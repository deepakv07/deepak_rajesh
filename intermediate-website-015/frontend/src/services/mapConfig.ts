import TileLayer from 'ol/layer/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import XYZ from 'ol/source/XYZ';

/**
 * Official Esri World Imagery ArcGIS REST MapServer Service Endpoint
 */
export const ESRI_WORLD_IMAGERY_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';

export const ESRI_WORLD_IMAGERY_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

/**
 * Official Esri World Boundaries & Places Reference Layer Service Endpoint
 * Transparent overlay containing city/town/village names, administrative boundaries, and geographic labels.
 */
export const ESRI_BOUNDARIES_PLACES_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer';

export const ESRI_BOUNDARIES_PLACES_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

/**
 * Official Esri World Transportation Reference Layer Service Endpoint
 * Transparent overlay containing roads, highways, and transit lines.
 */
export const ESRI_TRANSPORTATION_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer';

export const ESRI_TRANSPORTATION_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';

export const ESRI_ATTRIBUTION =
  'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

/**
 * Creates an OpenLayers TileLayer for Esri World Imagery Satellite (Bottom layer, zIndex = 0)
 */
export function createEsriSatelliteLayer(
  visible = true,
  zIndex = 0
): TileLayer<TileArcGISRest | XYZ> {
  const source = new XYZ({
    url: ESRI_WORLD_IMAGERY_TILE_URL,
    attributions: ESRI_ATTRIBUTION,
    crossOrigin: 'anonymous',
    maxZoom: 19,
  });

  return new TileLayer({
    properties: { id: 'satellite', name: 'Esri World Imagery' },
    source,
    visible,
    zIndex,
  });
}

/**
 * Creates an OpenLayers TileLayer for Esri World Boundaries and Places (Reference Overlay layer, zIndex = 1)
 * Transparent background layer that overlays city names, village labels, district names, and place names on satellite tiles.
 */
export function createEsriReferenceLayer(
  visible = true,
  zIndex = 1
): TileLayer<TileArcGISRest | XYZ> {
  const source = new XYZ({
    url: ESRI_BOUNDARIES_PLACES_TILE_URL,
    attributions: 'Labels © Esri',
    crossOrigin: 'anonymous',
    maxZoom: 19,
  });

  return new TileLayer({
    properties: { id: 'reference', name: 'Esri Boundaries & Places' },
    source,
    visible,
    zIndex,
  });
}

/**
 * Creates an OpenLayers TileLayer for Esri World Transportation (Roads & Transit layer, zIndex = 2)
 * Transparent background layer that overlays major roads and transportation networks on satellite tiles.
 */
export function createEsriTransportationLayer(
  visible = true,
  zIndex = 2
): TileLayer<TileArcGISRest | XYZ> {
  const source = new XYZ({
    url: ESRI_TRANSPORTATION_TILE_URL,
    attributions: 'Roads © Esri',
    crossOrigin: 'anonymous',
    maxZoom: 19,
  });

  return new TileLayer({
    properties: { id: 'transportation', name: 'Esri World Transportation' },
    source,
    visible,
    zIndex,
  });
}
