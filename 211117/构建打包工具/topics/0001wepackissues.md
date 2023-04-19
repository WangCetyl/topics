# 1.前端代码为何要进行构建打包
# 2.module chunk bundle，分别什么意思，有何区别
-   1.module 代表所有的文件，一个文件就是一个module，文件包括js css 图片等等
-   2.chunk 是多模块的合成，如entry import() splitChunk体现在内存中的文件，
-   1.bundle 是最后生成输出的文件

# 3.webpack 拆分common dev pro
- 使用 webpack-merge插件  
```
   const webpackMerge = require('webpack-merge')
   ......
   module.exports = webpackMerge(base,dev/pro)
```
# 4.loader同plugin的区别
# 5.webpack如何实现懒加载
```
  import(./'').then(res => {
      console.log(res.default.message) //注意这里的default
  })  
```
# 6.webpack常见性能优化-优化打包构建速度 - 开发体验和效率
- babel-loader优化 缓存 排除不必要或者仅包含必要解析文件夹二選一
```
{
    test: /\.js$/,
    loader: ['babel-loader?cacheDirectory'],
    include: srcPath,
    // exclude: /node_modules/
    // inlude: /node_modules/
},
```
- IgnorePlugin  如果一些引用文件 如moment支持各国语言，如果只需要中文，就可以设置IgnorePlugin，只引用需要代码
```
    //webpack中plugins中设置
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    ]
    //具体在需要引用的文件中
    //原来
    import moment from 'moment'
    //现在添加需要的引用
    import 'moment/locale/zh-cn'
```
- noParse  对于已经压缩过的文件 如 .min.js 此时不要打包直接引用即可
```
module.exports = {
    module: {
        noParse: [/react\.min\.js$/]
    }
}
```
- happyPack  多进程打包
```
const HappyPack = require('happypack')
rules: [
    // js
    {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        include: srcPath,
        // exclude: /node_modules/
    },
]
plugins: [
    new HappyPack({
        // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
        id: 'babel',
        // 如何处理 .js 文件，用法和 Loader 配置中一样
        loaders: ['babel-loader?cacheDirectory']
    }),
]
```
- ParallelUgligyPlugin 多进程压缩js
```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
plugins: [
     new ParallelUglifyPlugin({
        // 传递给 UglifyJS 的参数
        // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
        uglifyJS: {
            output: {
                beautify: false, // 最紧凑的输出
                comments: false, // 删除所有的注释
            },
            compress: {
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }
    })
]
```
- 自动刷新 在webpack中配置 watch:true  watchOptions:{},但是实际使用devServer配置就自動設置以上watch相关配置
```
    module.exports = {
        watch: true,//开启监听，默认为false，设置后webpack-dev-server 会自动开启刷新浏览器
        //监听 配置
        watchOptions: {
            ignore:/node_modules/,//忽略哪些
            //监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
            aggregateTimeout:300,//默认300ms
            //判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化的实现
            poll:1000//默认每隔1000毫秒询问一次
        }
    }
```
- 热更新
   由于自动刷新页面 会导致整个页面都刷，导致速度慢，并且 会导致页面的状态变化。所以热更新优势更佳。此时只有变动代码的
   地方变化，其他不变 整个页面也不刷新
   ```
     //在webpack的dev文件中中配置
    const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
    entry: {
        index: [
            'webpack-dev-server/client?http://localhost:8080/',
            'webpack/hot/dev-server',
            path.join(srcPath, 'index.js')
        ],
    }
    devServer: {
        hot:true
    }
    //同时对应项目相关代码需要设置
    // 增加，开启热更新之后的代码逻辑
    if (module.hot) {
        module.hot.accept(['./math'], () => {
        const sumRes = sum(10, 30)
            console.log('sumRes in hot', sumRes)
        })
    }
   ```
