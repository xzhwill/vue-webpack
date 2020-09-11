const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();

// developmentWebpackConfig
const developmentWebpackConfig = require('./webpack.development.config.js');
const compiler = webpack(developmentWebpackConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
}));

// Serve the files on port 3000.
app.listen(3000, function () {
console.log('Example app listening on port 3000!\n');
});