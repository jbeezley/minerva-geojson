import d3 from 'd3';
import preview from '../src/color/preview';
import resemble from 'resemblejs';

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
});
