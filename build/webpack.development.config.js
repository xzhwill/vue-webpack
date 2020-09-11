
process.env.BABEL_ENV ='development';
process.env.NODE_ENV ='development';

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = webpackMerge.merge(baseConfig, {
    mode: 'development',
    devServer: {
        inline: true,
        clientLogLevel: 'warning',//错误提示形式
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join('./', 'index.html')
                }
            ],
        },//当使用 HTML5 History API 时(路由)，任意的 404 响应到页面
        overlay: { //compiler errors or warnings提示
            warnings: false,
            errors: true
        },
        // openPage: 'index.html',
        // host: HOST || 'localhost',
        // port: PORT || 8072,
        host: 'localhost',
        port: 8072,
        open: true, //第一次构建完成时自动打开网页，默认是true
        hot: true, //热替换特性,自动刷新整个页面
        compress: true,//配置是否启用 gzip 压缩
        proxy: {},//代理
        publicPath: '/',//此路径下的打包文件可访问http://localhost:8080/assets/bundle.js,
        quiet: true, //启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台
        // watch: false//监视文件相关的控制选项 false关闭
        watchOptions: {
            ignored: '/node_modules/',
            poll: false
        }
    },
    plugins: [
        // --- 允许在 编译时 创建配置的全局常量 ---
        new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
        // --- 允许在 编译时 创建配置的全局常量 ---
        // --- HMR热替换插件 --- 
        new webpack.NamedModulesPlugin(),// 当开启 HMR 的时候使用该插件会显示module相对路径，建议用于开发环境
        new webpack.HotModuleReplacementPlugin(),
        // --- HMR热替换插件 --- 
        // --- 错误信息只是在控制台，不会加载错误信息页面 ---
        new webpack.NoEmitOnErrorsPlugin(),
        // --- 错误信息只是在控制台，不会加载错误信息页面 ---
        // --- 创建HTML5文件 ---
        //该插件将为你生成一个HTML5文件(.html文件)，其中包括使用 script 标签的 body 中的所有 webpack 包
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            //1,ture默认值，scirpt标签位于html文件的body底部 2,bodyscript标签位于html文件的body底部 3,script标签位于html文件的head中
            inject: true
        }),
        // --- 创建HTML5文件 ---
        // --- 拷贝静态文件 ---
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../static'),
                    to: 'static'
                }
            ]
        })
        // --- 拷贝静态文件 ---
    ]
})