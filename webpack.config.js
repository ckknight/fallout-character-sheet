// disabling eslint. configuration is not es6-y
/*eslint-disable */
var DEBUG = !!process.env.DEBUG;
var path = require('path');
var webpack = require('webpack');

var validJsFolders = [
    path.resolve(__dirname, 'src')];

module.exports = {
    entry: './src/app',
    output: {
        path: './dist',
        filename: 'app.js',
        libraryTarget: 'umd',
    },
    devtool: 'source-map',

    cache: DEBUG,
    debug: DEBUG,

    stats: {
        colors: true,
        reasons: DEBUG,
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ],

    resolve: {
        extensions: ['', '.js', '.json'],
        modulesDirectories: [
            'node_modules',
        ],
    },

    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                include: validJsFolders,
                loader: 'eslint-loader',
            },
        ],

        loaders: [
            {
                test: /\.jsx?$/,
                include: validJsFolders,
                loader: 'babel-loader',
                query: {
                    optional: [
                        'runtime',
                        'es7.classProperties',
                        'es7.asyncFunctions',
                        'es7.objectRestSpread',
                        'es7.trailingFunctionCommas',
                    ],
                },
            },

            {
                test: /\.json$/,
                include: validJsFolders,
                loader: 'json-loader',
            },
        ],
    },
};
/*eslint-enable */
