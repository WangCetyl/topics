
/*

  https://segmentfault.com/a/1190000015724112
  https://github.com/Abiel1024/blog/issues/16
 
	思路：在JavaScript中的this指向说到了：函数还可以作为某个对象的方法调用，这时this就指这个上级对象。
  也就是我们平时说的，
	谁调用，this就指向谁。所以实现的方法就是在传入的对象中添加这么一个方法，然后再去执行这个方法。
  为了保持对象一直，在执行完之后再把这个对象给删除了。是不是很简单^-^。

 */

// call、apply和bind的原生实现
// 因为关乎到了this指向的问题，call、apply和bind的用法可以说是老生常谈了。这篇文章的主要作用是利用js原生
// 方法对三个方法进行实现，
// 升入了解其中的原理，对相关知识点有更好的掌握。github地址call、apply和bind的原生实现

// call与apply
// 简单介绍：call和apply方法都是使用一个指定的this值和对应的参数前提下调用某个函数或方法。区别则在于call
// 是通过传多个参数的方式，
// 而apply则是传入一个数组。
// 举个例子：

var obj = {
  name: 'linxin'
}

function func(age, sex) {
  console.log(this.name,age,sex);
}

func.call(obj,12,'女');         // linxin 12 女
func.apply(obj, [18, '女']);        //linxin 18 女
// 模拟实现
// 思路：在JavaScript中的this指向说到了：函数还可以作为某个对象的方法调用，这时this就指这个上级对象。也就是我们平时说的，
// 谁调用，
// this就指向谁。所以实现的方法就是在传入的对象中添加这么一个方法，然后再去执行这个方法。为了保持对象一直，在执行完之后
// 再把这个对
// 象给删除了。是不是很简单^-^。
// 初体验：

Function.prototype.newCall = function(context) {
  context.fn = this;  // 通过this获取call的函数
  context.fn();
  delete context.fn;
}
let foo = {
  value: 1
}
function bar() {
  console.log(this.value);
}
bar.newCall (foo); // 1
这样就完成了基础版本的实现，但是如果说有传参数呢？
所以我们可以进行优化一下，因为传入的参数数量是不确定的，所以我们可以从Arguments对象中去获取，这个比较简单。问题是参数是不确定
的，我们如何传入到我们要执行的函数中去呢 ？ 这里我们有两种选择：一种是通过eval拼接的方式，另一种就要用到es6了。
体验升级（eval版本）：

Function.prototype.newCall = function(context) {
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  eval('context.fn(' + args +')');
  delete context.fn;
}
let person = {
  name: 'Abiel'
}
function sayHi(age,sex) {
  console.log(this.name, age, sex);
}
sayHi.newCall (person, 25, '男'); // Abiel 25 男
体验升级（ES6版本）：

Function.prototype.newCall = function(context) {
  context.fn = this;  
  context.fn(...Array.from(arguments).slice(1));
  delete context.fn;
}
let person = {
  name: 'Abiel'
}
function sayHi(age,sex) {
  console.log(this.name, age, sex);
}
sayHi.newCall (person, 25, '男'); // Abiel 25 男
让然ES6的方法还可以不用到arguments就能实现
ES6版本再升级：

Function.prototype.newCall = function(context, ...parameter) {
  context.fn = this;  
  context.fn(...parameter);
  delete context.fn;
}
let person = {
  name: 'Abiel'
}
function sayHi(age,sex) {
  console.log(this.name, age, sex);
}
sayHi.newCall (person, 25, '男'); // Abiel 25 男

这样我们基本上实现了call的功能，但是还是存在一些隐患和区别。
当对象本身就有fn这个方法的时候，就有大问题了。
当call传入的对象是null的时候，或者其他一些类型的时候，函数会报错。
终极体验：

Function.prototype.newCall = function(context, ...parameter) {
  if (typeof context === 'object') {
    context = context || window
  } else {
    context = Object.create(null)
  }
  let fn = Symbol()
  context[fn] = this
  context[fn](...parameter);
  delete context[fn]
}
let person = {
  name: 'Abiel'
}
function sayHi(age,sex) {
  console.log(this.name, age, sex);
}
sayHi.newCall (person, 25, '男'); // Abiel 25 男
实现了call之后，apply也是同样的思路。
apply实现：

Function.prototype.newApply = function(context, parameter) {
  if (typeof context === 'object') {
    context = context || window
  } else {
    context = Object.create(null)
  }
  let fn = Symbol()
  context[fn] = this
  context[fn](parameter);
  delete context[fn]
}
bind
bind也是函数的方法，作用也是改变this执行，同时也是能传多个参数。与call和apply不同的是bind方法不会立即执行，
而是返回一个改变上下文this指向后的函数，原函数并没有被改变。并且如果函数本身是一个绑定了 this 对象的函数，
那 apply 和 call 不会像预期那样执行。
初体验：

Function.prototype.bind = function (context) {
  var me = this
  return function () { // bind之后得到的函数
    return me.call(context)  // 执行是改变this执行
  }
}
加入参数：
/*返回函数，处理this 参数的处理，构造函数的实现*/
// Function.prototype.bind = function (context,...innerArgs) {
//   var me = this
//   return function (...finnalyArgs) {
//     return me.call(context,...innerArgs,...finnalyArgs)
//   }
// }

/*Function.prototype.bind = function (context) {
  var me = this
  var args1 = Array.prototype.slice.call(arguments, 1)
  return function () {
    var args2 = Array.prototype.slice.call(arguments, 1)
    me.apply(context,args1.concat(args2))
  }
}*/

/*构造函数的实现*/
Function.prototype.bind = function (context) {
  var me = this
  var args1 = Array.prototype.slice.call(arguments, 1)
  let Fn = function () {
    var args2 = Array.prototype.slice.call(arguments, 1)
    me.apply(this instanceof Fn? this:context,args1.concat(args2))
  }
  Fn.prototype = Object.create(this)
  return Fn
}
let person = {
  name: 'Abiel'
}
function sayHi(age,sex) {
  console.log(this.name, age, sex);
}
let personSayHi = sayHi.bind(person, 25)
personSayHi('男')