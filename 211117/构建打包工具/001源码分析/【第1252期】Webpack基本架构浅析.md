---
created: 2021-07-26T13:27:04 (UTC +08:00)
tags: []
source: https://mp.weixin.qq.com/s/SutFaepzDrMUPy4KLlZzkg
author: Gloria
---

# 【第1252期】Webpack基本架构浅析

> ## Excerpt
> 通过手绘来表达

---
前言

截止到今日webpack的star数超过4万了，发展速度还是很快的。今日早读文章由网易考拉海购@Gloria投稿分享。

正文从这开始～

> 文章webpack版本为3.6.0

随着掌握的前端基础知识越来越多，对技术的要求逐渐不满足于实现即可，技术到了瓶颈期，自己也曾尝试写过一些开源库，不过很少有满意的作品，通常没迭代几个版本就没有耐心继续维护了。通常是面临的情形是前期设计思路太过简单导致后期扩展的时候需要重构大量的代码（GG吧~），就好比一坨屎，再怎么装点，都很难把它当成蛋糕吃下去。

我认为，突破这个瓶颈的关键就是学会深入理解优秀开源库背后的思路。有人可能会说，我用xxx已经很久了，能够熟练使用它解决各种棘手问题，对于它，我已经充分理解了。我想说的是，即便你对于它的使用已经达到了炉火纯青的程度，但是站在使用者角度理解再“深”能有多深呢，不过是坐井观天罢了。

#### 为什么Webpack

目前为止，Webpack已经拥有39.9k的star，在前端代码打包器领域内应该算是无敌的存在了吧。Webpack强大的生态圈和丰富的解决方案使得我们在日常开发中很难逃脱它的魔爪。如果能学习到它背后的思路，对于技能树的完善和水平层次的提高应该是非常有好处的。

#### 概要

如果要全面总结webpack的实现，估计写10篇文章都不一定够。为了更加清晰地get到webpack的设计思路，会隐去webpack的大部分功能实现。

以实现简单的js模块打包功能为背景，文章分为3部分：

1.  BundleBuilder基本架构
    
2.  Webpack基本架构
    
3.  学到了些什么
    

相信你在阅读完本文后会对Webpack的架构有个大概的了解，这应该会对你继续深入理解webpack其它功能的实现以及编写插件会有所帮助。

#### BundleBuilder基本架构

> 简单到不能再简单的js模块打包器

##### 示意图

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

BundleBuilder

##### BundleBuilder对象

1.  BundleBuilder对象接收并处理外部配置
    
2.  根据配置选择不同的ModuleResolver
    
3.  使用ModuleResolver接收配置得到最终文件内容
    
4.  生成打包后的文件
    

##### ModuleResolver对象

1.  接收从BundleBuilder传进的配置
    
2.  解析入口文件内容
    
3.  提取子模块路径，并递归地解析子模块
    
4.  将引用的模块路径替换为模块id最终生成模块文件
    

#### webpack基本架构

这个接下来依次讲解webpack中几个重要对象之间的关系，会以各自的视角描述几个重要的过程。当然，就单单这几个对象还不能完全地描述流程上的所有内容。

##### Tapable插件功能

> webpack 4.0的插件系统已经完全重做并将Tapable更新到了1.0.0

在正式介绍几个核心对象之前，你需要了解一下Tapable类。

简单来说，Tapable为一个对象提供了插件功能。如果你用过`Vue.js`或者`React.js`之类的框架，Tapable就是为某个对象提供了相当于组件的生命周期功能，在外部你可以通过调用这些生命周期钩子监听该对象。

当然，你还可以在外部手动触发对象的某个生命周期。

如果你想详细了解Tapable的API可以：http://blog.zxrcool.com/2017/10/22/Webpack原理分享（一）/（文中版本为0.2.8）

##### Webpack主函数视角

> 最宏观的视角

1.合并外部与默认配置

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

2.配置并创建compiler

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

3.在compiler启动前触发compiler上的若干生命周期

> 其中生命周期包括：environment，after-environment，entry-option，after-plugins，after-resolvers

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

4.启动compiler

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

5.将compiler运行后得到的状态信息打印出来

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

##### Compiler视角

1.正式运行前依次触发before-run和run生命周期

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

2.创建params对象并触发before-compile生命周期

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

3.触发compile生命周期并创建compilation对象

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

4.触发this-compilation和compilation生命周期

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

5.触发make生命周期并调用compilation.finish()

> 在make阶段调用了compilation.addEntry()，开始构建模块树，构建完毕后调用compilation.finish()，记录报错信息

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

6.调用compilation.seal()并触发after-compile生命周期

> compilation在seal过程中做了很多工作，在compilation视角部分会讲到，现在只需知道seal过后compilation生成了assets对象以供compiler生成文件

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

7.拿到assets并在生成每个assets对应的文件

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

8.将警告信息和文件大小信息合成为stats状态信息

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

9.触发done生命周期并将stats状态信息交给webpack主函数

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

##### Compilation构建模块树视角

> 当compiler命令compilation构建模块树之后compilation都做了些什么

1.使用moduleFactory创建空module

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

