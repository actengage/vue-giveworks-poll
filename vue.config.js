const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    publicPath: '/',
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.html'
        }
    },
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
        plugins: [
            new LodashModuleReplacementPlugin,
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ]
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://thecapsule.test',
                ws: true,
                changeOrigin: true
            }
        }
    }
};
