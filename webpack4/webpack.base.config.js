let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

let resetCss = new ExtractTextWebpackPlugin('styles/reset.css')
let sassCss = new ExtractTextWebpackPlugin('styles/sass.css')
// let MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  module: {
    rules: [
      // {
      //     test: /\.css$/,
      //     use: ['style-loader', 'css-loader']
      // }
      // {
      //   test: /\.css$/,
      //   use: ExtractTextWebpackPlugin.extract({
      //     use: ['css-loader', 'sass-loader']
      //   })
      // },
      {
        test: /\.css$/,
        use: resetCss.extract({
          // 将css用link的方式引入就不再需要style-loader了
          use: ['css-loader', 'postcss-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.scss|sass$/,
        use: sassCss.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/'
          }
        }]
      },
      // {
      //   test: /\.(htm|html)$/,
      //   use: 'html-withimg-loader'
      // },
      {
        test: /\.(htm|html)$/,
        use: 'html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/, // 只转化src目录下的js
        exclude: /node_modules/ // 排除掉node_modules，优化打包速度
      },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader']
      // }
    ]
  },

  // externals: process.env.NODE_ENV === 'production' ? {
  //     jquery: 'jQuery'
  // } : {},
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index', 'libs/utils', 'libs/vendor']
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      filename: 'login.html',
      chunks: ['index', 'libs/utils', 'libs/vendor']
    }),
    resetCss,
    sassCss,
    // new ExtractTextWebpackPlugin('css/reset.css'),
    // new MiniCssExtractPlugin({
    //   filename: 'css/reset.css'
    // }),

  ],
  devServer: {
    contentBase: './dist',
    port: 3000,
    // hot: true
  }
}