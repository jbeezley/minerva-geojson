module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(bower_components|node_modules)/,
            loader: 'babel'
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
        backbone: 'Backbone'
    }
};
