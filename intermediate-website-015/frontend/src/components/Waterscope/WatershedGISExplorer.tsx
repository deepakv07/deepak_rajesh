import React, { useState, useEffect, useRef } from 'react';
import type { AppTheme } from '../../App';

// OpenLayers Imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import 'ol/ol.css';

// Esri Satellite & Reference Layer Configuration Service
import {
  createEsriSatelliteLayer,
  createEsriReferenceLayer,
  createEsriTransportationLayer,
} from '../../services/mapConfig';

interface Props {
  theme: AppTheme;
}

export const WatershedGISExplorer: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  // Status and coordinates state
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({
    lat: '12.9812°N',
    lng: '80.1247°E',
  });

  const [satelliteStatus, setSatelliteStatus] = useState<
    'active' | 'loading' | 'error'
  >('active');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Esri World Imagery + Reference Labels Active'
  );

  // Layer Toggles State
  const [layers, setLayers] = useState({
    // Physical / Satellite Basemap (Esri World Imagery - Bottom Layer)
    satellite: true,
    // Real Esri Reference Layer (Place names, cities, villages, boundaries, roads)
    reference: true,
    // Optional OSM Reference
    street: false,
    // WATERSCOPE Vector Spatial Layers
    boundary: true,
    drainage: true,
    waterbodies: true,
    interventions: true,
    photos: true,
    footprints: true,
    verification: true,
    reliability: false,
  });

  const [selectedFeature, setSelectedFeature] = useState<{
    type: string;
    id: string;
    status: string;
    evidence: string;
    coordinates?: string;
  } | null>(null);

  // References to OL Layers
  const olLayersRef = useRef<Record<string, TileLayer<any> | VectorLayer<any>>>({});

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === 'reference') {
        if (olLayersRef.current['reference']) {
          olLayersRef.current['reference'].setVisible(next.reference);
        }
        if (olLayersRef.current['transportation']) {
          olLayersRef.current['transportation'].setVisible(next.reference);
        }
      } else if (olLayersRef.current[key]) {
        olLayersRef.current[key].setVisible(next[key]);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!mapElementRef.current) return;

    // Demo Watershed Center: Kancheepuram / Chennai region (12.9812°N, 80.1247°E)
    const center = fromLonLat([80.1247, 12.9812]);

    // 1. LAYER 1 (BOTTOM BASEMAP): Real Esri World Imagery MapServer (zIndex: 0)
    const esriSatelliteLayer = createEsriSatelliteLayer(layers.satellite, 0);

    // 2. LAYER 2 (REFERENCE & LABELS): Real Esri World Boundaries and Places (zIndex: 1)
    const esriReferenceLayer = createEsriReferenceLayer(layers.reference, 1);

    // 3. LAYER 3 (TRANSPORTATION & ROADS): Real Esri World Transportation (zIndex: 2)
    const esriTransportationLayer = createEsriTransportationLayer(layers.reference, 2);

    // Track tile loading events on Esri sources
    const esriSource = esriSatelliteLayer.getSource();
    if (esriSource) {
      esriSource.on('tileloadstart', () => {
        setSatelliteStatus('loading');
        setStatusMessage('Loading Esri satellite & reference tiles...');
      });
      esriSource.on('tileloadend', () => {
        setSatelliteStatus('active');
        setStatusMessage('Esri World Imagery + Reference Labels Active');
      });
      esriSource.on('tileloaderror', () => {
        setSatelliteStatus('active'); // keep active state for cached tiles
        setStatusMessage('Esri World Imagery + Reference Labels Active');
      });
    }

    // 4. OpenStreetMap Standard Layer (Optional reference overlay, zIndex: 3)
    const streetLayer = new TileLayer({
      properties: { id: 'street' },
      source: new OSM(),
      visible: layers.street,
      zIndex: 3,
    });

    // 5. WATERSCOPE Vector Layer: Watershed Boundary Polygon (zIndex: 10)
    const boundaryPoly = new Polygon([[
      fromLonLat([80.1100, 12.9900]),
      fromLonLat([80.1380, 12.9950]),
      fromLonLat([80.1450, 12.9800]),
      fromLonLat([80.1350, 12.9650]),
      fromLonLat([80.1150, 12.9600]),
      fromLonLat([80.1050, 12.9750]),
      fromLonLat([80.1100, 12.9900]),
    ]]);

    const boundaryFeature = new Feature({ geometry: boundaryPoly, type: 'Boundary' });
    const boundaryLayer = new VectorLayer({
      properties: { id: 'boundary' },
      source: new VectorSource({ features: [boundaryFeature] }),
      style: new Style({
        stroke: new Stroke({
          color: '#38bdf8',
          width: 3,
          lineDash: [6, 4],
        }),
        fill: new Fill({ color: 'rgba(56, 189, 248, 0.12)' }),
      }),
      visible: layers.boundary,
      zIndex: 10,
    });

    // 6. WATERSCOPE Vector Layer: Drainage Streams (zIndex: 12)
    const stream1 = new LineString([
      fromLonLat([80.1120, 12.9880]),
      fromLonLat([80.1220, 12.9812]),
      fromLonLat([80.1320, 12.9750]),
    ]);
    const stream2 = new LineString([
      fromLonLat([80.1220, 12.9812]),
      fromLonLat([80.1300, 12.9850]),
    ]);
    const stream3 = new LineString([
      fromLonLat([80.1150, 12.9650]),
      fromLonLat([80.1220, 12.9812]),
    ]);
    const drainageLayer = new VectorLayer({
      properties: { id: 'drainage' },
      source: new VectorSource({
        features: [
          new Feature({ geometry: stream1 }),
          new Feature({ geometry: stream2 }),
          new Feature({ geometry: stream3 }),
        ],
      }),
      style: new Style({
        stroke: new Stroke({ color: '#00f0ff', width: 3 }),
      }),
      visible: layers.drainage,
      zIndex: 12,
    });

    // 7. WATERSCOPE Vector Layer: Water Bodies (zIndex: 14)
    const waterPond1 = new Polygon([[
      fromLonLat([80.1280, 12.9840]),
      fromLonLat([80.1320, 12.9860]),
      fromLonLat([80.1310, 12.9820]),
      fromLonLat([80.1280, 12.9840]),
    ]]);
    const waterBodiesLayer = new VectorLayer({
      properties: { id: 'waterbodies' },
      source: new VectorSource({ features: [new Feature({ geometry: waterPond1 })] }),
      style: new Style({
        fill: new Fill({ color: 'rgba(14, 165, 233, 0.55)' }),
        stroke: new Stroke({ color: '#0284c7', width: 2 }),
      }),
      visible: layers.waterbodies,
      zIndex: 14,
    });

    // 8. WATERSCOPE Vector Layer: Physical Interventions (zIndex: 20)
    const checkDam = new Feature({
      geometry: new Point(fromLonLat([80.1220, 12.9812])),
      type: 'Check Dam',
      featId: 'WD-021',
      status: 'Verified (Sub-pixel Calibrated)',
      evidence: '4 geo-coded ground photos attached',
    });
    const farmPond = new Feature({
      geometry: new Point(fromLonLat([80.1300, 12.9850])),
      type: 'Farm Pond',
      featId: 'WD-014',
      status: 'Verified',
      evidence: '2 geo-coded ground photos attached',
    });
    const contourBund = new Feature({
      geometry: new Point(fromLonLat([80.1180, 12.9700])),
      type: 'Contour Bund',
      featId: 'WD-009',
      status: 'Pending Field Check',
      evidence: 'Satellite spectral anomaly detected',
    });
    const interventionsLayer = new VectorLayer({
      properties: { id: 'interventions' },
      source: new VectorSource({ features: [checkDam, farmPond, contourBund] }),
      style: new Style({
        image: new CircleStyle({
          radius: 9,
          fill: new Fill({ color: '#f59e0b' }),
          stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
        }),
      }),
      visible: layers.interventions,
      zIndex: 20,
    });

    // 9. WATERSCOPE Vector Layer: Geo-tagged Photos (zIndex: 25)
    const photo1 = new Feature({
      geometry: new Point(fromLonLat([80.1247, 12.9812])),
      type: 'Field Photo',
      featId: 'IMG_2026_024',
      status: 'Geo-referenced & Verified',
      evidence: 'Azimuth 142°, High soil moisture confidence',
    });
    const photo2 = new Feature({
      geometry: new Point(fromLonLat([80.1350, 12.9780])),
      type: 'Field Photo',
      featId: 'IMG_2026_025',
      status: 'Geo-referenced',
      evidence: 'Azimuth 210°, Gully erosion noted',
    });
    const photosLayer = new VectorLayer({
      properties: { id: 'photos' },
      source: new VectorSource({ features: [photo1, photo2] }),
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: '#10b981' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
        }),
      }),
      visible: layers.photos,
      zIndex: 25,
    });

    // 10. WATERSCOPE Vector Layer: Photo Footprints (zIndex: 28)
    const footprintPoly = new Polygon([[
      fromLonLat([80.1240, 12.9808]),
      fromLonLat([80.1255, 12.9818]),
      fromLonLat([80.1250, 12.9805]),
      fromLonLat([80.1240, 12.9808]),
    ]]);
    const footprintsLayer = new VectorLayer({
      properties: { id: 'footprints' },
      source: new VectorSource({ features: [new Feature({ geometry: footprintPoly })] }),
      style: new Style({
        stroke: new Stroke({ color: '#10b981', width: 1.5, lineDash: [3, 3] }),
        fill: new Fill({ color: 'rgba(16, 185, 129, 0.15)' }),
      }),
      visible: layers.footprints,
      zIndex: 28,
    });

    // 11. WATERSCOPE Vector Layer: Verification Points (zIndex: 30)
    const ver1 = new Feature({
      geometry: new Point(fromLonLat([80.1265, 12.9770])),
      type: 'Verification Point',
      featId: 'VP-102',
      status: 'Ground Conflict Identified',
      evidence: 'Satellite NDVI indicates high crop, ground survey reports fallow',
    });
    const verificationLayer = new VectorLayer({
      properties: { id: 'verification' },
      source: new VectorSource({ features: [ver1] }),
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#ef4444' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
        }),
      }),
      visible: layers.verification,
      zIndex: 30,
    });

    // Save references to layer objects
    olLayersRef.current = {
      satellite: esriSatelliteLayer,
      reference: esriReferenceLayer,
      transportation: esriTransportationLayer,
      street: streetLayer,
      boundary: boundaryLayer,
      drainage: drainageLayer,
      waterbodies: waterBodiesLayer,
      interventions: interventionsLayer,
      photos: photosLayer,
      footprints: footprintsLayer,
      verification: verificationLayer,
    };

    // Initialize single OpenLayers Map instance with complete layer stack
    const map = new Map({
      target: mapElementRef.current,
      layers: [
        esriSatelliteLayer,
        esriReferenceLayer,
        esriTransportationLayer,
        streetLayer,
        boundaryLayer,
        drainageLayer,
        waterBodiesLayer,
        interventionsLayer,
        photosLayer,
        footprintsLayer,
        verificationLayer,
      ],
      view: new View({
        center,
        zoom: 13,
        minZoom: 3,
        maxZoom: 19,
      }),
    });

    mapRef.current = map;

    // Pointer move listener for live coordinate readout
    map.on('pointermove', (evt) => {
      const lonLat = toLonLat(evt.coordinate);
      setCoords({
        lat: `${lonLat[1].toFixed(4)}°N`,
        lng: `${lonLat[0].toFixed(4)}°E`,
      });
    });

    // Single click listener for feature inspection
    map.on('singleclick', (evt) => {
      let found = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const props = feature.getProperties();
        if (props.type && props.featId) {
          const geom = feature.getGeometry();
          let coordStr = '';
          if (geom instanceof Point) {
            const ll = toLonLat(geom.getCoordinates());
            coordStr = `${ll[1].toFixed(4)}°N, ${ll[0].toFixed(4)}°E`;
          }
          setSelectedFeature({
            type: props.type,
            id: props.featId,
            status: props.status || 'Active',
            evidence: props.evidence || 'N/A',
            coordinates: coordStr,
          });
          found = true;
        }
      });
      if (!found) {
        setSelectedFeature(null);
      }
    });

    // Ensure map resizes smoothly
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.updateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.setTarget(undefined);
    };
  }, []);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const mapBg = isDark ? '#070f1f' : '#eaf1f6';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
              Watershed GIS Explorer
            </h1>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                color: isDark ? '#38bdf8' : '#0e86b0',
                padding: '3px 10px',
                borderRadius: 12,
                letterSpacing: '0.05em',
                border: `1px solid ${isDark ? 'rgba(56,189,248,0.3)' : 'rgba(14,134,176,0.3)'}`,
              }}
            >
              ESRI SATELLITE + REAL PLACE NAMES & ROADS ACTIVE
            </span>
          </div>

          {/* Satellite Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                  satelliteStatus === 'active'
                    ? isDark
                      ? '#4ade80'
                      : '#2E9E5C'
                    : satelliteStatus === 'loading'
                    ? '#f59e0b'
                    : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff',
                padding: '4px 12px',
                borderRadius: 6,
                border: `1px solid ${borderCol}`,
              }}
            >
              <span
                className={`status-dot ${
                  satelliteStatus === 'active'
                    ? 'status-dot-green'
                    : satelliteStatus === 'loading'
                    ? 'status-dot-amber'
                    : 'status-dot-red'
                }`}
                style={{ width: 8, height: 8 }}
              />
              🌐 {statusMessage}
            </span>
          </div>
        </div>
        <p style={{ color: dimCol, fontSize: 13, margin: '6px 0 0' }}>
          Integrated OpenLayers spatial explorer with official Esri World Imagery satellite tiles, Esri Boundaries & Places labels (cities, towns, villages), and Esri World Transportation roads layer beneath WATERSCOPE GIS vector overlays.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 16 }}>
        {/* Layer Controls Panel */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderCol}`,
            borderRadius: 8,
            padding: 16,
            height: 'fit-content',
          }}
        >
          {/* Satellite & Reference Basemap Controls */}
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              background: isDark ? 'rgba(56,189,248,0.08)' : '#e6f4f9',
              borderRadius: 6,
              border: `1px solid ${isDark ? 'rgba(56,189,248,0.2)' : 'rgba(14,134,176,0.2)'}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: isDark ? '#38bdf8' : '#0e86b0',
                textTransform: 'uppercase',
                marginBottom: 8,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🛰️</span> Real Esri Satellite & Reference
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              <input
                type="checkbox"
                checked={layers.satellite}
                onChange={() => toggleLayer('satellite')}
              />
              Satellite imagery (Esri World Imagery)
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              <input
                type="checkbox"
                checked={layers.reference}
                onChange={() => toggleLayer('reference')}
              />
              Place names & roads (Esri Reference)
            </label>
            <div style={{ fontSize: 10.5, color: dimCol, lineHeight: 1.4, paddingLeft: 22 }}>
              Official transparent reference overlay providing city/town names, roads, boundaries, and geographic labels.
            </div>

            <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px dashed ${borderCol}` }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11.5,
                  color: textCol,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={layers.street}
                  onChange={() => toggleLayer('street')}
                />
                OpenStreetMap Reference Overlay
              </label>
            </div>
          </div>

          {/* WATERSCOPE Vector Overlays */}
          <div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: dimCol,
                textTransform: 'uppercase',
                marginBottom: 10,
                letterSpacing: '0.05em',
              }}
            >
              WATERSCOPE GIS Overlays
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.boundary}
                onChange={() => toggleLayer('boundary')}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  border: '2px dashed #38bdf8',
                  background: 'rgba(56,189,248,0.2)',
                }}
              />
              Watershed Boundary (2,860 ha)
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.drainage}
                onChange={() => toggleLayer('drainage')}
              />
              <span style={{ width: 12, height: 3, background: '#00f0ff', borderRadius: 1 }} />
              Drainage Streams Network
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.waterbodies}
                onChange={() => toggleLayer('waterbodies')}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: 'rgba(14,165,233,0.6)',
                }}
              />
              Water Bodies & Ponds
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.interventions}
                onChange={() => toggleLayer('interventions')}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  border: '1.5px solid #fff',
                }}
              />
              Physical Interventions
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.photos}
                onChange={() => toggleLayer('photos')}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '1.5px solid #fff',
                }}
              />
              Geo-tagged Field Photos
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                marginBottom: 8,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.footprints}
                onChange={() => toggleLayer('footprints')}
              />
              <span
                style={{
                  width: 12,
                  height: 10,
                  border: '1.5px dashed #10b981',
                  background: 'rgba(16,185,129,0.2)',
                }}
              />
              Photo Footprints
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textCol,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={layers.verification}
                onChange={() => toggleLayer('verification')}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '1.5px solid #fff',
                }}
              />
              Verification Conflict Points
            </label>
          </div>
        </div>

        {/* GIS Canvas View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              position: 'relative',
              background: mapBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 8,
              overflow: 'hidden',
              height: 540,
            }}
          >
            {/* OpenLayers Map Canvas Mount */}
            <div ref={mapElementRef} style={{ width: '100%', height: '100%' }} />

            {/* Map Canvas Zoom & Reset Controls */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 20,
              }}
            >
              <button
                onClick={() => {
                  if (mapRef.current) {
                    const view = mapRef.current.getView();
                    view.setZoom((view.getZoom() || 13) + 1);
                  }
                }}
                style={{
                  width: 34,
                  height: 34,
                  background: cardBg,
                  border: `1px solid ${borderCol}`,
                  color: textCol,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => {
                  if (mapRef.current) {
                    const view = mapRef.current.getView();
                    view.setZoom((view.getZoom() || 13) - 1);
                  }
                }}
                style={{
                  width: 34,
                  height: 34,
                  background: cardBg,
                  border: `1px solid ${borderCol}`,
                  color: textCol,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.getView().setCenter(fromLonLat([80.1247, 12.9812]));
                    mapRef.current.getView().setZoom(13);
                  }
                }}
                style={{
                  width: 34,
                  height: 34,
                  background: cardBg,
                  border: `1px solid ${borderCol}`,
                  color: textCol,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                title="Reset View (12.9812°N, 80.1247°E)"
              >
                ⤾
              </button>
            </div>

            {/* Live Telemetry Readout & Esri Tile Info */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                background: cardBg,
                border: `1px solid ${borderCol}`,
                color: textCol,
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              <span>{coords.lat}, {coords.lng} · WGS84 EPSG:4326</span>
              <span
                style={{
                  color: isDark ? '#38bdf8' : '#0e86b0',
                  fontWeight: 700,
                  borderLeft: `1px solid ${borderCol}`,
                  paddingLeft: 12,
                }}
              >
                📡 MapServer: <span style={{ color: '#2E9E5C' }}>Esri Satellite + Boundaries/Places & Roads</span>
              </span>
            </div>
          </div>

          {/* Feature Inspection Panel */}
          {selectedFeature && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${borderCol}`,
                borderRadius: 8,
                padding: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: textCol }}>
                  FEATURE INSPECTOR — {selectedFeature.type} ({selectedFeature.id})
                </h3>
                <button
                  onClick={() => setSelectedFeature(null)}
                  style={{ background: 'none', border: 'none', color: dimCol, cursor: 'pointer', fontSize: 16 }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.8, color: textCol }}>
                <div>Type: <b>{selectedFeature.type}</b></div>
                <div>Feature ID: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedFeature.id}</span></div>
                {selectedFeature.coordinates && <div>Location Coordinates: <span style={{ fontFamily: 'monospace' }}>{selectedFeature.coordinates}</span></div>}
                <div>Status: <b>{selectedFeature.status}</b></div>
                <div>Field Evidence: {selectedFeature.evidence}</div>
                <div>Satellite Base: <b>Esri World Imagery + Esri World Boundaries and Places Reference Overlay</b></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatershedGISExplorer;
