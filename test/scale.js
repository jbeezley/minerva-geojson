import Scale from '../src/models/scale';

describe('Scale', function () {
    describe('quantitative', function () {
        it('initialize', function () {
            var linear = new Scale({
                type: 'linear',
                domain: [0, 10],
                range: [0, 1]
            });

            expect(linear.get('type')).toBe('linear');
            expect(linear.get('domain')).toEqual([0, 10]);
            expect(linear.get('range')).toEqual([0, 1]);
        });

        it('scale', function () {
            var linear = new Scale({
                type: 'linear',
                domain: [0, 10],
                range: [0, 1]
            });

            expect(linear.scale(0)).toBe(0);
            expect(linear.scale(10)).toBe(1);
            expect(linear.scale(5)).toBe(0.5);
        });

        it('values', function () {
            var linear = new Scale({
                type: 'linear',
                domain: [0, 10],
                range: [0, 1]
            });
            expect(linear.values()).toEqual({
                0: 0,
                10: 1
            });
        });

        it('insert', function () {
            var linear = new Scale({
                type: 'linear',
                domain: [0, 10],
                range: [0, 1]
            });
            var spy = sinon.spy();

            linear.on('change', spy);
            linear.insert(5, 0.5);
            expect(linear.get('domain')).toEqual([0, 5, 10]);
            expect(linear.get('range')).toEqual([0, 0.5, 1]);
            expect(spy.callCount).toBe(1);

            linear.insert(5, 0.25);
            expect(linear.get('domain')).toEqual([0, 5, 10]);
            expect(linear.get('range')).toEqual([0, 0.25, 1]);
            expect(spy.callCount).toBe(2);

            linear.insert(5, 0.25);
            expect(linear.get('domain')).toEqual([0, 5, 10]);
            expect(linear.get('range')).toEqual([0, 0.25, 1]);
            expect(spy.callCount).toBe(2);
        });

        it('remove', function () {
            var linear = new Scale({
                type: 'linear',
                domain: [0, 5, 10],
                range: [0, 0.5, 1]
            });
            var spy = sinon.spy();

            expect(linear.get('domain')).toEqual([0, 5, 10]);
            expect(linear.get('range')).toEqual([0, 0.5, 1]);

            linear.on('change', spy);
            linear.remove(5);
            expect(linear.get('domain')).toEqual([0, 10]);
            expect(linear.get('range')).toEqual([0, 1]);
            expect(spy.callCount).toBe(1);

            linear.remove(5);
            expect(linear.get('domain')).toEqual([0, 10]);
            expect(linear.get('range')).toEqual([0, 1]);
            expect(spy.callCount).toBe(1);
        });
    });

    describe('ordinal', function () {
        it('initialize', function () {
            var ordinal = new Scale({
                type: 'ordinal',
                domain: ['cat', 'dog'],
                range: ['red', 'blue']
            });

            expect(ordinal.get('type')).toBe('ordinal');
            expect(ordinal.get('domain')).toEqual(['cat', 'dog']);
            expect(ordinal.get('range')).toEqual(['red', 'blue']);
        });

        it('scale', function () {
            var ordinal = new Scale({
                type: 'ordinal',
                domain: ['cat', 'dog'],
                range: ['red', 'blue']
            });

            expect(ordinal.scale('cat')).toBe('red');
            expect(ordinal.scale('dog')).toBe('blue');
        });

        it('values', function () {
            var ordinal = new Scale({
                type: 'ordinal',
                domain: ['cat', 'dog'],
                range: ['red', 'blue']
            });

            expect(ordinal.values()).toEqual({
                cat: 'red',
                dog: 'blue'
            });
        });

        it('insert', function () {
            var ordinal = new Scale({
                type: 'ordinal',
                domain: ['cat', 'dog'],
                range: ['red', 'blue']
            });
            var spy = sinon.spy();

            ordinal.on('change', spy);

            ordinal.insert('bird', 'green');
            expect(ordinal.get('domain')).toEqual(['bird', 'cat', 'dog']);
            expect(ordinal.get('range')).toEqual(['green', 'red', 'blue']);
            expect(spy.callCount).toBe(1);

            ordinal.insert('bird', 'yellow');
            expect(ordinal.get('domain')).toEqual(['bird', 'cat', 'dog']);
            expect(ordinal.get('range')).toEqual(['yellow', 'red', 'blue']);
            expect(spy.callCount).toBe(2);

            ordinal.insert('bird', 'yellow');
            expect(ordinal.get('domain')).toEqual(['bird', 'cat', 'dog']);
            expect(ordinal.get('range')).toEqual(['yellow', 'red', 'blue']);
            expect(spy.callCount).toBe(2);
        });

        it('remove', function () {
            var ordinal = new Scale({
                type: 'ordinal',
                domain: ['cat', 'dog'],
                range: ['red', 'blue']
            });
            var spy = sinon.spy();

            ordinal.on('change', spy);

            ordinal.remove('cat');
            expect(ordinal.get('domain')).toEqual(['dog']);
            expect(ordinal.get('range')).toEqual(['blue']);
            expect(spy.callCount).toBe(1);

            ordinal.remove('cat');
            expect(ordinal.get('domain')).toEqual(['dog']);
            expect(ordinal.get('range')).toEqual(['blue']);
            expect(spy.callCount).toBe(1);

            ordinal.remove('dog');
            expect(ordinal.get('domain')).toEqual([]);
            expect(ordinal.get('range')).toEqual([]);
            expect(spy.callCount).toBe(2);
        });
    });
});
