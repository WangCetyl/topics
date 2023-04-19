js函数的方法call()、apply()和bind()详细介绍和区别
2019年01月04日 18:49:31 觉儿 阅读数 157
在JavaScript中，call()、apply()和bind()是Function对象自带的三个方法，这三个方法的主要作用是改变函数中的this指向。
相同点：
1. apply 、 call 、bind 三者都是用来改变函数的this对象的指向；
2. apply 、 call 、bind 三者都可以利用后续参数传参；
不同点：
1.接受参数上call、bind接收多个参数，apply接收一个数组；
2.区别是，当你希望改变上下文环境之后并非立即执行，而是回调执行的时候，使用 bind() 方法。而 apply/call 则会立即执行函数。
  bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。

在 javascript 中，call 和 apply 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。
JavaScript 的一大特点是，函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。

1.call()
函数实例的call()方法，可以改变函数内部this的指向（即函数执行时所在的作用域或环境），然后在所指定的作用域中，调用该函数。
格式： func.call(thisValue,arg1,arg2…)
第一个参数是this要指向
(1).函数.call() 参数不传，或者传递null,undefined， 函数中的this指向window对象

var n = 123;
var obj = { n: 456 };
function a() {
  console.log(this.n);
}
a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456

可以看到，如果call方法没有参数，或者参数为null或undefined，则等同于指向全局对象。

(2)函数.call(5) 参数是一个原始值，那么这个原始值会自动转成对应的包装对象
传递字符串、数值或布尔类型等基础类型，函数中的this指向其对应的包装对象，如 String、Number、Boolean

var f = function () {
  return this;
};
console.log(f.call(5))   //Number {5}

(3)函数.call(obj) 参数传递一个对象，那么函数中的this指向这个对象

function Animal(){   
  this.name="animal";   
  this.showName=function(){   
    console.log(this.name);   
  }   
}   
function Dog(){   
  this.name="dog";   
}   
var animal=new Animal();   
var dog=new Dog();       
animal.showName.call(dog);//dog

animal.showName.call(dog) ，意思是把animal的方法放到dog上执行，也可以说，把animal 的showName()方法放到 dog上来执行。

(4)函数.call(this) 参数传递this，使得当前环境中的this指向所调用函数的执行环境，由此可以继承所调用函数的属性和方法(继承)

function func1(name){
	this.name=name;   
  	this.showName=function(){   
    	console.log(this.name);   
  	}   
}
function func2(name){
	func1.call(this,name);	
	//当前的this指向了func1（也可以说func2继承了func1） 
}
var func2Obj = new func2("Crazy dog");
func2Obj.showName();//func1  调用的是func1内的方法，将func1的name方法交给class2使用

2.apply()
apply()方法作用与call()方法类似，也是改变this指向，然后再调用该函数，唯一的区别在于：appl接收一个数组做为函数执行时的函数。
格式： func.apply(thisValue,[ arg1 , arg2… ])
如果参数不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。

function class1(args1,args2){       
  this.name=function(){      
   console.log(args,args);      
  }     
}     
function class2(){    
  var args1="1";
  var args2="2";
  class1.call(this,args1,args2);  
  /*或*/
  class1.apply(this,[args1,args2]);
}
var c=new class2();   
c.name();//1,2


既然两者功能一样，那该用哪个呢？
在JavaScript 中，某个函数的参数数量是不固定的，因此要说适用条件的话，当你的参数是明确知道数量时用 call ；而不确定的时候用 apply，然后把参数 push 进数组传递进去。当参数数量不确定时，函数内部也可以通过 arguments 这个数组来遍历所有的参数。

3.bind
bind() 方法与 apply 和 call 很相似，也是可以改变函数体内 this 的指向。然后返回一个新的函数。
注意：bind方法的返回值是函数

var bar=function(){   
  console.log(this.x);   
}
var foo={ 
     x:3   
}   
bar();  			//undefined
bar.bind(foo)();	//3
 /*或*/
var func=bar.bind(foo);   
func();				//3

4.call()和apply()的应用
1、数组之间追加
var array1 = [12 , “foo” , {name “Joe”} , -2458];
var array2 = [“Doe” , 555 , 100];
Array.prototype.push.apply(array1, array2);
/* array1 值为 [12 , “foo” , {name “Joe”} , -2458 , “Doe” , 555 , 100] */

