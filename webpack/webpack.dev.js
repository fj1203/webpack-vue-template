const path = require("path");
const  HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const merge = require("webpack-merge");
const common = require("./webpack.base");
const config = require("../config");
const Utils = require("./utils");
const dev = require("../config/dev.env");
const portfinder = require("portfinder");
const webpack = require("webpack");
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const options = merge(common,{
    devtool:config.dev.devtool,
    module:{
        rules:[
            ...Utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
            {
                test: /\.(js|vue)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [path.resolve(__dirname, "src")], // 指定检查的目录
                exclude: /node_modules/,
                options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                    formatter: require("eslint-friendly-formatter") // 指定错误报告的格式规范
                }
            }
        ]
    },
    output:{
        filename:"[name].js",
    },
    devServer:{
        clientLogLevel: "warning",
        // 当使用history出现404时则自动调回index页
        historyApiFallback: true,
        contentBase: path.join(__dirname, "../dist"),
        hot: true,
        // 启用gzip
        compress: false,
        // 设置webpack热加载地址
        host: HOST || config.dev.host,
        // 设置webpack热加载端口
        port: PORT || config.dev.port,
        // 设置是否自动打开浏览器
        open: config.dev.autoOpenBrowser,
        // 当编译器出现错误时，在全屏覆盖显示错误位置
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        // 从config文件中读取端口代理设置
        proxy: config.dev.proxyTable,
        // 启用简洁报错
        quiet: true,
        // 启用监听文件变化
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins:[
        new webpack.DefinePlugin({
            "process.env": dev
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.html",
            chunksSortMode: "none",
            inject: "body",
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});
module.exports= new Promise((resolve, reject)=>{
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err,port) => {
        if(err){
            reject(err);
        }else{
            process.env.PORT = port;
            options.devServer.port = port;
            options.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: ["您的项目已成功启动"],
                    notes: [`本机访问请在vscode的终端中按住左ctrl键点击: http://127.0.0.1:${port} \n `, `局域网访问地址: http://${Utils.getNetworkIp()}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(options);
        }
    });
});