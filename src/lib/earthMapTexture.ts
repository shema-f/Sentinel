import { geoEquirectangular, geoGraticule, geoPath } from 'd3';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import countriesTopology from 'world-atlas/countries-110m.json';

/**
 * Real world map geometry for the 3D WebGL threat globe.
 *
 * Data source: `world-atlas` — Natural Earth 1:110m admin-0 countries and land
 * polygons (public domain), pre-compiled to TopoJSON. The dataset is bundled
 * into the application at build time, so the globe renders genuine coastlines,
 * islands, lakes (as holes) and country borders while keeping the repository's
 * zero-runtime-asset invariant: no CDN, no runtime fetch, no user traffic leak.
 */

const topology = countriesTopology as unknown as Topology;

let countriesGeo: FeatureCollection | null = null;
let landGeo: FeatureCollection | null = null;

/** Real GeoJSON country polygons (177 features, Natural Earth 1:110m). */
export function getRealWorldCountries(): FeatureCollection {
  if (!countriesGeo) {
    const obj = topology.objects.countries as unknown as GeometryCollection;
    countriesGeo = feature(topology, obj) as unknown as FeatureCollection;
  }
  return countriesGeo;
}

/** Real GeoJSON land outline (single multipolygon, coastlines + island rings). */
export function getRealWorldLand(): FeatureCollection {
  if (!landGeo) {
    const obj = topology.objects.land as unknown as GeometryCollection;
    landGeo = feature(topology, obj) as unknown as FeatureCollection;
  }
  return landGeo;
}

/**
 * Draws a 2:1 equirectangular Earth texture using real world vector data.
 *
 * The projection is chosen so the raster maps 1:1 onto THREE.SphereGeometry's
 * default UV layout: `u = (lon + 180) / 360`, `v = (90 - lat) / 180`, i.e. the
 * canvas x-axis runs -180° → +180° longitude left-to-right and the y-axis runs
 * +90° → -90° latitude top-to-bottom. Every breach marker computed through
 * `latLngToVector3` therefore lands exactly on its real coastline position.
 */
export function createEarthMapCanvas(width = 2048, height = 1024): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Deep ocean gradient base
  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#07101e');
  ocean.addColorStop(0.5, '#060c16');
  ocean.addColorStop(1, '#04070e');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2]);
  const path = geoPath(projection, ctx);

  // 2. Real country polygons: one combined fill pass (no antialias seams,
  //    even-odd keeps lakes/inland-sea holes open regardless of ring winding)
  ctx.beginPath();
  path(getRealWorldCountries());
  ctx.fillStyle = '#13293f';
  ctx.fill('evenodd');

  // 3. Country borders (faint cyan gridlines between nations)
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.stroke();

  // 4. Real coastlines with an emerald telemetry glow
  ctx.beginPath();
  path(getRealWorldLand());
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = 'rgba(0, 240, 168, 0.75)';
  ctx.shadowColor = 'rgba(0, 240, 168, 0.6)';
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // 5. Genuine 15° lat/long graticule
  const graticule = geoGraticule().step([15, 15]);
  ctx.beginPath();
  path(graticule());
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = 'rgba(41, 68, 105, 0.55)';
  ctx.stroke();

  // 6. Procedural telemetry coordinate nodes overlay (brand styling)
  ctx.fillStyle = 'rgba(0, 240, 168, 0.5)';
  for (let x = 64; x < width; x += 256) {
    for (let y = 64; y < height; y += 128) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
}
