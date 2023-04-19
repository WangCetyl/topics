
var f =1 
if(!f) {
	var a = 10
}

function fn() {
	var b= 20
	c = 30
}

fn();
console.log(a)
console.log(c)
console.log(b)
/*
  undefined  
30
G:\test\interview\topics\003var_Hoisting.js:15
console.log(b)
            ^

ReferenceError: b is not defined
    at Object.<anonymous> (G:\test\interview\topics\003var_Hoisting.js:15:13)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
    at startup (bootstrap_node.js:188:16)
    at bootstrap_node.js:609:3
	
1 没有用var声明的是全局对象，即使在函数内部，所以  console.log(c)=30
2.只有在函数内部新声明的才是局部对象，在if，while，for等内部声明的变量其实
   是全局变量(除非本身在function内部)
3. 因为变量提升，虽然if内部没有执行，但是预解析的阶段会执行var a 只是没有赋值 所以undefined
   但是 b是函数内部的声明 局部变量，出来就会报错 ReferenceError: b is not defined

*/