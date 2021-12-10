const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            "zlib": require.resolve("browserify-zlib"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "url": require.resolve("url"),
            "assert": require.resolve("assert"),
            "util": require.resolve("util"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer")
        },
        alias: {
            process: "process/browser"
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    entry: './dist/js/index.js',
    output: {
        path: __dirname + '/dist/webpack/',
        filename:  'hyttpo-webpack.js',
        sourceMapFilename: 'hyttpo-webpack.map',
        library: 'hyttpo',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    devtool: 'source-map',
    mode: 'production'
}
