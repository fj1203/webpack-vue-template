const merge = require('webpack-merge')
const common = require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config')
const utils = require('./utils')
const webpack = require('webpack')
const env = require('../config/prod.env')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');



const options = merge(common,{
    mode: "production",
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output:{
        path: config.build.assetsRoot,
    },
    externals:{},
    module:{
        rules: utils.styleLoaders({
            // 是否开启css的map映射
            sourceMap: config.build.productionSourceMap,
            // 该选项是是否开启css分离压缩的选项
            extract: true,
            // 是否使用postcss-loader添加浏览器前缀
            usePostCSS: true
        })
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                vendor: { // 将第三方模块提取出来
                    minSize: 30000,
                    minChunks: 1,
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 1
                },
                commons: {
                    test: /[\\/]src[\\/]common[\\/]/,
                    name: 'commons',
                    minSize: 30000,
                    minChunks: 3,
                    chunks: 'initial',
                    priority: -1,
                    reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                }
            }
        },
        runtimeChunk: { name: 'runtime' },
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                // 是否开启多线程
                // 在本实例中，该选项已被默认启动，所以可以去除
                parallel: true,
                // 将注释提取到一个文件中
                // 本实例中默认开启，但是现在关闭了它
                extractComments: false,
                // 是否开启缓存
                // 本实例中默认开启，但是现在关闭了它
                cache: false,
                // 是否开启映射
                sourceMap: config.build.productionSourceMap,
                terserOptions: {
                    warnings: false,
                    // 去除打印
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log']
                    },
                    // 去除注释，当设置为true时，会保留注释
                    output: {
                        comments: false,
                    },
                }
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            })
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new CleanWebpackPlugin(),
        new MiniCssPlugin({
            filename: utils.assetsPath('css/[name].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            inject: 'body',
            chunksSortMode: 'none',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        }),
    ],
    stats: {
        // 显示所有模块
        maxModules: Infinity,
        // 显示模块为何被引入
        reasons: true,
    }
})
// 当config中对应项为true时，启用打包分析
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    prodWebpackConf.plugins.push(new BundleAnalyzerPlugin())
}
// 当config中对应项为true时，启用cdn加速
if (config.build.cdn) {
    options.externals = config.build.NeedCdnModuleName
    const WebpackCdnPlugin = require('webpack-cdn-plugin');
    options.plugins.push(new WebpackCdnPlugin({
        modules: config.build.NeedCdnModuleAddress
    }))
}
if (config.build.gzip) {
    const CompressionPlugin = require('compression-webpack-plugin');
    options.plugins.push(new CompressionPlugin({
        // 这里如果算法为brotliCompress的话,需要将gz改为br
        filename: '[path].gz[query]',
        // 压缩算法,这里的话,你可以选择brotliCompress和gzip还有zopfli,当然这一切要取决于用户的浏览器支持哪种压缩模式
        // 若要使用brotliCompress算法,需要nodejs11.7以上.并且后缀名为.br
        algorithm: 'gzip',
        // 根据config文件设置的情况对什么文件进行压缩
        test: new RegExp(
            '\\.(' +
            config.build.productionGzipExtensions.join('|') +
            ')$'
        ),
        // 超过该大小就会压缩(单位:字节)
        threshold: 10240,
        // 压缩比,官方给的解释设置0.8是最佳了.至于计算公式,就是minRatio = 压缩后的大小 / 原来的大小
        // 当压缩比比这个低的话,就会进行压缩处理,如果设置成1的话,就是全部都处理了.
        minRatio: 0.8,
        // 是否删除原文件(默认也是false)
        // 这这里并不推荐删除源文件,因为需要照顾到不支持gzip的浏览器
        deleteOriginalAssets: false,
    })
    )
}
module.exports = options;
