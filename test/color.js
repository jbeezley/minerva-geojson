import d3 from 'd3';
import resemble from 'resemblejs';
import colorbrewer from 'colorbrewer';

import preview from '../src/color/preview';
import tables from '../src/color/tables';
import {Table} from '../src/color/tables';

describe('color', function () {
    describe('preview', function () {
        it('numeric', function (done) {
            var scl = d3.scale.linear()
                .domain([0, 0.5, 1])
                .range(['steelblue', 'white', 'firebrick']);

            var img = preview(scl, true);

            resemble(img.src).onComplete(function (data) {
                expect(data).toEqual({
                    red: 74,
                    green: 65,
                    blue: 70,
                    brightness: 68
                });
                done();
            });
        });

        it('categories', function (done) {
            var scl = d3.scale.ordinal()
                .domain(['a', 'b', 'c'])
                .range(['steelblue', 'white', 'firebrick']);

            var img = preview(scl);

            resemble(img.src).onComplete(function (data) {
                expect(data).toEqual({
                    red: 65,
                    green: 54,
                    blue: 60,
                    brightness: 58
                });
                done();
            });
        });
    });

    describe('tables', function () {
        it('Reds', function () {
            var reds = tables.Reds;
            expect(reds).toBeDefined();
            expect(reds.get(3)).toEqual(colorbrewer.Reds[3]);
        });
        it('Table', function () {
            var t = new Table('custom', {
                3: ['#ffffff', '#777777', '#000000']
            });
            expect(t.get(2)).toEqual(['#ffffff', '#000000']);
            expect(t.get(3)).toEqual(t.get(4));

            t = new Table('custom35', {
                3: ['#ffffff', '#777777', '#000000'],
                5: ['#ffffff', '#aaaaaa', '#777777', '#444444', '#000000']
            });
            expect(t.get(4)).toEqual([
                '#ffffff', '#aaaaaa', '#777777', '#444444'
            ]);
        });
        it('invalid number of components', function () {
            expect(function () {
                tables.Reds.get(1);
            }).toThrow();
            expect(function () {
                tables.Reds.get(null);
            }).toThrow();
        });
        describe('preview', function () {
            it('caching', function () {
                var p0 = tables.Reds.preview();
                var p2 = tables.Reds.preview(2);
                expect(tables.Reds.preview(0)).toBe(p0);
                expect(tables.Reds.preview(2)).toBe(p2);
            });
            it('continuous', function () {
                var img = tables.Reds.preview();
                resemble(img.src).onComplete(function (data) {
                    expect(data).toEqual({
                        red: 87,
                        green: 43,
                        blue: 38,
                        brightness: 56
                    });
                });
            });
            it('5 categories', function () {
                var img = tables.Reds.preview(5);
                resemble(img.src).onComplete(function (data) {
                    expect(data).toEqual({
                        red: 89,
                        green: 44,
                        blue: 38,
                        brightness: 57
                    });
                });
            });
        });
    });
});
