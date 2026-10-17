import React, { useState, useMemo, useRef } from 'react';
import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule,
} from 'd3';
import {
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Eye,
  Crosshair,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MapPin,
  Flame,
  Radio,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AnonymizedBreachLocation, Severity } from '../types';
import {
  ANONYMIZED_BREACH_LOCATIONS,
  WORLD_GEO_FEATURE_COLLECTION,
  MAP_REGION_PRESETS,
} from '../lib/worldGeoData';
import { ThreatGlobe3D } from './ThreatGlobe3D';
import { RegionalThreatHeatmap } from './RegionalThreatHeatmap';

interface GlobalBreachMapViewProps {
  onNavigateToIncident?: () => void;
  onNavigateToGraph?: () => void;
}

export const GlobalBreachMapView: React.FC<GlobalBreachMapViewProps> = ({
  onNavigateToIncident,
  onNavigateToGraph,
}) => {
  const [breaches, setBreaches] = useState<AnonymizedBreachLocation[]>(ANONYMIZED_BREACH_LOCATIONS);
  const [selectedBreach, setSelectedBreach] = useState<AnonymizedBreachLocation | null>(null);
  const [hoveredBreach, setHoveredBreach] = useState<AnonymizedBreachLocation | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Filters
  const [selectedIdentity, setSelectedIdentity] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map Navigation & Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeRegionPreset, setActiveRegionPreset] = useState<string>('global');
  const [showRadarScan, setShowRadarScan] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'heatmap'>('3d');

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Map Base Dimensions
  const mapWidth = 960;
  const mapHeight = 500;

  // D3 Projection
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(160 * zoomLevel)
      .translate([
        mapWidth / 2 + panOffset.x,
        mapHeight / 2 + panOffset.y,
      ]);
  }, [zoomLevel, panOffset]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  const graticuleLines = useMemo(() => {
    const graticule = geoGraticule();
    return pathGenerator(graticule());
  }, [pathGenerator]);

  // Unique Identities in dataset
  const uniqueIdentities = useMemo(() => {
    const set = new Set<string>();
    breaches.forEach(b => set.add(b.identityMasked));
    return Array.from(set);
  }, [breaches]);

  // Filtered Breaches
  const filteredBreaches = useMemo(() => {
    return breaches.filter(b => {
      if (selectedIdentity !== 'all' && b.identityMasked !== selectedIdentity) {
        return false;
      }
      if (selectedSeverity !== 'all') {
        if (selectedSeverity === 'CONTAINED' && !b.isContained) return false;
        if (selectedSeverity !== 'CONTAINED' && (b.severity !== selectedSeverity || b.isContained)) return false;
      }
      if (selectedSourceType !== 'all' && b.sourceType !== selectedSourceType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCity = b.city.toLowerCase().includes(q);
        const matchesCountry = b.country.toLowerCase().includes(q);
        const matchesBreach = b.breachName.toLowerCase().includes(q);
        const matchesActor = b.threatActor?.toLowerCase().includes(q);
        if (!matchesCity && !matchesCountry && !matchesBreach && !matchesActor) return false;
      }
      return true;
    });
  }, [breaches, selectedIdentity, selectedSeverity, selectedSourceType, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = breaches.length;
    const critical = breaches.filter(b => b.severity === 'CRITICAL' && !b.isContained).length;
    const contained = breaches.filter(b => b.isContained).length;
    const totalRecords = breaches.reduce((acc, curr) => acc + curr.recordsExposed, 0);
    return { total, critical, contained, totalRecords };
  }, [breaches]);

  // Quick preset jump
  const handleRegionPreset = (presetId: string) => {
    setActiveRegionPreset(presetId);
    const preset = MAP_REGION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    if (preset.id === 'global') {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(preset.zoom);
      // Project center point
      const baseProj = geoNaturalEarth1().scale(160 * preset.zoom);
      const coords = baseProj(preset.center);
      if (coords && Array.isArray(coords) && coords.length >= 2) {
        setPanOffset({
          x: -(coords[0] - mapWidth / 2),
          y: -(coords[1] - mapHeight / 2),
        });
      }
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.8, Math.min(6, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveRegionPreset('global');
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleToggleContained = (id: string) => {
    setBreaches(prev =>
      prev.map(b => (b.id === id ? { ...b, isContained: !b.isContained } : b))
    );
    if (selectedBreach && selectedBreach.id === id) {
      setSelectedBreach(prev => (prev ? { ...prev, isContained: !prev.isContained } : null));
    }
  };

  const getSeverityColor = (severity: Severity, isContained: boolean) => {
    if (isContained) return '#00f0a8';
    switch (severity) {
      case 'CRITICAL':
        return '#ff4757';
      case 'HIGH':
        return '#ffa502';
      case 'MEDIUM':
        return '#38bdf8';
      case 'LOW':
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#162335]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-[#00f0a8]" />
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Global Breach Threat Map
            </h1>
            <span className="rounded bg-[#00f0a8]/10 border border-[#00f0a8]/30 px-2 py-0.5 font-mono text-[10px] text-[#00f0a8] font-bold">
              ANONYMIZED TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Interactive geospatial intelligence correlating discovered infostealer logs, darknet combo drops, and adversary C2 nodes with monitored identity fleet.
          </p>
        </div>

        {/* Privacy Invariant Banner */}
        <div className="flex items-center space-x-3 rounded-lg border border-[#1b2b3f] bg-[#0c1422] px-3 py-2 text-xs font-mono text-[#cbd5e1]">
          <Lock className="h-4 w-4 text-[#00f0a8] shrink-0" />
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-white">Differential Privacy Enforced</div>
            <div className="text-[10px] text-[#64748b]">
              Coordinates fuzzed (±35km jitter) • Zero plaintext passwords
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="rounded-xl border border-[#162235] bg-[#090e18] p-4">
          <div className="text-xs text-[#64748b] flex items-center justify-between">
            <span>GLOBAL DISCOVERIES</span>
            <Globe className="h-3.5 w-3.5 text-[#38bdf8]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-[10px] text-[#64748b] mt-1">Geolocated compromise points</div>
        </div>

        <div className="rounded-xl border border-[#ff4757]/30 bg-[#ff4757]/5 p-4">
          <div className="text-xs text-[#ff4757] flex items-center justify-between">
            <span>CRITICAL UNCONTAINED</span>
            <Flame className="h-3.5 w-3.5 text-[#ff4757] animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#ff4757]">{stats.critical}</div>
          <div className="text-[10px] text-[#94a3b8] mt-1">Active stealer C2 / live sessions</div>
        </div>

        <div className="rounded-xl border border-[#00f0a8]/30 bg-[#00f0a8]/5 p-4">
          <div className="text-xs text-[#00f0a8] flex items-center justify-between">
            <span>CONTAINED INCIDENTS</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00f0a8]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#00f0a8]">{stats.contained}</div>
          <div className="text-[10px] text-[#94a3b8] mt-1">Credentials rotated / safe</div>
        </div>

        <div className="rounded-xl border border-[#162235] bg-[#090e18] p-4">
          <div className="text-xs text-[#64748b] flex items-center justify-between">
            <span>EXPOSED RECORDS</span>
            <Layers className="h-3.5 w-3.5 text-[#94a3b8]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#38bdf8]">
            {stats.totalRecords.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#64748b] mt-1">Aggregated dataset rows</div>
        </div>
      </div>

      {/* Main Filter & Control Toolbar */}
      <div className="rounded-xl border border-[#18263a] bg-[#0c1322] p-4 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by city, country, malware family..."
              className="w-full rounded-lg border border-[#18263a] bg-[#070b13] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-[#64748b] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Identity Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-[#64748b]">Identity:</span>
            <select
              value={selectedIdentity}
              onChange={e => setSelectedIdentity(e.target.value)}
              className="rounded-lg border border-[#18263a] bg-[#070b13] px-3 py-1.5 text-xs text-[#cbd5e1] focus:border-[#38bdf8] focus:outline-none"
            >
              <option value="all">All Monitored Fleet ({uniqueIdentities.length})</option>
              {uniqueIdentities.map(id => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* Region Presets */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {MAP_REGION_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleRegionPreset(preset.id)}
                className={`rounded px-2.5 py-1 text-[11px] transition-colors whitespace-nowrap ${
                  activeRegionPreset === preset.id
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'bg-[#101928] border border-[#18263a] text-[#94a3b8] hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#141e2e]">
          {/* Severity Filters */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'CONTAINED'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all capitalize ${
                  selectedSeverity === sev
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev === 'all' ? 'All' : sev.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Source Type Filter */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'infostealer', label: 'Infostealer' },
              { id: 'c2_server', label: 'C2 Node' },
              { id: 'credential_dump', label: 'Combo Dump' },
              { id: 'darknet_forum', label: 'Dark Web' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedSourceType(type.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedSourceType === type.id
                    ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Dimension Mode (3D WebGL vs 2D D3) & Map Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1 text-xs shadow-sm">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === '3d'
                    ? 'bg-emerald-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>3D Cyber Globe (Three.js)</span>
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'heatmap'
                    ? 'bg-rose-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Regional Heatmap & Trends (Recharts)</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === '2d'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>2D Vector Map (D3)</span>
              </button>
            </div>

            {viewMode === '2d' && (
              <div className="flex items-center space-x-3 text-[11px] text-[#64748b]">
                <label className="flex items-center space-x-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showRadarScan}
                    onChange={e => setShowRadarScan(e.target.checked)}
                    className="rounded border-[#18263a] bg-[#070b13] text-[#00f0a8] focus:ring-0"
                  />
                  <span>Radar Sweep</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={showGraticules}
                    onChange={e => setShowGraticules(e.target.checked)}
                    className="rounded border-[#18263a] bg-[#070b13] text-[#38bdf8] focus:ring-0"
                  />
                  <span>Graticule Grid</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Map Stage Container */}
      <div className="relative rounded-2xl border border-[#18263a] bg-[#050912] overflow-hidden shadow-2xl">
        {viewMode === '3d' ? (
          <ThreatGlobe3D
            breaches={filteredBreaches}
            selectedBreachId={selectedBreach?.id}
            onSelectBreach={setSelectedBreach}
            onNavigateToIncident={onNavigateToIncident}
          />
        ) : viewMode === 'heatmap' ? (
          <div className="p-6 bg-slate-950/90">
            <RegionalThreatHeatmap
              onNavigateToIncident={onNavigateToIncident}
              onNavigateToGlobe={() => setViewMode('3d')}
              onSelectBreach={setSelectedBreach}
            />
          </div>
        ) : (
          <>
            {/* Radar Scanning Line Animation */}
            {showRadarScan && (
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-30">
                <div
                  className="h-full w-24 bg-gradient-to-r from-transparent via-[#00f0a8]/25 to-transparent blur-sm"
                  style={{
                    animation: 'radarSweep 8s linear infinite',
                  }}
                />
              </div>
            )}

        {/* Map Canvas Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5 font-mono">
          <button
            onClick={() => handleZoom(0.3)}
            title="Zoom In"
            className="rounded-lg border border-[#1c2e47] bg-[#0b1322]/90 p-2 text-white hover:bg-[#142338] transition-colors shadow-lg"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.3)}
            title="Zoom Out"
            className="rounded-lg border border-[#1c2e47] bg-[#0b1322]/90 p-2 text-white hover:bg-[#142338] transition-colors shadow-lg"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Map Position"
            className="rounded-lg border border-[#1c2e47] bg-[#0b1322]/90 p-2 text-[#38bdf8] hover:bg-[#142338] transition-colors shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Map Canvas Status Indicator (Top-Left) */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 rounded-md border border-[#162335] bg-[#080e1b]/80 backdrop-blur px-3 py-1 font-mono text-[10px] text-[#94a3b8]">
          <span className="h-2 w-2 rounded-full bg-[#ff4757] animate-ping" />
          <span>ACTIVE THREAT RADAR</span>
          <span className="text-[#334155]">|</span>
          <span className="text-white font-bold">{filteredBreaches.length} Discovered Nodes</span>
          <span className="text-[#334155]">|</span>
          <span className="text-[#00f0a8]">k-Anonymity Verified</span>
        </div>

        {/* SVG World Map */}
        <div
          className="relative cursor-grab active:cursor-grabbing w-full overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-auto block"
            style={{ minHeight: '440px', background: '#050912' }}
          >
            <defs>
              {/* Radial gradient background */}
              <radialGradient id="oceanGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0c1728" />
                <stop offset="70%" stopColor="#060c16" />
                <stop offset="100%" stopColor="#04070e" />
              </radialGradient>

              {/* Threat Pulse Filter */}
              <filter id="glowCritical" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Rect */}
            <rect width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />

            {/* Lat / Long Graticules */}
            {showGraticules && graticuleLines && (
              <path
                d={graticuleLines}
                fill="none"
                stroke="#15263d"
                strokeWidth="0.5"
                strokeDasharray="2 3"
                opacity={0.6}
              />
            )}

            {/* World Landmass Polygons */}
            <g className="world-landmasses">
              {WORLD_GEO_FEATURE_COLLECTION.features.map((feature, i) => {
                const d = pathGenerator(feature as any);
                if (!d) return null;
                return (
                  <path
                    key={i}
                    d={d}
                    fill="#0d1726"
                    stroke="#1c2d47"
                    strokeWidth="1"
                    className="transition-colors hover:fill-[#122036]"
                  />
                );
              })}
            </g>

            {/* Equator & Prime Meridian reference lines */}
            {showGraticules && (
              <g stroke="#1e3452" strokeWidth="0.75" opacity={0.4}>
                {/* Equator */}
                <line
                  x1={0}
                  y1={mapHeight / 2 + panOffset.y}
                  x2={mapWidth}
                  y2={mapHeight / 2 + panOffset.y}
                  strokeDasharray="4 4"
                />
              </g>
            )}

            {/* Threat Connection Arcs for Infostealer exfiltration routes */}
            <g className="threat-arcs" opacity={0.35}>
              {filteredBreaches
                .filter(b => b.sourceType === 'infostealer' || b.sourceType === 'c2_server')
                .slice(0, 5)
                .map((b, idx) => {
                  const [px, py] = projection(b.fuzzedCoordinates) || [0, 0];
                  // Arbitrary anchor hub (e.g. Frankfurt C2 hub)
                  const [hx, hy] = projection([8.68, 50.11]) || [0, 0];
                  if (!px || !py || !hx || !hy || (px === hx && py === hy)) return null;
                  const dx = px - hx;
                  const dy = py - hy;
                  const cx = (px + hx) / 2 - dy * 0.2;
                  const cy = (py + hy) / 2 + dx * 0.2;
                  return (
                    <path
                      key={`arc-${idx}`}
                      d={`M ${px} ${py} Q ${cx} ${cy} ${hx} ${hy}`}
                      fill="none"
                      stroke={b.isContained ? '#00f0a8' : '#ff4757'}
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  );
                })}
            </g>

            {/* Anonymized Threat Points */}
            <g className="threat-markers">
              {filteredBreaches.map(breach => {
                const projected = projection(breach.fuzzedCoordinates);
                if (!projected) return null;
                const [x, y] = projected;

                // Skip points outside visual viewport
                if (x < -50 || x > mapWidth + 50 || y < -50 || y > mapHeight + 50) return null;

                const color = getSeverityColor(breach.severity, breach.isContained);
                const isSelected = selectedBreach?.id === breach.id;

                return (
                  <g
                    key={breach.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBreach(breach);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredBreach(breach);
                      const rect = svgRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredBreach(null);
                      setTooltipPos(null);
                    }}
                  >
                    {/* Concentric Ping Ring for uncontained threats */}
                    {!breach.isContained && (
                      <circle
                        r="14"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        opacity={0.7}
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Highlight */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Privacy Fuzzing Halo */}
                    <circle
                      r="10"
                      fill={color}
                      opacity={isSelected ? 0.25 : 0.12}
                    />

                    {/* Core Threat Marker Node */}
                    <circle
                      r={isSelected ? '6.5' : '4.5'}
                      fill={color}
                      stroke="#050912"
                      strokeWidth="1.5"
                      filter={breach.severity === 'CRITICAL' ? 'url(#glowCritical)' : undefined}
                      className="transition-transform duration-200 group-hover:scale-125"
                    />

                    {/* Regional Label on high zoom or selected */}
                    {(zoomLevel > 1.8 || isSelected) && (
                      <text
                        x="8"
                        y="3"
                        fill="#cbd5e1"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="pointer-events-none drop-shadow-md select-none"
                      >
                        {breach.city}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Hover Tactical Tooltip */}
        {hoveredBreach && tooltipPos && (
          <div
            className="pointer-events-none absolute z-30 rounded-lg border border-[#223550] bg-[#070d18]/95 p-3 font-mono shadow-2xl backdrop-blur max-w-xs space-y-1.5 transition-all text-xs"
            style={{
              left: `${Math.min(mapWidth - 280, Math.max(10, tooltipPos.x + 15))}px`,
              top: `${Math.min(mapHeight - 160, Math.max(10, tooltipPos.y - 40))}px`,
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#18263a]">
              <span className="font-bold text-white text-xs">{hoveredBreach.city}</span>
              <span
                className="px-1.5 py-0.2 rounded text-[9px] font-bold"
                style={{
                  backgroundColor: `${getSeverityColor(hoveredBreach.severity, hoveredBreach.isContained)}20`,
                  color: getSeverityColor(hoveredBreach.severity, hoveredBreach.isContained),
                }}
              >
                {hoveredBreach.isContained ? 'CONTAINED' : hoveredBreach.severity}
              </span>
            </div>

            <div className="text-[11px] text-[#38bdf8] font-semibold">
              {hoveredBreach.breachName}
            </div>

            <div className="space-y-0.5 text-[10px] text-[#94a3b8]">
              <div>Target: <span className="text-white">{hoveredBreach.identityMasked}</span> (Hash: {hoveredBreach.identityHashPrefix}...)</div>
              <div>Actor: <span className="text-[#cbd5e1]">{hoveredBreach.threatActor || 'Unknown'}</span></div>
              <div>Exposed: <span className="text-white">{hoveredBreach.recordsExposed.toLocaleString()} rows</span></div>
            </div>

            <div className="pt-1 border-t border-[#18263a] flex items-center justify-between text-[9px] text-[#64748b]">
              <span>Differential Privacy: ±{hoveredBreach.fuzzRadiusKm}km</span>
              <span className="text-[#00f0a8]">Click to inspect</span>
            </div>
          </div>
        )}
          </>
        )}

        {/* Bottom Live Threat Telemetry Stream Ticker */}
        <div className="border-t border-[#162335] bg-[#070b14] px-4 py-2 flex items-center justify-between font-mono text-xs overflow-x-auto">
          <div className="flex items-center space-x-2 shrink-0">
            <Radio className="h-3.5 w-3.5 text-[#00f0a8] animate-pulse" />
            <span className="text-[11px] font-bold text-[#00f0a8]">LIVE CTI FEED:</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-[#94a3b8] truncate px-4">
            {filteredBreaches.slice(0, 3).map((b, i) => (
              <span key={i} className="inline-flex items-center space-x-1.5 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getSeverityColor(b.severity, b.isContained) }} />
                <span className="text-white font-medium">{b.city}</span>
                <span className="text-[#64748b]">({b.breachName})</span>
                <span className="text-[#38bdf8]">{b.recordsExposed.toLocaleString()} records</span>
              </span>
            ))}
          </div>
          <div className="shrink-0 text-[10px] text-[#64748b]">
            Showing {filteredBreaches.length} of {breaches.length} Nodes
          </div>
        </div>
      </div>

      {/* Selected Breach Inspection Modal / Drawer */}
      {selectedBreach && (
        <div className="rounded-xl border border-[#23354f] bg-[#0c1424] p-6 font-mono space-y-6 shadow-2xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b2b42]">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#38bdf8]" />
                <h3 className="text-lg font-bold text-white">
                  {selectedBreach.breachName}
                </h3>
                <span
                  className="rounded px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${getSeverityColor(selectedBreach.severity, selectedBreach.isContained)}20`,
                    color: getSeverityColor(selectedBreach.severity, selectedBreach.isContained),
                  }}
                >
                  {selectedBreach.isContained ? 'CONTAINED' : selectedBreach.severity}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Discovered in {selectedBreach.city}, {selectedBreach.country} ({selectedBreach.countryCode}) • Threat Class: {selectedBreach.sourceType.toUpperCase()}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleContained(selectedBreach.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedBreach.isContained
                    ? 'border border-[#1f334f] bg-[#101b2e] text-[#94a3b8] hover:text-white'
                    : 'bg-[#00f0a8] text-black hover:bg-[#00f0a8]/90'
                }`}
              >
                {selectedBreach.isContained ? 'Re-open Exposure' : '✓ Mark Contained'}
              </button>
              <button
                onClick={() => setSelectedBreach(null)}
                className="rounded-lg border border-[#1f334f] bg-[#101b2e] px-3 py-1.5 text-xs text-[#cbd5e1] hover:text-white"
              >
                Close Drawer
              </button>
            </div>
          </div>

          {/* Telemetry Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Identity & Hash Details */}
            <div className="rounded-lg border border-[#18263a] bg-[#070b14] p-4 space-y-2">
              <div className="text-[#64748b] text-[10px] uppercase font-bold">Monitored Identity Anchor</div>
              <div className="text-white font-bold text-sm">{selectedBreach.identityMasked}</div>
              <div className="text-[#94a3b8]">
                SHA Prefix: <span className="text-[#00f0a8] font-bold">{selectedBreach.identityHashPrefix}</span> (k-Anonymity)
              </div>
              <div className="text-[10px] text-[#64748b] pt-1">
                Zero plaintext credentials or complete hashes leave the client machine.
              </div>
            </div>

            {/* Adversary & Malware Metadata */}
            <div className="rounded-lg border border-[#18263a] bg-[#070b14] p-4 space-y-2">
              <div className="text-[#64748b] text-[10px] uppercase font-bold">Malware & Infrastructure</div>
              <div className="text-white font-bold text-sm">{selectedBreach.malwareFamily || 'Generic Combo List'}</div>
              <div className="text-[#94a3b8]">
                Threat Actor: <span className="text-[#cbd5e1]">{selectedBreach.threatActor || 'Unattributed'}</span>
              </div>
              <div className="text-[#94a3b8]">
                MITRE ATT&CK: <span className="text-[#38bdf8]">{selectedBreach.mitreTechnique || 'T1555'}</span>
              </div>
            </div>

            {/* Differential Privacy Coordinates Box */}
            <div className="rounded-lg border border-[#18263a] bg-[#070b14] p-4 space-y-2">
              <div className="text-[#64748b] text-[10px] uppercase font-bold">Geospatial Privacy Jitter</div>
              <div className="text-white font-bold text-sm">
                [{selectedBreach.fuzzedCoordinates?.[0]?.toFixed(2) ?? '0.00'}°, {selectedBreach.fuzzedCoordinates?.[1]?.toFixed(2) ?? '0.00'}°]
              </div>
              <div className="text-[#94a3b8]">
                Fuzzing Radius: <span className="text-[#00f0a8]">±{selectedBreach.fuzzRadiusKm} km</span>
              </div>
              <div className="text-[10px] text-[#64748b] pt-1">
                Calculated to coarse metro level to prevent exact residential geolocation doxxing.
              </div>
            </div>
          </div>

          {/* Exposed Data Classes */}
          <div className="space-y-2">
            <div className="text-xs text-[#94a3b8] font-bold">COMPROMISED ATTRIBUTES IN DATASET:</div>
            <div className="flex flex-wrap gap-2">
              {selectedBreach.dataClasses.map((dc, i) => (
                <span
                  key={i}
                  className="rounded-md border border-[#ff4757]/30 bg-[#ff4757]/10 px-2.5 py-1 text-[11px] text-[#ff4757] font-semibold"
                >
                  ⚠ {dc.replace(/_/g, ' ').toUpperCase()}
                </span>
              ))}
              <span className="rounded-md border border-[#1b2b42] bg-[#0e1726] px-2.5 py-1 text-[11px] text-[#94a3b8]">
                Row Count: {selectedBreach.recordsExposed.toLocaleString()} records
              </span>
            </div>
          </div>

          {/* Actionable Remediation & Cross-Navigation */}
          <div className="rounded-lg border border-[#1f3554] bg-[#0a1220] p-4 space-y-3">
            <div className="flex items-center space-x-2 text-[#00f0a8] font-bold text-xs">
              <Shield className="h-4 w-4" />
              <span>DEFENSIVE REMEDIATION PROTOCOL</span>
            </div>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              {selectedBreach.recommendedAction}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onNavigateToIncident && (
                <button
                  onClick={onNavigateToIncident}
                  className="flex items-center space-x-1.5 rounded-lg bg-[#ff4757] px-3 py-1.5 text-xs text-white font-bold hover:bg-[#ff4757]/90 transition-colors"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Launch 10-Step Containment</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}

              {onNavigateToGraph && (
                <button
                  onClick={onNavigateToGraph}
                  className="flex items-center space-x-1.5 rounded-lg border border-[#1f3554] bg-[#101b2e] px-3 py-1.5 text-xs text-[#38bdf8] hover:bg-[#162740] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>View in Identity Graph</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Breach Intelligence Fleet Table */}
      <div className="rounded-xl border border-[#18263a] bg-[#0c1322] p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#162335]">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Discovered Breach Incidents by Region
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Zero-knowledge correlation table with verified k-anonymity prefixes.
            </p>
          </div>
          <span className="text-xs text-[#64748b]">
            Showing {filteredBreaches.length} locations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#162335] text-[#64748b]">
                <th className="pb-3 font-normal">LOCATION</th>
                <th className="pb-3 font-normal">BREACH SOURCE</th>
                <th className="pb-3 font-normal">MONITORED TARGET</th>
                <th className="pb-3 font-normal">THREAT CLASS</th>
                <th className="pb-3 font-normal">SEVERITY</th>
                <th className="pb-3 font-normal text-right">EXPOSED ROWS</th>
                <th className="pb-3 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131d2c]">
              {filteredBreaches.map(b => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBreach(b)}
                  className={`cursor-pointer hover:bg-[#101929] transition-colors ${
                    selectedBreach?.id === b.id ? 'bg-[#122036]' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white">
                    {b.city}, {b.countryCode}
                  </td>
                  <td className="py-3 text-[#38bdf8]">{b.breachName}</td>
                  <td className="py-3 text-[#cbd5e1]">
                    {b.identityMasked}{' '}
                    <span className="text-[10px] text-[#00f0a8]">({b.identityHashPrefix})</span>
                  </td>
                  <td className="py-3 text-[#94a3b8]">{b.sourceType}</td>
                  <td className="py-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: `${getSeverityColor(b.severity, b.isContained)}20`,
                        color: getSeverityColor(b.severity, b.isContained),
                      }}
                    >
                      {b.isContained ? 'CONTAINED' : b.severity}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[#cbd5e1]">
                    {b.recordsExposed.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBreach(b);
                      }}
                      className="rounded border border-[#1b2b42] bg-[#0c1424] px-2 py-1 text-[10px] text-[#38bdf8] hover:bg-[#14233c]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
