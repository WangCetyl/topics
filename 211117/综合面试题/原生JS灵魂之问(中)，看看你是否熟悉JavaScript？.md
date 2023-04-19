---
created: 2021-08-16T11:05:50 (UTC +08:00)
tags: []
source: https://mp.weixin.qq.com/s/0Z8DpI2tA-LCwEXQkkZlVw
author: 神三元
---

# 原生JS灵魂之问(中)，看看你是否熟悉JavaScript？

> ## Excerpt
> 笔者最近在对原生JS的知识做系统梳理，因为我觉得JS作为前端工程师的根本技术，学再多遍都不为过。打算来做一个

---
笔者最近在对原生JS的知识做系统梳理，因为我觉得JS作为前端工程师的根本技术，学再多遍都不为过。打算来做一个系列，一共分三次发，以一系列的问题为驱动，当然也会有追问和扩展，内容系统且完整，对初中级选手会有很好的提升，高级选手也会得到复习和巩固。这是本系列的第二篇。

扫了一眼目录后，也许你可能会说：这些八百年都用不到的东西，我为什么要会?是，我承认真实业务场景中并不会要你手写一个splice, 手写深拷贝或者V8的数组排序，但我要说的是，问这些问题的初衷并不是让你拿到平时去用的，而是检验你对 `JS语言的理解`有没有到达那样的水准，有一些 `边界情况`是否能够考虑到，有没有基本的 `计算机素养`(比如最基本的排序方法到底理不理解)，未来有没有潜力去设计出更加优秀的产品或者框架。如果你仅仅是想通过一篇文章来解决业务中的临时问题，那不好意思，请出门左拐，这篇文章确实不适合你。但如果你觉得自己的原生编程能力还有待提高，想让自己的思维能力上一个台阶，希望我这篇"呕心沥血"整理了1w多字的文章能够让你有所成长。另外补充一句，本文并不针对面试，但以下任何一篇的内容放在面试中，都是非常惊艳的操作：）

## 第七篇: 函数的arguments为什么不是数组？如何转化成数组？

因为argument是一个对象，只不过它的属性从0开始排，依次为0，1，2...最后还有callee和length属性。我们也把这样的对象称为类数组。

常见的类数组还有：

1.  用getElementByTagName/ClassName/Name（）获得的HTMLCollection
    

1.  用querySlector获得的nodeList
    

那这导致很多数组的方法就不能用了，必要时需要我们将它们转换成数组，有哪些方法呢？

### 1. Array.prototype.slice.call()

1.  `function sum(a, b) {`
    
2.   `let args = Array.prototype.slice.call(arguments);`
    
3.   `console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦`
    
4.  `}`
    
5.  `sum(1, 2);//3`
    

### 2. Array.from()

1.  `function sum(a, b) {`
    
2.   `let args = Array.from(arguments);`
    
3.   `console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦`
    
4.  `}`
    
5.  `sum(1, 2);//3`
    

这种方法也可以用来转换Set和Map哦！

### 3. ES6展开运算符

1.  `function sum(a, b) {`
    
2.   `let args = [...arguments];`
    
3.   `console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦`
    
4.  `}`
    
5.  `sum(1, 2);//3`
    

### 4. 利用concat+apply

1.  `function sum(a, b) {`
    
2.   `let args = Array.prototype.concat.apply([], arguments);//apply方法会把第二个参数展开`
    
3.   `console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦`
    
4.  `}`
    
5.  `sum(1, 2);//3`
    

当然，最原始的方法就是再创建一个数组，用for循环把类数组的每个属性值放在里面，过于简单，就不浪费篇幅了。

## 第七篇: forEach中return有效果吗？如何中断forEach循环？

在forEach中用return不会返回，函数会继续执行。

1.  `let nums = [1, 2, 3];`
    
2.  `nums.forEach((item, index) => {`
    
3.   `return;//无效`
    
4.  `})`
    

中断方法：

1.  使用try监视代码块，在需要中断的地方抛出异常。
    
2.  官方推荐方法（替换方法）：用every和some替代forEach函数。every在碰到return false的时候，中止循环。some在碰到return ture的时候，中止循环
    

## 第八篇: JS判断数组中是否包含某个值

### 方法一：array.indexOf

> 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。

1.  `var arr=[1,2,3,4];`
    
2.  `var index=arr.indexOf(3);`
    
3.  `console.log(index);`
    

### 方法二：array.includes(searcElement[,fromIndex])

> 此方法判断数组中是否存在某个值，如果存在返回true，否则返回false

1.  `var arr=[1,2,3,4];`
    
2.  `if(arr.includes(3))`
    
3.   `console.log("存在");`
    
4.  `else`
    
5.   `console.log("不存在");`
    

### 方法三：array.find(callback[,thisArg])

> 返回数组中满足条件的**第一个元素的值**，如果没有，返回undefined

1.  `var arr=[1,2,3,4];`
    
2.  `var result = arr.find(item =>{`
    
3.   `return item > 3`
    
4.  `});`
    
5.  `console.log(result);`
    

### 方法四：array.findeIndex(callback[,thisArg])

> 返回数组中满足条件的第一个元素的下标，如果没有找到，返回 `-1`]

1.  `var arr=[1,2,3,4];`
    
2.  `var result = arr.findIndex(item =>{`
    
3.   `return item > 3`
    
4.  `});`
    
5.  `console.log(result);`
    

当然，for循环当然是没有问题的，这里讨论的是数组方法，就不再展开了。

## 第九篇: JS中flat---数组扁平化

对于前端项目开发过程中，偶尔会出现层叠数据结构的数组，我们需要将多层级数组转化为一级数组（即提取嵌套数组元素最终合并为一个数组），使其内容合并且展开。那么该如何去实现呢？

需求:多维数组=>一维数组

1.  `let ary = [1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]`
    
2.  `let str = JSON.stringify(ary);`
    

### 1. 调用ES6中的flat方法

1.  `ary = arr.flat(Infinity);`
    

### 2. replace + split

1.  `ary = str.replace(/(\[|\])/g, '').split(',')`
    

### 3. replace + JSON.parse

1.  `str = str.replace(/(\[|\]))/g, '');`
    
2.  `str = '[' + str + ']';`
    
3.  `ary = JSON.parse(str);`
    

### 4. 普通递归

1.  `let result = [];`
    
2.  `let fn = function(ary) {`
    
3.   `for(let i = 0; i < ary.length; i++) {`
    
4.   `let item = ary[i];`
    
5.   `if (Array.isArray(ary[i])){`
    
6.   `fn(item);`
    
7.   `} else {`
    
8.   `result.push(item);`
    
9.   `}`
    
10.   `}`
    
11.  `}`
    

### 5. 利用reduce函数迭代

1.  `function flatten(ary) {`
    
2.   `return ary.reduce((pre, cur) => {`
    
3.   `return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);`
    
4.   `}, []);`
    
5.  `}`
    
6.  `let ary = [1, 2, [3, 4], [5, [6, 7]]]`
    
7.  `console.log(flatten(ary))`
    

### 6：扩展运算符

1.  `//只要有一个元素有数组，那么循环继续`
    
2.  `while (ary.some(Array.isArray())) {`
    
3.   `ary = [].concat(...ary);`
    
4.  `}`
    

这是一个比较实用而且很容易被问到的问题，欢迎大家交流补充。

## 第十篇: JS数组的高阶函数——基础篇

### 1.什么是高阶函数

概念非常简单，如下:

> `一个函数`就可以接收另一个函数作为参数或者返回值为一个函数， `这种函数`就称之为高阶函数。

那对应到数组中有哪些方法呢？

### 2.数组中的高阶函数

#### 1.map

-   参数:接受两个参数，一个是回调函数，一个是回调函数的this值(可选)。
    

其中，回调函数被默认传入三个值，依次为当前元素、当前索引、整个数组。

-   创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
    
-   对原来的数组没有影响
    

1.  `let nums = [1, 2, 3];`
    
2.  `let obj = {val: 5};`
    
3.  `let newNums = nums.map(function(item,index,array) {`
    
4.   `return item + index + array[index] + this.val;` 
    
5.   `//对第一个元素，1 + 0 + 1 + 5 = 7`
    
6.   `//对第二个元素，2 + 1 + 2 + 5 = 10`
    
7.   `//对第三个元素，3 + 2 + 3 + 5 = 13`
    
8.  `}, obj);`
    
9.  `console.log(newNums);//[7, 10, 13]`
    

当然，后面的参数都是可选的 ，不用的话可以省略。

#### 2. reduce

-   参数: 接收两个参数，一个为回调函数，另一个为初始值。回调函数中三个默认参数，依次为积累值、当前值、整个数组。
    

1.  `let nums = [1, 2, 3];`
    
2.  `// 多个数的加和`
    
3.  `let newNums = nums.reduce(function(preSum,curVal,array) {`
    
