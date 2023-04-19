作者: 董沅鑫
链接: https://godbmw.com/passages/2019-03-27-javascript-second/
来源: godbmw.com
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

JavaScript基础知识梳理(下)

内容速览 👇

实现ES5继承的4种方法
原型和原型链
作用域和作用域链
Event Loop
执行上下文
闭包的理解和分析
ES5继承
题目：ES5中常用继承方法。

方法一：绑定构造函数

缺点：不能继承父类原型方法/属性

function Animal(){
  this.species = '动物'
}

function Cat(){
  // 执行父类的构造方法, 上下文为实例对象
  Animal.apply(this, arguments)
}


/**
 * 测试代码
 */
var cat = new Cat()
console.log(cat.species) // output: 动物

方法二：原型链继承

缺点：无法向父类构造函数中传递参数；子类原型链上定义的方法有先后顺序问题。

注意：js中交换原型链，均需要修复prototype.constructor指向问题。

function Animal(species){
  this.species = species
}
Animal.prototype.func = function(){
  console.log('Animal')
}

function Cat(){}
/**
 * func方法是无效的, 因为后面原型链被重新指向了Animal实例
 */
Cat.prototype.func = function() {
  console.log('Cat')
}

Cat.prototype = new Animal()
Cat.prototype.constructor = Cat // 修复: 将Cat.prototype.constructor重新指向本身

/**
 * 测试代码
 */
var cat = new Cat()
cat.func() // output: Animal
console.log(cat.species) // undefined

方法3:组合继承

结合绑定构造函数和原型链继承2种方式，缺点是：调用了2次父类的构造函数。


function Animal(species){
  this.species = species
}
Animal.prototype.func = function(){
  console.log('Animal')
}

function Cat(){
  Animal.apply(this, arguments)
}

Cat.prototype = new Animal()
Cat.prototype.constructor = Cat 

/**
 * 测试代码
 */
var cat = new Cat('cat')
cat.func() // output: Animal
console.log(cat.species) // output: cat


方法4:寄生组合继承

改进了组合继承的缺点，只需要调用1次父类的构造函数。它是引用类型最理想的继承范式。（引自：《JavaScript高级程序设计》）


/**
 * 寄生组合继承的核心代码
 * @param {Function} sub 子类
 * @param {Function} parent 父类
 */
function inheritPrototype(sub, parent) {
  // 拿到父类的原型
  var prototype = Object.create(parent.prototype) 
  // 改变constructor指向
  prototype.constructor = sub
  // 父类原型赋给子类
  sub.prototype = prototype
}

function Animal(species){
  this.species = species
}
Animal.prototype.func = function(){
  console.log('Animal')
}

function Cat(){
  Animal.apply(this, arguments) // 只调用了1次构造函数
}

inheritPrototype(Cat, Animal)

/**
 * 测试代码
 */

var cat = new Cat('cat')
cat.func() // output: Animal
console.log(cat.species) // output: cat

原型和原型链
所有的引用类型（数组、对象、函数），都有一个__proto__属性，属性值是一个普通的对象
所有的函数，都有一个prototype属性，属性值也是一个普通的对象
所有的引用类型（数组、对象、函数），__proto__属性值指向它的构造函数的prototype属性值
注：ES6的箭头函数没有prototype属性，但是有__proto__属性。


const obj = {};
// 引用类型的 __proto__ 属性值指向它的构造函数的 prototype 属性值
console.log(obj.__proto__ === Object.prototype); // output: true


原型
题目：如何JS中的原型？

// 构造函数
function Foo(name, age) {
    this.name = name
}
Foo.prototype.alertName = function () {
    alert(this.name)
}
// 创建实例
var f = new Foo('zhangsan')
f.printName = function () {
    console.log(this.name)
}
// 测试
f.printName()
f.alertName()
但是执行alertName时发生了什么？这里再记住一个重点 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__（即它的构造函数的prototype）中寻找，因此f.alertName就会找到Foo.prototype.alertName。

原型链
题目：如何JS中的原型链？

以上一题为基础，如果调用f.toString()。

f试图从__proto__中寻找（即Foo.prototype），还是没找到toString()方法。
继续向上找，从f.__proto__.__proto__中寻找（即Foo.prototype.__proto__中）。因为Foo.prototype就是一个普通对象，因此Foo.prototype.__proto__ = Object.prototype
最终对应到了Object.prototype.toString
这是对深度遍历的过程，寻找的依据就是一个链式结构，所以叫做“原型链”。

作用域和作用域链
题目：如何理解 JS 的作用域和作用域链。

①作用域

ES5有”全局作用域“和”函数作用域“。ES6的let和const使得JS用了”块级作用域“。

为了解决ES5的全局冲突，一般都是闭包编写：(function(){ ... })()。将变量封装到函数作用域。

②作用域链

当前作用域没有找到定义，继续向父级作用域寻找，直至全局作用域。这种层级关系，就是作用域链。

Event Loop
单线程
题目：讲解下面代码的执行过程和结果。

var a = true;
setTimeout(function(){
    a = false;
}, 100)
while(a){
    console.log('while执行了')
}

这段代码会一直执行并且输出”while…”。JS是单线程的，先跑执行栈里的同步任务，然后再跑任务队列的异步任务。

执行栈和任务队列
题目：说一下JS的Event Loop。

简单总结如下：

JS是单线程的，其上面的所有任务都是在两个地方执行：执行栈和任务队列。前者是存放同步任务；后者是异步任务有结果后，就在其中放入一个事件。
当执行栈的任务都执行完了（栈空），js会读取任务队列，并将可以执行的任务从任务队列丢到执行栈中执行。
这个过程是循环进行，所以称作Loop。
执行上下文
题目：解释下“全局执行上下文“和“函数执行上下文”。

①全局执行上下文

解析JS时候，创建一个 全局执行上下文 环境。把代码中即将执行的（内部函数的不算，因为你不知道函数何时执行）变量、函数声明都拿出来。未赋值的变量就是undefined。

下面这段代码输出：undefined；而不是抛出Error。因为在解析JS的时候，变量a已经存入了全局执行上下文中了。

console.log(a);
var a = 1;

②函数执行上下文

和全局执行上下文差不多，但是多了this和arguments和参数。

在JS中，this是关键字，它作为内置变量，其值是在执行的时候确定（不是定义的时候确定）。

闭包的理解和分析
题目：解释下js的闭包

直接上MDN的解释：闭包是函数和声明该函数的词法环境的组合。

而在JavaScript中，函数是被作为一级对象使用的，它既可以本当作值返回，还可以当作参数传递。理解了：“Js中的函数运行在它们被定义的作用域，而不是它们被执行的作用域”（摘自《JavaScript语言精粹》） 这句话即可。

题目：闭包优缺点

闭包封住了变量作用域，有效地防止了全局污染；但同时，它也存在内存泄漏的风险：

在浏览器端可以通过强制刷新解决，对用户体验影响不大
在服务端，由于node的内存限制和累积效应，可能会造成进程退出甚至服务器沓机
解决方法是显式对外暴露一个接口，专门用以清理变量：

function mockData() {
  const mem = {}
  
  return {
    clear: () => mem = null, // 显式暴露清理接口

    get: (page) => {
      if(page in mem) {
        return mem[page]
      }
      mem[page] = Math.random()
    }
  }
}


























