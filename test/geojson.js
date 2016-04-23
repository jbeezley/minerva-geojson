import merge from '../src/geojson/merge';

describe('geojson utilities', function () {
    describe('mergeProperty', function () {
        it('string type', function () {
            var accum = merge('value1');

            accum = merge('value2', accum);
            accum = merge('value1', accum);

            expect(accum.values.value1).toBe(2);
            expect(accum.values.value2).toBe(1);
        });
    });
});
