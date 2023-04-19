
/*
	

*/

let data = [
	{"type":"数字","value":3},//数字在使用toString()方法的时候 需要用句柄来使用否则报错
	{"type":"字符串","value":"lewis"},
	{"type":"布尔值","value":true},
	{"type":"数组","value":[1,2,"a",{"a":5}]},
	{"type":"函数","value":function(){}},//函数在使用toString()方法的时候 需要用句柄来使用否则报错
	{"type":"对象","value":{"a":5}}, //对象在使用toString()方法的时候 需要用句柄来使用否则报错
	{"type":"日期","value":new Date()},
	{"type":"正则","value":new RegExp()}
	
]

for(let i=0; i<data.length; i++) {
	console.log(
		data[i].type + "value0f()",
		data[i].value.valueOf()
	);
	console.log(
		data[i].type + "toString()",
		data[i].value.toString()
	);
}
/*
数字value0f() 3
数字toString() 3
字符串value0f() lewis
字符串toString() lewis
布尔值value0f() true
布尔值toString() true
数组value0f() (4) [1, 2, "a", {…}]0: 11: 22: "a"3: {a: 5}length: 4__proto__: Array(0)
数组toString() 1,2,a,[object Object]
函数value0f() ƒ (){}
函数toString() function(){}
对象value0f() {a: 5}
对象toString() [object Object]
日期value0f() 1588403587401
日期toString() Sat May 02 2020 15:13:07 GMT+0800 (中国标准时间)
正则value0f() /(?:)/
正则toString() /(?:)/
*/


