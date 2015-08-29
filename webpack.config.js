'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var srcPath = path.join(__dirname, 'src');

module.exports = {
  target: 'web',
  cache: true,
  entry: {
    module: path.join(srcPath, 'app.js'),
    common: ['react', 'react-router', 'alt']
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: path.join(__dirname, 'tmp'),
    publicPath: '',
    filename: '[name].js',
    library: ['Example', '[name]'],
    pathInfo: true
  },

  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&stage=0' },
      { test: /\.woff.?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'file-loader' },
      { test: /\.eot$/, loader: 'file-loader' },
      { test: /\.svg$/, loader: 'file-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/templates/index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.NoErrorsPlugin()
  ],

  debug: true,
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './tmp',
    historyApiFallback: true
  }
};
