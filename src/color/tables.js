import colorbrewer from 'colorbrewer';
import _ from 'lodash';
import d3 from 'd3';

import preview from './preview';

function Table(name, defs) {
    this._preview = [];
    this.defs = defs;
}

Table.prototype = {
    /**
     * Get a d3 scale range with the given number of components.
     */
    get: function (n) {
        if (!(n > 1)) {
            throw new Error('Invalid number of components');
        }

        // If there is a definition for `n`, return that.
        if (_.has(this.defs, n)) {
            return this.defs[n];
        }

        // If n is two, use the first and last components of the
        // 3 component scale.
        if (n === 2 && _.has(this.defs, 3)) {
            return [this.defs[3][0], this.defs[3][2]];
        }

        // find the smallest key > the requested value and slice the output
        let counts = _.keys(this.defs).map(Number).sort();
        let nearest = _.find(counts, (key) => n < key);
        if (nearest !== undefined) {
            return _.take(this.defs[nearest], n);
        }

        // otherwise just return the largest
        return this.defs[_.last(counts)];
    },

    /**
     * Return a d3 scale with the given number of components.
     * If no count provided, it will return a continuous scale.
     */
    scale: function (ncats) {
        var table, scale;
        if (!(ncats > 1)) {
            table = this.get(Number.POSITIVE_INFINITY);
            scale = d3.scale.linear();
        } else {
            table = this.get(ncats);
            scale = d3.scale.ordinal();
        }
        return scale.domain(_.range(table.length))
            .range(table);
    },

    /**
     * Generate a preview image of the color table.
     * @param {number} [ncats] The number of categories (undefined for continuous)
     */
    preview: function (ncats) {
        ncats = ncats || 0;
        if (!_.has(this._preview, ncats)) {
            this._preview[ncats] = preview(
                this.scale(ncats),
                ncats <= 1
            );
        }
        return this._preview[ncats];
    }
};

// Create tables for each element in `colorbrewer`.
var tables = {Table};
_.each(colorbrewer, (table, name) => {
    tables[name] = new Table(name, table);
});

export default tables;