2、获取数组中的最大值和最小值
var numbers = [5, 458 , 120 , -215 ];
var maxInNumbers = Math.max.apply(Math, numbers), //458
maxInNumbers = Math.max.call(Math,5, 458 , 120 , -215); //458
number 本身没有 max 方法，但是 Math 有，我们就可以借助 call 或者 apply 使用其方法。

3、验证是否是数组（前提是toString()方法没有被重写过）
functionisArray(obj){
return Object.prototype.toString.call(obj) === ‘[object Array]’ ;
}

4、类（伪）数组使用数组方法
var domNodes =Array.prototype.slice.call(document.getElementsByTagName("*"));
Javascript中存在一种名为伪数组的对象结构。比较特别的是 arguments 对象，还有像调用 getElementsByTagName , document.childNodes 之类的，它们返回NodeList对象都属于伪数组。不能应用 Array下的 push , pop 等方法。
但是我们能通过 Array.prototype.slice.call 转换为真正的数组的带有 length 属性的对象，这样 domNodes 就可以应用 Array 下的所有方法了。

5.深入理解call()、apply()、bind()
定义一个 log 方法，让它可以代理 console.log 方法，常见的解决方法是：
function log(msg)　{
console.log(msg);
}
log(1); //1
log(1,2); //1
上面方法可以解决最基本的需求，但是当传入参数的个数是不确定的时候，上面的方法就失效了，这个时候就可以考虑使用 apply 或者 call，注意这里传入多少个参数是不确定的，所以使用apply是最好的，方法如下：
function log(){
console.log.apply(console, arguments);
};
log(1); //1
log(1,2); //1 2
接下来的要求是给每一个 log 消息添加一个"(app)"的前辍，比如：
log(“hello world”); //(app)hello world
该怎么做比较优雅呢?这个时候需要想到arguments参数是个伪数组，通过 Array.prototype.slice.call 转化为标准数组，再使用数组方法unshift，像这样：
function log(){
var args = Array.prototype.slice.call(arguments);
args.unshift(’(app)’);
console.log.apply(console, args);
};

bind()

直接来看看具体如何使用，在常见的单体模式中，通常我们会使用 _this , that , self 等保存 this ，这样我们可以在改变了上下文之后继续引用到它。 像这样：

var foo = {
    bar : 1,
    eventBind: function(){
        var _this = this;
        $('.someClass').on('click',function(event) {
            /* Act on the event */
            console.log(_this.bar);     //1 注意此处如果直接用this，那么获取的是dom对象，而非foo对象
        });
    }
}

由于 Javascript 特有的机制，上下文环境在 eventBind:function(){ } 过渡到 $(’.someClass’).on(‘click’,function(event) { }) 发生了改变，上述使用变量保存 this 这些方式都是有用的，也没有什么问题。当然使用 bind() 可以更加优雅的解决这个问题：

var foo = {
    bar : 1,
    eventBind: function(){
        $('.someClass').on('click',function(event) {
            /* Act on the event */
            console.log(this.bar);      //1
        }.bind(this));
    }
}

在上述代码里，bind() 创建了一个函数，当这个click事件绑定在被调用的时候，它的 this 关键词会被设置成被传入的值（这里指调用bind()时传入的参数）。因此，这里我们传入想要的上下文 this(其实就是 foo )，到 bind() 函数中。然后，当回调函数被执行的时候， this 便指向 foo 对象。再来一个简单的栗子：
var bar = function(){
console.log(this.x);
}
var foo = {
x:3
}
bar(); // undefined
var func = bar.bind(foo);
func(); // 3
这里我们创建了一个新的函数 func，当使用 bind() 创建一个绑定函数之后，它被执行的时候，它的 this 会被设置成 foo ， 而不是像我们调用 bar() 时的全局作用域。

有个有趣的问题，如果连续 bind() 两次，亦或者是连续 bind() 三次那么输出的值是什么呢？像这样：

var bar = function(){
console.log(this.x);
}
var foo = {
x:3
}
var sed = {
x:4
}
var func = bar.bind(foo).bind(sed);
func(); //?
var fiv = {
x:5
}
var func = bar.bind(foo).bind(sed).bind(fiv);
func(); //?
答案是，两次都仍将输出 3 ，而非期待中的 4 和 5 。原因是，在Javascript中，多次 bind() 是无效的。更深层次的原因， bind() 的实现，相当于使用函数在内部包了一个 call / apply ，第二次 bind() 相当于再包住第一次 bind() ,故第二次以后的 bind 是无法生效的。