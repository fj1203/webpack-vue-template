const Utils = require('./utils')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const Webpackbar = require('webpackbar')
const path = require('path')
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    context: path.join(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: Utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: Utils.assetsPath('js/[name].[chunkhash:8].bundle.js'),
        path: config.build.assetsRoot,
        publicPath:
      process.env.NODE_ENV === 'production'
          ? config.build.assetsPublicPath
          : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory=true',
                include: [
                    resolve('src'),
                    resolve('test'),
                    resolve('node_modules/webpack-dev-server/client')
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: Utils.assetsPath('image/[name]-[hash:8].[ext]')
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: Utils.assetsPath('fonts/[name]-[hash:8].[ext]')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new Webpackbar('正在打包')
    ]
}