4.   `return preSum + curVal;` 
    
5.  `}, 0);`
    
6.  `console.log(newNums);//6`
    

不传默认值会怎样？

不传默认值会自动以第一个元素为初始值，然后从第二个元素开始依次累计。

#### 3. filter

参数: 一个函数参数。这个函数接受一个默认参数，就是当前元素。这个作为参数的函数返回值为一个布尔类型，决定元素是否保留。

filter方法返回值为一个新的数组，这个数组里面包含参数里面所有被保留的项。

1.  `let nums = [1, 2, 3];`
    
2.  `// 保留奇数项`
    
3.  `let oddNums = nums.filter(item => item % 2);`
    
4.  `console.log(oddNums);`
    

#### 4. sort

参数: 一个用于比较的函数，它有两个默认参数，分别是代表比较的两个元素。

举个例子:

1.  `let nums = [2, 3, 1];`
    
2.  `//两个比较的元素分别为a, b`
    
3.  `nums.sort(function(a, b) {`
    
4.   `if(a > b) return 1;`
    
5.   `else if(a < b) return -1;`
    
6.   `else if(a == b) return 0;`
    
7.  `})`
    

当比较函数返回值大于0，则 a 在 b 的后面，即a的下标应该比b大。

反之，则 a 在 b 的后面，即 a 的下标比 b 小。

整个过程就完成了一次升序的排列。

当然还有一个需要注意的情况，就是比较函数不传的时候，是如何进行排序的？

> 答案是将数字转换为字符串，然后根据字母unicode值进行升序排序，也就是根据字符串的比较规则进行升序排序。

## 第十一篇: 能不能手动实现数组的map方法 ?

依照 ecma262 草案，实现的map的规范如下:

下面根据草案的规定一步步来模拟实现map函数:

1.  `Array.prototype.map = function(callbackFn, thisArg) {`
    
2.   `// 处理数组类型异常`
    
3.   `if (this === null || this === undefined) {`
    
4.   `throw new TypeError("Cannot read property 'map' of null or undefined");`
    
5.   `}`
    
6.   `// 处理回调类型异常`
    
7.   `if (Object.prototype.toString.call(callbackfn) != "[object Function]") {`
    
8.   `throw new TypeError(callbackfn + ' is not a function')`
    
9.   `}`
    
10.   `// 草案中提到要先转换为对象`
    
11.   `let O = Object(this);`
    
12.   `let T = thisArg;`
    

15.   `let len = O.length >>> 0;`
    
16.   `let A = new Array(len);`
    
17.   `for(let k = 0; k < len; k++) {`
    
18.   `// 还记得原型链那一节提到的 in 吗？in 表示在原型链查找`
    
19.   `// 如果用 hasOwnProperty 是有问题的，它只能找私有属性`
    
20.   `if (k in O) {`
    
21.   `let kValue = O[k];`
    
22.   `// 依次传入this, 当前项，当前索引，整个数组`
    
23.   `let mappedValue = callbackfn.call(T, KValue, k, O);`
    
24.   `A[k] = mappedValue;`
    
25.   `}`
    
26.   `}`
    
27.   `return A;`
    
28.  `}`
    

这里解释一下, length >>> 0, 字面意思是指"右移 0 位"，但实际上是把前面的空位用0填充，这里的作用是保证len为数字且为整数。

举几个特例：

1.  `null >>> 0 //0`
    

3.  `undefined >>> 0 //0`
    

5.  `void(0) >>> 0 //0`
    

7.  `function a (){}; a >>> 0 //0`
    

9.  `[] >>> 0 //0`
    

11.  `var a = {}; a >>> 0 //0`
    

13.  `123123 >>> 0 //123123`
    

15.  `45.2 >>> 0 //45`
    

17.  `0 >>> 0 //0`
    

19.  `-0 >>> 0 //0`
    

21.  `-1 >>> 0 //4294967295`
    

23.  `-1212 >>> 0 //4294966084`
    

总体实现起来并没那么难，需要注意的就是使用 in 来进行原型链查找。同时，如果没有找到就不处理，能有效处理稀疏数组的情况。

最后给大家奉上V8源码，参照源码检查一下，其实还是实现得很完整了。

1.  `function ArrayMap(f, receiver) {`
    
2.   `CHECK_OBJECT_COERCIBLE(this, "Array.prototype.map");`
    

4.   `// Pull out the length so that modifications to the length in the`
    
5.   `// loop will not affect the looping and side effects are visible.`
    
6.   `var array = TO_OBJECT(this);`
    
7.   `var length = TO_LENGTH(array.length);`
    
8.   `if (!IS_CALLABLE(f)) throw %make_type_error(kCalledNonCallable, f);`
    
9.   `var result = ArraySpeciesCreate(array, length);`
    
10.   `for (var i = 0; i < length; i++) {`
    
11.   `if (i in array) {`
    
12.   `var element = array[i];`
    
13.   `%CreateDataProperty(result, i, %_Call(f, receiver, element, i, array));`
    
14.   `}`
    
15.   `}`
    
16.   `return result;`
    
17.  `}`
    

参考:

V8源码

Array 原型方法源码实现大揭秘

ecma262草案

## 第十二篇: 能不能手动实现数组的reduce方法 ?

依照 ecma262 草案，实现的reduce的规范如下:

其中有几个核心要点:

1、初始值不传怎么处理

2、回调函数的参数有哪些，返回值如何处理。

1.  `Array.prototype.reduce = function(callbackfn, initialValue) {`
    
2.   `// 异常处理，和 map 一样`
    
3.   `// 处理数组类型异常`
    
4.   `if (this === null || this === undefined) {`
    
5.   `throw new TypeError("Cannot read property 'reduce' of null or undefined");`
    
6.   `}`
    
7.   `// 处理回调类型异常`
    
8.   `if (Object.prototype.toString.call(callbackfn) != "[object Function]") {`
    
9.   `throw new TypeError(callbackfn + ' is not a function')`
    
10.   `}`
    
11.   `let O = Object(this);`
    
12.   `let len = O.length >>> 0;`
    
13.   `let k = 0;`
    
14.   `let accumulator = initialValue;`
    
15.   `if (accumulator === undefined) {`
    
16.   `for(; k < len ; k++) {`
    
17.   `// 查找原型链`
    
18.   `if (k in O) {`
    
19.   `accumulator = O[k];`
    
20.   `k++;`
    
21.   `break;`
    
22.   `}`
    
23.   `}`
    
24.   `// 循环结束还没退出，就表示数组全为空`
    
25.   `throw new Error('Each element of the array is empty');`
    
26.   `}`
    
27.   `for(;k < len; k++) {`
    
28.   `if (k in O) {`
    
29.   `// 注意，核心！`
    
30.   `accumulator = callbackfn.call(undefined, accumulator, O[k], O);`
    
31.   `}`
    
32.   `}`
    
33.   `return accumulator;`
    
34.  `}`
    

其实是从最后一项开始遍历，通过原型链查找跳过空项。

最后给大家奉上V8源码，以供大家检查:

1.  `function ArrayReduce(callback, current) {`
    
2.   `CHECK_OBJECT_COERCIBLE(this, "Array.prototype.reduce");`
    

4.   `// Pull out the length so that modifications to the length in the`
    
5.   `// loop will not affect the looping and side effects are visible.`
    
6.   `var array = TO_OBJECT(this);`
    
7.   `var length = TO_LENGTH(array.length);`
    
8.   `return InnerArrayReduce(callback, current, array, length,`
    
9.   `arguments.length);`
    
10.  `}`
    

12.  `function InnerArrayReduce(callback, current, array, length, argumentsLength) {`
    
13.   `if (!IS_CALLABLE(callback)) {`
    
14.   `throw %make_type_error(kCalledNonCallable, callback);`
    
15.   `}`
    

17.   `var i = 0;`
    
18.   `find_initial: if (argumentsLength < 2) {`
    
19.   `for (; i < length; i++) {`
    
20.   `if (i in array) {`
    
21.   `current = array[i++];`
    
22.   `break find_initial;`
    
23.   `}`
    
24.   `}`
    
25.   `throw %make_type_error(kReduceNoInitial);`
    
26.   `}`
    

28.   `for (; i < length; i++) {`
    
29.   `if (i in array) {`
    
30.   `var element = array[i];`
    
31.   `current = callback(current, element, i, array);`
    
32.   `}`
    
33.   `}`
    
34.   `return current;`
    
35.  `}`
    

参考:

V8源码

ecma262草案

## 第十三篇: 能不能手动实现数组的 push、pop 方法 ?

参照 ecma262 草案的规定，关于 push 和 pop 的规范如下图所示:

首先来实现一下 push 方法:

1.  `Array.prototype.push = function(...items) {`
    
2.   `let O = Object(this);`
    
3.   `let len = this.length >>> 0;`
    
4.   `let argCount = items.length >>> 0;`
    
