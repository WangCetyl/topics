//利用new进行实例化对象，利用原型(prototype)实现继承，在继承时只会继承原型链上的属性和方法，不会继承挂在对象自身上的属性和方法，实例化时对象具有所有的属性和方法
//
// 1通过构造函数继承 对象冒充
function  Fn(arg1) {
	this.arg1 = arg1
	this.say = function() { console.log('sayFn') }
}

Fn.prototype.saypt = function() { console.log('saypt')}

function fn(fnarg1) {
	Fn.call(this,"arg1Fn")//或者 Fn.apply(fn)  意思为将Fn的this指向fn从而继承Fn的属性
	this.fnarg1 = fnarg1
}

// 此时执行如下命令
console.log(new fn('jACK'))
//fn {arg1: "arg1Fn", say: ƒ, fnarg1: "jACK"}可以看到fn继承了Fn的属性 并且拥有自己的属性 fnarg1
//从打印开出fn的实例继承了say 但是原型链上面的 saypt没有继承


// 2.通过原型链实行继承
function  Fn2(arg1) {
	this.arg1 = arg1
	this.say = function() { console.log('sayFn2') }
	this.array = [1,2,3,4]
}

Fn2.prototype.saypt = function() { console.log('say2pt')}

function fn2(fnarg1) {
	
	this.fnarg1 = fnarg1
}

fn2.prototype = new Fn2("Fn2arg1")//通过原型链实现从Fn2的继承

console.log(new fn2('jACK发你'))
//fn2 {fnarg1: "jACK发你"}
	// fnarg1: "jACK发你"
	// __proto__: Fn2
	// arg1: "Fn2arg1"
	// say: ƒ ()
	// __proto__: Object
// 该继承方式缺点是，如果修改其中一个实例的引用类型属性，其他实例的引用类型属性也相应改变
//并且子类参数无法向父类传参
var fn2c3 = new fn2("实例一")
var fn2c4 = new fn2("实例2")
console.log(fn2c3.arg1,fn2c4.arg1)//Fn2arg1 Fn2arg1
console.log(fn2c3.array,fn2c4.array)//(4) [1, 2, 3, 4] (4) [1, 2, 3, 4]
fn2c3.arg1 ="Fnarg1change"
fn2c3.array.push(9)
console.log(fn2c3.arg1,fn2c4.arg1)//Fnarg1change Fn2arg1   看到基本类型属性不影响
console.log(fn2c3.array,fn2c4.array)//[1, 2, 3, 4, 9] (5) [1, 2, 3, 4, 9]  引用类型的改变了

//3混合继承
function  Fn3(arg1) {
	this.arg1 = arg1
	this.say = function() { console.log('say3Fn') }
	this.array = [1,2,3,4]
}

Fn3.prototype.saypt = function() { console.log('say3pt')}

function fn3(fnarg1) {
	Fn3.call(this,"arg1Fn3")
	this.fnarg1 = fnarg1
}

fn3.prototype = new Fn3("Fn3arg1")

var fn3c1 = new fn3("实例一")
var fn3c2 = new fn3("实例2")
console.log(fn3c1.arg1,fn3c1.arg1)//arg1Fn3 arg1Fn3
console.log(fn3c2.array,fn3c2.array)// [1, 2, 3, 4] (4) [1, 2, 3, 4]
fn3c1.arg1 ="Fnarg1change"
fn3c2.array.push(9)
console.log(fn3c1.arg1,fn3c2.arg1)//Fnarg1change arg1Fn3
console.log(fn3c1.array,fn3c2.array)//[1, 2, 3, 4] (5) [1, 2, 3, 4, 9]

console.log(fn3c1.__proto__.constructor===fn3)//false
console.log(fn3c1.__proto__.constructor===Fn3)//true

console.log(fn3c1 instanceof fn3)//true
console.log(fn3c1 instanceof Fn3)//true
// 这种方式的缺点是Fn3被两次执行 复制，开销并且无法判断fn4c1是fn4 或者Fn4的实例

//4混合继承的优化方式1
function  Fn4(arg1) {
	this.arg1 = arg1
	this.say = function() { console.log('say4Fn') }
	this.array = [1,2,3,4]
}

Fn4.prototype.saypt = function() { console.log('say4pt')}

function fn4(fnarg1) {
	Fn4.call(this,"arg1Fn4")
	this.fnarg1 = fnarg1
}

fn4.prototype = Fn4.prototype

var fn4c1 = new fn4("实例一")
var fn4c2 = new fn4("实例2")
console.log(fn4c1.arg1,fn4c1.arg1)//arg1Fn4 arg1Fn4
console.log(fn4c2.array,fn4c2.array)// [1, 2, 3, 4] (4) [1, 2, 3, 4]
fn4c1.arg1 ="Fnarg1change"
fn4c2.array.push(9)
console.log(fn4c1.arg1,fn4c2.arg1)//Fnarg1change arg1Fn4
console.log(fn4c1.array,fn4c2.array)//[1, 2, 3, 4] (5) [1, 2, 3, 4, 9]


console.log(fn4c1.__proto__.constructor===fn4)//false
console.log(fn4c1.__proto__.constructor===Fn4)//true

console.log(fn4c1 instanceof fn4)//true
console.log(fn4c1 instanceof Fn4)//true
// 这种方式的缺点无法判断fn4c1是fn4 或者Fn4的实例

//5混合继承的优化方式2
function  Fn5(arg1) {
	this.arg1 = arg1
	this.say = function() { console.log('say5Fn') }
	this.array = [1,2,3,4]
}

Fn5.prototype.saypt = function() { console.log('say5pt')}

function fn5(fnarg1) {
	Fn5.call(this,"arg1Fn5")
	this.fnarg1 = fnarg1
}

fn5.prototype = Object.create( Fn5.prototype )
fn5.prototype = fn5

var fn5c1 = new fn5("实例一")
var fn5c2 = new fn5("实例2")
console.log(fn5c1.arg1,fn5c1.arg1)//arg1Fn3 arg1Fn3
console.log(fn5c2.array,fn5c2.array)// [1, 2, 3, 4] (4) [1, 2, 3, 4]
fn5c1.arg1 ="Fnarg1change"
fn5c2.array.push(9)
console.log(fn5c1.arg1,fn5c2.arg1)//Fnarg1change arg1Fn3
console.log(fn5c1.array,fn5c2.array)//[1, 2, 3, 4] (5) [1, 2, 3, 4, 9]


console.log(fn5c1.__proto__.constructor===fn5)//false
console.log(fn5c1.__proto__.constructor===Fn5)//false

console.log(fn5c1 instanceof fn5)//true
console.log(fn5c1 instanceof Fn5)//false
// 这种方式是完美的继承方式