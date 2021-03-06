const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            buffer: require.resolve('buffer'),
        },
        alias: {
            process: 'process/browser',
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
    module: {
        rules: [
            {
                test: /httpAdapter.js/g,
                loader: 'ignore-loader',
            },
        ],
    },
    entry: './dist/js/index.js',
    output: {
        path: `${__dirname}/dist/webpack/`,
        filename: 'index.js',
        library: 'hyttpo',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    mode: 'production',
};