5.   `// 2 ** 53 - 1 为JS能表示的最大正整数`
    
6.   `if (len + argCount > 2 ** 53 - 1) {`
    
7.   `throw new TypeError("The number of array is over the max value restricted!")`
    
8.   `}`
    
9.   `for(let i = 0; i < argCount; i++) {`
    
10.   `O[len + i] = items[i];`
    
11.   `}`
    
12.   `let newLength = len + argCount;`
    
13.   `O.length = newLength;`
    
14.   `return newLength;`
    
15.  `}`
    

亲测已通过MDN上所有测试用例。MDN链接

然后来实现 pop 方法:

1.  `Array.prototype.pop = function() {`
    
2.   `let O = Object(this);`
    
3.   `let len = this.length >>> 0;`
    
4.   `if (len === 0) {`
    
5.   `O.length = 0;`
    
6.   `return undefined;`
    
7.   `}`
    
8.   `len --;`
    
9.   `let value = O[len];`
    
10.   `delete O[len];`
    
11.   `O.length = len;`
    
12.   `return value;`
    
13.  `}`
    

亲测已通过MDN上所有测试用例。MDN链接

参考链接:

V8数组源码

ecma262规范草案

MDN文档

## 第十四篇: 能不能手动实现数组的 filter 方法 ?

代码如下:

1.  `Array.prototype.filter = function(callbackfn, thisArg) {`
    
2.   `// 处理数组类型异常`
    
3.   `if (this === null || this === undefined) {`
    
4.   `throw new TypeError("Cannot read property 'filter' of null or undefined");`
    
5.   `}`
    
6.   `// 处理回调类型异常`
    
7.   `if (Object.prototype.toString.call(callbackfn) != "[object Function]") {`
    
8.   `throw new TypeError(callbackfn + ' is not a function')`
    
9.   `}`
    
10.   `let O = Object(this);`
    
11.   `let len = O.length >>> 0;`
    
12.   `let resLen = 0;`
    
13.   `let res = [];`
    
14.   `for(let i = 0; i < len; i++) {`
    
15.   `if (i in O) {`
    
16.   `let element = O[i];`
    
17.   `if (callbackfn.call(thisArg, O[i], i, O)) {`
    
18.   `res[resLen++] = element;`
    
19.   `}`
    
20.   `}`
    
21.   `}`
    
22.   `return res;`
    
23.  `}`
    

MDN上所有测试用例亲测通过。

参考:

V8数组部分源码第1025行

MDN中filter文档

## 第十五篇: 能不能手动实现数组的splice方法 ?

splice 可以说是最受欢迎的数组方法之一，api 灵活，使用方便。现在来梳理一下用法:

1.  splice(position, count) 表示从 position 索引的位置开始，删除count个元素
    

1.  splice(position, 0, ele1, ele2, ...) 表示从 position 索引的元素后面插入一系列的元素
    

1.  splice(postion, count, ele1, ele2, ...) 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素
    

1.  返回值为 `被删除元素`组成的 `数组`。
    

接下来我们实现这个方法。

参照ecma262草案的规定，详情请点击。

首先我们梳理一下实现的思路。

### 初步实现

1.  `Array.prototype.splice = function(startIndex, deleteCount, ...addElements) {`
    
2.   `let argumentsLen = arguments.length;`
    
3.   `let array = Object(this);`
    
4.   `let len = array.length;`
    
5.   `let deleteArr = new Array(deleteCount);`
    

7.   `// 拷贝删除的元素`
    
8.   `sliceDeleteElements(array, startIndex, deleteCount, deleteArr);`
    
9.   `// 移动删除元素后面的元素`
    
10.   `movePostElements(array, startIndex, len, deleteCount, addElements);`
    
11.   `// 插入新元素`
    
12.   `for (let i = 0; i < addElements.length; i++) {`
    
13.   `array[startIndex + i] = addElements[i];`
    
14.   `}`
    
15.   `array.length = len - deleteCount + addElements.length;`
    
16.   `return deleteArr;`
    
17.  `}`
    

先拷贝删除的元素，如下所示:

1.  `const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {`
    
2.   `for (let i = 0; i < deleteCount; i++) {`
    
3.   `let index = startIndex + i;`
    
4.   `if (index in array) {`
    
5.   `let current = array[index];`
    
6.   `deleteArr[i] = current;`
    
7.   `}`
    
8.   `}`
    
9.  `};`
    

然后对删除元素后面的元素进行挪动, 挪动分为三种情况:

1.  添加的元素和删除的元素个数相等
    
2.  添加的元素个数小于删除的元素
    
3.  添加的元素个数大于删除的元素
    

当两者相等时，

1.  `const movePostElements = (array, startIndex, len, deleteCount, addElements) => {`
    
2.   `if (deleteCount === addElements.length) return;`
    
3.  `}`
    

当添加的元素个数小于删除的元素时, 如图所示:

1.  `const movePostElements = (array, startIndex, len, deleteCount, addElements) => {`
    
2.   `//...`
    
3.   `// 如果添加的元素和删除的元素个数不相等，则移动后面的元素`
    
4.   `if(deleteCount > addElements.length) {`
    
5.   `// 删除的元素比新增的元素多，那么后面的元素整体向前挪动`
    
6.   `// 一共需要挪动 len - startIndex - deleteCount 个元素`
    
7.   `for (let i = startIndex + deleteCount; i < len; i++) {`
    
8.   `let fromIndex = i;`
    
9.   `// 将要挪动到的目标位置`
    
10.   `let toIndex = i - (deleteCount - addElements.length);`
    
11.   `if (fromIndex in array) {`
    
12.   `array[toIndex] = array[fromIndex];`
    
13.   `} else {`
    
14.   `delete array[toIndex];`
    
15.   `}`
    
16.   `}`
    
17.   `// 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素`
    
18.   `// 目前长度为 len + addElements - deleteCount`
    
19.   `for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {`
    
20.   `delete array[i];`
    
21.   `}`
    
22.   `}` 
    
23.  `};`
    

当添加的元素个数大于删除的元素时, 如图所示:

1.  `const movePostElements = (array, startIndex, len, deleteCount, addElements) => {`
    
2.   `//...`
    
3.   `if(deleteCount < addElements.length) {`
    
4.   `// 删除的元素比新增的元素少，那么后面的元素整体向后挪动`
    
5.   `// 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？`
    
6.   `for (let i = len - 1; i >= startIndex + deleteCount; i--) {`
    
7.   `let fromIndex = i;`
    
8.   `// 将要挪动到的目标位置`
    
9.   `let toIndex = i + (addElements.length - deleteCount);`
    
10.   `if (fromIndex in array) {`
    
11.   `array[toIndex] = array[fromIndex];`
    
12.   `} else {`
    
13.   `delete array[toIndex];`
    
14.   `}`
    
15.   `}`
    
16.   `}`
    
17.  `};`
    

### 优化一: 参数的边界情况

当用户传来非法的 startIndex 和 deleteCount 或者负索引的时候，需要我们做出特殊的处理。

1.  `const computeStartIndex = (startIndex, len) => {`
    
2.   `// 处理索引负数的情况`
    
3.   `if (startIndex < 0) {`
    
4.   `return startIndex + len > 0 ? startIndex + len: 0;`
    
5.   `}` 
    
6.   `return startIndex >= len ? len: startIndex;`
    
7.  `}`
    

9.  `const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {`
    
10.   `// 删除数目没有传，默认删除startIndex及后面所有的`
    
11.   `if (argumentsLen === 1)` 
    
12.   `return len - startIndex;`
    
13.   `// 删除数目过小`
    
14.   `if (deleteCount < 0)` 
    
15.   `return 0;`
    
16.   `// 删除数目过大`
    
17.   `if (deleteCount > len - deleteCount)` 
    
18.   `return len - startIndex;`
    
19.   `return deleteCount;`
    
20.  `}`
    

22.  `Array.prototype.splice = function (startIndex, deleteCount, ...addElements) {`
    
23.   `//,...`
    
24.   `let deleteArr = new Array(deleteCount);`
    

26.   `// 下面参数的清洗工作`
    
27.   `startIndex = computeStartIndex(startIndex, len);`
    
28.   `deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);`
    

30.   `// 拷贝删除的元素`
    
31.   `sliceDeleteElements(array, startIndex, deleteCount, deleteArr);`
    
32.   `//...`
    
33.  `}`
    

### 优化二: 数组为密封对象或冻结对象

什么是密封对象?

> 密封对象是不可扩展的对象，而且已有成员的[[Configurable]]属性被设置为false，这意味着不能添加、删除方法和属性。但是属性值是可以修改的。

什么是冻结对象？

> 冻结对象是最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值。

接下来，我们来把这两种情况一一排除。

1.  `// 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象`
    
2.  `if (Object.isSealed(array) && deleteCount !== addElements.length) {`
    
