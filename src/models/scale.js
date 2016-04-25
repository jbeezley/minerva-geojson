import Backbone from 'backbone';
import d3 from 'd3';
import _ from 'lodash';

var Scale = Backbone.Model.extend({
    defaults: {
        type: 'linear',        // d3.scale type
        domain: [],            // d3.scale domain
        range: []              // d3.scale range
    },

    initialize: function () {
        this._reset();
        this.listenTo(this, 'change', this._reset);
    },

    /**
     * Regenerate the cached scale object.
     */
    _reset: function () {
        this._scale = d3.scale[this.get('type')]()
            .domain(this.get('domain'))
            .range(this.get('range'));
    },

    /**
     * Evaluate the scale on the given value.
     */
    scale: function (value) {
        return this._scale(value);
    },

    /**
     * Get a key -> value mapping of the scale domain.
     */
    values: function () {
        return _.fromPairs(_.zip(this.get('domain'), this.get('range')));
    },

    /**
     * Add a key -> value pair to the scale's domain and range while
     * maintaining a sorted domain array.
     */
    insert: function (key, value) {
        var domain = this.get('domain'),
            range = this.get('range'),
            index = _.sortedIndex(domain, key);

        if (domain[index] === key && range[index] !== value) {
            range[index] = value;
            this.trigger('change', this);
        } else if (domain[index] !== key) {
            domain.splice(index, 0, key);
            range.splice(index, 0, value);
            this.trigger('change', this);
        }
        return this;
    },

    /**
     * Remove a key -> value pair from the scale's domain and range.
     */
    remove: function (key) {
        var domain = this.get('domain'),
            range = this.get('range'),
            index = _.sortedIndexOf(domain, key);

        if (index >= 0) {
            domain.splice(index, 1);
            range.splice(index, 1);
            this.trigger('change', this);
        }
        return this;
    }
});

export default Scale;
