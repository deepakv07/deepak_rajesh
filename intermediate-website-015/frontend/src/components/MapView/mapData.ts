// ─── GIS Map Data: Hivare Bazar Micro-Watershed, Nashik, Maharashtra ───

export type StructureType = 'Check Dam' | 'Percolation Tank' | 'Farm Pond' | 'Gully Plug';
export type VerificationStatus = 'verified' | 'attention' | 'mismatch';

export interface StructureMarker {
  id: string;
  name: string;
  type: StructureType;
  status: VerificationStatus;
  lat: number;
  lng: number;
  gpsStr: string;
  confidence: number;
  ndviBaseline: number;
  ndviCurrent: number;
  capacity: string;
  scheme: string;
  officer: string;
  lastInspected: string;
  issue?: string;
  payment: 'cleared' | 'pending' | 'held';
  ndviSeries: number[]; // 12 monthly values Jan-Dec
}

export const STRUCTURE_MARKERS: StructureMarker[] = [
  {
    id: 'CD-HB-01',
    name: 'Hivare Bazar Check Dam #1',
    type: 'Check Dam',
    status: 'verified',
    lat: 19.991,
    lng: 74.445,
    gpsStr: '19.9910°N, 74.4450°E',
    confidence: 91.2,
    ndviBaseline: 0.29,
    ndviCurrent: 0.58,
    capacity: '3.2M L',
    scheme: 'PMKSY-WDC',
    officer: 'Shri A.D. Patil',
    lastInspected: '18 Oct 2024',
    payment: 'cleared',
    ndviSeries: [0.21, 0.24, 0.29, 0.31, 0.28, 0.33, 0.48, 0.58, 0.57, 0.52, 0.41, 0.30],
  },
  {
    id: 'CD-HB-02',
    name: 'Hivare Bazar Check Dam #2',
    type: 'Check Dam',
    status: 'verified',
    lat: 20.012,
    lng: 74.467,
    gpsStr: '20.0120°N, 74.4670°E',
    confidence: 88.4,
    ndviBaseline: 0.31,
    ndviCurrent: 0.61,
    capacity: '4.1M L',
    scheme: 'MGNREGS',
    officer: 'Smt. R. Jadhav',
    lastInspected: '21 Oct 2024',
    payment: 'cleared',
    ndviSeries: [0.22, 0.26, 0.31, 0.33, 0.30, 0.36, 0.51, 0.61, 0.59, 0.54, 0.43, 0.32],
  },
  {
    id: 'PT-HB-01',
    name: 'Percolation Tank — Hivare East',
    type: 'Percolation Tank',
    status: 'attention',
    lat: 19.998,
    lng: 74.452,
    gpsStr: '19.9980°N, 74.4520°E',
    confidence: 74.1,
    ndviBaseline: 0.25,
    ndviCurrent: 0.38,
    capacity: '6.8M L',
    scheme: 'PMKSY-WDC',
    officer: 'Shri K.B. Shinde',
    lastInspected: '12 Sep 2024',
    payment: 'pending',
    issue: 'Silt accumulation > 30% — Desilt required before next monsoon',
    ndviSeries: [0.20, 0.23, 0.25, 0.27, 0.26, 0.28, 0.34, 0.38, 0.37, 0.35, 0.30, 0.24],
  },
  {
    id: 'FP-HB-01',
    name: 'Farm Pond — Sector C',
    type: 'Farm Pond',
    status: 'verified',
    lat: 20.005,
    lng: 74.459,
    gpsStr: '20.0050°N, 74.4590°E',
    confidence: 94.7,
    ndviBaseline: 0.27,
    ndviCurrent: 0.62,
    capacity: '1.4M L',
    scheme: 'RKVY',
    officer: 'Shri V.M. Kulkarni',
    lastInspected: '25 Oct 2024',
    payment: 'cleared',
    ndviSeries: [0.19, 0.22, 0.27, 0.29, 0.31, 0.38, 0.55, 0.62, 0.60, 0.53, 0.40, 0.28],
  },
  {
    id: 'FP-HB-02',
    name: 'Farm Pond — Sector A',
    type: 'Farm Pond',
    status: 'verified',
    lat: 19.985,
    lng: 74.470,
    gpsStr: '19.9850°N, 74.4700°E',
    confidence: 89.3,
    ndviBaseline: 0.24,
    ndviCurrent: 0.55,
    capacity: '1.1M L',
    scheme: 'RKVY',
    officer: 'Smt. P. Wagh',
    lastInspected: '22 Oct 2024',
    payment: 'cleared',
    ndviSeries: [0.18, 0.20, 0.24, 0.26, 0.27, 0.35, 0.49, 0.55, 0.53, 0.48, 0.37, 0.26],
  },
  {
    id: 'GP-HB-01',
    name: 'Gully Plug #7 — North Nala',
    type: 'Gully Plug',
    status: 'mismatch',
    lat: 20.018,
    lng: 74.448,
    gpsStr: '20.0180°N, 74.4480°E',
    confidence: 42.8,
    ndviBaseline: 0.18,
    ndviCurrent: 0.22,
    capacity: '0.3M L',
    scheme: 'MGNREGS',
    officer: 'Shri S.R. More',
    lastInspected: '05 Sep 2024',
    payment: 'held',
    issue: 'Photo GPS mismatch — Uploaded coordinates diverge 820m from satellite-detected structure. Fraud risk: MEDIUM.',
    ndviSeries: [0.16, 0.17, 0.18, 0.19, 0.18, 0.20, 0.22, 0.22, 0.21, 0.20, 0.19, 0.17],
  },
  {
    id: 'GP-HB-02',
    name: 'Gully Plug #12 — South Ravine',
    type: 'Gully Plug',
    status: 'attention',
    lat: 19.978,
    lng: 74.463,
    gpsStr: '19.9780°N, 74.4630°E',
    confidence: 61.5,
    ndviBaseline: 0.20,
    ndviCurrent: 0.29,
    capacity: '0.2M L',
    scheme: 'MGNREGS',
    officer: 'Shri T.D. Gaikwad',
    lastInspected: '08 Oct 2024',
    payment: 'pending',
    issue: 'Partial structure damage detected in October pass. Repair works needed.',
    ndviSeries: [0.17, 0.19, 0.20, 0.21, 0.22, 0.24, 0.27, 0.29, 0.28, 0.26, 0.23, 0.19],
  },
];