3.   `throw new TypeError('the object is a sealed object!')`
    
4.  `} else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {`
    
5.   `throw new TypeError('the object is a frozen object!')`
    
6.  `}`
    

好了，现在就写了一个比较完整的splice，如下:

1.  `const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {`
    
2.   `for (let i = 0; i < deleteCount; i++) {`
    
3.   `let index = startIndex + i;`
    
4.   `if (index in array) {`
    
5.   `let current = array[index];`
    
6.   `deleteArr[i] = current;`
    
7.   `}`
    
8.   `}`
    
9.  `};`
    

11.  `const movePostElements = (array, startIndex, len, deleteCount, addElements) => {`
    
12.   `// 如果添加的元素和删除的元素个数相等，相当于元素的替换，数组长度不变，被删除元素后面的元素不需要挪动`
    
13.   `if (deleteCount === addElements.length) return;`
    
14.   `// 如果添加的元素和删除的元素个数不相等，则移动后面的元素`
    
15.   `else if(deleteCount > addElements.length) {`
    
16.   `// 删除的元素比新增的元素多，那么后面的元素整体向前挪动`
    
17.   `// 一共需要挪动 len - startIndex - deleteCount 个元素`
    
18.   `for (let i = startIndex + deleteCount; i < len; i++) {`
    
19.   `let fromIndex = i;`
    
20.   `// 将要挪动到的目标位置`
    
21.   `let toIndex = i - (deleteCount - addElements.length);`
    
22.   `if (fromIndex in array) {`
    
23.   `array[toIndex] = array[fromIndex];`
    
24.   `} else {`
    
25.   `delete array[toIndex];`
    
26.   `}`
    
27.   `}`
    
28.   `// 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素`
    
29.   `// 目前长度为 len + addElements - deleteCount`
    
30.   `for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {`
    
31.   `delete array[i];`
    
32.   `}`
    
33.   `} else if(deleteCount < addElements.length) {`
    
34.   `// 删除的元素比新增的元素少，那么后面的元素整体向后挪动`
    
35.   `// 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？`
    
36.   `for (let i = len - 1; i >= startIndex + deleteCount; i--) {`
    
37.   `let fromIndex = i;`
    
38.   `// 将要挪动到的目标位置`
    
39.   `let toIndex = i + (addElements.length - deleteCount);`
    
40.   `if (fromIndex in array) {`
    
41.   `array[toIndex] = array[fromIndex];`
    
42.   `} else {`
    
43.   `delete array[toIndex];`
    
44.   `}`
    
45.   `}`
    
46.   `}`
    
47.  `};`
    

49.  `const computeStartIndex = (startIndex, len) => {`
    
50.   `// 处理索引负数的情况`
    
51.   `if (startIndex < 0) {`
    
52.   `return startIndex + len > 0 ? startIndex + len: 0;`
    
53.   `}` 
    
54.   `return startIndex >= len ? len: startIndex;`
    
55.  `}`
    

57.  `const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {`
    
58.   `// 删除数目没有传，默认删除startIndex及后面所有的`
    
59.   `if (argumentsLen === 1)` 
    
60.   `return len - startIndex;`
    
61.   `// 删除数目过小`
    
62.   `if (deleteCount < 0)` 
    
63.   `return 0;`
    
64.   `// 删除数目过大`
    
65.   `if (deleteCount > len - deleteCount)` 
    
66.   `return len - startIndex;`
    
67.   `return deleteCount;`
    
68.  `}`
    

70.  `Array.prototype.splice = function(startIndex, deleteCount, ...addElements) {`
    
71.   `let argumentsLen = arguments.length;`
    
72.   `let array = Object(this);`
    
73.   `let len = array.length >>> 0;`
    
74.   `let deleteArr = new Array(deleteCount);`
    

76.   `startIndex = computeStartIndex(startIndex, len);`
    
77.   `deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);`
    

79.   `// 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象`
    
80.   `if (Object.isSealed(array) && deleteCount !== addElements.length) {`
    
81.   `throw new TypeError('the object is a sealed object!')`
    
82.   `} else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {`
    
83.   `throw new TypeError('the object is a frozen object!')`
    
84.   `}`
    

86.   `// 拷贝删除的元素`
    
87.   `sliceDeleteElements(array, startIndex, deleteCount, deleteArr);`
    
88.   `// 移动删除元素后面的元素`
    
89.   `movePostElements(array, startIndex, len, deleteCount, addElements);`
    

91.   `// 插入新元素`
    
92.   `for (let i = 0; i < addElements.length; i++) {`
    
93.   `array[startIndex + i] = addElements[i];`
    
94.   `}`
    

96.   `array.length = len - deleteCount + addElements.length;`
    

98.   `return deleteArr;`
    
99.  `}`
    

以上代码对照MDN文档中的所有测试用例亲测通过。

相关测试代码请前往: 传送门

最后给大家奉上V8源码，供大家检查：V8数组 splice 源码第 660 行

## 第十六篇: 能不能实现数组的 sort 方法？

估计大家对 JS 数组的sort 方法已经不陌生了，之前也对它的用法做了详细的总结。那，它的内部是如何来实现的呢？如果说我们能够进入它的内部去看一看， 理解背后的设计，会使我们的思维和素养得到不错的提升。

sort 方法在 V8 内部相对与其他方法而言是一个比较高深的算法，对于很多边界情况做了反复的优化，但是这里我们不会直接拿源码来干讲。我们会来根据源码的思路，实现一个 跟引擎性能**一样**的排序算法，并且一步步拆解其中的奥秘。

### V8 引擎的思路分析

首先大概梳理一下源码中排序的思路:

设要排序的元素个数是n：

-   当 n <= 10 时，采用 `插入排序`
    
-   当 n > 10 时，采用 `三路快速排序`
    
-   10 < n <= 1000, 采用中位数作为哨兵元素
    
-   n > 1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数
    

在动手之前，我觉得我们有必要**为什么**这么做搞清楚。

第一、为什么元素个数少的时候要采用插入排序？

虽然 `插入排序`理论上说是O(n^2)的算法， `快速排序`是一个O(nlogn)级别的算法。但是别忘了，这只是理论上的估算，在实际情况中两者的算法复杂度前面都会有一个系数的， 当 n 足够小的时候，快速排序 `nlogn`的优势会越来越小，倘若插入排序O(n^2)前面的系数足够小，那么就会超过快排。而事实上正是如此， `插入排序`经过优化以后对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。

因此，对于很小的数据量，应用 `插入排序`是一个非常不错的选择。

第二、为什么要花这么大的力气选择哨兵元素？

因为 `快速排序`的性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者最大元素，那么进行partition(一边是小于哨兵的元素，另一边是大于哨兵的元素)时，就会有一边是空的，那么这么排下去，递归的层数就达到了n, 而每一层的复杂度是O(n)，因此快排这时候会退化成O(n^2)级别。

这种情况是要尽力避免的！如果来避免？

就是让哨兵元素进可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你就能理解 V8 里面所做的种种优化了。

接下来，我们来一步步实现的这样的官方排序算法。

### 插入排序及优化

最初的插入排序可能是这样写的:

1.  `const insertSort = (arr, start = 0, end) => {`
    
2.   `end = end || arr.length;`
    
3.   `for(let i = start; i < end; i++) {`
    
4.   `let j;`
    
5.   `for(j = i; j > start && arr[j - 1] > arr[j]; j --) {`
    
6.   `let temp = arr[j];`
    
7.   `arr[j] = arr[j - 1];`
    
8.   `arr[j - 1] = temp;`
    
9.   `}`
    
10.   `}`
    
11.   `return;`
    
12.  `}`
    

看似可以正确的完成排序，但实际上交换元素会有相当大的性能消耗，我们完全可以用变量覆盖的方式来完成，优化后代码如下:

1.  `const insertSort = (arr, start = 0, end) => {`
    
2.   `end = end || arr.length;`
    
3.   `for(let i = start; i < end; i++) {`
    
4.   `let e = arr[i];`
    
5.   `let j;`
    
6.   `for(j = i; j > start && arr[j - 1] > e; j --)`
    
7.   `arr[j] = arr[j-1];`
    
8.   `arr[j] = e;`
    
9.   `}`
    
10.   `return;`
    
11.  `}`
    

接下来正式进入到 sort 方法。

### 寻找哨兵元素

sort的骨架大致如下:

1.  `Array.prototype.sort = (comparefn) => {`
    
2.   `let array = Object(this);`
    
3.   `let length = array.length >>> 0;`
    
4.   `return InnerArraySort(array, length, comparefn);`
    
5.  `}`
    

7.  `const InnerArraySort = (array, length, comparefn) => {`
    
8.   `// 比较函数未传入`
    
9.   `if (Object.prototype.toString.call(callbackfn) !== "[object Function]") {`
    
10.   `comparefn = function (x, y) {`
    
