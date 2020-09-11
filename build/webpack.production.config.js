
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSSPlugin = require('purifycss-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const dropConsoleWebpackPlugin = require('drop-console-webpack-plugin')
const deleteFile = require('./utils').deleteFile;
// 删除css文件下的.css文件


const pathCss = path.resolve(__dirname, '../dist/static/css');
if (fs.existsSync(pathCss)) {
    const modelPages = fs.readdirSync(path.resolve(__dirname, '../dist/static/css'))
    deleteFile(path.resolve(__dirname, '../dist/static/css'),true)
    // modelPages.forEach(item => {
    //     const deleteCss = path.resolve(__dirname, '../dist/static/css') + '/' + item;
    //     deleteFile(deleteCss, true);
    // })
}

// const rm = require('rimraf')

// rm(path.join(path.resolve(__dirname, '../dist'), 'static'), err => {
//     console.log("=========================================================")
//     if (err) throw err

// })

console.log("++++++++++++++++++++++++++++++++++++++++++++++")

module.exports = webpackMerge.merge(baseConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                // 按照索引反向执行
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true
                        },
                    },
                    // 使用MiniCssExtractPlugin则不能再使用style-loader
                    // 'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    // --- 提公用代码 ---
    optimization: {
        // 当两个cacheGroup.priority相同时，先定义的会先命中
        // minChunks、maxAsyncRequests、maxInitialRequests>=1
        splitChunks: {
            chunks: 'all', //async异步代码分割（动态加载import()）里面进行 initial表示只从入口同步代码分割 all同步异步分割都开启
            minSize: 30000, //字节 引入的文件大于30kb才进行分割
            // maxSize: 50000, //50kb，尝试将大于50kb的文件拆分成n个50kb的文件
            minChunks: 1, //module至少使用次数
            maxAsyncRequests: 5, //同时加载的module数量最多是5个，只分割出同时引入的前5个文件
            maxInitialRequests: 3, //首页加载的时候引入的文件最多3个，并发请求entry1
            automaticNameDelimiter: '.', //缓存组和生成文件名称之间的连接符
            name: true, //缓存组里面的filename生效，覆盖默认命名
            // 缓存组，将所有加载module放在缓存里面一起分割打包
            // 同时满足各个条件
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    // 在node_modules>react-dom满足引入使用2次（优先级）
                    priority: -10, //优先级
                    // filename: 'vendors.js'
                },
                default: {
                    //module至少使用次数，例如jquery在entry1和entry2都被引入了，
                    //如jquery没在node_modules里满足引入使用2次
                    minChunks: 2,
                    priority: -20, //优先
                    // reuseExistingChunk: true, //module嵌套引入时，判断是否复用已经被打包的module
                    // filename: 'common.js'
                }
            }
        },
        // removeAvaliableModules :true
    },
    // --- 提公用代码 ---
    plugins: [
        // --- 清理上一次项目生成的文件 ---
        new CleanWebpackPlugin({}),
        // --- 清理上一次项目生成的文件 ---
        // --- 允许在 编译时 创建配置的全局常量 ---
        new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
        // --- 允许在 编译时 创建配置的全局常量 ---
        // --- 根据module的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境 ---
        new webpack.HashedModuleIdsPlugin(),
        // --- 根据module的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境 ---
        // --- 预编译功能 ---
        new webpack.optimize.ModuleConcatenationPlugin(),
        // --- 预编译功能 ---
        // --- 错误信息只是在控制台，不会加载错误信息页面 ---
        new webpack.NoEmitOnErrorsPlugin(),
        // --- 错误信息只是在控制台，不会加载错误信息页面 ---
        // --- 创建HTML5文件 ---
        //该插件将为你生成一个HTML5文件(.html文件)，其中包括使用 script 标签的 body 中的所有 webpack 包
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'), //生产目录和文件明
            template: 'index.html', //模板页面，根目录
            // 自动生成script标签，index.html引入
            // 1,ture默认值，scirpt标签位于html文件的body底部
            // 2,'body'，script标签位于html文件的body底部（同 true） 
            // 3,'head'，script标签位于html文件的head中
            // 4,false，生成一个html文件，没js文件
            minify: { //压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true, // 压缩内联css
                removeAttributeQuotes: true // 移除属性的引号
            },
            inject: true,
            // chunksSortMode: 'dependency'//dependency依次加载
        }),
        // --- css文件内容不改，不会重复构建contenthash --- 
        // 将 CSS 提为独立的文件，代替 extract-text-webpack-plugin
        new MiniCssExtractPlugin({
            filename: '../css/[name].[hash].css',
            chunkFilename: '../css/[id].[hash].css',
        }),
        // --- css文件内容不改，不会重复构建contenthash --- 
        // --- 删除重复或者多余的css代码 ---
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, '../dist/*.html')),
        }),
        // --- 删除重复或者多余的css代码 ---
        // --- 清空console ---
        // new dropConsoleWebpackPlugin()
        // --- 清空console ---
        // --- 通过交互式的、可缩放的查看文件的size ---
        // new BundleAnalyzerPlugin()
        // --- 通过交互式的、可缩放的查看文件的size ---
    ]
})