// ─── Micro-Watershed Boundary GeoJSON ───
export const WATERSHED_BOUNDARY = {
  type: 'Feature' as const,
  properties: { name: 'Hivare Bazar Micro-Watershed', area_ha: 1482, villages: 12 },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [74.430, 19.970], [74.440, 19.965], [74.452, 19.963],
      [74.465, 19.966], [74.475, 19.972], [74.483, 19.980],
      [74.488, 19.990], [74.490, 20.001], [74.487, 20.012],
      [74.480, 20.021], [74.470, 20.027], [74.458, 20.030],
      [74.446, 20.028], [74.436, 20.022], [74.428, 20.013],
      [74.424, 20.002], [74.423, 19.991], [74.426, 19.980],
      [74.430, 19.970],
    ]],
  },
};

// ─── NDVI Overlay cells (simulated spectral grid) ───
// Each cell: [lng, lat, ndvi_before, ndvi_after]
export const NDVI_CELLS = [
  // High NDVI zones (riparian + forest)
  { bounds: [[19.988, 74.442], [19.998, 74.455]] as [[number,number],[number,number]], before: 0.31, after: 0.62, id: 'n1' },
  { bounds: [[20.000, 74.456], [20.012, 74.468]] as [[number,number],[number,number]], before: 0.28, after: 0.59, id: 'n2' },
  { bounds: [[19.975, 74.460], [19.985, 74.472]] as [[number,number],[number,number]], before: 0.26, after: 0.55, id: 'n3' },
  // Medium NDVI zones (agriculture)
  { bounds: [[19.985, 74.455], [19.996, 74.465]] as [[number,number],[number,number]], before: 0.22, after: 0.41, id: 'n4' },
  { bounds: [[20.005, 74.442], [20.016, 74.452]] as [[number,number],[number,number]], before: 0.20, after: 0.38, id: 'n5' },
  { bounds: [[19.980, 74.445], [19.990, 74.458]] as [[number,number],[number,number]], before: 0.24, after: 0.44, id: 'n6' },
  { bounds: [[20.010, 74.460], [20.022, 74.472]] as [[number,number],[number,number]], before: 0.19, after: 0.36, id: 'n7' },
  // Low NDVI zones (barren / ridge)
  { bounds: [[19.970, 74.468], [19.980, 74.478]] as [[number,number],[number,number]], before: 0.13, after: 0.22, id: 'n8' },
  { bounds: [[20.014, 74.448], [20.025, 74.458]] as [[number,number],[number,number]], before: 0.12, after: 0.19, id: 'n9' },
];

// ─── NDWI (Water) cells ───
export const NDWI_CELLS = [
  { bounds: [[19.990, 74.443], [19.998, 74.452]] as [[number,number],[number,number]], before: -0.12, after: 0.41, id: 'w1' },
  { bounds: [[20.002, 74.457], [20.010, 74.465]] as [[number,number],[number,number]], before: -0.08, after: 0.38, id: 'w2' },
  { bounds: [[19.982, 74.462], [19.990, 74.470]] as [[number,number],[number,number]], before: -0.15, after: 0.30, id: 'w3' },
  { bounds: [[19.976, 74.448], [19.984, 74.456]] as [[number,number],[number,number]], before: -0.20, after: 0.18, id: 'w4' },
  { bounds: [[20.012, 74.462], [20.020, 74.470]] as [[number,number],[number,number]], before: -0.10, after: 0.25, id: 'w5' },
];

// ─── LULC classified zones ───
export const LULC_ZONES = [
  { bounds: [[19.992, 74.440], [20.006, 74.458]] as [[number,number],[number,number]], class: 'Forest', color: '#166534', id: 'l1' },
  { bounds: [[19.978, 74.448], [19.992, 74.462]] as [[number,number],[number,number]], class: 'Agriculture', color: '#a3e635', id: 'l2' },
  { bounds: [[20.005, 74.455], [20.018, 74.468]] as [[number,number],[number,number]], class: 'Agriculture', color: '#84cc16', id: 'l3' },
  { bounds: [[19.968, 74.458], [19.980, 74.472]] as [[number,number],[number,number]], class: 'Fallow Land', color: '#d97706', id: 'l4' },
  { bounds: [[20.013, 74.443], [20.025, 74.456]] as [[number,number],[number,number]], class: 'Degraded/Barren', color: '#92400e', id: 'l5' },
  { bounds: [[19.984, 74.440], [19.993, 74.450]] as [[number,number],[number,number]], class: 'Water Body', color: '#0284c7', id: 'l6' },
  { bounds: [[19.997, 74.463], [20.008, 74.472]] as [[number,number],[number,number]], class: 'Settlement', color: '#6b7280', id: 'l7' },
  { bounds: [[19.974, 74.435], [19.984, 74.447]] as [[number,number],[number,number]], class: 'Scrubland', color: '#65a30d', id: 'l8' },
];
