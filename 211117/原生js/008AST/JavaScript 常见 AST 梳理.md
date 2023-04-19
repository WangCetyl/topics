---
created: 2021-07-26T13:22:23 (UTC +08:00)
tags: []
source: https://mp.weixin.qq.com/s/OjViHaF6iFQcEJ7UK080NA
author: 神说要有光zxg
---

# JavaScript 常见 AST 梳理

> ## Excerpt
> 这是掘金小册《babel 插件通关秘籍》的第三节（试读章节）。babel 编译的第一步是把源码 parse

---
这是掘金小册《babel 插件通关秘籍》的第三节（试读章节）。

babel 编译的第一步是把源码 parse 成抽象语法树 AST （Abstract Syntax Tree），后续对这个 AST 进行转换。（之所以叫抽象语法树是因为省略掉了源码中的分隔符、注释等内容）

AST 也是有标准的，JS parser 的 AST 大多是 estree 标准，从 SpiderMonkey 的 AST 标准扩展而来。babel 的整个编译流程都是围绕 AST 来的，这一节我们来学一下 AST。

熟悉了 AST，也就是知道转译器和 JS 引擎是怎么理解代码的，对深入掌握 Javascript 也有很大的好处。

## 常见的 AST 节点

AST 是对源码的抽象，字面量、标识符、表达式、语句、模块语法、class 语法 都有各自的 AST。我们分别来了解一下：

### Literal

Literal 是字面量的意思，比如 `let name = 'guang'`中，`'guang'`就是一个字符串字面量 StringLiteral，相应的还有 数字字面量 NumericLiteral，布尔字面量 BooleanLiteral，字符串字面量 StringLiteral，正则表达式字面量 RegExpLiteral 等。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgmB83DEDHndbqIx8KibMiaRQTZrhHpOX7KGYSiaItK0tUFyt2Xb71AsC0Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

代码中的字面量很多，babel 就是通过 xxLiteral 来抽象这部分内容的。

### Identifier

Identifer 是标识符的意思，变量名、属性名、参数名等各种声明和引用的名字，都是Identifer。我们知道，JS 中的标识符只能包含字母或数字或下划线（“_”）或美元符号（“$”），且不能以数字开头。这是 Identifier 的词法特点。

来尝试分析一下，下面这一段代码里面有多少 Identifier 呢？

```
const name = 'guang';function say(name) {  console.log(name);}const obj = {  name: 'guang'}
```

答案是这些

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1Ng4ibX27Z9Z85hgeVG4EJKsWUVfFTicUFT5bO29qhTRMSziabkIJmYpHtIw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Identifier 是变量和变量的引用，代码中也是随处可见。

### Statement

statement 是语句，它是可以独立执行的单位，比如 break，continue，debugger，return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的每一条可以独立执行的代码，都是语句。

语句末尾一般会加一个分号分隔，或者用换行分隔。

下面这些我们经常写的代码，每一行都是一个 Statement：

```
break;continue;return;debugger;throw Error();{}try {} catch(e) {} finally{}for (let key in obj) {}for (let i = 0;i < 10;i ++) {}while (true) {}do {} while (true)switch (v){case 1: break;default:;}label: console.log();with (a){}
```

他们对应的 AST 节点如图所示

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgxhGeHCU9Rk1hB5aRMhZV1KcM0WNlHTmHYRn8u66oYBmxiafw2icwHNQw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

语句是代码执行的最小单位，可以说，代码是由语句（Statement）构成的。

### Declaration

声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。

比如下面这些声明语句：

```
const a = 1;function b(){}class C {}import d from 'e';export default e = 1;export {e};export * from 'e';
```

他们对应的 AST 节点如图：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgBkyboERTvHfZicLm50x4wvP6sZxJniapbIQFB4nc6PEoSJH71PgJDpiag/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

声明语句用于定义变量，变量声明也是代码中一个基础的部分。

### Expression

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别。

下面是一些常见的表达式

```
[1,2,3]a = 11 + 2;-1;function(){};() => {};class{};a;this;super;a::b;
```

它们对应的AST如图：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgGBqfN8VsEOpVtS6EN4XX5t0cTsFCFHnbBZO6zKibYJftfTLRSRLoPQQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

细心的同学可能会问 identifier 和 super 怎么也是表达式呢？

其实有的节点可能会是多种类型，identifier、super 有返回值，符合表达式的特点，所以也是 expression。

我们判断 AST 节点是不是某种类型要看它是不是符合该种类型的特点，比如语句的特点是能够单独执行，表达式的特点是有返回值。

有的表达式可以单独执行，符合语句的特点，所以也是语句，比如赋值表达式、数组表达式等，但有的表达式不能单独执行，需要和其他类型的节点组合在一起构成语句。比如匿名函数表达式和匿名 class 表达式单独执行会报错

```
function(){};class{}
```

需要和其他部分一起构成一条语句，比如组成赋值语句

```
a = function() {}b = class{}
```

表达式语句解析成 AST 的时候会包裹一层 ExpressionStatement 节点，代表这个表达式是被当成语句执行的。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