11.   `if (x === y) return 0;`
    
12.   `x = x.toString();`
    
13.   `y = y.toString();`
    
14.   `if (x == y) return 0;`
    
15.   `else return x < y ? -1 : 1;`
    
16.   `};`
    
17.   `}`
    
18.   `const insertSort = () => {`
    
19.   `//...`
    
20.   `}`
    
21.   `const getThirdIndex = (a, from, to) => {`
    
22.   `// 元素个数大于1000时寻找哨兵元素`
    
23.   `}`
    
24.   `const quickSort = (a, from, to) => {`
    
25.   `//哨兵位置`
    
26.   `let thirdIndex = 0;`
    
27.   `while(true) {`
    
28.   `if(to - from <= 10) {`
    
29.   `insertSort(a, from, to);`
    
30.   `return;`
    
31.   `}`
    
32.   `if(to - from > 1000) {`
    
33.   `thirdIndex = getThirdIndex(a, from , to);`
    
34.   `}else {`
    
35.   `// 小于1000 直接取中点`
    
36.   `thirdIndex = from + ((to - from) >> 2);`
    
37.   `}`
    
38.   `}`
    
39.   `//下面开始快排`
    
40.   `}`
    
41.  `}`
    

我们先来把求取哨兵位置的代码实现一下:

1.  `const getThirdIndex = (a, from, to) => {`
    
2.   `let tmpArr = [];`
    
3.   `// 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的`
    
4.   `let increment = 200 + ((to - from) & 15);`
    
5.   `let j = 0;`
    
6.   `from += 1;`
    
7.   `to -= 1;`
    
8.   `for (let i = from; i < to; i += increment) {`
    
9.   `tmpArr[j] = [i, a[i]];`
    
10.   `j++;`
    
11.   `}`
    
12.   `// 把临时数组排序，取中间的值，确保哨兵的值接近平均位置`
    
13.   `tmpArr.sort(function(a, b) {`
    
14.   `return comparefn(a[1], b[1]);`
    
15.   `});`
    
16.   `let thirdIndex = tmpArr[tmpArr.length >> 1][0];`
    
17.   `return thirdIndex;`
    
18.  `}`
    

### 完成快排

接下来我们来完成快排的具体代码：

1.  `const _sort = (a, b, c) => {`
    
2.   `let arr = [a, b, c];`
    
3.   `insertSort(arr, 0, 3);`
    
4.   `return arr;`
    
5.  `}`
    

7.  `const quickSort = (a, from, to) => {`
    
8.   `//...`
    
9.   `// 上面我们拿到了thirdIndex`
    
10.   `// 现在我们拥有三个元素，from, thirdIndex, to`
    
11.   `// 为了再次确保 thirdIndex 不是最值，把这三个值排序`
    
12.   `[a[from], a[thirdIndex], a[to - 1]] = _sort(a[from], a[thirdIndex], a[to - 1]);`
    
13.   `// 现在正式把 thirdIndex 作为哨兵`
    
14.   `let pivot = a[thirdIndex];`
    
15.   `[a[from], a[thirdIndex]] = [a[thirdIndex], a[from]];`
    
16.   `// 正式进入快排`
    
17.   `let lowEnd = from + 1;`
    
18.   `let highStart = to - 1;`
    
19.   `a[thirdIndex] = a[lowEnd];`
    
20.   `a[lowEnd] = pivot;`
    
21.   `// [lowEnd, i)的元素是和pivot相等的`
    
22.   `// [i, highStart) 的元素是需要处理的`
    
23.   `for(let i = lowEnd + 1; i < highStart; i++) {`
    
24.   `let element = a[i];`
    
25.   `let order = comparefn(element, pivot);`
    
26.   `if (order < 0) {`
    
27.   `a[i] = a[lowEnd];`
    
28.   `a[lowEnd] = element;`
    
29.   `lowEnd++;`
    
30.   `} else if(order > 0) {`
    
31.   `do{`
    
32.   `highStart--;`
    
33.   `if(highStart === i) break;`
    
34.   `order = comparefn(a[highStart], pivot);`
    
35.   `}while(order > 0)`
    
36.   `// 现在 a[highStart] <= pivot`
    
37.   `// a[i] > pivot`
    
38.   `// 两者交换`
    
39.   `a[i] = a[highStart];`
    
40.   `a[highStart] = element;`
    
41.   `if(order < 0) {`
    
42.   `// a[i] 和 a[lowEnd] 交换`
    
43.   `element = a[i];`
    
44.   `a[i] = a[lowEnd];`
    
45.   `a[lowEnd] = element;`
    
46.   `lowEnd++;`
    
47.   `}`
    
48.   `}`
    
49.   `}`
    
50.   `// 永远切分大区间`
    
51.   `if (lowEnd - from > to - highStart) {`
    
52.   `// 继续切分lowEnd ~ from 这个区间`
    
53.   `to = lowEnd;`
    
54.   `// 单独处理小区间`
    
55.   `quickSort(a, highStart, to);`
    
56.   `} else if(lowEnd - from <= to - highStart) {`
    
57.   `from = highStart;`
    
58.   `quickSort(a, from, lowEnd);`
    
59.   `}`
    
60.  `}`
    

### 测试结果

测试结果如下:

一万条数据:

十万条数据:

一百万条数据:

一千万条数据:

结果仅供大家参考，因为不同的node版本对于部分细节的实现可能不一样，我现在的版本是v10.15。

从结果可以看到，目前版本的 node 对于有序程度较高的数据是处理的不够好的，而我们刚刚实现的排序通过反复确定哨兵的位置就能 有效的规避快排在这一场景下的劣势。

最后给大家完整版的sort代码:

1.  `const sort = (arr, comparefn) => {`
    
2.   `let array = Object(arr);`
    
3.   `let length = array.length >>> 0;`
    
4.   `return InnerArraySort(array, length, comparefn);`
    
5.  `}`
    

7.  `const InnerArraySort = (array, length, comparefn) => {`
    
8.   `// 比较函数未传入`
    
9.   `if (Object.prototype.toString.call(comparefn) !== "[object Function]") {`
    
10.   `comparefn = function (x, y) {`
    
11.   `if (x === y) return 0;`
    
12.   `x = x.toString();`
    
13.   `y = y.toString();`
    
14.   `if (x == y) return 0;`
    
15.   `else return x < y ? -1 : 1;`
    
16.   `};`
    
17.   `}`
    
18.   `const insertSort = (arr, start = 0, end) => {`
    
19.   `end = end || arr.length;`
    
20.   `for (let i = start; i < end; i++) {`
    
21.   `let e = arr[i];`
    
22.   `let j;`
    
23.   `for (j = i; j > start && comparefn(arr[j - 1], e) > 0; j--)`
    
24.   `arr[j] = arr[j - 1];`
    
25.   `arr[j] = e;`
    
26.   `}`
    
27.   `return;`
    
28.   `}`
    
29.   `const getThirdIndex = (a, from, to) => {`
    
30.   `let tmpArr = [];`
    
31.   `// 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的`
    
32.   `let increment = 200 + ((to - from) & 15);`
    
33.   `let j = 0;`
    
34.   `from += 1;`
    
35.   `to -= 1;`
    
36.   `for (let i = from; i < to; i += increment) {`
    
37.   `tmpArr[j] = [i, a[i]];`
    
38.   `j++;`
    
39.   `}`
    
40.   `// 把临时数组排序，取中间的值，确保哨兵的值接近平均位置`
    
41.   `tmpArr.sort(function (a, b) {`
    
42.   `return comparefn(a[1], b[1]);`
    
43.   `});`
    
44.   `let thirdIndex = tmpArr[tmpArr.length >> 1][0];`
    
45.   `return thirdIndex;`
    
46.   `};`
    

48.   `const _sort = (a, b, c) => {`
    
49.   `let arr = [];`
    
50.   `arr.push(a, b, c);`
    
51.   `insertSort(arr, 0, 3);`
    
52.   `return arr;`
    
53.   `}`
    

55.   `const quickSort = (a, from, to) => {`
    
56.   `//哨兵位置`
    
57.   `let thirdIndex = 0;`
    
58.   `while (true) {`
    
59.   `if (to - from <= 10) {`
    
60.   `insertSort(a, from, to);`
    
61.   `return;`
    
62.   `}`
    
63.   `if (to - from > 1000) {`
    
64.   `thirdIndex = getThirdIndex(a, from, to);`
    
65.   `} else {`
    
66.   `// 小于1000 直接取中点`
    
67.   `thirdIndex = from + ((to - from) >> 2);`
    
68.   `}`
    
69.   `let tmpArr = _sort(a[from], a[thirdIndex], a[to - 1]);`
    
70.   `a[from] = tmpArr[0]; a[thirdIndex] = tmpArr[1]; a[to - 1] = tmpArr[2];`
    
71.   `// 现在正式把 thirdIndex 作为哨兵`
    
