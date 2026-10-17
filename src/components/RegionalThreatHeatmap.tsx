import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';
import {
  Globe,
  Flame,
  AlertTriangle,
  Shield,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info,
  Calendar,
  Zap,
  Eye,
  Radio,
  Lock,
} from 'lucide-react';
import { AnonymizedBreachLocation } from '../types';
import { ANONYMIZED_BREACH_LOCATIONS } from '../lib/worldGeoData';

interface RegionalThreatHeatmapProps {
  onNavigateToIncident?: () => void;
  onNavigateToGlobe?: () => void;
  onSelectBreach?: (breach: AnonymizedBreachLocation) => void;
}

// Global Macro Regions configuration
interface RegionSummary {
  id: string;
  name: string;
  code: string;
  countries: string[];
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  threatScore: number; // 0 - 100
  incidentCount: number;
  criticalCount: number;
  highCount: number;
  recordsExposed: number;
  containedCount: number;
  dominantMalware: string;
  primaryVector: string;
  fuzzRadiusAvg: number;
  description: string;
}

export const RegionalThreatHeatmap: React.FC<RegionalThreatHeatmapProps> = ({
  onNavigateToIncident,
  onNavigateToGlobe,
  onSelectBreach,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  const [metricMode, setMetricMode] = useState<'incidents' | 'records' | 'intensity'>('incidents');
  const [timeWindow, setTimeWindow] = useState<'30d' | '90d' | 'all'>('90d');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    region: string;
    vector: string;
    intensity: number;
    incidents: number;
    records: number;
  } | null>(null);

  // Grouped macro-region data definitions
  const regions: RegionSummary[] = useMemo(() => {
    return [
      {
        id: 'na',
        name: 'North America',
        code: 'NA',
        countries: ['United States', 'Canada'],
        threatLevel: 'CRITICAL',
        threatScore: 92,
        incidentCount: 5,
        criticalCount: 3,
        highCount: 2,
        recordsExposed: 48900,
        containedCount: 2,
        dominantMalware: 'RedLine Stealer v24.1',
        primaryVector: 'Infostealer SQLite Scrape',
        fuzzRadiusAvg: 32,
        description: 'Dense concentration of cloud infrastructure credentials and browser autofill dumps.',
      },
      {
        id: 'eu',
        name: 'Western Europe',
        code: 'EU',
        countries: ['Germany', 'Netherlands', 'United Kingdom', 'France'],
        threatLevel: 'CRITICAL',
        threatScore: 88,
        incidentCount: 6,
        criticalCount: 3,
        highCount: 2,
        recordsExposed: 52100,
        containedCount: 3,
        dominantMalware: 'Naz.API Aggregated Dataset',
        primaryVector: 'Darknet Pastebin & C2 Proxies',
        fuzzRadiusAvg: 34,
        description: 'High volume of credential-stuffing combo lists targeting enterprise single sign-on (SSO).',
      },
      {
        id: 'apac',
        name: 'Asia-Pacific',
        code: 'APAC',
        countries: ['Japan', 'Singapore', 'Australia', 'South Korea', 'India'],
        threatLevel: 'HIGH',
        threatScore: 81,
        incidentCount: 4,
        criticalCount: 2,
        highCount: 1,
        recordsExposed: 24350,
        containedCount: 1,
        dominantMalware: 'Vidar & Lumma Stealer',
        primaryVector: 'Cryptocurrency Extension Exfiltration',
        fuzzRadiusAvg: 28,
        description: 'Focused malware campaigns targeting web3 browser wallets and edge VPN tokens.',
      },
      {
        id: 'latam',
        name: 'Latin America',
        code: 'LATAM',
        countries: ['Brazil', 'Mexico', 'Argentina'],
        threatLevel: 'MODERATE',
        threatScore: 68,
        incidentCount: 2,
        criticalCount: 1,
        highCount: 1,
        recordsExposed: 16700,
        containedCount: 1,
        dominantMalware: 'Grandoreiro Banking Trojan',
        primaryVector: 'Phishing Redirects & Overlay Bots',
        fuzzRadiusAvg: 35,
        description: 'Rapid growth in automated session theft targeting fintech platforms and e-commerce portals.',
      },
      {
        id: 'mea',
        name: 'Middle East & Africa',
        code: 'MEA',
        countries: ['United Arab Emirates', 'South Africa'],
        threatLevel: 'MODERATE',
        threatScore: 62,
        incidentCount: 2,
        criticalCount: 0,
        highCount: 2,
        recordsExposed: 11200,
        containedCount: 1,
        dominantMalware: 'Stealc Info Harvester',
        primaryVector: 'Edge Gateway Telemetry Leak',
        fuzzRadiusAvg: 30,
        description: 'Credential harvesting from public Wi-Fi hotspots and corporate remote access gateways.',
      },
      {
        id: 'nordics_ch',
        name: 'Nordics & Central Europe',
        code: 'NCE',
        countries: ['Switzerland', 'Sweden'],
        threatLevel: 'LOW',
        threatScore: 42,
        incidentCount: 2,
        criticalCount: 0,
        highCount: 1,
        recordsExposed: 5800,
        containedCount: 2,
        dominantMalware: 'Lumma Stealer C2',
        primaryVector: 'Malvertising Downloads',
        fuzzRadiusAvg: 25,
        description: 'Targeted spear-phishing with high containment efficacy through hardware token adoption.',
      },
    ];
  }, []);

  // Multi-Month Regional Threat Timeline for AreaChart
  const timelineData = useMemo(() => {
    return [
      { month: 'Oct 23', NorthAmerica: 12000, Europe: 14500, AsiaPacific: 6200, LatinAmerica: 3100, MEA: 2400, totalExposures: 38200 },
      { month: 'Nov 23', NorthAmerica: 18400, Europe: 16200, AsiaPacific: 7800, LatinAmerica: 4200, MEA: 3100, totalExposures: 49700 },
      { month: 'Dec 23', NorthAmerica: 24100, Europe: 22800, AsiaPacific: 9400, LatinAmerica: 5800, MEA: 3900, totalExposures: 66000 },
      { month: 'Jan 24', NorthAmerica: 42000, Europe: 38500, AsiaPacific: 14200, LatinAmerica: 8200, MEA: 5100, totalExposures: 108000 },
      { month: 'Feb 24', NorthAmerica: 36500, Europe: 34100, AsiaPacific: 16800, LatinAmerica: 9400, MEA: 6200, totalExposures: 103000 },
      { month: 'Mar 24', NorthAmerica: 44200, Europe: 39800, AsiaPacific: 20100, LatinAmerica: 12100, MEA: 7800, totalExposures: 124000 },
      { month: 'Apr 24', NorthAmerica: 48900, Europe: 46200, AsiaPacific: 24350, LatinAmerica: 14500, MEA: 9200, totalExposures: 143150 },
      { month: 'May 24', NorthAmerica: 39100, Europe: 41200, AsiaPacific: 22400, LatinAmerica: 13200, MEA: 8400, totalExposures: 124300 },
      { month: 'Jun 24', NorthAmerica: 45300, Europe: 47900, AsiaPacific: 26100, LatinAmerica: 15800, MEA: 10500, totalExposures: 145600 },
      { month: 'Jul 24', NorthAmerica: 41200, Europe: 44100, AsiaPacific: 23800, LatinAmerica: 14200, MEA: 9800, totalExposures: 133100 },
      { month: 'Aug 24', NorthAmerica: 47800, Europe: 51200, AsiaPacific: 28400, LatinAmerica: 16900, MEA: 11400, totalExposures: 155700 },
      { month: 'Sep 24', NorthAmerica: 52100, Europe: 54600, AsiaPacific: 31200, LatinAmerica: 18400, MEA: 12800, totalExposures: 169100 },
    ];
  }, []);

  // Stacked Bar Data: Severity Distribution by Region
  const regionalSeverityData = useMemo(() => {
    return regions.map(r => ({
      region: r.name,
      code: r.code,
      Critical: r.criticalCount,
      High: r.highCount,
      Moderate: r.incidentCount - (r.criticalCount + r.highCount),
      Contained: r.containedCount,
      records: r.recordsExposed,
      score: r.threatScore,
    }));
  }, [regions]);

  // Infostealer Radar Capabilities Comparison
  const malwareRadarData = useMemo(() => {
    return [
      { metric: 'Volume Exfiltration', Lumma: 94, RedLine: 98, Vidar: 82, Stealc: 75, Racoon: 68 },
      { metric: 'Session Hijack Rate', Lumma: 96, RedLine: 91, Vidar: 88, Stealc: 79, Racoon: 72 },
      { metric: 'Crypto Extension Theft', Lumma: 88, RedLine: 92, Vidar: 95, Stealc: 64, Racoon: 58 },
      { metric: 'C2 Relay Agility', Lumma: 95, RedLine: 86, Vidar: 84, Stealc: 89, Racoon: 65 },
      { metric: 'EDR Evasion Rating', Lumma: 92, RedLine: 84, Vidar: 87, Stealc: 82, Racoon: 61 },
      { metric: 'Darknet Market Liquidity', Lumma: 98, RedLine: 99, Vidar: 90, Stealc: 85, Racoon: 76 },
    ];
  }, []);

  // Heatmap Matrix Grid Data: Regions x Attack Vectors
  const attackVectors = [
    'Infostealer Malware',
    'C2 Server Relays',
    'Darknet Combo Drops',
    'Edge VPN Stuffing',
    'Cloud API Harvesters',
  ];

  const heatmapMatrix = useMemo(() => {
    const matrix: Array<{
      region: string;
      regionCode: string;
      vector: string;
      intensity: number; // 0 - 100
      incidents: number;
      records: number;
    }> = [
      { region: 'North America', regionCode: 'NA', vector: 'Infostealer Malware', intensity: 96, incidents: 3, records: 32000 },
      { region: 'North America', regionCode: 'NA', vector: 'C2 Server Relays', intensity: 88, incidents: 2, records: 12400 },
      { region: 'North America', regionCode: 'NA', vector: 'Darknet Combo Drops', intensity: 78, incidents: 1, records: 4500 },
      { region: 'North America', regionCode: 'NA', vector: 'Edge VPN Stuffing', intensity: 72, incidents: 1, records: 3200 },
      { region: 'North America', regionCode: 'NA', vector: 'Cloud API Harvesters', intensity: 91, incidents: 2, records: 14100 },

      { region: 'Western Europe', regionCode: 'EU', vector: 'Infostealer Malware', intensity: 94, incidents: 3, records: 28400 },
      { region: 'Western Europe', regionCode: 'EU', vector: 'C2 Server Relays', intensity: 84, incidents: 2, records: 9800 },
      { region: 'Western Europe', regionCode: 'EU', vector: 'Darknet Combo Drops', intensity: 95, incidents: 3, records: 34000 },
      { region: 'Western Europe', regionCode: 'Edge VPN Stuffing', vector: 'Edge VPN Stuffing', intensity: 86, incidents: 2, records: 6100 },
      { region: 'Western Europe', regionCode: 'EU', vector: 'Cloud API Harvesters', intensity: 68, incidents: 1, records: 4200 },

      { region: 'Asia-Pacific', regionCode: 'APAC', vector: 'Infostealer Malware', intensity: 85, incidents: 2, records: 16200 },
      { region: 'Asia-Pacific', regionCode: 'APAC', vector: 'C2 Server Relays', intensity: 76, incidents: 1, records: 5400 },
      { region: 'Asia-Pacific', regionCode: 'APAC', vector: 'Darknet Combo Drops', intensity: 62, incidents: 1, records: 3100 },
      { region: 'Asia-Pacific', regionCode: 'APAC', vector: 'Edge VPN Stuffing', intensity: 89, incidents: 2, records: 7800 },
      { region: 'Asia-Pacific', regionCode: 'APAC', vector: 'Cloud API Harvesters', intensity: 79, incidents: 1, records: 6100 },

      { region: 'Latin America', regionCode: 'LATAM', vector: 'Infostealer Malware', intensity: 74, incidents: 1, records: 9200 },
      { region: 'Latin America', regionCode: 'LATAM', vector: 'C2 Server Relays', intensity: 65, incidents: 1, records: 3800 },
      { region: 'Latin America', regionCode: 'LATAM', vector: 'Darknet Combo Drops', intensity: 70, incidents: 1, records: 4400 },
      { region: 'Latin America', regionCode: 'LATAM', vector: 'Edge VPN Stuffing', intensity: 58, incidents: 0, records: 1200 },
      { region: 'Latin America', regionCode: 'LATAM', vector: 'Cloud API Harvesters', intensity: 62, incidents: 1, records: 2800 },

      { region: 'Middle East & Africa', regionCode: 'MEA', vector: 'Infostealer Malware', intensity: 68, incidents: 1, records: 6800 },
      { region: 'Middle East & Africa', regionCode: 'MEA', vector: 'C2 Server Relays', intensity: 54, incidents: 1, records: 2100 },
      { region: 'Middle East & Africa', regionCode: 'MEA', vector: 'Darknet Combo Drops', intensity: 60, incidents: 1, records: 3200 },
      { region: 'Middle East & Africa', regionCode: 'MEA', vector: 'Edge VPN Stuffing', intensity: 66, incidents: 1, records: 2900 },
      { region: 'Middle East & Africa', regionCode: 'MEA', vector: 'Cloud API Harvesters', intensity: 48, incidents: 0, records: 800 },

      { region: 'Nordics & CH', regionCode: 'NCE', vector: 'Infostealer Malware', intensity: 45, incidents: 1, records: 3200 },
      { region: 'Nordics & CH', regionCode: 'NCE', vector: 'C2 Server Relays', intensity: 38, incidents: 0, records: 1100 },
      { region: 'Nordics & CH', regionCode: 'NCE', vector: 'Darknet Combo Drops', intensity: 42, incidents: 1, records: 2100 },
      { region: 'Nordics & CH', regionCode: 'NCE', vector: 'Edge VPN Stuffing', intensity: 35, incidents: 0, records: 850 },
      { region: 'Nordics & CH', regionCode: 'NCE', vector: 'Cloud API Harvesters', intensity: 30, incidents: 0, records: 600 },
    ];
    return matrix;
  }, []);

  // Filtered breaches matching selected region
  const filteredBreaches = useMemo(() => {
    if (selectedRegionId === 'all') return ANONYMIZED_BREACH_LOCATIONS;
    const regionObj = regions.find(r => r.id === selectedRegionId);
    if (!regionObj) return ANONYMIZED_BREACH_LOCATIONS;
    return ANONYMIZED_BREACH_LOCATIONS.filter(b => regionObj.countries.includes(b.country));
  }, [selectedRegionId, regions]);

  // Color mapper for intensity
  const getIntensityColor = (intensity: number) => {
    if (intensity >= 85) return 'bg-rose-500/80 text-white border-rose-400 shadow-rose-950/50';
    if (intensity >= 70) return 'bg-orange-500/75 text-white border-orange-400';
    if (intensity >= 55) return 'bg-amber-500/60 text-slate-100 border-amber-400/80';
    if (intensity >= 40) return 'bg-sky-500/50 text-slate-100 border-sky-400/60';
    return 'bg-emerald-500/30 text-slate-200 border-emerald-400/40';
  };

  const totalExposuresSum = regions.reduce((acc, r) => acc + r.recordsExposed, 0);
  const totalIncidentsSum = regions.reduce((acc, r) => acc + r.incidentCount, 0);
  const totalContainedSum = regions.reduce((acc, r) => acc + r.containedCount, 0);
  const avgThreatScore = Math.round(regions.reduce((acc, r) => acc + r.threatScore, 0) / regions.length);

  return (
    <div className="space-y-6">
      {/* Top Threat KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Global Threat Index</span>
            <Flame className="h-4 w-4 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-sans">{avgThreatScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-rose-400">
            <TrendingUp className="h-3 w-3" />
            <span>+8.4% velocity vs previous quarter</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Records Exposed</span>
            <Radio className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-sans">
              {(totalExposuresSum / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-500">records</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>Across 6 global cyber theatres</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Hotspot</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold text-white tracking-tight">North America & EU</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            <span>RedLine & Lumma C2 Corridors</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Containment Rate</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-sans">
              {Math.round((totalContainedSum / totalIncidentsSum) * 100)}%
            </span>
            <span className="text-xs text-slate-500">mitigated</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400/90 flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{totalContainedSum} of {totalIncidentsSum} incidents locked</span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Regional Security Incident Heatmap & Macro Trends
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Recharts Data Viz
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Continuous threat density telemetry mapped across international cybersecurity theatres with differential privacy fuzzing.
          </p>
        </div>

        {/* Controls: Region & Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedRegionId('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedRegionId === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Regions
            </button>
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegionId(r.id)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedRegionId === r.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.code}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMetricMode('incidents')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'incidents'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Incidents
            </button>
            <button
              onClick={() => setMetricMode('records')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'records'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Records
            </button>
            <button
              onClick={() => setMetricMode('intensity')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'intensity'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Intensity
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Heatmap Matrix + Threat Timeline AreaChart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Regional Threat Density Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-rose-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Regional Attack Vector Density Heatmap
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Intensity Index (0 - 100)</span>
            </div>

            {/* Heatmap Matrix Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                    <th className="py-2 pr-3 font-semibold text-slate-300">Theatre</th>
                    {attackVectors.map(v => (
                      <th key={v} className="py-2 px-1.5 text-center font-medium truncate max-w-[100px]" title={v}>
                        {v.split(' ')[0]}
                      </th>
                    ))}
                    <th className="py-2 pl-3 text-right font-semibold text-slate-300">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {regions.map(r => {
                    const rowCells = heatmapMatrix.filter(
                      c => c.region === r.name || c.regionCode === r.code
                    );
                    const isSelected = selectedRegionId === r.id;

                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRegionId(isSelected ? 'all' : r.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/60'
                            : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white tracking-tight">{r.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">[{r.code}]</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {r.dominantMalware}
                          </div>
                        </td>

                        {attackVectors.map(v => {
                          const cell = rowCells.find(c => c.vector === v);
                          const intensity = cell ? cell.intensity : 40;
                          const incidents = cell ? cell.incidents : 0;
                          const records = cell ? cell.records : 0;

                          return (
                            <td key={v} className="py-2 px-1.5 text-center">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedHeatmapCell({
                                    region: r.name,
                                    vector: v,
                                    intensity,
                                    incidents,
                                    records,
                                  });
                                }}
                                title={`${r.name} · ${v}: Intensity ${intensity}/100, ${incidents} incidents`}
                                className={`w-full py-2 px-1 rounded-lg border text-[11px] font-mono font-bold transition-transform hover:scale-105 ${getIntensityColor(
                                  intensity
                                )}`}
                              >
                                {metricMode === 'incidents'
                                  ? incidents
                                  : metricMode === 'records'
                                  ? `${(records / 1000).toFixed(0)}k`
                                  : intensity}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3 pl-3 text-right">
                          <span className={`font-mono font-bold text-xs ${
                            r.threatScore >= 80
                              ? 'text-rose-400'
                              : r.threatScore >= 60
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {r.threatScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center space-x-2">
                <span>Threat Scale:</span>
                <div className="flex items-center space-x-1 font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                    &lt;40 Low
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/50 text-sky-200 border border-sky-400/60">
                    40-55 Guarded
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/60 text-amber-200 border border-amber-400/80">
                    55-70 Elevated
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/75 text-white border border-orange-400">
                    70-85 High
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/80 text-white border border-rose-400">
                    85+ Critical
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Click any cell to inspect details</span>
            </div>
          </div>

          {/* Selected Heatmap Cell Detail Popover/Banner */}
          {selectedHeatmapCell && (
            <div className="mt-4 p-3 rounded-xl border border-emerald-500/30 bg-slate-950/90 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white tracking-tight">
                    {selectedHeatmapCell.region} · {selectedHeatmapCell.vector}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Intensity: {selectedHeatmapCell.intensity}/100 · {selectedHeatmapCell.incidents} active incidents · {selectedHeatmapCell.records.toLocaleString()} records
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onNavigateToIncident && (
                  <button
                    onClick={onNavigateToIncident}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-500 transition-colors shadow-sm"
                  >
                    <span>Contain Threat</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedHeatmapCell(null)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Regional Severity Stacked BarChart (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Regional Severity Distribution
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Incident Severity Count</span>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalSeverityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="code"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="Critical" stackId="a" fill="#f43f5e" name="Critical" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="High" stackId="a" fill="#f97316" name="High" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Moderate" stackId="a" fill="#38bdf8" name="Moderate" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Contained" stackId="a" fill="#10b981" name="Contained" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>High containment seen in NCE & APAC</span>
            {onNavigateToGlobe && (
              <button
                onClick={onNavigateToGlobe}
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <span>View on 3D Globe</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: 12-Month Exfiltration Trend AreaChart + Infostealer Capabilities Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 12-Month Multi-Region Exfiltration Volume (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white tracking-tight">
                12-Month Regional Exfiltration Trajectory
              </h4>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>Records Leaked (k-Anonymity Verified Indices)</span>
            </div>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorEU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAPAC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} records`, 'Exposures']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="NorthAmerica"
                  name="North America"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNA)"
                />
                <Area
                  type="monotone"
                  dataKey="Europe"
                  name="Western Europe"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEU)"
                />
                <Area
                  type="monotone"
                  dataKey="AsiaPacific"
                  name="Asia-Pacific"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAPAC)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Infostealer Capabilities RadarChart (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Infostealer Threat Vectors
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Radar Model</span>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={malwareRadarData} outerRadius="75%">
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                  <Radar
                    name="RedLine"
                    dataKey="RedLine"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.25}
                  />
                  <Radar
                    name="Lumma"
                    dataKey="Lumma"
                    stroke="#00f0a8"
                    fill="#00f0a8"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Vidar"
                    dataKey="Vidar"
                    stroke="#38bdf8"
                    fill="#38bdf8"
                    fillOpacity={0.15}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
            <span>RedLine & Lumma lead in session cookie extraction and web browser token exfiltration</span>
          </div>
        </div>
      </div>

      {/* Filtered Incidents Table matching selected region */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Active Regional Incidents ({filteredBreaches.length})
            </h4>
            <p className="text-xs text-slate-400">
              {selectedRegionId === 'all'
                ? 'Displaying all verified global threat exposures'
                : `Filtered to incidents within ${regions.find(r => r.id === selectedRegionId)?.name}`}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Differential Fuzzing:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              ±25 to 40 km
            </span>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-800/60 overflow-hidden">
          {filteredBreaches.map(b => (
            <div
              key={b.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                    b.severity === 'CRITICAL'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                      : b.severity === 'HIGH'
                      ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                      : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                  }`}
                >
                  {b.severity[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-white tracking-tight">{b.city}, {b.country}</span>
                    <span className="text-[10px] font-mono text-slate-400">· {b.breachName}</span>
                    {b.isContained && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Contained
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                    <span>Malware: <strong className="text-slate-200">{b.malwareFamily}</strong></span>
                    <span>·</span>
                    <span>Records: <strong className="text-slate-200">{b.recordsExposed.toLocaleString()}</strong></span>
                    <span>·</span>
                    <span>MITRE: <code className="text-cyan-400">{b.mitreTechnique ? b.mitreTechnique.split(' - ')[0] : 'T1555'}</code></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {onSelectBreach && (
                  <button
                    onClick={() => onSelectBreach(b)}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Inspect</span>
                  </button>
                )}
                {onNavigateToIncident && !b.isContained && (
                  <button
                    onClick={onNavigateToIncident}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-semibold hover:bg-rose-500 transition-colors shadow-sm"
                  >
                    <span>Remediate</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
