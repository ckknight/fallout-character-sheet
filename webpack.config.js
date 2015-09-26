// disabling eslint. configuration is not es6-y
/*eslint-disable */
var DEBUG = !!process.env.DEBUG;
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var validJsFolders = [
    path.resolve(__dirname, 'src')];

module.exports = {
    entry: './src/app',
    output: {
        path: './dist',
        publicPath: DEBUG ? '/dist/' : './',
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
        new ExtractTextPlugin("styles.css", {
            disable: DEBUG
        })
    ].concat(DEBUG ? [] : [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin()
    ]),

    resolve: {
        extensions: ['', '.js', '.json', '.css'],
        modulesDirectories: [
            'node_modules',
        ],
        alias: {
            '~': path.resolve(__dirname, 'node_modules'),
        },
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
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss'),
            },

            {
                test: /\.json$/,
                include: validJsFolders,
                loader: 'json-loader',
            },
            //
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     loader: "url-loader?limit=10000&mimetype=application/font-woff",
            // },

            {
                test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
            },
        ],
    },
    postcss: [
        autoprefixer({ browsers: ['last 2 versions', '> 1%'] })
    ]
};
/*eslint-enable */
