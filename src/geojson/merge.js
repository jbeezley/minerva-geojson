/**
 * Merge a new value into an accumulation object.
 * The result depends on the value type:
 *
 * 1. string: stores a values object that maps
 *            the values encountered to the total
 *            number of occurences.
 *
 * 2. number: stores the minimum and maximum values
 *            encountered
 */
function merge(value, accumulated) {
    accumulated = accumulated || {count: 0};
    accumulated.count += 1;
    switch (typeof value) {
        case 'string':
            accumulated.values = accumulated.values || {};
            accumulated.values[value] = (accumulated.values[value] || 0) + 1;
            break;

        case 'number':
            if (isFinite(value)) {
                accumulated.nFinite = (accumulated.nFinite || 0) + 1;
                accumulated.min = Math.min(
                    accumulated.min !== undefined ? accumulated.min : Number.POSITIVE_INFINITY,
                    value
                );
                accumulated.max = Math.max(
                    accumulated.max !== undefined ? accumulated.max : Number.NEGATIVE_INFINITY,
                    value
                );
                accumulated.sum = (accumulated.sum || 0) + value;
                accumulated.sumsq = (accumulated.sumsq || 0) + value * value;
            }
            break;
    }
    return accumulated;
}

export default merge;
