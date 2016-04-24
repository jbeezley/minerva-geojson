import accumulate from './accumulate';

/**
 * Normalize a geojson object turning geometries into features and
 * returning a feature collection.  The returned feature collection
 * is processed to provide a summary object containing accumulated
 * property statistics that can be used to generate numeric/color
 * scales for visualization.
 */
function normalize(geojson) {
    var normalized;

    switch (geojson.type) {
        case 'FeatureCollection':
            normalized = geojson;
            break;

        case 'Feature':
            normalized = {
                type: 'FeatureCollection',
                features: [geojson]
            };
            break;

        case 'GeometryCollection':
            normalized = {
                type: 'FeatureCollection',
                features: geojson.geometries.map(function (g) {
                    return {
                        type: 'Feature',
                        geometry: g,
                        properties: {}
                    };
                })
            };
            break;

        case 'Point':
        case 'LineString':
        case 'Polygon':
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
            normalized = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: geojson,
                    properties: {}
                }]
            };
            break;

        default:
            throw new Error('Invalid json type');
    }

    // generate property summary
    normalized.summary = accumulate(normalized.features.map((f) => f.properties));

    return normalized;
}

export default normalize;