72.   `let pivot = a[thirdIndex];`
    
73.   `[a[from], a[thirdIndex]] = [a[thirdIndex], a[from]];`
    
74.   `// 正式进入快排`
    
75.   `let lowEnd = from + 1;`
    
76.   `let highStart = to - 1;`
    
77.   `a[thirdIndex] = a[lowEnd];`
    
78.   `a[lowEnd] = pivot;`
    
79.   `// [lowEnd, i)的元素是和pivot相等的`
    
80.   `// [i, highStart) 的元素是需要处理的`
    
81.   `for (let i = lowEnd + 1; i < highStart; i++) {`
    
82.   `let element = a[i];`
    
83.   `let order = comparefn(element, pivot);`
    
84.   `if (order < 0) {`
    
85.   `a[i] = a[lowEnd];`
    
86.   `a[lowEnd] = element;`
    
87.   `lowEnd++;`
    
88.   `} else if (order > 0) {`
    
89.   `do{`
    
90.   `highStart--;`
    
91.   `if (highStart === i) break;`
    
92.   `order = comparefn(a[highStart], pivot);`
    
93.   `}while (order > 0) ;`
    
94.   `// 现在 a[highStart] <= pivot`
    
95.   `// a[i] > pivot`
    
96.   `// 两者交换`
    
97.   `a[i] = a[highStart];`
    
98.   `a[highStart] = element;`
    
99.   `if (order < 0) {`
    
100.   `// a[i] 和 a[lowEnd] 交换`
    
101.   `element = a[i];`
    
102.   `a[i] = a[lowEnd];`
    
103.   `a[lowEnd] = element;`
    
104.   `lowEnd++;`
    
105.   `}`
    
106.   `}`
    
107.   `}`
    
108.   `// 永远切分大区间`
    
109.   `if (lowEnd - from > to - highStart) {`
    
110.   `// 单独处理小区间`
    
111.   `quickSort(a, highStart, to);`
    
112.   `// 继续切分lowEnd ~ from 这个区间`
    
113.   `to = lowEnd;`
    
114.   `} else if (lowEnd - from <= to - highStart) {`
    
115.   `quickSort(a, from, lowEnd);`
    
116.   `from = highStart;`
    
117.   `}`
    
118.   `}`
    
119.   `}`
    
120.   `quickSort(array, 0, length);`
    
121.  `}`
    

参考链接:

V8 sort源码(点开第997行)

冴羽排序源码专题

## 第十七篇: 能不能模拟实现一个new的效果？

`new`被调用后做了三件事情:

1.  让实例可以访问到私有属性
    
2.  让实例可以访问构造函数原型(constructor.prototype)所在原型链上的属性
    
3.  如果构造函数返回的结果不是引用数据类型
    

1.  `function newFactory(ctor, ...args) {`
    
2.   `if(typeof ctor !== 'function'){`
    
3.   `throw 'newOperator function the first param must be a function';`
    
4.   `}`
    
5.   `let obj = new Object();`
    
6.   `obj.__proto__ = Object.create(ctor.prototype);`
    
7.   `let res = ctor.apply(obj, ...args);`
    

9.   `let isObject = typeof res === 'object' && typeof res !== null;`
    
10.   `let isFunction = typoof res === 'function';`
    
11.   `return isObect || isFunction ? res : obj;`
    
12.  `};`
    

## 第十八篇: 能不能模拟实现一个 bind 的效果？

实现bind之前，我们首先要知道它做了哪些事情。

1.  对于普通函数，绑定this指向
    
2.  对于构造函数，要保证原函数的原型对象上的属性不能丢失
    

1.  `Function.prototype.bind = function (context, ...args) {`
    
2.   `// 异常处理`
    
3.   `if (typeof this !== "function") {`
    
4.   `throw new Error("Function.prototype.bind - what is trying to be bound is not callable");`
    
5.   `}`
    
6.   `// 保存this的值，它代表调用 bind 的函数`
    
7.   `var self = this;`
    
8.   `var fNOP = function () {};`
    

10.   `var fbound = function () {`
    
11.   `self.apply(this instanceof self ?` 
    
12.   `this :` 
    
13.   `context, args.concat(Array.prototype.slice.call(arguments)));`
    
14.   `}`
    

16.   `fNOP.prototype = this.prototype;`
    
17.   `fbound.prototype = new fNOP();`
    

19.   `return fbound;`
    
20.  `}`
    

也可以这么用 Object.create 来处理原型:

1.  `Function.prototype.bind = function (context, ...args) {`
    
2.   `if (typeof this !== "function") {`
    
3.   `throw new Error("Function.prototype.bind - what is trying to be bound is not callable");`
    
4.   `}`
    

6.   `var self = this;`
    

8.   `var fbound = function () {`
    
9.   `self.apply(this instanceof self ?` 
    
10.   `this :` 
    
11.   `context, args.concat(Array.prototype.slice.call(arguments)));`
    
12.   `}`
    

14.   `fbound = Object.create(this.prototype);`
    

16.   `return fbound;`
    
17.  `}`
    

## 第十八篇: 能不能实现一个 call/apply 函数？

引自 `冴羽`大佬的代码，可以说比较完整了。

1.  `Function.prototype.call = function (context) {`
    
2.   `var context = context || window;`
    
3.   `context.fn = this;`
    

5.   `var args = [];`
    
6.   `for(var i = 1, len = arguments.length; i < len; i++) {`
    
7.   `args.push('arguments[' + i + ']');`
    
8.   `}`
    

10.   `var result = eval('context.fn(' + args +')');`
    

12.   `delete context.fn`
    
13.   `return result;`
    
14.  `}`
    

不过我认为换成 ES6 的语法会更精炼一些:

1.  `Function.prototype.call = function (context, ...args) {`
    
2.   `var context = context || window;`
    
3.   `context.fn = this;`
    

5.   `var result = eval('context.fn(...args)');`
    

7.   `delete context.fn`
    
8.   `return result;`
    
9.  `}`
    

类似的，有apply的对应实现:

1.  `Function.prototype.apply = function (context, args) {`
    
2.   `let context = context || window;`
    
3.   `context.fn = this;`
    
4.   `let result = eval('context.fn(...args)');`
    

6.   `delete context.fn`
    
7.   `return result;`
    
8.  `}`
    

## 第十九篇: 谈谈你对JS中this的理解。

其实JS中的this是一个非常简单的东西，只需要理解它的执行规则就OK。

在这里不想像其他博客一样展示太多的代码例子弄得天花乱坠， 反而不易理解。

call/apply/bind可以显示绑定, 这里就不说了。

主要这些场隐式绑定的场景讨论:

1.  全局上下文
    
2.  直接调用函数
    
3.  对象.方法的形式调用
    
4.  DOM事件绑定(特殊)
    
5.  new构造函数绑定
    
6.  箭头函数
    

### 1. 全局上下文

全局上下文默认this指向window, 严格模式下指向undefined。

### 2. 直接调用函数

比如:

1.  `let obj = {`
    
2.   `a: function() {`
    
3.   `console.log(this);`
    
4.   `}`
    
5.  `}`
    
6.  `let func = obj.a;`
    
7.  `func();`
    

这种情况是直接调用。this相当于全局上下文的情况。

### 3. 对象.方法的形式调用

还是刚刚的例子，我如果这样写:

1.  `obj.a();`
    

这就是 `对象.方法`的情况，this指向这个对象

### 4. DOM事件绑定

onclick和addEventerListener中 this 默认指向绑定事件的元素。

IE比较奇异，使用attachEvent，里面的this默认指向window。

### 5. new+构造函数

此时构造函数中的this指向实例对象。

### 6. 箭头函数？

箭头函数没有this, 因此也不能绑定。里面的this会指向当前最近的非箭头函数的this，找不到就是window(严格模式是undefined)。比如:

1.  `let obj = {`
    
2.   `a: function() {`
    
3.   `let do = () => {`
    
4.   `console.log(this);`
    
5.   `}`
    
6.   `do();`
    
7.   `}`
    
8.  `}`
    
9.  `obj.a(); // 找到最近的非箭头函数a，a现在绑定着obj, 因此箭头函数中的this是obj`
    

> 优先级: new > call、apply、bind > 对象.方法 > 直接调用。

## 第二十篇: JS中浅拷贝的手段有哪些？

### 重要: 什么是拷贝？

首先来直观的感受一下什么是拷贝。

1.  `let arr = [1, 2, 3];`
    
2.  `let newArr = arr;`
    
3.  `newArr[0] = 100;`
    

5.  `console.log(arr);//[100, 2, 3]`
    

这是直接赋值的情况，不涉及任何拷贝。当改变newArr的时候，由于是同一个引用，arr指向的值也跟着改变。

现在进行浅拷贝:

1.  `let arr = [1, 2, 3];`
    
2.  `let newArr = arr.slice();`
    
