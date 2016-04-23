import merge from './merge';

/**
 * Accumulate property values into a summary object.  The
 * output object will have keys encountered in the feature
 * array mapped to an object that summarizes the values
 * encountered.
 *
 * @param {object[]} features An array of "property" objects
 * @returns {object}
 */
function accumulate(features) {
    var feature, i, accumulated = {}, key;

    for (i = 0; i < features.length; i += 1) {
        feature = features[i];
        for (key in feature) {
            if (feature.hasOwnProperty(key)) {
                accumulated[key] = merge(feature[key], accumulated[key]);
            }
        }
    }

    return accumulated;
}

export default accumulate;
