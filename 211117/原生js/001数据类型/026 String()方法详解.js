
/*
	String()
	基本数据类型、null、undefined的结果就是给数据就是给数据加上引号变成字符串
	1、数组的结果为把所有中括号去掉，外面价格引号
	2、对象的结果为'[object object]'(除了日期对象)
	3、函数的结果为在函数整体外面加个引号
*/

console.log("String(3) =") 
String(3)
console.log("String(null) =") 
String(null)
console.log("String(undefined) =") 
String(undefined)
console.log("String([1,2,'q']) =") 
String([1,2,'q'])
console.log("String({'a':1}) =") 
String({"a":1})

String(function() {console.log()})

String(new Date())//"Sat May 02 2020 14:41:41 GMT+0800 (中国标准时间)"

String(new RegExp())//"/(?:)/"

/*
"3"
"null"
"undefined"
"1,2,q"
"[object Object]"
"function() {console.log()}"
"Sat May 02 2020 14:41:41 GMT+0800 (中国标准时间)"
"/(?:)/"

*/