3.  `newArr[0] = 100;`
    

5.  `console.log(arr);//[1, 2, 3]`
    

当修改newArr的时候，arr的值并不改变。什么原因?因为这里newArr是arr浅拷贝后的结果，newArr和arr现在引用的已经不是同一块空间啦！

这就是浅拷贝！

但是这又会带来一个潜在的问题:

1.  `let arr = [1, 2, {val: 4}];`
    
2.  `let newArr = arr.slice();`
    
3.  `newArr[2].val = 1000;`
    

5.  `console.log(arr);//[ 1, 2, { val: 1000 } ]`
    

咦!不是已经不是同一块空间的引用了吗？为什么改变了newArr改变了第二个元素的val值，arr也跟着变了。

这就是浅拷贝的限制所在了。它只能拷贝一层对象。如果有对象的嵌套，那么浅拷贝将无能为力。但幸运的是，深拷贝就是为了解决这个问题而生的，它能 解决无限极的对象嵌套问题，实现彻底的拷贝。当然，这是我们下一篇的重点。现在先让大家有一个基本的概念。

接下来，我们来研究一下JS中实现浅拷贝到底有多少种方式？

### 1. 手动实现

1.  `const shallowClone = (target) => {`
    
2.   `if (typeof target === 'object' && target !== null) {`
    
3.   `const cloneTarget = Array.isArray(target) ? []: {};`
    
4.   `for (let prop in target) {`
    
5.   `if (target.hasOwnProperty(prop)) {`
    
6.   `cloneTarget[prop] = target[prop];`
    
7.   `}`
    
8.   `}`
    
9.   `return cloneTarget;`
    
10.   `} else {`
    
11.   `return target;`
    
12.   `}`
    
13.  `}`
    

### 2. Object.assign

但是需要注意的是，Object.assgin() 拷贝的是对象的属性的引用，而不是对象本身。

1.  `let obj = { name: 'sy', age: 18 };`
    
2.  `const obj2 = Object.assign({}, obj, {name: 'sss'});`
    
3.  `console.log(obj2);//{ name: 'sss', age: 18 }`
    

### 3. concat浅拷贝数组

1.  `let arr = [1, 2, 3];`
    
2.  `let newArr = arr.concat();`
    
3.  `newArr[1] = 100;`
    
4.  `console.log(arr);//[ 1, 2, 3 ]`
    

### 4. slice浅拷贝

开头的例子不就说的这个嘛！

### 5. ...展开运算符

1.  `let arr = [1, 2, 3];`
    
2.  `let newArr = [...arr];//跟arr.slice()是一样的效果`
    

## 第二十一篇: 能不能写一个完整的深拷贝？

上一篇已经解释了什么是深拷贝，现在我们来一起实现一个完整且专业的深拷贝。

### 1. 简易版及问题

1.  `JSON.parse(JSON.stringify());`
    

估计这个api能覆盖大多数的应用场景，没错，谈到深拷贝，我第一个想到的也是它。但是实际上，对于某些严格的场景来说，这个方法是有巨大的坑的。问题如下：

> 1.  无法解决 `循环引用`的问题。举个例子：
>     

1.  `const a = {val:2};`
    
2.  `a.target = a;`
    

拷贝a会出现系统栈溢出，因为出现了 `无限递归`的情况。

> 1.  无法拷贝一写 `特殊的对象`，诸如 RegExp, Date, Set, Map等。
>     
> 2.  无法拷贝 `函数`(划重点)。
>     

因此这个api先pass掉，我们重新写一个深拷贝，简易版如下:

1.  `const deepClone = (target) => {`
    
2.   `if (typeof target === 'object' && target !== null) {`
    
3.   `const cloneTarget = Array.isArray(target) ? []: {};`
    
4.   `for (let prop in target) {`
    
5.   `if (target.hasOwnProperty(prop)) {`
    
6.   `cloneTarget[prop] = deepClone(target[prop]);`
    
7.   `}`
    
8.   `}`
    
9.   `return cloneTarget;`
    
10.   `} else {`
    
11.   `return target;`
    
12.   `}`
    
13.  `}`
    

现在，我们以刚刚发现的三个问题为导向，一步步来完善、优化我们的深拷贝代码。

### 2. 解决循环引用

现在问题如下:

1.  `let obj = {val : 100};`
    
2.  `obj.target = obj;`
    

4.  `deepClone(obj);//报错: RangeError: Maximum call stack size exceeded`
    

这就是循环引用。我们怎么来解决这个问题呢？

创建一个Map。记录下已经拷贝过的对象，如果说已经拷贝过，那直接返回它行了。

1.  `const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;`
    

3.  `const deepClone = (target, map = new Map()) => {`
    
4.   `if(map.get(target))` 
    
5.   `return target;`
    

8.   `if (isObject(target)) {`
    
9.   `map.put(target, true);`
    
10.   `const cloneTarget = Array.isArray(target) ? []: {};`
    
11.   `for (let prop in target) {`
    
12.   `if (target.hasOwnProperty(prop)) {`
    
13.   `cloneTarget[prop] = deepClone(target[prop]);`
    
14.   `}`
    
15.   `}`
    
16.   `return cloneTarget;`
    
17.   `} else {`
    
18.   `return target;`
    
19.   `}`
    
20.  `}`
    

现在来试一试：

1.  `const a = {val:2};`
    
2.  `a.target = a;`
    
3.  `let newA = deepClone(a);`
    
4.  `console.log(newA)//{ val: 2, target: { val: 2, target: [Circular] } }`
    

好像是没有问题了, 拷贝也完成了。但还是有一个潜在的坑, 就是map 上的 key 和 map 构成了 `强引用关系`，这是相当危险的。我给你解释一下与之相对的弱引用的概念你就明白了：

> 在计算机程序设计中，弱引用与强引用相对， 是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。--百度百科

说的有一点绕，我用大白话解释一下，被弱引用的对象可以在 `任何时候被回收`，而对于强引用来说，只要这个强引用还在，那么对象 `无法被回收`。拿上面的例子说，map 和 a一直是强引用的关系， 在程序结束之前，a 所占的内存空间一直 `不会被释放`。

怎么解决这个问题？

很简单，让 map 的 key 和 map 构成 `弱引用`即可。ES6给我们提供了这样的数据结构，它的名字叫 `WeakMap`，它是一种特殊的Map, 其中的键是 `弱引用`的。其键必须是对象，而值可以是任意的。

稍微改造一下即可:

1.  `const deepClone = (target, map = new Map()) => {`
    
2.   `//...`
    
3.  `}`
    

### 3. 拷贝特殊对象

#### 可继续遍历

对于特殊的对象，我们使用以下方式来鉴别:

1.  `Object.prototype.toString.call(obj);`
    

梳理一下对于可遍历对象会有什么结果：

1.  `["object Map"]`
    
2.  `["object Set"]`
    
3.  `["object Array"]`
    
4.  `["object Object"]`
    
5.  `["object Arguments"]`
    

好，以这些不同的字符串为依据，我们就可以成功地鉴别这些对象。

1.  `const getType = Object.prototype.toString.call(obj);`
    

3.  `const canTraverse = {`
    
4.   `'[object Map]': true,`
    
5.   `'[object Set]': true,`
    
6.   `'[object Array]': true,`
    
7.   `'[object Object]': true,`
    
8.   `'[object Arguments]': true,`
    
9.  `};`
    

11.  `const deepClone = (target, map = new Map()) => {`
    
12.   `if(!isObject(target))` 
    
13.   `return target;`
    
14.   `let type = getType(target);`
    
15.   `let cloneTarget;`
    
16.   `if(!canTraverse[type]) {`
    
17.   `// 处理不能遍历的对象`
    
18.   `return;`
    
19.   `}else {`
    
20.   `// 这波操作相当关键，可以保证对象的原型不丢失！`
    
21.   `let ctor = target.prototype;`
    
22.   `cloneTarget = new ctor();`
    
23.   `}`
    

25.   `if(map.get(target))` 
    
26.   `return target;`
    
27.   `map.put(target, true);`
    

29.   `if(type === mapTag) {`
    
30.   `//处理Map`
    
31.   `target.forEach((item, key) => {`
    
32.   `cloneTarget.set(deepClone(key), deepClone(item));`
    
33.   `})`
    
34.   `}`
    

36.   `if(type === setTag) {`
    
37.   `//处理Set`
    
38.   `target.forEach(item => {`
    
39.   `target.add(deepClone(item));`
    
40.   `})`
    
41.   `}`
    

43.   `// 处理数组和对象`
    
44.   `for (let prop in target) {`
    
45.   `if (target.hasOwnProperty(prop)) {`
    
46.   `cloneTarget[prop] = deepClone(target[prop]);`
    
47.   `}`
    
48.   `}`
    
49.   `return cloneTarget;`
    
50.  `}`
    

