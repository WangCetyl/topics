随着ES标准的发展，相继出现了ES6，ES7，ES8，ES9等新特性。新特性的出现，可以很好的提高开发效率和开发者体验，受到前端开发者的喜爱。但是浏览器厂商对这些新特性的支持是存在时差的，各主流浏览器的支持程度也参差不齐了，同时用户端安装的浏览器版本也不可控。为保障产品的可运行性，同时兼顾开发者的体验，babel应运而生。 babel承担了将ES6+新特性转译为浏览器能识别的向后兼容的JS语法的职责。

架构上，babel把ES6+中的新特性划分为两类：新增语法（syntax）和 新增API。语法的解析是js引擎的职责，开发者是不能自己定义，重写的。例如新增的 let，const，箭头函数等关键字在不支持的浏览器是不能使用的。新增API是开发者可以通过函数重写覆盖的，例如includes， map，promise等，开发者可以自己在项目里实现。babel对这两类新特性的处理进行了解耦，新增语法特性通过指定插件或预设直接转换，新增API特性通过代码层引入babel-polyfill或babel-runtime来实现向下兼容。

### 关系图

babel-polyfill和babel-runtime两者的关系图可总结如下：在功能上都是模拟了一个ES6+的环境，支持代码中使用新增API特性；在外部依赖上，有两个相同的核心依赖包。但在实现方式上两者区别很大，一个简单全面，另一个精致优雅，各有长短，适用不同的应用场景。 

