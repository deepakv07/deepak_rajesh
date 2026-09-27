import { Router } from 'express';

export const gisRouter = Router();

/**
 * GET /api/gis/watershed-meta
 * Telemetry endpoint for WATERSCOPE watershed spatial metadata
 */
gisRouter.get('/watershed-meta', (_req, res) => {
  res.json({
    status: 'success',
    watershed: {
      id: 'KAN-WS-015',
      name: 'Kancheepuram Watershed Region',
      center: { lat: 12.9812, lng: 80.1247 },
      areaHa: 2860,
      state: 'Tamil Nadu',
      district: 'Kancheepuram',
      layers: [
        'Esri World Imagery Satellite',
        'Esri World Boundaries and Places',
        'Esri World Transportation',
        'WATERSCOPE Watershed Boundary',
        'Drainage Streams Network',
        'Physical Interventions',
        'Geo-tagged Field Photos',
      ],
    },
  });
});

/**
 * GET /api/gis/interventions
 * Spatial interventions vector data endpoint
 */
gisRouter.get('/interventions', (_req, res) => {
  res.json({
    status: 'success',
    count: 3,
    interventions: [
      {
        id: 'WD-021',
        type: 'Check Dam',
        lat: 12.9812,
        lng: 80.122,
        status: 'Verified (Sub-pixel Calibrated)',
        evidence: '4 geo-coded ground photos attached',
      },
      {
        id: 'WD-014',
        type: 'Farm Pond',
        lat: 12.985,
        lng: 80.13,
        status: 'Verified',
        evidence: '2 geo-coded ground photos attached',
      },
      {
        id: 'WD-009',
        type: 'Contour Bund',
        lat: 12.97,
        lng: 80.118,
        status: 'Pending Field Check',
        evidence: 'Satellite spectral anomaly detected',
      },
    ],
  });
});
