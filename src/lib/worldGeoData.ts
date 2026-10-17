import { AnonymizedBreachLocation } from '../types';

/**
 * Anonymized global breach data points discovered across dark web pastebins,
 * infostealer logs (RedLine, Lumma, Vidar), and public combo lists.
 *
 * Privacy Invariants Enforced:
 * 1. Coordinates are fuzzed with coarse differential jitter (±35km) to prevent physical geolocation doxxing.
 * 2. Identifiers are strictly masked (e.g. al***@gm***.com).
 * 3. Hashes expose only the 5-character k-anonymity prefix.
 * 4. Zero plaintext passwords or session tokens are stored or rendered.
 */
export const ANONYMIZED_BREACH_LOCATIONS: AnonymizedBreachLocation[] = [
  {
    id: 'brg_ashburn_01',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'United States',
    countryCode: 'US',
    city: 'Ashburn, VA',
    coordinates: [-77.48, 39.04],
    fuzzedCoordinates: [-77.42, 39.11],
    fuzzRadiusKm: 35,
    breachName: 'Naz.API Infostealer Collector',
    sourceType: 'infostealer',
    malwareFamily: 'RedLine Stealer v24.1',
    threatActor: 'TA505 Affiliate Syndicate',
    severity: 'CRITICAL',
    recordsExposed: 14200,
    dataClasses: ['email', 'password_hash', 'session_cookie', 'ip_address'],
    discoveredAt: '2024-01-16T08:30:00Z',
    isContained: false,
    recommendedAction: 'Invalidate active OAuth tokens and execute 10-step Containment Protocol.',
    mitreTechnique: 'T1555.003 - Credentials from Web Browsers',
  },
  {
    id: 'brg_sanjose_02',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'United States',
    countryCode: 'US',
    city: 'San Jose, CA',
    coordinates: [-121.88, 37.33],
    fuzzedCoordinates: [-121.94, 37.28],
    fuzzRadiusKm: 30,
    breachName: 'Cloud Storage API Key Exfiltration',
    sourceType: 'c2_server',
    malwareFamily: 'Lumma Stealer C2',
    threatActor: 'UNC2970',
    severity: 'HIGH',
    recordsExposed: 3100,
    dataClasses: ['oauth_token', 'browser_history', 'cookie'],
    discoveredAt: '2024-03-12T14:15:00Z',
    isContained: false,
    recommendedAction: 'Revoke AWS & Google Cloud session grants in Developer Security center.',
    mitreTechnique: 'T1539 - Steal Web Session Cookie',
  },
  {
    id: 'brg_frankfurt_03',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt am Main',
    coordinates: [8.68, 50.11],
    fuzzedCoordinates: [8.74, 50.18],
    fuzzRadiusKm: 40,
    breachName: 'Naz.API Aggregated Dataset',
    sourceType: 'credential_dump',
    malwareFamily: 'Botnet Harvester',
    threatActor: 'ShadowBroker Clone',
    severity: 'CRITICAL',
    recordsExposed: 28400,
    dataClasses: ['email', 'password_hash', 'autofill_data'],
    discoveredAt: '2024-01-16T11:45:00Z',
    isContained: false,
    recommendedAction: 'Rotate master vault passwords and enforce FIDO2 WebAuthn passkeys.',
    mitreTechnique: 'T1110.003 - Password Spraying',
  },
  {
    id: 'brg_amsterdam_04',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Netherlands',
    countryCode: 'NL',
    city: 'Amsterdam',
    coordinates: [4.90, 52.37],
    fuzzedCoordinates: [4.84, 52.41],
    fuzzRadiusKm: 25,
    breachName: 'Exploit.in Credential Dump',
    sourceType: 'darknet_forum',
    malwareFamily: 'Underground Combo Scrape',
    threatActor: 'Independent Threat Broker',
    severity: 'HIGH',
    recordsExposed: 6200,
    dataClasses: ['email', 'password_hash'],
    discoveredAt: '2023-11-20T19:00:00Z',
    isContained: true,
    recommendedAction: 'Archived exposure; password has been updated but email remains monitored.',
    mitreTechnique: 'T1589.001 - Credentials Gathering',
  },
  {
    id: 'brg_london_05',
    identityMasked: 'co***@va***.com',
    identityHashPrefix: '5BAA6',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    coordinates: [-0.12, 51.50],
    fuzzedCoordinates: [-0.08, 51.55],
    fuzzRadiusKm: 30,
    breachName: 'Enterprise VPN Gateway Credential Stuffing',
    sourceType: 'edge_gateway',
    malwareFamily: 'Automated Brute-Force Bot',
    threatActor: 'FIN7 Affiliate',
    severity: 'HIGH',
    recordsExposed: 1840,
    dataClasses: ['corporate_email', 'vpn_session_token', 'ip_history'],
    discoveredAt: '2024-02-04T06:10:00Z',
    isContained: true,
    recommendedAction: 'Enforce IP range restriction and terminate stale edge sessions.',
    mitreTechnique: 'T1078.004 - Valid Accounts: Cloud Accounts',
  },
  {
    id: 'brg_tokyo_06',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    coordinates: [139.69, 35.68],
    fuzzedCoordinates: [139.75, 35.62],
    fuzzRadiusKm: 35,
    breachName: 'Vidar Stealer Browser SQLite Dump',
    sourceType: 'infostealer',
    malwareFamily: 'Vidar Infostealer',
    threatActor: 'RedAlpha Botnet Operator',
    severity: 'CRITICAL',
    recordsExposed: 9750,
    dataClasses: ['browser_passwords', 'autofill', 'crypto_wallet_extension'],
    discoveredAt: '2024-04-18T16:20:00Z',
    isContained: false,
    recommendedAction: 'Inspect Browser Security Center and purge compromised browser profiles.',
    mitreTechnique: 'T1552.001 - Credentials in Files',
  },
  {
    id: 'brg_singapore_07',
    identityMasked: 'al***@se***.com',
    identityHashPrefix: 'A1B2C',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    coordinates: [103.85, 1.29],
    fuzzedCoordinates: [103.81, 1.34],
    fuzzRadiusKm: 20,
    breachName: 'Edge Gateway Telemetry Leak',
    sourceType: 'edge_gateway',
    malwareFamily: 'Scattered Spider Proxy',
    threatActor: 'Adversary Proxy Node',
    severity: 'MEDIUM',
    recordsExposed: 420,
    dataClasses: ['session_headers', 'tls_fingerprint'],
    discoveredAt: '2024-05-02T22:15:00Z',
    isContained: true,
    recommendedAction: 'Zero plaintext passwords detected; session token has been revoked.',
    mitreTechnique: 'T1190 - Exploit Public-Facing Application',
  },
  {
    id: 'brg_sydney_08',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    coordinates: [151.20, -33.86],
    fuzzedCoordinates: [151.15, -33.81],
    fuzzRadiusKm: 35,
    breachName: 'Underground Pastebin Credential Scrape',
    sourceType: 'pastebin',
    malwareFamily: 'Web Scraping Bot',
    threatActor: 'Unattributed Paste Publisher',
    severity: 'MEDIUM',
    recordsExposed: 1120,
    dataClasses: ['email', 'password_hash'],
    discoveredAt: '2023-08-14T12:00:00Z',
    isContained: true,
    recommendedAction: 'Legacy credential verified as rotated. Retained in monitoring fleet.',
    mitreTechnique: 'T1596 - Search Open Technical Databases',
  },
  {
    id: 'brg_saopaulo_09',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Brazil',
    countryCode: 'BR',
    city: 'São Paulo',
    coordinates: [-46.63, -23.55],
    fuzzedCoordinates: [-46.58, -23.61],
    fuzzRadiusKm: 40,
    breachName: 'Banking Trojan Telemetry Auction',
    sourceType: 'darknet_forum',
    malwareFamily: 'Grandoreiro Trojan Clone',
    threatActor: 'Latin American Cybercrime Cell',
    severity: 'HIGH',
    recordsExposed: 2300,
    dataClasses: ['email', 'bank_username_hash', 'session_id'],
    discoveredAt: '2023-10-09T03:45:00Z',
    isContained: false,
    recommendedAction: 'Verify financial account 2FA and enable biometric approvals.',
    mitreTechnique: 'T1056.001 - Keylogging',
  },
  {
    id: 'brg_paris_10',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    coordinates: [2.35, 48.85],
    fuzzedCoordinates: [2.41, 48.91],
    fuzzRadiusKm: 30,
    breachName: 'Reverse Proxy Phishing Kit Harvest',
    sourceType: 'c2_server',
    malwareFamily: 'Evilginx3 Infrastructure',
    threatActor: 'WizPhish Campaign',
    severity: 'HIGH',
    recordsExposed: 4500,
    dataClasses: ['email', 'session_cookie', 'mfa_token'],
    discoveredAt: '2024-01-29T17:10:00Z',
    isContained: false,
    recommendedAction: 'Upgrade from SMS/TOTP to FIDO2 WebAuthn to eliminate MitM relaying.',
    mitreTechnique: 'T1566.002 - Spearphishing Link',
  },
  {
    id: 'brg_seoul_11',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'South Korea',
    countryCode: 'KR',
    city: 'Seoul',
    coordinates: [126.97, 37.56],
    fuzzedCoordinates: [127.03, 37.51],
    fuzzRadiusKm: 30,
    breachName: 'Lumma C2 Botnet Beacon Node',
    sourceType: 'c2_server',
    malwareFamily: 'Lumma Stealer v4',
    threatActor: 'Lumma Operator Network',
    severity: 'CRITICAL',
    recordsExposed: 7100,
    dataClasses: ['browser_tokens', 'system_fingerprint', 'credentials'],
    discoveredAt: '2024-06-11T13:20:00Z',
    isContained: false,
    recommendedAction: 'Quarantine device and revoke sessions immediately via Incident Response.',
    mitreTechnique: 'T1071.001 - Web Protocols',
  },
  {
    id: 'brg_dubai_12',
    identityMasked: 'al***@se***.com',
    identityHashPrefix: 'A1B2C',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    coordinates: [55.27, 25.20],
    fuzzedCoordinates: [55.33, 25.15],
    fuzzRadiusKm: 35,
    breachName: 'Executive Credential Telegram Channel',
    sourceType: 'darknet_forum',
    malwareFamily: 'Telegram Combolist Scraper',
    threatActor: 'ThreatChannel 892',
    severity: 'HIGH',
    recordsExposed: 1450,
    dataClasses: ['domain_credentials', 'corporate_email'],
    discoveredAt: '2024-05-19T20:40:00Z',
    isContained: false,
    recommendedAction: 'Trigger enterprise domain password reset for impacted user.',
    mitreTechnique: 'T1589.002 - Email Addresses',
  },
  {
    id: 'brg_toronto_13',
    identityMasked: 'co***@va***.com',
    identityHashPrefix: '5BAA6',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto, ON',
    coordinates: [-79.38, 43.65],
    fuzzedCoordinates: [-79.44, 43.71],
    fuzzRadiusKm: 30,
    breachName: 'Cloud S3 Bucket Misconfiguration Dump',
    sourceType: 'credential_dump',
    malwareFamily: 'Exposed Cloud Storage',
    threatActor: 'Open Bucket Crawler',
    severity: 'LOW',
    recordsExposed: 890,
    dataClasses: ['developer_documentation', 'test_emails'],
    discoveredAt: '2023-06-22T09:15:00Z',
    isContained: true,
    recommendedAction: 'Bucket ACL secured; no production passwords were leaked.',
    mitreTechnique: 'T1530 - Data from Cloud Storage',
  },
  {
    id: 'brg_warsaw_14',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'Poland',
    countryCode: 'PL',
    city: 'Warsaw',
    coordinates: [21.01, 52.23],
    fuzzedCoordinates: [21.08, 52.19],
    fuzzRadiusKm: 35,
    breachName: 'Eastern European Forum Combo Dump',
    sourceType: 'darknet_forum',
    malwareFamily: 'Forum Scraper DB',
    threatActor: 'CyberGhost Group',
    severity: 'MEDIUM',
    recordsExposed: 3800,
    dataClasses: ['email', 'sha1_password_hash'],
    discoveredAt: '2023-12-05T14:35:00Z',
    isContained: true,
    recommendedAction: 'Rotated during Incident 2023-Q4 audit cycle.',
    mitreTechnique: 'T1110 - Brute Force',
  },
  {
    id: 'brg_johannesburg_15',
    identityMasked: 'al***@gm***.com',
    identityHashPrefix: '7C4A8',
    country: 'South Africa',
    countryCode: 'ZA',
    city: 'Johannesburg',
    coordinates: [28.04, -26.20],
    fuzzedCoordinates: [28.11, -26.26],
    fuzzRadiusKm: 40,
    breachName: 'Ransomware Affiliate Dropzone Dump',
    sourceType: 'c2_server',
    malwareFamily: 'LockBit 3.0 Stealer Module',
    threatActor: 'Affiliate #414',
    severity: 'MEDIUM',
    recordsExposed: 980,
    dataClasses: ['cached_credentials', 'vpn_profile'],
    discoveredAt: '2023-09-30T11:00:00Z',
    isContained: true,
    recommendedAction: 'All corresponding authentication tokens expired.',
    mitreTechnique: 'T1486 - Data Encrypted for Impact',
  },
];

