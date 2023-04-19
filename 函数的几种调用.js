
/*
· 1.函数名（）
  2.函数名.call()
  3.函数名.apply()
  4.new 函数名()
  5.直接在后面加上一对小括号
  6.定时器
  7.ES6里面模板字符串
	

*/
 function fn(t) {
	 console.log(t)
 }
 
 fn("直接调用")
 fn.call(null,"call调用")
 fn.apply(null,["apply调用"])
 new fn("new调用")
 ;(function(t){console.log(t)})("自执行调用");
 setTimeout(fn("定时器调用1"),0)
 setTimeout(fn,0,"定时器调用2")
 fn`模板字符串调用`
 
 let fn1 = function (t){
	 console.log(t)
 }('函数表单时子执行')
 
 0+function(t){console.log(t)}
 0+(function(t){console.log(t)})("函数表达式是多种多样的")
 //函数表达式是多种多样的
//NaN

true&&(function(t){console.log(t)})("逻辑运算符&&函数")
false||(function(t){console.log(t)})("逻辑运算符||函数")
typeof (function(t){console.log(t)})("typeof 调用函数")
//逻辑运算符&&函数
//逻辑运算符||函数
//typeof 调用函数

/*
直接调用
call调用
apply调用
new调用
自执行调用
定时器调用1
["模板字符串调用", raw: Array(1)]
0: "模板字符串调用"
length: 1
raw: ["模板字符串调用"]
__proto__: Array(0)
函数表单时子执行
定时器调用2
*/


