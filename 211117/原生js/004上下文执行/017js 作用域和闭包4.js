
if(false) {
	function f1() {
		console.log(true)
	}
}else {
	function f1() {
		console.log(false)
	}
}

f1()//false

if(true) {
	function f2() {
		console.log(true)
	}
}else {
	function f2() {
		console.log(false)
	}
}
f2()//true

/*
	if,else,while,do-while语块中的函数 可以看做是函数表达式，所以提升函数名变量，执行的时候看命中那个赋值
	但是注意 一般表达式中，f1是函数内部的name，不可以在外部f1()这样调用（报错，f1 is not defined）,但是在
	特例这里可以调用。
	
	但是在早期的浏览器版本2016年前，这种结构可以看做函数声明，从而首先变量提升

*/