- DllPlugin
  如果框架体积大，构建慢，并且版本稳定 此时同一版本只需要构建一次
  webpack已内置DllPlugin支持包含两个插件操作
  1.DllPlugin =打包出dll文件
  2.DllReferencePlugin - 使用dll文件
  ```
  <!-- 另建 webpack.dll.js文件 -->
    const path = require('path')
    const DllPlugin = require('webpack/lib/DllPlugin')
    const { srcPath, distPath } = require('./paths')
    module.exports = {
        mode: 'development',
        // JS 执行入口文件
        entry: {
            // 把 React 相关模块的放到一个单独的动态链接库
            react: ['react', 'react-dom']
        },
        output: {
            // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
            // 也就是 entry 中配置的 react 和 polyfill
            filename: '[name].dll.js',
            // 输出的文件都放到 dist 目录下
            path: distPath,
            // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
            // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
            library: '_dll_[name]',
        },
        plugins: [
            // 接入 DllPlugin
            new DllPlugin({
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 react.manifest.json 中就有 "name": "_dll_react"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: path.join(distPath, '[name].manifest.json'),
            }),
        ],
    }
  ```
  ```
    //webpack.dev中配置
    const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
    plugins: [
        // 第三，告诉 Webpack 使用了哪些动态链接库
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require(path.join(distPath, 'react.manifest.json')),
        }),
    ],
  ```
# 7.webpack常见性能优化 - 优化构建速度 生成环境使用
- babel-loader 缓存
- IgorePlugin
- noParse
- happyPack
- ParallelUgligyPlugin 
- scope hosting
# 8.webpack常见性能优化 - 优化代码产出
  基于体积更小；合理分包、不重复加载；速度更快、内存使用更少。
- 小图片base64编码
- 使用生产环境
- bundle使用contenthash
- 提取公共代码
- 懒加载
- IgorePlugin
- scope hosting
- 使用CDN加速
# 9.webpack构建流程概述
# 10.多页面打包设置
```
    entry: {
        index: path.join(srcPath, 'index.js'),
        login: path.join(srcPath, 'login.js')
    },
    output: {
        // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
        filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
        // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
            // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
            chunks: ['index']  // 只引用 index.js
        }),
        // 多入口 - 生成 login.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'login.html'),
            filename: 'login.html',
            chunks: ['login']  // 只引用 login.js
        })
    ]
```
# 11.css代码单独抽离压缩
```
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    const TerserJSPlugin = require('terser-webpack-plugin')
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    rules: [
            // 抽离 css
        {
            test: /\.css$/,
            loader: [
                MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                'css-loader',
                'postcss-loader'
            ]
        },
        // 抽离 less --> css
        {
            test: /\.less$/,
            loader: [
                MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                'css-loader',
                'less-loader',
                'postcss-loader'
            ]
        }
    ]
    plugins: [
           // 抽离 css 文件 缓存
        new MiniCssExtractPlugin({
            filename: 'css/main.[contentHash:8].css'
        })
    ],
    optimization: {
        // 压缩 css
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }

```
# 12.抽离公共代码
```
    optimization: {
        // 分割代码块
        splitChunks: {
            chunks: 'all',
            /**
             * initial 入口 chunk，对于异步导入的文件不处理
                async 异步 chunk，只对异步导入的文件处理
                all 全部 chunk
             */

            // 缓存分组
            cacheGroups: {
                // 第三方模块
                vendor: {
                    name: 'vendor', // chunk 名称
                    priority: 1, // 权限更高，优先抽离，重要！！！
                    test: /node_modules/,
                    minSize: 0,  // 大小限制
                    minChunks: 1  // 最少复用过几次
                },

                // 公共的模块
                common: {
                    name: 'common', // chunk 名称
                    priority: 0, // 优先级
                    minSize: 0,  // 公共模块的大小限制
                    minChunks: 2  // 公共模块最少复用过几次
                }
            }
        }
    }
```
# 13.ES6 Module 同 Common.js的区别
- ES6为静态引入，编译时引入
- Commonjs为动态引入，执行时引入
- 只有ES6 Module才能静态分析，实行Tree-Shaking
# 10.babel-runtime同babel-polyfill的区别