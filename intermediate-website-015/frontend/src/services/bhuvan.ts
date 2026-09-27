/**
 * ISRO / NRSC Bhuvan Spatial Services Integration Module
 * WATERSCOPE SIH26015 Portal
 */

import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import { transformExtent } from 'ol/proj';

// Official Bhuvan Access Credential
export const BHUVAN_ACCESS_TOKEN =
  (import.meta.env.VITE_BHUVAN_API_KEY as string) ||
  '769fa6ec5b5f0cd86c5011e4bdef25ca4175f9c5';

export const BHUVAN_ENDPOINTS = {
  PROXY_TILE: '/api/bhuvan-tile/bhuvan/gwc/service/wmts',
  PROXY_WMS: '/api/bhuvan-wms/bhuvan/wms',
  DIRECT_TILE: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wmts',
  DIRECT_WMS: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms',
};

export interface BhuvanLayerMeta {
  id: string;
  name: string;
  category: 'satellite' | 'lulc' | 'water' | 'soil';
  description: string;
  wmsLayerName: string;
  attribution: string;
}

export const BHUVAN_LAYERS_CONFIG: BhuvanLayerMeta[] = [
  {
    id: 'bhuvan_sat',
    name: 'ISRO Bhuvan Physical Satellite Map',
    category: 'satellite',
    description: 'ISRO NRSC Bhuvan LISS-III physical satellite basemap with state/district boundaries',
    wmsLayerName: 'india3',
    attribution: '© ISRO / NRSC Bhuvan Physical Satellite Imagery',
  },
  {
    id: 'bhuvan_india',
    name: 'ISRO Bhuvan National Satellite Overview',
    category: 'satellite',
    description: 'National ISRO Bhuvan satellite mosaic basemap with all state boundaries',
    wmsLayerName: 'india_overview',
    attribution: '© ISRO / NRSC Bhuvan National Basemap',
  },
  {
    id: 'bhuvan_lulc',
    name: 'ISRO Bhuvan LULC WMS',
    category: 'lulc',
    description: 'National Land Use / Land Cover classification WMS',
    wmsLayerName: 'lulc:GANGA_LULC',
    attribution: '© ISRO / NRSC Land Use Mapping Group',
  },
  {
    id: 'bhuvan_water',
    name: 'ISRO Bhuvan Water Dynamics WMS',
    category: 'water',
    description: 'Surface water bodies & hydrology drainage WMS',
    wmsLayerName: 'disaster:AP_DIS_BRIDGES',
    attribution: '© ISRO / NRSC Water Resources Group',
  },
  {
    id: 'bhuvan_soil',
    name: 'ISRO Bhuvan Soil Geomorphology WMS',
    category: 'soil',
    description: 'National geomorphology & soil erosion classification WMS',
    wmsLayerName: 'geomorphology:GANGA_GEOM',
    attribution: '© ISRO / NRSC Geosciences Group',
  },
];

/**
 * Creates an OpenLayers ImageLayer for ISRO Bhuvan Physical Satellite Basemap (South India / Tamil Nadu context)
 */
export function createBhuvanPhysicalSatelliteLayer(opacity = 0.95): ImageLayer<Static> {
  const southIndiaExtent = transformExtent([72.0, 8.0, 81.5, 17.5], 'EPSG:4326', 'EPSG:3857');

  return new ImageLayer({
    properties: { id: 'bhuvan_sat', name: 'ISRO Bhuvan Physical Satellite Map' },
    source: new Static({
      url: '/bhuvan_physical_map.jpg',
      imageExtent: southIndiaExtent,
      attributions: '© ISRO / NRSC Bhuvan Physical Satellite Imagery (LISS-III)',
    }),
    opacity,
    visible: true,
  });
}

/**
 * Creates an OpenLayers ImageLayer for ISRO Bhuvan National Overview Basemap (All India context)
 */
export function createBhuvanIndiaOverviewLayer(opacity = 0.95): ImageLayer<Static> {
  const indiaExtent = transformExtent([68.0, 6.0, 97.5, 37.5], 'EPSG:4326', 'EPSG:3857');

  return new ImageLayer({
    properties: { id: 'bhuvan_india', name: 'ISRO Bhuvan National Satellite Overview' },
    source: new Static({
      url: '/bhuvan_india_satellite.jpg',
      imageExtent: indiaExtent,
      attributions: '© ISRO / NRSC Bhuvan National Satellite Overview',
    }),
    opacity,
    visible: false,
  });
}

/**
 * Creates an OpenLayers TileLayer for Bhuvan satellite tiles (WMTS)
 */
export function createBhuvanSatelliteLayer(opacity = 0.95): TileLayer<XYZ> {
  const tileUrl = `${BHUVAN_ENDPOINTS.PROXY_TILE}?service=WMTS&request=GetTile&version=1.0.0&layer=india3&style=default&tilematrixset=EPSG:900913&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}&token=${BHUVAN_ACCESS_TOKEN}`;

  return new TileLayer({
    properties: { id: 'bhuvan_tile', name: 'ISRO Bhuvan Satellite WMTS' },
    source: new XYZ({
      url: tileUrl,
      attributions: '© ISRO / NRSC Bhuvan',
      crossOrigin: 'anonymous',
      minZoom: 3,
      maxZoom: 17,
    }),
    opacity,
    visible: false,
  });
}

/**
 * Creates an OpenLayers TileWMS layer for Bhuvan thematic services
 */
export function createBhuvanWMSLayer(
  layerMeta: BhuvanLayerMeta,
  opacity = 0.75,
  visible = false
): TileLayer<TileWMS> {
  return new TileLayer({
    properties: { id: layerMeta.id, name: layerMeta.name },
    source: new TileWMS({
      url: BHUVAN_ENDPOINTS.PROXY_WMS,
      params: {
        LAYERS: layerMeta.wmsLayerName,
        TILED: true,
        VERSION: '1.1.1',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        token: BHUVAN_ACCESS_TOKEN,
      },
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    }),
    opacity,
    visible,
  });
}