2.命令module自行构建自身属性，比如依赖的子模块信息（dependency）

> 调用module.build()进行构建模块自身属性

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

3.递归地重复1和2的操作，生成模块树

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

4.将模块树记录到chunk中

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

##### Compilation的seal视角

1.配置chunk

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

2.将所处模块树深度和引用顺序等信息记录在每个模块上

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

3.将所有模块按照引用顺序排序

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

4.触发optimize-module-order生命周期并按照排序后的模块顺序为每个模块编号

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

5.使用template对象渲染出chunk的内容source

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

6.拿到source后生成asset，添加到assets中

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

#### 学到了什么

##### 引入插件系统

存在的问题

可以看到，BundleBuilder的架构中完全没有为第三方提供接口，后期当然也可以做成根据不同的外部配置项来实现一些有限的定制化需求。

但是，这样为了保证功能的多样性，会频繁修改打包器的内部实现。这种做法会使得整个打包器的稳定性不足，最终非常臃肿，维护困难。

webpack的做法

反观webpack，它使用了一种非常聪明的方式。在保证基本架构的前提下，为主流程上的大部分对象都引入插件系统，使用者可以获取到这些对象，并且在一些特定的时候运行使用者提供的代码。这样一来，社区的逐渐壮大保证了功能的多样性，还把稳定性不足的风险留给用户去处理，提高了整个打包器的可维护性。

##### 过程粒度细化

存在的问题

可以看到，BundleBuilder最终生成文件内容只有一个过程，就是调用ModuleResolver获取字符串。当这个过程中的某一阶段需要独立进行的时候，难免会要重构代码。如果内部实现是比较松耦合的，那么重构的工作会比较轻松，但是像现在BundleBuilder这种实现，显然要做的工作并不少。

webpack的做法

从接收配置到生成文件内容，从比较宏观的角度，分为构建，封装，生成文件内容，三部分。

1.  保证了内部修改的灵活性。如果要对过程再细分或者添加过程，实现起来会比较方便。
    
2.  丰富了对外扩展的接口。很显然，由于webpack引入了插件系统，细化过程粒度应该是必然选择，这样会有效地增加用户对整个打包过程的自定义能力。
    
3.  提升了代码的可维护性。当打包器在运行时出现了bug，粒度越小，越加方便定位问题。
    

### 更多类的抽象

存在的问题

在BundleBuilder中，对于每个模块仅仅是通过路径读取它的文件内容，然后分析其子模块的信息，最后生成处理后的模块内容。这些都是过程。如果后面迭代时需要在打包后输出一些log，如模块警告，模块路径等与模块相关的信息。以面向过程的编程方式当然也可以实现，但这样难免会增加实现难度，降低代码可读性。

webpack的做法

稍微搜索一下，不包括自带插件，webpack总共有200多个用`Class`声明的类。

1.  结构化的数据。创建一个类就意味着我们能统一很多有相同抽象含义的对象创建同样的属性，比如Module类，它可以记录很多与模块相关的信息。
    
2.  方便扩展不同种类的对象。比如模块类，可以通过继承的方式衍生出，普通js文件模块，css文件模块等等。
    
3.  多类意味着有承担不同职责的对象。明确的职责分工，比如compiler仅仅负责compilation的创建，文件的生成和信息状态的合成。ModuleFactory负责创建Module。一旦出了问题方便定位到责任人，降低了各个工作的耦合度。
    
4.  对象间的解耦。比如compilation和Module两个类，webpack其实也可以直接使用compilation来直接创建Module，但是一旦Module的种类增加，不可避免地需要在compilation中写一些条件语句，这样，创建Module这部分的代码会让本来就有很多事情要做的compilation变得更加庞大。所以webpack引入了ModuleFactory，compilation只需调用ModuleFactory来创建Module就好，创建部分的逻辑则被分布在了ModuleFactory中，将compilation与Module解耦，两者中一方发生变化，只需在ModuleFactory中增加逻辑即可。
    

## 感受

由于webpack过于庞大，看源码的过程感觉是在修行。写这篇文章之初准备深入到一些技术细节，后来感觉意义不大。也尝试过列举在简单js模块打包流程上涉及到的默认插件，写出来像API手册，如果完全写完，体量可能都接近半本书了。最后，决定拿小学3年级画画水平，将最基本的架构关系画出来。

最大的感受就是：当你真的准备设计一个库的时候，应该在实现之前充分列举可能的应用场景，将充分抽象出稳定的基本架构，然后将难办的部分，复杂度很高的部分，或者说定制化需求比较多的部分，采用开放插件的方式扔给使用者去解决。

最后，为你推荐

[【第1206期】看清楚真正的 Webpack 插件](http://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651227882&idx=1&sn=b48093351f3e52ec281c29ee9cb5d600&chksm=bd495f6e8a3ed6782de9f25f57c72c2d60a3756c028b95c66707d4376f9099458f75ae1fddda&scene=21#wechat_redirect)  

关于本文  
作者：@Gloria  
原文：http://blog.zxrcool.com/2018/04/19/Webpack基本架构浅析/

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)
