import d3 from 'd3';
import _ from 'lodash';

/**
 * Generate a canvas preview of a color map.  Continuous color maps must
 * have a numeric domain.
 *
 * @param {function} scale A d3.scale function
 * @param {boolean} [continuous=false] Generate a continuous colormap
 * @param {object} [size] The size in pixels of the canvas
 * @param {number} [size.width=100]
 * @param {number} [size.heigh=20]
 * @return {Image} An image element
 */
function preview(scale, continuous, size) {
    var domain, trans, canvas, ctx, img;

    domain = scale.domain();
    size = size || {};
    size.width = size.width || 100;
    size.height = size.height || 20;

    if (continuous) {
        trans = d3.scale.linear()
            .domain([0, size.width - 1])
            .range(d3.extent(domain));
    } else {
        trans = d3.scale.quantize()
            .domain([0, size.width - 1])
            .range(domain);
    }
    trans = _.flow(trans, scale);

    canvas = d3.select(document.createElement('canvas'))
        .attr('width', size.width)
        .attr('height', size.height)
        .node();

    ctx = canvas.getContext('2d');
    img = ctx.createImageData(size.width, size.height);

    for (let i = 0; i < size.width; i += 1) {
        const rgb = d3.rgb(trans(i));
        for (let j = 0; j < size.height; j += 1) {
            const k = (j * size.width + i) * 4;
            img.data[k] = rgb.r;
            img.data[k + 1] = rgb.g;
            img.data[k + 2] = rgb.b;
            img.data[k + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);

    img = document.createElement('img');
    img.src = canvas.toDataURL();
    return img;
}

export default preview;
