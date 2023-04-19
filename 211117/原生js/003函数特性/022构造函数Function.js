
/*
	Function(a1,12,a3,a4,context)构造函数 一个重要用途就是将Ajax的返回的字符串 改为数据原型
	其中所有参数都是字符串，最后一个事函数体内的内容。之前的都是函数参数

*/

var  Ajaxdata = "[1,2,3,4,5]"

var arr = (new Function('return' + Ajaxdata + ';'))() 

console.log(arr)//[1,2,3,4,5]


var fn = new Function('a','b','console.log(a+b)')

fn(1,2)
fn('wang'," lewis")