![](https://img-blog.csdnimg.cn/20190802103121987.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=,size_16,color_FFFFFF,t_70)

### “我补全，你随意”简单全面的babel-polyfill

babel-polyfill通过在全局空间扩展对象，静态方法，原型链方法来实现ES6+环境的模拟，而这些扩展工作都封装在`@babel/polyfill`包内部，不会影响业务代码，即使是编译后的代码可读性也很好。使用时只需在dependencies下安装：`npm install --save @babel/polyfill`，同时在应用入口文件中引入`import "@babel/polyfill"`即可。

`@babel/polyfill`本身是一个简单的包，没有什么代码量，功能实现都依赖两个核心的第三方包corejs 和 regenerator-runtime。 

![](https://img-blog.csdnimg.cn/20190802103250622.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=,size_16,color_FFFFFF,t_70)

[corejs](https://github.com/zloirock/core-js#readme)是JavaScript标准库的polyfill，高度模块化，官网描述如下：

"Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2019: promises, symbols, collections, iterators, typed arrays, many other features, ECMAScript proposals, some cross-platform WHATWG / W3C features and proposals like URL. You can load only required features or use it without global namespace pollution."

corejs提供了两种加载模块的方式：一种是直接从corejs下加载模块，加载完，新增API的polyfill将直接挂载到全局空间；另一种是从corejs/library下加载，这种加载方式只导出模块，不污染全局空间。babel-polyfill就是采用的第一种加载方式，从corejs中加载了所有stable API的polyfill，可以覆盖新增的全局对象（eg：Promise），静态方法（eg: Object.assign()），和实例原型链方法(eg:includes)。 

![](https://img-blog.csdnimg.cn/20190802103334969.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=,size_16,color_FFFFFF,t_70)

注：corejs 目前已经发布到corejs3，相对于corejs2有较大变化。目前babel-polyfill里使用的还是corejs2，升级到corejs3时，将淘汰babel-polyfill，本文提到的corejs都是指corejs2。

[regenerator-runtime](https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime)包的功能很简单，就是提供模拟generator和async所需的模块regeneratorRuntime。支持以模块方式导入，或者全局定义的方式加载。`@babel/polyfill` 里采用全局定义的方式加载，加载完后全局空间会增加一个regeneratorRuntime的对象。babel在转译generator和async语法时会使用到这个全局对象。

babel-polyfill在这种直接，简单，粗暴的方式下，也存在一定的缺陷：

-   `@babel/polyfill`引入了大量API的polyfill，体积很大，尽管我们代码中可能只用到了其中几个方法。针对这一问题，babel 也给出了解决方案：结合@babel/preset-env的useBuiltIns设置，实现按需加载。可自行查看[官网介绍](https://www.babeljs.cn/docs/babel-polyfill).
    
-   `@babel/polyfill`直接增加了全局对象，修改内置对象的静态方法，原型链方法，污染了全局空间。这一缺陷在库开发时，尤为明显，因为库发布后会被各种应用使用，应用方可能因为某种原因，也在全局定义了相同名字的API，导致库功能不可用或者应用功能不可用。因此官网中明确指出库开发时，不提倡直接在库里使用@babel/polyfill，而是使用@babel/runtime.
    

### “你先用，我替换”精致优雅的babel-runtime

相比于babel-polyfill，babel-runtime实现显得精致而优雅，他不污染全局，而是采用隔离并替换的方式。对于代码中使用的新的全局对象，新的静态方法都会采用一个"影子"来替换，这个"影子"的实现被隔离在babel-runtime内部。使用"影子"时，从babel-runtime提供的相关模块载入即可。babel-runtime将这份工作进行了分工：一是提供"影子"的runtime包，由`@bable/runtime-corejs2` 担任；二是编译时负责扫描代码，完成"影子"的载入，实现代码替换的工作，由`@babel/plugin-transform-runtime` 担任。 编译完的代码，相比于源代码会有较大差异，可读性稍差。

此外，相比于babel-polyfill，babel-runtime还有另外一个功能，就是将babel转译时添加到文件中的内联辅助函数统一隔离到babel-runtime提供的helper模块中，编译时，直接从helper模块加载，不在每个文件中重复的定义辅助函数，从而减少包的尺寸，如下图。这是babel-runtime 一个非常大的功能点，也是transform-runtime plugin设计的初衷。。

![](https://img-blog.csdnimg.cn/20190802103451576.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=,size_16,color_FFFFFF,t_70)

babel-runtime的runtime包结构如下图所示：由corejs，helpers，regenerator 三个模块组成：

-   corejs：从第三方依赖corejs2的library中加载API，负责对外导出新增API的“影子”模块。在默认的“@babel/runtime”包中并不包含这个模块，只有在“@bable/runtime-corejs2”中才包括。这是因为`@babel/plugin-transform-runtime`的options选项设置中corejs属性默认为false，若要使用polyfill功能，可以将corejs属性设置为2，然后安装“@bable/runtime-corejs2”即可。
    
-   helpers：收敛babel转译所需的辅助函数，负责对外导出辅助函数；
    
-   regenerator：从第三方依赖regenerator-runtime中导入regeneratorRuntime模块，然后对外导出。
    

![](https://img-blog.csdnimg.cn/201908021036006.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=,size_16,color_FFFFFF,t_70)

babel-runtime的使用相比于babel-polyfill稍显麻烦，需要在development dependency中安装:

`npm install --save-dev @babel/plugin-transform-runtime`

同时在babel的plugin配置中加入“@babel/transform-runtime”，若需要polyfill API功能，还需将corejs属性设置为2，或者3.如下：

```
"@babel/proposal-class-properties",    ["@babel/transform-runtime",
```

然后在dependencies中安装：

`npm install --save @babel/runtime`

或者 （corejs属性配置为2时）

`npm install --save @babel/runtime-corejs2`。

babel-runtime 以优雅的姿势，不仅实现了ES6+API的支持，还优化了babel的转译工作，减少了包的尺寸。但是目前babel/runtime-corejs2还有一个很大的局限性，不能支持新增实例方法（instance method）的“影子”替换。这点也是使用者容易忽略的坑。

但是好消息是，babel 3月份发布的7.4.0版本中，corejs3 已经可以支持@babel/plugin-transform-runtime转换实例方法，在@babel/runtime-corejs3中已经包含转换实例方法的辅助模块。

### 对比总结

 

polyfill

runtime

使用

简单

稍麻烦

优点

ES6+ 特性覆盖全面

@babel/runtime-corejs2 对ES6+ 特性覆盖不全面，暂不支持新增的实例方法。eg: inludes ，但是@babel/runtime-corejs3已经支持

缺点

1.包大 2.污染全局空间

1. 优化包体积 2.隔离不污染全局

适用场景

应用级别项目

1. 对包size要求高的项目 2.库级别项目

发展

在babel7.4.0 以后deprecate

新增@babel/runtime-corejs3，功能增强

参考：

[https://www.babeljs.cn/docs/babel-plugin-transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)

[https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1](https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1)

[https://juejin.im/entry/5b108f4c6fb9a01e5868ba3d](https://juejin.im/entry/5b108f4c6fb9a01e5868ba3d)

[https://www.cnblogs.com/chyingp/p/understanding-babel-polyfill.html](https://www.cnblogs.com/chyingp/p/understanding-babel-polyfill.html)

[https://segmentfault.com/q/1010000005596587](https://segmentfault.com/q/1010000005596587)

[https://codersmind.com/babel-polyfill-babel-runtime-explained/](https://codersmind.com/babel-polyfill-babel-runtime-explained/)

[https://codersmind.com/babel-polyfill-babel-runtime-explained/](https://codersmind.com/babel-polyfill-babel-runtime-explained/)