/**
 * GeoJSON FeatureCollection defining world landmasses for zero-dependency,
 * lightning-fast D3 vector map rendering without external CDN calls.
 */
export const WORLD_GEO_FEATURE_COLLECTION: {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { name: string; region: string };
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: any;
    };
  }>;
} = {
  type: 'FeatureCollection',
  features: [
    // North America
    {
      type: 'Feature',
      properties: { name: 'North America', region: 'americas' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-168.0, 66.0], [-150.0, 70.0], [-130.0, 70.0], [-115.0, 69.0],
            [-95.0, 70.0], [-80.0, 62.0], [-60.0, 48.0], [-65.0, 44.0],
            [-75.0, 35.0], [-80.0, 25.0], [-82.0, 23.0], [-90.0, 21.0],
            [-97.0, 26.0], [-105.0, 20.0], [-100.0, 16.0], [-90.0, 14.0],
            [-80.0, 8.0], [-77.0, 8.0], [-83.0, 10.0], [-88.0, 16.0],
            [-105.0, 23.0], [-115.0, 32.0], [-124.0, 48.0], [-135.0, 57.0],
            [-165.0, 60.0], [-168.0, 66.0]
          ]
        ]
      }
    },
    // Greenland
    {
      type: 'Feature',
      properties: { name: 'Greenland', region: 'americas' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.0, 60.0], [-20.0, 70.0], [-18.0, 80.0], [-30.0, 83.0],
            [-60.0, 82.0], [-72.0, 76.0], [-55.0, 65.0], [-44.0, 60.0]
          ]
        ]
      }
    },
    // South America
    {
      type: 'Feature',
      properties: { name: 'South America', region: 'americas' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.0, 8.0], [-72.0, 11.0], [-60.0, 8.0], [-50.0, 0.0],
            [-35.0, -5.0], [-38.0, -13.0], [-42.0, -22.0], [-50.0, -30.0],
            [-58.0, -38.0], [-65.0, -45.0], [-68.0, -55.0], [-75.0, -50.0],
            [-73.0, -40.0], [-71.0, -30.0], [-76.0, -15.0], [-80.0, -2.0],
            [-77.0, 8.0]
          ]
        ]
      }
    },
    // Europe
    {
      type: 'Feature',
      properties: { name: 'Europe', region: 'europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.5, 36.0], [-9.0, 43.0], [-1.0, 44.0], [-4.5, 48.5],
            [2.0, 51.0], [5.0, 58.0], [5.0, 62.0], [15.0, 65.0],
            [25.0, 71.0], [32.0, 68.0], [40.0, 66.0], [50.0, 60.0],
            [50.0, 48.0], [40.0, 44.0], [30.0, 45.0], [24.0, 40.0],
            [22.0, 38.0], [15.0, 38.0], [12.0, 44.0], [3.0, 43.0],
            [-5.0, 36.0], [-9.5, 36.0]
          ]
        ]
      }
    },
    // British Isles
    {
      type: 'Feature',
      properties: { name: 'British Isles', region: 'europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.5, 50.0], [1.5, 52.5], [-2.0, 58.0], [-5.5, 58.5],
            [-6.0, 54.0], [-10.5, 52.0], [-10.0, 54.0], [-6.0, 55.0],
            [-5.5, 50.0]
          ]
        ]
      }
    },
    // Africa
    {
      type: 'Feature',
      properties: { name: 'Africa', region: 'africa' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.0, 36.0], [10.0, 37.0], [25.0, 32.0], [33.0, 30.0],
            [35.0, 27.0], [43.0, 12.0], [51.0, 10.0], [45.0, 0.0],
            [40.0, -10.0], [35.0, -20.0], [32.0, -28.0], [28.0, -34.0],
            [18.0, -34.5], [15.0, -25.0], [12.0, -15.0], [8.0, 4.0],
            [2.0, 6.0], [-5.0, 5.0], [-15.0, 10.0], [-17.0, 15.0],
            [-15.0, 22.0], [-10.0, 28.0], [-5.0, 36.0]
          ]
        ]
      }
    },
    // Asia
    {
      type: 'Feature',
      properties: { name: 'Asia', region: 'asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [36.0, 35.0], [40.0, 44.0], [50.0, 48.0], [50.0, 60.0],
            [60.0, 68.0], [80.0, 74.0], [100.0, 77.0], [130.0, 72.0],
            [160.0, 70.0], [180.0, 65.0], [170.0, 60.0], [140.0, 50.0],
            [130.0, 42.0], [120.0, 38.0], [122.0, 30.0], [115.0, 22.0],
            [108.0, 18.0], [102.0, 8.0], [100.0, 3.0], [98.0, 10.0],
            [90.0, 22.0], [80.0, 15.0], [77.0, 8.0], [70.0, 20.0],
            [60.0, 25.0], [55.0, 26.0], [50.0, 15.0], [43.0, 12.0],
            [35.0, 27.0], [36.0, 35.0]
          ]
        ]
      }
    },
    // Japan
    {
      type: 'Feature',
      properties: { name: 'Japan', region: 'asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.0, 32.0], [135.0, 35.0], [140.0, 38.0], [145.0, 44.0],
            [142.0, 45.0], [140.0, 41.0], [136.0, 36.0], [130.0, 33.0],
            [130.0, 32.0]
          ]
        ]
      }
    },
    // Australia
    {
      type: 'Feature',
      properties: { name: 'Australia', region: 'asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.0, -22.0], [125.0, -15.0], [136.0, -12.0], [142.0, -10.0],
            [145.0, -15.0], [150.0, -22.0], [153.0, -28.0], [150.0, -36.0],
            [142.0, -38.5], [135.0, -35.0], [128.0, -32.0], [116.0, -34.0],
            [113.0, -28.0], [114.0, -22.0]
          ]
        ]
      }
    },
    // New Zealand
    {
      type: 'Feature',
      properties: { name: 'New Zealand', region: 'asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.0, -46.0], [174.0, -42.0], [178.0, -37.5], [174.0, -35.0],
            [172.0, -41.0], [168.0, -44.0], [166.0, -46.0]
          ]
        ]
      }
    }
  ]
};

export const MAP_REGION_PRESETS = [
  { id: 'global', label: 'Global View', center: [0, 20] as [number, number], zoom: 1 },
  { id: 'americas', label: 'Americas', center: [-85, 25] as [number, number], zoom: 1.8 },
  { id: 'europe', label: 'Europe', center: [15, 52] as [number, number], zoom: 2.8 },
  { id: 'asia_pac', label: 'Asia-Pacific', center: [115, 20] as [number, number], zoom: 2.1 },
  { id: 'mideast_africa', label: 'Middle East & Africa', center: [35, 10] as [number, number], zoom: 2.0 },
];
