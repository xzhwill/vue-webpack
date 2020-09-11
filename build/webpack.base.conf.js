const path = require('path');
require("@babel/polyfill");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const TerserPlugin = require('terser-webpack-plugin') // 压缩js代码
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    // entry: ["@babel/polyfill", './src/App.js'],
    entry:{
        app:'./src/App.js'
    },
    // entry:'./src/App.js',
    // {
    //     app:path.join(__dirname,'./src/App.js'),
    //     common:[
    //         `babel-polyfill`,
    //     ]
    // },
    output: {
        path: path.resolve(__dirname, '../dist/static/js'),
        //1,此次打包的所有内容的 hash 
        //2,每一个chunk都根据自身的内容计算而来 
        //3,contenthash,css插件根据自身内容计算
        //chunkFilename异步代码，例如文件的引入require.ensure以文件形式加载CommonJS的方式异步加载
        filename: '[name].js', 
        // publicPath: '/',
        // publicPath /assets/
        // index.html <script src=assets/[name].js></script>
        //publicPath:""
        // <script src=[name].js></script>
    },
    module: {
        rules: [
            // vue-loader

            // html-withimg-loader处理图
            {
                test: /\.(htm|html)$/,
                loader: 'html-withimg-loader'
            },
            // babel-loader
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/, // include包括，exclude不包括
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true //开启缓存
                        }
                    }
                ]
            },
            // style-loader,css-loader
            {
                test: /\.css$/,
                // 按照索引反向执行
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // less-loader
            {
                test: /\.less$/,
                // 按照索引反向执行，依次经过less-loader、css-loader和style-loader编译
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader', // translates CSS into CommonJS 
                    'postcss-loader',
                    'less-loader' // compiles Less to CSS
                ]
            },
            //sass-loader
            {
                test: /\.scss$/,
                // 按照索引反向执行
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader', // translates CSS into CommonJS 
                    'postcss-loader',
                    'sass-loader' // compiles Sass to CSS
                ]
            },
            // 图片
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // name: '[name].[ext]',
                        // name: path.posix.join('static', 'img/[name].[hash:7].[ext]'),
                        name: '../img/[name].[hash:7].[ext]',
                        limit: 10000,
                        esModule: false
                    }
                }]
            },
            // 音视频
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'media/[name].[hash:7].[ext]',
                        limit: 10000
                    }
                }]
            },
            // 字体
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    // 第三方库 例如 jQuery或者地图AMap
    //要到html中以script标签的形式引externals之后就可以在相应的文件中import了
    // externals:{}
    optimization: {
        minimizer: [
            // --- 压缩js代码 ---
            new TerserPlugin({}),
            // --- 压缩js代码 ---
            // --- 压缩css代码 ---
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor:cssnano,//CSS处理器，默认为cssnano
                cssProcessorOptions: { 
                    safe: true, 
                    discardComments: {//清除所有注释样式
                        removeAll: true 
                    } 
                },
                canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台,默认为true
            })
        ],
        // --- 压缩css代码 ---
    },
    plugins:[
        new ProgressBarPlugin()
    ]
}
    