> 自己懂，不是真的懂。能把别人教懂，才会真的会！

webpack 是一个非常强大和复杂的打包工具，它的强大在于它的插件机制。webpack 的插件机制中有两个非常重要的概念：compiler 和 Compilation。而查看这两个类，你会发现这两个类都继承于同一个基础类 —— tapable。

那到底是tapable 是什么强大的库呢？

查看[tapable](https://link.zhihu.com/?target=https%3A//github.com/webpack/tapable)库【本文的 tapable的版本为**2.0.0-beta.4**】，发现这个库导出了一堆的勾子函数，根据勾子的类型，可以分为以下三大类：

![](https://pic1.zhimg.com/v2-6ef05d76985d16993102eec3509a0be8_b.jpg)

这三类分别是 **同步型的hook（sync**），**异步型的hook（async）**，和**混合型（Mulit）**。

上图中第四个支线其实是tapable 库的核心功能类：hook, 和HookCodeFactory。因为tapable中导出的每一个hook都继承于这两个基础类。

> 这篇文章主要分析下tapable的 第—家族—sync勾子家族的**具体用法**

**首先官方正式介绍下**

-   **SyncHook**： 家族最普通的成员，只支持同步地注册函数，并在调用时依次执行。
-   **SyncBailHook**：有一定的特殊能力成员，支持同步地注册函数，并在调用时依次执行，但当注册在前面的函数有返回值(**非undefined**)时，后面注册的函数将被终止执行。支持先到的函数对后面的函数实行**封杀**。
-   **SyncLoopHook**：非普通成员，支持同步地注册函数，并在调用时依次执行，并支持循环执行。直至有返回值(**非undefined**)，则循环终止。
-   **SyncWaterfallHook**：非普通成员，支持同步地注册函数，并在调用时依次执行。并且前一个函数的返回值（注：函数默认有隐式的返回值 undefined）将作为后一个函数的参数。

## 实际例子

-   **SyncHook**

```
const { SyncHook } = require('tapable');
const syncHook = new SyncHook(['name']);

syncHook.tap('1', (name) => {
    console.log('Hello ', name);
});

syncHook.tap('2', (name) => {
    console.log('Welcome ', name);
});

syncHook.call('Alice');

// 结果当然也毫无悬念
Hello  Alice
Welcome  Alice
```

使用tapable也非常简单，还是**三步走**的策略：

-   **初始化**: new 一个SyncHook 的实例

```
const syncHook = new SyncHook(['name']);
```

⚠️：初始化的时候传入的参数（可以不传）是一个数组，并且数组的元素必须是 **字段串。**

**（原因待第二篇内部原理部分详细阐释 ）**

-   **注册**: 通过tap 注册监听函数

其中name 用于标示这个函数，fn就是监听的回调函数。

-   **调用**

通过调用实例上的call方法，依次传入参数。

## **总结**：

syncHook 勾子功能非常简单，就是一个发布/订阅模式。注册在实例上函数被依次的执行。

用代码示意如下：**[代码仅做示意，详解请见2]**

```
const q = new SyncHook([p1, p2, ...pn]);
q.tap('1', fn1);
q.tap('2', fn2);
// ...
q.call(c1, c2, ...cn);

// 最后的实际执行函数
(p1, p2, ...pn) => {
    fn1(p1, p2, ...pn);
    fn2(p1, p2, ...pn);
    // ...
}
```

-   **SyncBailHook**

```
const { SyncBailHook } = require('tapable');

const syncBailHook = new SyncBailHook([ 'nam1', 'nam2']);

syncBailHook.tap('1', (name) => {
    console.log('Hello ', name);
    return null;
});

syncBailHook.tap('2', (name) => {
    console.log('Welcome ', name);
    
});

syncBailHook.call('Alice');

// 结果
Hello Alice
```

例子与SyncHook非常类似， 值得注意的是 第一个监听函数最后返回了一个null ，非undefined , 则后面的函数不再执行。

## **总结**：

SyncBailHook在SyncHook的基础上增加了一层，对前面函数返回值的判断，相对于SyncHook 来说，SyncBailHook勾子让监听函数之间有了**前后承接的联系**。

用代码示意如下：**[代码仅做示意，详解请见2]**

```
const q = new SyncHook([p1, p2, ...pn]);
q.tap('1', fn1);
q.tap('2', fn2);
// ...
q.call(c1, c2, ...cn);

// 最后的实际执行函数
let result = true;
(p1, p2, ...pn) => {
    result =  f0(p1, p2, ...pn);
    for(var i = 1; i< fnList.length ; i++) {
         if (result !== undefined) {
            result =  fnList[i](p1, p2, ...pn);
         } else {
            break;
       }
    }
}
```

-   **SyncLoopHook**

**例子：**

```
const syncLoopHook = new SyncLoopHook([ 'nam1', 'nam2']);

let count1 = 1;
syncLoopHook.tap('1', (name) => {
    console.log('Hello ', name);
   while(count1 > 0) {
        --count1;
        return true;
    }
    return  // 这句写不写都一样
});

let count2 = 2;
syncLoopHook.tap('2', (name) => {
    console.log('Welcome ', name);
    while(count2 > 0) {
        --count2;
        return true;
    }
    return; // 这句写不写都一样 
});

syncLoopHook.call('Alice');

// 结果：
Hello  Alice
Hello  Alice
Welcome  Alice
Hello  Alice
Welcome  Alice
Hello  Alice
Welcome  Alice
```

这里的结果跟之前的两个勾子的结果有很大的不一样，借着官方介绍，我们来剖析下为何会得到这样的结果。

SyncLoopHook的定义是一旦遇到return值不为undefined时，就会停止循环，如果不是则会一直循环执行下去。

上面 的描述起来，有些抽象，我们打印出一些日志，来辅助说明下：

```
const { SyncLoopHook } = require('tapable');

const syncLoopHook = new SyncLoopHook([ 'nam1', 'nam2']);

let count1 = 1;
syncLoopHook.tap('1', (name) => {
    console.log('Hello ', name);
    console.log('count1: ', count1);
   while(count1 > 0) {
        --count1;
        return true;
    }
    return  // 这句写不写都一样
});

let count2 = 2;
syncLoopHook.tap('2', (name) => {
    console.log('Welcome ', name);
    console.log('count2: ', count2);
    while(count2 > 0) {
        --count2;
        return true;
    }
    return; // 这句写不写都一样 
});

syncLoopHook.call('Alice');

// 结果：
Hello  Alice
count1:  1
Hello  Alice
count1:  0
Welcome  Alice
count2:  2
Hello  Alice
count1:  0
Welcome  Alice
count2:  1
Hello  Alice
count1:  0
Welcome  Alice
count2:  0
```

在上面的例子中，我们会发现，当第一个函数返回值不为 undefined 时，会一直循环执行第一个函数，直至函数返回值为undefined为止。

如果日志还看不清的话，我们借助函数执行流转图再来说明下：

1）当第 1次执行Fn1的时候，发现返回值为true，则立即**触发循环机制**，形成一个最小的loop，再次执行Fn1。

2）第二次执行Fn1的返回值为undefined ，则按照顺序接下去执行Fn2。

3）第一次执行Fn2，返回值有效，则**触发循环机制**。再次开始执行Fn1。

4）第三次执行Fn1，返回值无效，按顺序执行Fn2

5) 第二次执行Fn2的时候，发现返回值仍然有效，再次**触发循环机制**。又一次执行Fn1.

6）第四次执行Fn1，返回值无效，按顺序执行Fn2

7）第二次执行Fn2的时候，发现返回值仍然无效，并且Fn2已经是最后一个函数，则结束函数执行。

![](https://pic3.zhimg.com/v2-3d799b2eba3769956e16401450b4ec42_b.jpg)

可以自己分析下下面的代码的执行结果，测试下是否有真正理解上面的循环过程：

```
const { SyncLoopHook } = require('tapable');

const syncLoopHook = new SyncLoopHook([ 'nam1', 'nam2']);

let count1 = 1;
syncLoopHook.tap('1', (name) => {
    console.log('Hello ', name);
   while(count1 > 0) {
        --count1;
        return true;
    }
    return  // 这句写不写都一样
});

let count2 = 1;
syncLoopHook.tap('2', (name) => {
    console.log('Welcome ', name);
    while(count2 > 0) {
        --count2;
        return true;
    }
    return; // 这句写不写都一样 
});

let count3 = 3;
syncLoopHook.tap('3', (name) => {
    console.log('Thank ', name);
    while(count3 > 0) {
        --count3;
        return true;
    }
    return; // 这句写不写都一样 
});

syncLoopHook.call('Alice');
```

**总结：**

SyncLoopHook与SyncBailHook 一样，都是对函数的返回值作出处理，不同于bail的阻断后面函数的执行，loop是从头开始循环执行。

⚠️：这里有三点需要注意下：

-   一旦得到返回值不为undefined, 则会立即触发循环机制，相当于会打断原有的顺序执行逻辑
-   循环执行的头总是 第一个函数
-   循环执行结束以后，监听函数列表还是会按照之前已有的顺序，接着往下执行。

用代码示意如下：**[代码仅做示意，详解请见2]**

```
const q = new SyncHook([p1, p2, ...pn]);
q.tap('1', fn1);
q.tap('2', fn2);
// ...
q.call(c1, c2, ...cn);

// 最后的实际执行函数

(p1, p2, ...pn) => {
    let result = true;
    let len = fnList.length;
    let = 0;
    while(i < len) {
       result = fnList[i](p1, p2, ...pn);
       if (result !== undefined) {
           i = 0;
       } else {
           i = i + 1;
       }
    }
}
```

-   **SyncWaterfallHook**

```
 const { SyncWaterfallHook } = require('tapable');

const syncWaterfallHook = new SyncWaterfallHook([ 'nam1', 'nam2']);

syncWaterfallHook.tap('1', (name) => {
    console.log('Hello ', name);
    return 2;
});

syncWaterfallHook.tap('2', (name) => {
    console.log('Welcome ', name);
});

syncWaterfallHook.tap('3', (name) => {
    console.log('Thank ', name);
    return 3;
});

syncWaterfallHook.tap('4', (name) => {
    console.log('Good for ', name);
});


syncWaterfallHook.call('Alice');

//  结果
Hello  Alice
Welcome  2
Thank  2
Good for  3
```

**总结：**

与SyncLoopHook、SyncBailHook 一样，SyncWaterfallHook 也是对函数的返回值作出处理。不同的是，SyncWaterfallHook（瀑布型hook）会将函数的返回值当成下一个函数的参数，形成了一个链式的调用，监听函数之间的以来关系最为密切。

⚠️这里同样有两点需要注意下：

-   瀑布流中的参数的初始值为 传入的参数值，如果没有参数值，则为undefined
-   瀑布流中的参数，只有当函数返回值有效（不为undefined）时，才会被替换。

用代码示意如下：**[代码仅做示意，详解请见2]**

```
const q = new SyncHook([p1, p2, ...pn]);
q.tap('1', fn1);
q.tap('2', fn2);
// ...
q.call(c1, c2, ...cn);

// 最后的实际执行函数

(p1, p2, ...pn) => {
    let args = [p1, p2, ...pn];
    let len = fnList.length;
    let = 0;
    while(i < len) {
       result = fnList[i](args);
       if (result !== undefined) {
           args = result;
       } 
       i = i + 1;
    }
}
```

## 最后总结

1）通过例子，我们可以发现tapable中的sync的hook最基础的功能就是顺序执行注册的监听函数。

2）函数的返回值是个非常重要的标志信息，bail 用它来判断后面的函数是否还需要执行。loop用它来判断，是否开启循环。waterfall型的hook 更是将它作为参数，传递给后面的函数，形成链式的调用。

sync家族的四位成员的具体用法，已经介绍完了。并且根据用法，大体猜测其内部的执行过程。tapable 内部究竟是怎么实现的呢？

请看下篇文章

## 参考

[webpack4.0源码分析之Tapable - 掘金juejin.im](https://link.zhihu.com/?target=https%3A//juejin.im/post/5abf33f16fb9a028e46ec352)[webpack/tapablegithub.com![图标](https://pic4.zhimg.com/v2-b3cbe05a99bbd53039fe6bb8ead786db_ipico.jpg)](https://link.zhihu.com/?target=https%3A//github.com/webpack/tapable)