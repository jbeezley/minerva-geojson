module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(bower_components|node_modules)/,
            loader: 'babel',
            query: {cacheDirectory: true}
        }, {
            test: /\.jade$/,
            loader: 'jade'
        }]
    },
    output: {
        libraryTarget: 'umd',
        library: 'minerva-geojson'
    },
    resolve: {
        extensions: [
            '',
            '.js'
        ]
    },
    externals: {
        jquery: '$',
        d3: 'd3',
        backbone: 'Backbone',
        colorbrewer: 'colorbrewer'
    }
};
