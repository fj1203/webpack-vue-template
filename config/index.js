const path = require('path')
module.exports = {
    dev:{
        assetsSubDirectory : 'static',
        assetsPublicPath:'/',
        devtool: 'cheap-module-eval-source-map',
        cssSourceMap:true,
        host: '0.0.0.0',
        autoOpenBrowser:false,
        errorOverlay: true,
        proxyTable: {},
        poll: false,
        port: 8080,
    },
    build:{
        assetsSubDirectory : 'static',
        assetsRoot: path.join(__dirname,'../dist'),
        assetsPublicPath:'/',
        /**
         * 打包时是否启用map
         */
        productionSourceMap:false,
        devtool: '#source-map',
        // `npm run build --report`
        // 或者你也可以直接设置true或者false来直接进行控制
        bundleAnalyzerReport: process.env.npm_config_report,
        cdn: true,
        NeedCdnModuleName: {
            'vue': 'Vue',
            'echarts': 'echarts',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT',
        },
        // 这里则是被webpack忽略之后，加载cdn
        NeedCdnModuleAddress: [{
            name: 'vue',
            var: 'Vue',
            path: 'dist/vue.runtime.min.js',
        }, {
            name: 'vue-router',
            var: 'VueRouter',
            path: 'dist/vue-router.min.js',
        }, {
            name: 'element-ui',
            var: 'ELEMENT',
            path: 'lib/index.js',
            style: 'lib/theme-chalk/index.css'
        }, {
            name: 'echarts',
            var: 'echarts',
            path: 'dist/echarts.common.min.js',
        }],
        // 此处配置是是否使用gzip功能对代码进行高强度的压缩(值得注意的是gzip功能需要nginx做出对应的配置,谨慎开启)
        // 你可能需要执行 npm i compression-webpack-plugin -D 命令来安装这个依赖
        // 因为本包中可能会不带这项依赖，毕竟不是每个人都需要
        gzip: false,
    }
}