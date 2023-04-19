/*
	闭包读取不止一个数据
*/

var res1,res2;
function foo() {
	var num1 = Math.random()
	var num2 = Math.random()
	
	return {
		num1: function() { return num1 },
		num2: function() { return num2 }
	}
}

let f = foo()

res1 = f.num1()
res2 = f.num2()

console.log(res1 +"\n" + res2 ) 


/*
	闭包读取和修改一个数据
*/

var res3,res4;
function foo1() {
	var num1 = Math.random()

	return {
		getNum: function() { return num1 },
		setNum: function(value) { num1= value }
	}
	
}

let f1 = foo1()

res3 = f1.getNum()
f1.setNum(5)
res4 = f1.getNum()
console.log(res3 +"\n" + res4 ) 
