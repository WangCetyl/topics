
function Fn () {
	var a = '您好！'
	return function fn () {
		console.log(a)//自由变量 在父作用域寻找 该父作用域就是Fn,所、以值一直是Fn中最靠近的a值
	}
}
var a = 1000
let fn1 = Fn()
fn1()
//您好！
------------------------------------------------------------
function Fn () {
	
	return function fn () {
		console.log(a)
	}
}
var a = 1000
let fn1 = Fn()
fn1()
//1000
-------------------------------------------------------------
//闭包
//函数作为返回值
//函数作为参数传值

function Fn () {
	var a = '您好！F1'
	return function fn () {
		console.log(a)
	}
}
var a = 1000
let fn1 = Fn()

function F2(fn) {
	var a ='您好F2'
	fn()
}
F2(fn1 )//您好！F1