小结：表达式的特点是有返回值，有的表达式可以独立作为语句执行，会包裹一层 ExpressionStatement。

### Class

class 的语法比较特殊，有专门的 AST 节点来表示。

整个 class 的内容是 ClassBody，属性是 ClassProperty，方法是ClassMethod（通过 kind 属性来区分是 constructor 还是 method）。

比如下面的代码

```
class Guang extends Person{    name = 'guang';    constructor() {}    eat() {}}
```

对应的AST是这样的

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NglyUaVsx5zSEqPibA0kAibp1awHxpicBzH3GauibnI6o9IXCgJz9Ez46NCQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

class 是 es next 的语法，babel 中有专门的 AST 来表示它的内容。

### Modules

es module 是语法级别的模块规范，所以也有专门的 AST 节点。

#### import

import 有 3 种语法：

named import：

```
import {c, d} from 'c';
```

default import：

```
import a from 'a';
```

namespaced import:

```
import * as b from 'b';
```

这 3 种语法都对应 ImportDeclaration 节点，但是 specifiers 属性不同，分别对应 ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgAT1dZVYzGtia3XAonzCBZqtK6J6dMjDXyrExy4I1icXZrRicbt5J58icVg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

图中黄框标出的是 specifier 部分。可以直观的看出整体结构相同，只是specifier 部分不同，所以 import 语法的 AST 的结构是ImportDeclaration 包含着各种 import specifier。

#### export

export 也有3种语法：

named export：

```
export { b, d};
```

default export：

```
export default a;
```

all export：

```
export * from 'c';
```

分别对应 ExportNamedDeclaration、ExportDefaultDeclaration、ExportAllDeclaration 的节点

其中 ExportNamedDeclaration 才有 specifiers 属性，其余两种都没有这部分（也比较好理解，export 不像 import 那样结构类似，这三种 export 语法结构是不一样的，所以不是都包含 specifier）。

比如这三种 export

```
export { b, d};export default a;export * from 'c';
```

对应的 AST 节点为

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgDbUxdl8MWnf5j4YZGR0XAfHEowicmFOpXzZjyO2iaice3q7icwV1shmfYA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

import 和 export 是语法级别的模块化实现，也是经常会操作的 AST。

### Program & Directive

program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放Directive 节点，比如`"use strict"` 这种指令会使用 Directive 节点表示。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgX9B23VjfzzoCh9ZddOVIDZMDNCtkuYoZTfyz4IxIZFHcmVV0l3piauw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Program 是包裹具体执行语句的节点，而 Directive 则是代码中的指令部分。

### File & Comment

babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。

注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgInGYCtuGn2QBeyYkCIzyQleBSplCIZm3qWXLdJqD9L7r6b4zEnj6yw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

上面 6 种就是常见的一些 AST 节点类型，babel 就是通过这些节点来抽象源码中不同的部分。

## AST 可视化查看工具

当然，我们并不需要记什么内容对应什么 AST 节点，可以通过 axtexplorer.net 这个网站来直观的查看。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/t1UiaZAYaZ2oQ3AEMjfDx4UQKR58iaF1NgJybpXwsr4CowFT3jYXrxQLxnpQgROpN9icbBXiaj4G1zxpia17cHFbBOQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

这个网站可以查看代码 parse 以后的结果，但是如果想查看全部的 AST 可以在babel parser 仓库里的 AST 文档里查，或者直接去看 @babel/types 的 typescript 类型定义。

## AST 的公共属性

每种 AST 都有自己的属性，但是它们也有一些公共属性：

-   `type`：AST 节点的类型
    
-   `start、end、loc`：start 和 end 代表该节点对应的源码字符串的开始和结束下标，不区分行列。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束行列号。
    
-   `leadingComments、innerComments、trailingComments`：表示开始的注释、中间的注释、结尾的注释，因为每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，通过这三个属性来记录和 Comment 的关联。
    
-   `extra`：记录一些额外的信息，用于处理一些特殊情况。
    

## 总结

这一节我们学习了代码中常见的语法在 babel 的 AST 中对应的节点。

我们学习了：标识符 Identifer、各种字面量 xxLiteral、各种语句 xxStatement，各种声明语句 xxDeclaration，各种表达式 xxExpression，以及 Class、Modules、File、Program、Directive、Comment 这些 AST 节点。

了解了这些节点，就能知道平时写的代码是怎么用 AST 表示的，当然也不需要记，可以去文档或一些工具网站 (astexpoler.net) 去查。

AST 节点可能同时有多种类型，确定一种 AST 节点是什么类型主要看它的特点，比如 Statement 的特点是可以单独执行，Expression 的特点是有返回值，所以一些可以单独执行的 Expression 会包一层 ExpressionStatement 执行。

不同 AST 节点有不同的属性来存放各自对应的源码内容，但是都有一些公共属性如 type、xxComments、loc 等。

学会了 AST，就可以把对代码的操作转为对 AST 的操作了。