#### 不可遍历的对象

1.  `const boolTag = '[object Boolean]';`
    
2.  `const numberTag = '[object Number]';`
    
3.  `const stringTag = '[object String]';`
    
4.  `const dateTag = '[object Date]';`
    
5.  `const errorTag = '[object Error]';`
    
6.  `const regexpTag = '[object RegExp]';`
    
7.  `const funcTag = '[object Function]';`
    

对于不可遍历的对象，不同的对象有不同的处理。

1.  `const handleRegExp = (target) => {`
    
2.   `const { source, flags } = target;`
    
3.   `return new target.constructor(source, flags);`
    
4.  `}`
    

6.  `const handleFunc = (target) => {`
    
7.   `// 待会的重点部分`
    
8.  `}`
    

10.  `const handleNotTraverse = (target, tag) => {`
    
11.   `const Ctor = targe.constructor;`
    
12.   `switch(tag) {`
    
13.   `case boolTag:`
    
14.   `case numberTag:`
    
15.   `case stringTag:`
    
16.   `case errorTag:` 
    
17.   `case dateTag:`
    
18.   `return new Ctor(target);`
    
19.   `case regexpTag:`
    
20.   `return handleRegExp(target);`
    
21.   `case funcTag:`
    
22.   `return handleFunc(target);`
    
23.   `default:`
    
24.   `return new Ctor(target);`
    
25.   `}`
    
26.  `}`
    

### 4. 拷贝函数

虽然函数也是对象，但是它过于特殊，我们单独把它拿出来拆解。

提到函数，在JS种有两种函数，一种是普通函数，另一种是箭头函数。每个普通函数都是 Function的实例，而箭头函数不是任何类的实例，每次调用都是不一样的引用。那我们只需要 处理普通函数的情况，箭头函数直接返回它本身就好了。

那么如何来区分两者呢？

答案是: 利用原型。箭头函数是不存在原型的。

代码如下:

1.  `const handleFunc = (func) => {`
    
2.   `// 箭头函数直接返回自身`
    
3.   `if(!func.prototype) return func;`
    
4.   `const bodyReg = /(?<={)(.|\n)+(?=})/m;`
    
5.   `const paramReg = /(?<=\().+(?=\)\s+{)/;`
    
6.   `const funcString = func.toString();`
    
7.   `// 分别匹配 函数参数 和 函数体`
    
8.   `const param = paramReg.exec(funcString);`
    
9.   `const body = bodyReg.exec(funcString);`
    
10.   `if(!body) return null;`
    
11.   `if (param) {`
    
12.   `const paramArr = param[0].split(',');`
    
13.   `return new Function(...paramArr, body[0]);`
    
14.   `} else {`
    
15.   `return new Function(body[0]);`
    
16.   `}`
    
17.  `}`
    

到现在，我们的深拷贝就实现地比较完善了。不过在测试的过程中，我也发现了一个小小的bug。

### 5. 小小的bug

如下所示:

1.  `const target = new Boolean(false);`
    
2.  `const Ctor = target.constructor;`
    
3.  `new Ctor(target); // 结果为 Boolean {true} 而不是 false。`
    

对于这样一个bug，我们可以对 Boolean 拷贝做最简单的修改， 调用valueOf: new target.constructor(target.valueOf())。

但实际上，这种写法是不推荐的。因为在ES6后不推荐使用【new 基本类型()】这 样的语法，所以es6中的新类型 Symbol 是不能直接 new 的，只能通过 new Object(SymbelType)。

因此我们接下来统一一下:

1.  `const handleNotTraverse = (target, tag) => {`
    
2.   `const Ctor = targe.constructor;`
    
3.   `switch(tag) {`
    
4.   `case boolTag:`
    
5.   `return new Object(Boolean.prototype.valueOf.call(target));`
    
6.   `case numberTag:`
    
7.   `return new Object(Number.prototype.valueOf.call(target));`
    
8.   `case stringTag:`
    
9.   `return new Object(String.prototype.valueOf.call(target));`
    
10.   `case errorTag:` 
    
11.   `case dateTag:`
    
12.   `return new Ctor(target);`
    
13.   `case regexpTag:`
    
14.   `return handleRegExp(target);`
    
15.   `case funcTag:`
    
16.   `return handleFunc(target);`
    
17.   `default:`
    
18.   `return new Ctor(target);`
    
19.   `}`
    
20.  `}`
    

### 6. 完整代码展示

OK!是时候给大家放出完整版的深拷贝啦:

1.  `const getType = obj => Object.prototype.toString.call(obj);`
    

3.  `const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;`
    

5.  `const canTraverse = {`
    
6.   `'[object Map]': true,`
    
7.   `'[object Set]': true,`
    
8.   `'[object Array]': true,`
    
9.   `'[object Object]': true,`
    
10.   `'[object Arguments]': true,`
    
11.  `};`
    
12.  `const mapTag = '[object Map]';`
    
13.  `const setTag = '[object Set]';`
    
14.  `const boolTag = '[object Boolean]';`
    
15.  `const numberTag = '[object Number]';`
    
16.  `const stringTag = '[object String]';`
    
17.  `const symbolTag = '[object Symbol]';`
    
18.  `const dateTag = '[object Date]';`
    
19.  `const errorTag = '[object Error]';`
    
20.  `const regexpTag = '[object RegExp]';`
    
21.  `const funcTag = '[object Function]';`
    

23.  `const handleRegExp = (target) => {`
    
24.   `const { source, flags } = target;`
    
25.   `return new target.constructor(source, flags);`
    
26.  `}`
    

28.  `const handleFunc = (func) => {`
    
29.   `// 箭头函数直接返回自身`
    
30.   `if(!func.prototype) return func;`
    
31.   `const bodyReg = /(?<={)(.|\n)+(?=})/m;`
    
32.   `const paramReg = /(?<=\().+(?=\)\s+{)/;`
    
33.   `const funcString = func.toString();`
    
34.   `// 分别匹配 函数参数 和 函数体`
    
35.   `const param = paramReg.exec(funcString);`
    
36.   `const body = bodyReg.exec(funcString);`
    
37.   `if(!body) return null;`
    
38.   `if (param) {`
    
39.   `const paramArr = param[0].split(',');`
    
40.   `return new Function(...paramArr, body[0]);`
    
41.   `} else {`
    
42.   `return new Function(body[0]);`
    
43.   `}`
    
44.  `}`
    

46.  `const handleNotTraverse = (target, tag) => {`
    
47.   `const Ctor = target.constructor;`
    
48.   `switch(tag) {`
    
49.   `case boolTag:`
    
50.   `return new Object(Boolean.prototype.valueOf.call(target));`
    
51.   `case numberTag:`
    
52.   `return new Object(Number.prototype.valueOf.call(target));`
    
53.   `case stringTag:`
    
54.   `return new Object(String.prototype.valueOf.call(target));`
    
55.   `case symbolTag:`
    
56.   `return new Object(Symbol.prototype.valueOf.call(target));`
    
57.   `case errorTag:` 
    
58.   `case dateTag:`
    
59.   `return new Ctor(target);`
    
60.   `case regexpTag:`
    
61.   `return handleRegExp(target);`
    
62.   `case funcTag:`
    
63.   `return handleFunc(target);`
    
64.   `default:`
    
65.   `return new Ctor(target);`
    
66.   `}`
    
67.  `}`
    

69.  `const deepClone = (target, map = new Map()) => {`
    
70.   `if(!isObject(target))` 
    
71.   `return target;`
    
72.   `let type = getType(target);`
    
73.   `let cloneTarget;`
    
74.   `if(!canTraverse[type]) {`
    
75.   `// 处理不能遍历的对象`
    
76.   `return handleNotTraverse(target, type);`
    
77.   `}else {`
    
78.   `// 这波操作相当关键，可以保证对象的原型不丢失！`
    
79.   `let ctor = target.constructor;`
    
80.   `cloneTarget = new ctor();`
    
81.   `}`
    

83.   `if(map.get(target))` 
    
84.   `return target;`
    
85.   `map.set(target, true);`
    

87.   `if(type === mapTag) {`
    
88.   `//处理Map`
    
89.   `target.forEach((item, key) => {`
    
90.   `cloneTarget.set(deepClone(key, map), deepClone(item, map));`
    
91.   `})`
    
92.   `}`
    

94.   `if(type === setTag) {`
    
95.   `//处理Set`
    
96.   `target.forEach(item => {`
    
97.   `cloneTarget.add(deepClone(item, map));`
    
98.   `})`
    
99.   `}`
    

101.   `// 处理数组和对象`
    
102.   `for (let prop in target) {`
    
103.   `if (target.hasOwnProperty(prop)) {`
    
104.   `cloneTarget[prop] = deepClone(target[prop], map);`
    
105.   `}`
    
106.   `}`
    
107.   `return cloneTarget;`
    
108.  `}`
