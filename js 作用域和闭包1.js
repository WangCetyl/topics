
console.log(a)
var a =100
//undefied 未定义

a=100
console.log(a)
var a 
// 100  注意使用var 可以先赋值 后定义，但是let就不可以

a=100
console.log(a)
let a 
//Uncaught ReferenceError: m is not defined 引用错误

f1(10000); 
function f1(a) { 
	console.log(this)
	console.log(arguments)
	b=100;//注意使用var b可以先赋值 后定义，但是let就不可以
	console.log(a);
	var b;
	console.log(b)
	f11(30)
	function f11(v) {
		console.log(v)
	}
}

//answers:
//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
//VM1643:4 Arguments [10000, callee: ƒ, Symbol(Symbol.iterator): ƒ]
//VM1643:6 10000
//VM1643:8 100
//VM1643:11 30

f2(100)
f2=function(a) {
	console.log(a)
}

//Uncaught ReferenceError: f2 is not defined   at <anonymous>:1:1

