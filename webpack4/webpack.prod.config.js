let path = require('path')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.config')
let CleanWebpackPlugin = require('clean-webpack-plugin')
// let tinyPngWebpackPlugin = require('tinypng-webpack-plugin')
let CompressionWebpackPlugin = require('compression-webpack-plugin')
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    filename: '[name].[chunkhash:7].js',
    path: path.resolve('dist'),
    // publicPath: "http://cdn.example.com/"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vender: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'libs/vendor',
          priority: 10
        },
        utils: {
          chunks: 'initial',
          name: 'libs/utils',
          minSize: 0
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    // new tinyPngWebpackPlugin({
    //   key: "paK5Dcn8yuBZ7WvBzwAeXRgBfYei9Vsh",
    //   proxy: "http://127.0.0.1:1087"
    // }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(js|css)$'
      ),
      threshold: 5120,
      minRatio: 0.8
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info'
    // })
  ]
})