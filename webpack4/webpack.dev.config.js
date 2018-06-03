let path = require('path')
let webpack = require('webpack')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  output: {
    filename: '[name].[hash:7].js',
    path: path.resolve('dist')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true,
    compress: true,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/
    }
  }
})