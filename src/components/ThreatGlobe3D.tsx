import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Globe,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Shield,
  AlertTriangle,
  Flame,
  Radio,
  Eye,
  Crosshair,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AnonymizedBreachLocation } from '../types';
import { ANONYMIZED_BREACH_LOCATIONS, MAP_REGION_PRESETS } from '../lib/worldGeoData';

interface ThreatGlobe3DProps {
  breaches?: AnonymizedBreachLocation[];
  selectedBreachId?: string | null;
  onSelectBreach?: (breach: AnonymizedBreachLocation) => void;
  onNavigateToIncident?: () => void;
  className?: string;
  compact?: boolean;
}

type GlobeTheme = 'tactical' | 'matrix' | 'heatmap';

export const ThreatGlobe3D: React.FC<ThreatGlobe3DProps> = ({
  breaches = ANONYMIZED_BREACH_LOCATIONS,
  selectedBreachId,
  onSelectBreach,
  onNavigateToIncident,
  className = '',
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<GlobeTheme>('tactical');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.003);
  const [hoveredBreach, setHoveredBreach] = useState<AnonymizedBreachLocation | null>(null);
  const [activeBreach, setActiveBreach] = useState<AnonymizedBreachLocation | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Sync external selectedBreachId
  useEffect(() => {
    if (selectedBreachId) {
      const match = breaches.find(b => b.id === selectedBreachId);
      if (match) setActiveBreach(match);
    }
  }, [selectedBreachId, breaches]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markerObjectsRef = useRef<{ mesh: THREE.Object3D; breach: AnonymizedBreachLocation }[]>([]);
  const arcCurvesRef = useRef<{ curve: THREE.QuadraticBezierCurve3; particle: THREE.Mesh; progress: number }[]>([]);
  const animFrameIdRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.3, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.3, y: 0 });
  const targetDistanceRef = useRef<number>(240);
  const currentDistanceRef = useRef<number>(240);

  // Generate procedural textures for continent landmasses & cyber grid (Zero external asset dependency)
  const textures = useMemo(() => {
    // 1. Cyber Continent Map Texture
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = 2048;
    mapCanvas.height = 1024;
    const ctx = mapCanvas.getContext('2d');
    if (ctx) {
      // Dark oceanic background
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, 2048, 1024);

      // Procedural stylized continent dot-matrix / polygons
      ctx.fillStyle = 'rgba(0, 240, 168, 0.18)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;

      // Approximate continent masses with procedural clusters for cybernetic earth look
      const drawContinentBlob = (cx: number, cy: number, rx: number, ry: number) => {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const r = 1 + Math.sin(a * 5) * 0.18 + Math.cos(a * 3) * 0.12;
          const px = cx + Math.cos(a) * rx * r;
          const py = cy + Math.sin(a) * ry * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // North America
      drawContinentBlob(500, 320, 280, 180);
      // South America
      drawContinentBlob(700, 680, 160, 240);
      // Europe
      drawContinentBlob(1080, 310, 170, 120);
      // Africa
      drawContinentBlob(1120, 560, 190, 220);
      // Asia
      drawContinentBlob(1500, 340, 340, 200);
      // Australia
      drawContinentBlob(1720, 720, 160, 130);

      // Fine holographic latitude/longitude tech grid
      ctx.strokeStyle = 'rgba(30, 48, 77, 0.45)';
      ctx.lineWidth = 0.8;
      for (let x = 0; x < 2048; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y < 1024; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }

      // Digital coordinate nodes
      ctx.fillStyle = 'rgba(0, 240, 168, 0.6)';
      for (let x = 64; x < 2048; x += 256) {
        for (let y = 64; y < 1024; y += 128) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const earthTexture = new THREE.CanvasTexture(mapCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 2. Glow ring particle texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gctx = glowCanvas.getContext('2d');
    if (gctx) {
      const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(0, 240, 168, 0.7)');
      grad.addColorStop(0.7, 'rgba(0, 240, 168, 0.2)');
      grad.addColorStop(1, 'rgba(0, 240, 168, 0)');
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 128, 128);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    return { earthTexture, glowTexture };
  }, []);

  // Helper: Convert Lat/Lng to 3D Cartesian coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06090f);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1500);
    camera.position.set(0, 30, targetDistanceRef.current);
    cameraRef.current = camera;

    // 3. Renderer with high performance & WebGL crispness
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(150, 120, 180);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f0a8, 0.8);
    rimLight.position.set(-180, -60, -120);
    scene.add(rimLight);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 80;

    // Earth Sphere Core
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    let earthMaterial: THREE.Material;

    if (activeTheme === 'tactical') {
      earthMaterial = new THREE.MeshStandardMaterial({
        map: textures.earthTexture,
        roughness: 0.6,
        metalness: 0.35,
        color: 0x0f172a,
        emissive: 0x051329,
        emissiveIntensity: 0.4,
      });
    } else if (activeTheme === 'matrix') {
      earthMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x00f0a8,
        transparent: true,
        opacity: 0.38,
      });
    } else {
      // Heatmap Theme
      earthMaterial = new THREE.MeshStandardMaterial({
        map: textures.earthTexture,
        color: 0x1a0b16,
        emissive: 0x2b0f20,
        roughness: 0.8,
      });
    }

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Outer Atmospheric Halo
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.94, 0.66, 1.0) * intensity * 0.9;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Coordinate Ring Latitudes/Longitudes
    if (showGrid) {
      const gridHelperGroup = new THREE.Group();
      const equatorGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.01, GLOBE_RADIUS * 1.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1e3a5f,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const equator = new THREE.Mesh(equatorGeo, ringMat);
      equator.rotation.x = Math.PI / 2;
      gridHelperGroup.add(equator);
      globeGroup.add(gridHelperGroup);
    }

    // 6. Breach Pins & Indicators
    markerObjectsRef.current = [];
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    const getSeverityColor = (sev: string, isContained: boolean) => {
      if (isContained) return 0x00f0a8;
      switch (sev) {
        case 'CRITICAL':
          return 0xff4757;
        case 'HIGH':
          return 0xff6b81;
        case 'MEDIUM':
          return 0xffa502;
        case 'LOW':
        default:
          return 0x38bdf8;
      }
    };

    breaches.forEach(breach => {
      const lon = breach.fuzzedCoordinates[0];
      const lat = breach.fuzzedCoordinates[1];
      const surfacePos = latLngToVector3(lat, lon, GLOBE_RADIUS);
      const colorHex = getSeverityColor(breach.severity, breach.isContained);

      // Marker Composite (Group of 3 distinct procedural parts)
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(surfacePos);
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfacePos.clone().normalize());

      // Part 1: Base Anchor Ring
      const baseRingGeo = new THREE.RingGeometry(0.8, 1.8, 24);
      const baseRingMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.rotation.x = Math.PI / 2;
      markerGroup.add(baseRing);

      // Part 2: Vertical Laser Beacon (Cylinder)
      const beaconHeight = breach.severity === 'CRITICAL' ? 12 : breach.severity === 'HIGH' ? 8 : 5;
      const beaconGeo = new THREE.CylinderGeometry(0.2, 0.4, beaconHeight, 12);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = beaconHeight / 2;
      markerGroup.add(beacon);

      // Part 3: Glowing Top Node Sphere
      const tipGeo = new THREE.SphereGeometry(0.9, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = beaconHeight;
      markerGroup.add(tip);

      // Invisible Click Target Bounding Sphere for Easy Raycasting
      const hitGeo = new THREE.SphereGeometry(4.5, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = beaconHeight / 2;
      markerGroup.add(hitMesh);

      pinsGroup.add(markerGroup);

      markerObjectsRef.current.push({
        mesh: hitMesh,
        breach,
      });
    });

    // 7. Exfiltration Great-Circle Threat Arcs
    arcCurvesRef.current = [];
    if (showArcs) {
      const arcsGroup = new THREE.Group();
      globeGroup.add(arcsGroup);

      // Target Frankfurt Threat Intelligence Collector Hub
      const frankfurtHub = latLngToVector3(50.11, 8.68, GLOBE_RADIUS);

      const criticalBreaches = breaches.filter(
        b => b.sourceType === 'infostealer' || b.sourceType === 'c2_server'
      );

      criticalBreaches.forEach((breach, idx) => {
        const start = latLngToVector3(breach.fuzzedCoordinates[1], breach.fuzzedCoordinates[0], GLOBE_RADIUS);
        const end = frankfurtHub;

        // Elevated midpoint for 3D parabola
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dist = start.distanceTo(end);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.32);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

        const arcMat = new THREE.LineBasicMaterial({
          color: breach.isContained ? 0x00f0a8 : 0xff4757,
          transparent: true,
          opacity: 0.65,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcsGroup.add(arcLine);

        // Animated traveling telemetry photon packet along curve
        const photonGeo = new THREE.SphereGeometry(0.7, 8, 8);
        const photonMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        });
        const photon = new THREE.Mesh(photonGeo, photonMat);
        arcsGroup.add(photon);

        arcCurvesRef.current.push({
          curve,
          particle: photon,
          progress: (idx * 0.2) % 1,
        });
      });
    }

    // 8. Raycaster & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };

        targetRotationRef.current.y += deltaX * 0.007;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 2.3,
          Math.min(Math.PI / 2.3, targetRotationRef.current.x + deltaY * 0.007)
        );
      } else {
        // Hover Raycast
        raycaster.setFromCamera(mouse, camera);
        const targets = markerObjectsRef.current.map(m => m.mesh);
        const intersects = raycaster.intersectObjects(targets);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const matched = markerObjectsRef.current.find(m => m.mesh === hitObj);
          if (matched) {
            setHoveredBreach(matched.breach);
            container.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredBreach(null);
        container.style.cursor = 'grab';
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targets = markerObjectsRef.current.map(m => m.mesh);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const matched = markerObjectsRef.current.find(m => m.mesh === hitObj);
        if (matched) {
          setActiveBreach(matched.breach);
          if (onSelectBreach) onSelectBreach(matched.breach);

          // Rotate globe to center on clicked breach
          const lon = matched.breach.fuzzedCoordinates[0];
          const lat = matched.breach.fuzzedCoordinates[1];
          targetRotationRef.current.y = -((lon + 180) * (Math.PI / 180)) - Math.PI / 2;
          targetRotationRef.current.x = (lat * (Math.PI / 180));
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistanceRef.current = Math.max(120, Math.min(380, targetDistanceRef.current + e.deltaY * 0.15));
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Rotation Interpolation
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += rotationSpeed;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * 0.08;

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentDistanceRef.current;
      }

      // Animate Arcs photon pulses
      arcCurvesRef.current.forEach(arc => {
        arc.progress = (arc.progress + delta * 0.45) % 1;
        const pt = arc.curve.getPoint(arc.progress);
        arc.particle.position.copy(pt);
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup resources to prevent memory leaks
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);

      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, [breaches, activeTheme, autoRotate, rotationSpeed, showArcs, showGrid, textures]);

  // Center on preset region
  const focusRegion = (centerLat: number, centerLon: number, zoomLevel: number) => {
    targetRotationRef.current.x = centerLat * (Math.PI / 180);
    targetRotationRef.current.y = -((centerLon + 180) * (Math.PI / 180)) - Math.PI / 2;
    targetDistanceRef.current = 240 / zoomLevel;
  };

  return (
    <div className={`relative w-full ${compact ? 'h-[380px] sm:h-[450px] lg:h-[520px]' : 'h-[580px]'} rounded-xl overflow-hidden border border-[#1a273b] bg-[#06090f] select-none ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Cyber HUD Header */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-1.5 backdrop-blur-xl shadow-lg">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-tight flex items-center space-x-1.5 font-sans">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>3D Threat Sphere</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            WebGL 2.0
          </span>
        </div>

        {/* Theme Selectors */}
        {!compact && <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1 backdrop-blur-xl text-xs shadow-lg">
          <button
            onClick={() => setActiveTheme('tactical')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTheme === 'tactical' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tactical
          </button>
          <button
            onClick={() => setActiveTheme('matrix')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTheme === 'matrix' ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matrix
          </button>
          <button
            onClick={() => setActiveTheme('heatmap')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTheme === 'heatmap' ? 'bg-slate-800 text-rose-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heatmap
          </button>
        </div>}
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-all shadow-lg ${
            autoRotate
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
          <span className="hidden sm:inline">{autoRotate ? 'Orbit Active' : 'Orbit Paused'}</span>
        </button>

        <button
          onClick={() => setShowArcs(!showArcs)}
          className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition-all shadow-lg ${
            showArcs
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white'
          }`}
          title="Toggle Exfiltration Arcs"
        >
          <Radio className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Threat Arcs</span>
        </button>
      </div>

      {/* Bottom Left Region Presets */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-1 rounded-xl border border-slate-800 bg-slate-950/85 p-1 backdrop-blur-xl text-xs shadow-lg">
        <span className="px-2 text-slate-500 font-medium">Focus:</span>
        <button
          onClick={() => focusRegion(20, 0, 1)}
          className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          Global
        </button>
        <button
          onClick={() => focusRegion(38, -95, 1.7)}
          className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          Americas
        </button>
        <button
          onClick={() => focusRegion(50, 15, 2.3)}
          className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          Europe
        </button>
        <button
          onClick={() => focusRegion(25, 110, 1.9)}
          className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          Asia-Pacific
        </button>
      </div>

      {/* Bottom Right Zoom & Reset HUD */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1 rounded-xl border border-slate-800 bg-slate-950/85 p-1 backdrop-blur-xl shadow-lg">
        <button
          onClick={() => {
            targetDistanceRef.current = Math.max(120, targetDistanceRef.current - 35);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            targetDistanceRef.current = Math.min(380, targetDistanceRef.current + 35);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            targetRotationRef.current = { x: 0.3, y: 0 };
            targetDistanceRef.current = 240;
          }}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors"
          title="Reset Orbit View"
        >
          Reset
        </button>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredBreach && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 rounded-2xl border border-slate-700/80 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl text-xs w-72 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-semibold text-white truncate max-w-[180px]">{hoveredBreach.breachName}</span>
            <div className="flex items-center space-x-1">
              <span className={`h-1.5 w-1.5 rounded-full ${
                hoveredBreach.isContained
                  ? 'bg-emerald-400'
                  : hoveredBreach.severity === 'CRITICAL'
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`} />
              <span className="text-[11px] font-medium text-slate-300">
                {hoveredBreach.isContained ? 'Contained' : hoveredBreach.severity}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Location</span>
              <span className="text-slate-200 font-medium">{hoveredBreach.city}, {hoveredBreach.countryCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Threat Vector</span>
              <span className="text-cyan-400 capitalize">{hoveredBreach.sourceType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Actor</span>
              <span className="text-amber-400">{hoveredBreach.threatActor}</span>
            </div>
            <div className="flex justify-between">
              <span>Impacted Records</span>
              <span className="text-white font-semibold">{hoveredBreach.recordsExposed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-800 text-[10px]">
              <span className="text-slate-500">Differential Privacy Jitter</span>
              <span className="text-emerald-400 font-mono">±{hoveredBreach.fuzzRadiusKm} km</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 text-center">
            Click marker to inspect breach details
          </div>
        </div>
      )}

      {/* Selected Breach Inspector Floating Panel */}
      {activeBreach && (
        <div className="absolute top-16 right-4 z-20 w-84 max-w-[calc(100%-2rem)] rounded-2xl border border-slate-800 bg-slate-950/95 p-5 backdrop-blur-xl shadow-2xl space-y-3.5 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Breach Target Profile</div>
              <h4 className="text-sm font-semibold text-white truncate max-w-[220px]">{activeBreach.breachName}</h4>
            </div>
            <button
              onClick={() => setActiveBreach(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Location</span>
              <span className="text-slate-200 font-medium">{activeBreach.city}, {activeBreach.countryCode}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Containment</span>
              <span className={`font-semibold ${activeBreach.isContained ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeBreach.isContained ? 'Contained' : 'Active Exposure'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Threat Actor</span>
              <span className="text-amber-400 font-medium truncate block">{activeBreach.threatActor}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Malware Family</span>
              <span className="text-cyan-400 font-medium truncate block">{activeBreach.malwareFamily}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-emerald-400 font-semibold block mb-0.5">k-Anonymity Centroid:</span>
            Coordinates jitted by ±{activeBreach.fuzzRadiusKm} km to prevent exact address re-identification. Identifier masked as{' '}
            <span className="text-slate-200 font-mono font-semibold">{activeBreach.identityMasked}</span>.
          </div>

          <div className="flex items-center space-x-2 pt-1">
            {onNavigateToIncident && !activeBreach.isContained && (
              <button
                onClick={onNavigateToIncident}
                className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 text-xs transition-colors shadow-lg shadow-rose-600/20"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Execute Containment</span>
              </button>
            )}
            <button
              onClick={() => {
                const lon = activeBreach.fuzzedCoordinates[0];
                const lat = activeBreach.fuzzedCoordinates[1];
                focusRegion(lat, lon, 2.5);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-cyan-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Center 3D
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
