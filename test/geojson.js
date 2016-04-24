import merge from '../src/geojson/merge';
import accumulate from '../src/geojson/accumulate';
import normalize from '../src/geojson/normalize';

describe('geojson', function () {
    describe('merge', function () {
        it('string type', function () {
            var accum = merge('value1');

            accum = merge('value2', accum);
            accum = merge('value1', accum);

            expect(accum.values.value1).toBe(2);
            expect(accum.values.value2).toBe(1);
        });

        it('number type', function () {
            var accum = merge(10);
            accum = merge(11, accum);
            accum = merge(-10, accum);
            accum = merge(undefined, accum);
            accum = merge(Number.POSITIVE_INFINITY, accum);
            accum = merge(NaN, accum);

            expect(accum).toEqual({
                count: 6,
                nFinite: 3,
                min: -10,
                max: 11,
                sum: 11,
                sumsq: 321
            });
        });
    });

    it('accumulate', function () {
        var accum = accumulate([
            {
                a: 4,
                b: 'red',
                c: 'bird'
            },
            {
                a: 0,
                b: 'blue',
                c: 'bird'
            },
            {
                a: 10,
                b: 'green',
                c: 'cat'
            },
            {
            }
        ]);

        expect(accum).toEqual({
            a: {
                count: 3,
                nFinite: 3,
                min: 0,
                max: 10,
                sum: 14,
                sumsq: 116
            },
            b: {
                count: 3,
                values: {
                    red: 1,
                    green: 1,
                    blue: 1
                }
            },
            c: {
                count: 3,
                values: {
                    bird: 2,
                    cat: 1
                }
            }
        });
    });

    describe('normalize', function () {
        it('FeatureCollection', function () {
            var spec = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [0, 0]
                        },
                        properties: {
                            a: 1,
                            b: 'red'
                        }
                    }, {
                        type: 'Feature',
                        geometry: {
                            type: 'MultiPoint',
                            coordinates: [[1, 1], [2, 2]]
                        },
                        properties: {
                            a: -1,
                            b: 'red'
                        }
                    }, {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [3, 3]
                        },
                        properties: {
                            c: 0
                        }
                    }
                ]
            };
            var normalized = normalize(spec);

            expect(normalized).toBe(spec);

            var summary = normalized.summary;

            expect(summary.a.count).toBe(2);
            expect(summary.a.nFinite).toBe(2);
            expect(summary.a.min).toBe(-1);
            expect(summary.a.max).toBe(1);

            expect(summary.b.values).toEqual({
                'red': 2
            });

            expect(summary.c.count).toBe(1);
        });

        it('Feature', function () {
            var spec = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [0, 0]
                },
                properties: {a: 'red'}
            };

            expect(normalize(spec)).toEqual({
                type: 'FeatureCollection',
                features: [spec],
                summary: {
                    a: {
                        count: 1,
                        values: {red: 1}
                    }
                }
            });
        });

        it('GeometryCollection', function () {
            var spec = {
                type: 'GeometryCollection',
                geometries: [
                    {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                ]
            };

            expect(normalize(spec)).toEqual({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: spec.geometries[0],
                    properties: {}
                }],
                summary: {}
            });
        });

        it('Point', function () {
            var spec = {
                type: 'Point',
                coordinates: [0, 0]
            };

            expect(normalize(spec)).toEqual({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: spec,
                    properties: {}
                }],
                summary: {}
            });
        });

        it('Invalid', function () {
            expect(function () {
                normalize({});
            }).toThrow();
        });
    });
});
