

/* 
	防抖和节流
	1.防抖原理：多次触发时间时，只执行一次回调，在事件被触发n秒后执行回调，如果在n秒内再次被触发则重新开始
*/

var a = 12 

if(true) {
	console.log(a)
	//let a = 13//暂时性死区
	//console.log(a)
}

//zhuFengInterview12.js:11 Uncaught ReferenceError: Cannot access 'a' before initialization at zhuFengInterview12.js:11

function fn(){
  let a1 = 1;
  var b1 = 2;
}

fn()
console.log(a1);  //  ReferenceError: a is not defined.  在代码块外部访问let声明的变量，报错。
console.log(b1);