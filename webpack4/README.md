# Into Webpack 4 

- [Into Webpack 4](#into-webpack-4)
  * [安装 Webpack](#安装-webpack)
  * [常用配置模块](#常用配置模块)
    + [出入口](#出入口)
    + [配置 HTML 模板](#配置-html-模板)
    + [引用CSS文件](#引用css文件)
      - [拆分 CSS](#拆分-css)
      - [配置预编译](#配置预编译)
      - [拆分成多个css](#拆分成多个-css)
      - [添加CSS3前缀](#添加css3前缀)
    + [引用图片](#引用图片)
      - [页面img引用图片](#页面img引用图片)
      - [引用字体图片和svg图片](#引用字体图片和svg图片)
      - [通过tinypng压缩图片](#通过tinypng压缩图片)
    + [转义ES6](#转义es6)
    + [打包和调试](#打包和调试)
      - [启动静态服务器](#启动静态服务器)
      - [热更新和自动刷新的区别](#热更新和自动刷新的区别)
      - [resolve解析](#resolve解析)
      - [提取公共代码](#提取公共代码)
      - [Gzip压缩](#gzip压缩)
      - [分析打包模块](#分析打包模块)

## 安装 Webpack
- 需要先在项目中`npm init`初始化一下，生成 `package.json`
- 建议 node 版本安装到8.2以上

```bash
# Webpack 4中除了正常安装 webpack 之外，需要再单独安一个 webpack-cli
npm i webpack webpack-cli -D
```

> **v4 默认配置**
<br>
 `production` 模式：默认提供所有可能的优化，如代码压缩/作用域提升等，optimization.minimize 默认为开，process.env.NODE_ENV 默认是 production
 <br>
`development` 模式：主要优化了增量构建速度和开发体验，optimization.minimize 默认为开，开发模式下支持注释和提示，并且支持 eval 下的 source maps，process.env.NODE_ENV 默认是 development
<br>
其他：
webpack 默认会按照 .wasm, .mjs, .js 和 .json 的扩展名顺序查找模块。
output.pathinfo 在开发模式下默认是打开的
生产环境下，默认关闭内存缓存
entry 的默认值是 ./src，output.path 的默认值是 ./dist
在选择模式选项时，默认值是 production

## 常用配置模块


```js
module.exports = {
  entry: '', // 入口文件
  output: {}, // 出口文件
  module: {}, // 处理对应模块
  plugins: [], // 对应的插件
  optimization: {} // 提取公共代码，同CommonsChunkPlugin
  devServer: {}, // 开发服务器配置
  mode: 'development' // 模式配置
}
```

### 出入口

可以生成多入口

```js
const path = require('path')
// 单入口
module.exports = {
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'bundle.js', // 打包后的文件名称
    path: path.resolve('dist') // 打包后的目录，必须是绝对路径
  }
}

// 多入口
module.exports = {
  // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
  // entry: ['./src/index.js', './src/login.js'],
  // 2.真正实现多入口和多出口需要写成对象的方式
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    // 1. filename: 'bundle.js',
    // 2. [name]就可以将出口文件名和入口文件名一一对应
    // 3. 使用[chunkhash]代替[hash]做拆分缓存
    filename: '[name].[chunkhash:7].js', // 打包后会生成index.js和login.js文件
    path: path.resolve('dist')
  }
}
```

### 配置 HTML 模板

安装 `html-webpack-plugin`

```bash 
npm i html-webpack-plugin -D
```

因为是个插件，所以需要在config.js里引用一下的

```js 
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
// 单页面
module.exports = {
  entry,
  output,
  plugins: [
    new HtmlWebpackPlugin({ // 通过 new 实例来使用插件
      template: './src/index.html', // 在src目录下创建一个index.html页面当做模板来用
      hash: true, // 会在打包好的bundle.js后面加上hash串
      chunks: ['index', 'libs/utils', 'libs/vendor']
    })
  ]
}

// 多页面
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    chunks: ['index'] // 对应关系,index.js对应的是index.html
  }),
  new HtmlWebpackPlugin({
    template: './src/login.html',
    filename: 'login.html',
    chunks: ['login'] // 对应关系,login.js对应的是login.html
  })
]
```

### 引用CSS文件

可以在`src/index.js`里引入css文件，到时候直接打包到生产目录下

```bash
npm i style-loader css-loader -D

```

在 module 中配置 rules：

```js
// 此时打包后的css文件是以行内样式style的标签写进打包后的html页面中
module.exports = {
  entry,
  output,
  module: {
    rules: [{
      test: /\.css$/, // 解析css
      use: ['style-loader', 'css-loader'] // 从右向左解析
    }]
  },
  plugins: []
}
```

#### 拆分 CSS

```bash 
# @next表示可以支持webpack4版本的插件
npm i extract-text-webpack-plugin@next -D
```

将打包到js里的css文件进行一个拆分，用link的方式引入进去

```js
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry,
  output,
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextWebpackPlugin.extract({
        use: 'css-loader' // 将css用link的方式引入就不再需要style-loader了
      })
    }]
  },
  plugins: [
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css')
  ]
}
```

或者使用`mini-css-extract-plugin`

```bash
npm i mini-css-extract-plugin -D
```

```js
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry,
  output,
  module: {
    rules: [{
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      })
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/reset.css'
    }),
  ]
}
```

#### 配置预编译

```bash 
npm i sass-loader node-sass -D
```

依次执行 sass | css | style-loader

```js
module: {
  rules: [{
    test: /\.scss$/,
    use: [
      "style-loader", // creates style nodes from JS strings
      "css-loader", // translates CSS into CommonJS
      "sass-loader" // compiles Sass to CSS
    ]
  }]
}
```

配合`extract-text-webpack-plugin`

```js
module: {
  rules: [{
    test: /\.scss$/,
    use: ExtractTextWebpackPlugin.extract({
      use: ['css-loader', 'sass-loader']
    })
  }]
}
```

#### 拆分成多个css
配合`extract-text-webpack-plugin``sass-loader`使用

```js
let resetCss = new ExtractTextWebpackPlugin('styles/reset.css')
let sassCss = new ExtractTextWebpackPlugin('styles/sass.css')

module.exports = {
  module: {
    rules: [{
        test: /\.css$/,
        use: resetCss.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.scss|sass$/,
        use: sassCss.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    resetCss,
    sassCss,
  ]
}
```
#### 添加CSS3前缀
通过postcss中的autoprefixer可以实现将CSS3中的一些需要兼容写法的属性添加响应的前缀

```bash 
npm i postcss-loader autoprefixer -D
```

安装后，还需要在项目根目录下创建一个postcss.config.js文件，配置如下：

```js
module.exports = {
  plugins: [require('autoprefixer')]  // 引用该插件即可了
}
```

然后在webpack里配置postcss-loader

```js
module: {
  rules: [{
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  }]
}
```

### 引用图片
处理图片方面，也需要loader

```bash 
npm i file-loader url-loader -D
```

如果是在css文件里引入的如背景图之类的图片，就需要指定一下相对路径

```js
module: {
  rules: [{
      test: /\.css$/,
      use: ExtractTextWebpackPlugin.extract({
        use: ['css-loader', 'sass-loader'],
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
    }
  ]
}
```

#### 页面img引用图片
img引用的图片地址需要`html-loader`处理

```bash
npm i html-loader -D
```


```js
module: {
  rules: [{
    test: /\.(htm|html)$/,
    use: 'html-loader'
  }]
}
```

#### 引用字体图片和svg图片
字体图标和svg图片都可以通过file-loader来解析

```js
module: {
  rules: [{
    test: /\.(eot|ttf|woff|svg)$/,
    use: 'file-loader'
  }]
}
```

即使样式中引入了这类格式的图标或者图片也不会出现问题，img如果也引用svg格式的话，配合上面写好的html-withimg-loader也不会出现问题

#### 通过tinypng压缩图片

```bash
# Webpack 4
npm i tinypng-webpack-plugin -D 

# for webpack 3 & 2 & 1
npm install tinypng-webpack-plugin@1.0.2 -D
```

填写key和代理

```bash 
let tinyPngWebpackPlugin = require('tinypng-webpack-plugin')

plugins: [
  new tinyPngWebpackPlugin({
    key: "paK5Dcn8yuBZ7WvBzwAeXRgBfYei9Vsh",
    proxy: "http://127.0.0.1:1087"
  })
]
```

### 转义ES6
使用Babel将ES6的代码转成ES5的代码

```bash 
npm i babel-core babel-loader babel-preset-env babel-preset-stage-0 -D
```

通过.babelrc文件来配置ES6、之后的版本和那些仅仅是草案的内容

```js
// .babelrc
{
  "presets": ["env", "stage-0"]   // 从右向左解析
}
```

在webpack里配置babel-loader

```js
module: {
  rules: [{
    test: /\.js$/,
    use: 'babel-loader',
    include: /src/, // 只转化src目录下的js
    exclude: /node_modules/ // 排除掉node_modules，优化打包速度
  }]
}
```

### 打包和调试

#### 启动静态服务器

启动devServer需要安装一下webpack-dev-server

```bash
npm i webpack-dev-server -D
```

```js
devServer: {
  contentBase: './dist',
  host: 'localhost', // 默认是localhost
  port: 3000, // 端口
  open: true, // 自动打开浏览器
  hot: true // 开启热更新
  compress: true, // 代码压缩
  watchOptions: {
    aggregateTimeout: 300, // 一旦第一个文件改变，在重建之前添加一个延迟
    poll: 1000, // 每隔（你设定的）多少时间查一下有没有文件改动过
    ignored: /node_modules/ // 排除一个文件夹
  }
}
```

用npm脚本启动

```js
"dev": "webpack-dev-server --inline --progress --config webpack.dev.config.js"
```

#### 热更新和自动刷新的区别

在配置devServer的时候，如果hot为true，就代表开启了热更新

热更新还需要配置一个webpack自带的插件并且还要在主要js文件里检查是否有module.hot

```js
let webpack = require('webpack');
module.exports = {
    plugins: [
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 3000
    }
}
```

此时还没完虽然配置了插件和开启了热更新，但实际上并不会生效

```js
// index.js
// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
```


#### resolve解析
在webpack的配置中，使用resolve配置别名和省略后缀名

```js
module.exports = {
  resolve: {
    // 别名
    alias: {
      $: './src/jquery.js'
    },
    // 省略后缀
    extensions: ['.js', '.json', '.css']
  },
}
```
这个配置在webpack中比较简单，我们也就不再叙述了，下面来看点干货

#### 提取公共代码
在webpack4之前，通过CommonsChunkPlugin插件提取公共代码。到了4以后，内置了一个一模一样的功能，而且起了一个好听的名字叫“优化”

在项目代码中引入

```js
// index.js
import $ from 'jquery'
import { sum } from './libs/util'
```

配置webpack

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      vender: { // 抽离第三方插件
        test: /node_modules/, // 指定是node_modules下的第三方包
        chunks: 'initial',
        name: 'libs/vendor', // 打包后的文件名，任意命名  
        priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
      },
      utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
        chunks: 'initial',
        name: 'libs/utils', // 任意命名
        minSize: 0 // 只要超出0字节就生成一个新包
      }
    }
  }
},
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
]
```

#### Gzip压缩

服务器开启Gzip的同时，前端使用compression-webpack-plugin压缩js

```bash
npm i -D compression-webpack-plugin
```

在webpack中配置

```bash
new CompressionWebpackPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: new RegExp(
    '\\.(js|css)$'
  ),
  threshold: 5120,
  minRatio: 0.8
})
```

#### 分析打包模块

```bash 
npm install -D webpack-bundle-analyzer
```

在webpack.config.js中配置：

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8889,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info'
  }),
]
```

在package.json的scripts里加入命令，就可以npm run build之后看到webpack-bundle-analyzer的效果

```js
"analyz": "NODE_ENV=production npm_config_report=true npm run build"
```


