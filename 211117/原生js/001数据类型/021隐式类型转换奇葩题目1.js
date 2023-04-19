!(!"Number(undefined)");//true
console.log('!(!"Number(undefined)") =',!(!"Number(undefined)"))
/*
	取反运算符 ！只有5个值(null,undefined,'',NaN,0)为false，其余全为true
*/

isNaN(parseInt(new Date())) + Number([1]) + typeof undefined
console.log('isNaN(parseInt(new Date())) + Number([1]) + typeof undefined=',isNaN(parseInt(new Date())) + Number([1]) + typeof undefined)

/*
	 
	parseInt(string, radix)必需。
	string要被解析的字符串。
	radix可选。表示要解析的数字的基数(进位数)。该值介于 2 ~ 36 之间。如果省略该参数或其值为 0，
	会根据 string 来判断数字的基数如果 string 以 "0x" 开头，parseInt() 会把 string 的其余部
	分解析为十六进制的整数。如果 string 以 0 开头，那么 ECMAScript v3 允许 parseInt() 的一个
	实现把其后的字符解析为八进制或十六进制的数字。如果 string 以 1 ~ 9 的数字开头，parseInt() 
	将把它解析为十进制的整数。
	如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。
	isNaN()函数用于检查其参数是否是"非数字值",即 所有Number能转化为数值的均为false，否则为true
	isNuN('A') true  
	isNaN(null) false
	isNaN(undefined) true
	isNaN([]) false
	isNaN([1,2])false
	
	本题中 new Date() 为字母开头的日期值Mon Apr 27 2020 15:31:01 GMT+0800 (中国标准时间)，所以返回NaN
	isNaN(NaN) 为true
	
	Number([1]) = 1
	
	typeof undefined = 'undefined'
	
	true + 1 + "undefined"  => 1 + 1 + "undefined" ="2undefined"
	
	
*/

Boolean(Number("")) + !isNaN(Number(null)) + Boolean('parserInt([])') +typeof !(null)
console.log('Boolean(Number("")) + !isNaN(Number(null)) + Boolean("parserInt([])") +typeof !(null) =',Boolean(Number("")) + !isNaN(Number(null)) + Boolean('parserInt([])') +typeof !(null))
/*
	Number("") = 0   Boolean(0) = false
	Number(null) = 0 isNaN(0) = false !false = true 
	Boolean("parseInt([])") = true
	typeof !(null) = "boolean"
	
	false + true + true + "true" = 0 + 1 +1 +"true" = "2boolean"
*/

parseFloat('1.6PX') + parseInt('1.2px') + typeof parseInt(null)

console.log("parseFloat('1.6PX') + parseInt('1.2px') + typeof parseInt(null)=",parseFloat('1.6PX') + parseInt('1.2px') + typeof parseInt(null))

/*
	parseFloat('1.6PX') = 1.6    parseInt('1.2px') = 1  parseInt(null)= NaN typeof 0 = 'number'
	1.6 + 1 + 'number' = '2.6number'
*/

isNaN(Number(!!Number(parseInt("0.8"))))

console.log("isNaN(Number(!!Number(parseInt('0.8')))) = ",isNaN(Number(!!Number(parseInt("0.8")))))

/*
	parseInt("0.8") = 0 =>Number(0)=0 => !0 = true => !false = true  => Number(true) = 1 => isNaN(1)=false
*/

typeof "parseInt(null)" + 12 + !!Number(NaN)

console.log('typeof "parseInt(null)" + 12 + !!Number(NaN) ==',typeof "parseInt(null)" + 12 + !!Number(NaN))

/*
	type of "parseInt(null)" = 'string'
    !!Number(NaN) = !!NaN = !true = false	
	'string' + 12 + false = "string12false"
*/


!typeof(isNaN("")) + parseInt(NaN)

console.log('!typeof(isNaN("")) + parseInt(NaN) =',!typeof(isNaN("")) + parseInt(NaN))

/*
	isNaN("") = false; typeof false = "boolean"; !"boolean" = false
	parseInt(NaN) = NaN
	false + NaN =NaN (此时加号为数学运算)
*/

typeof !parseInt(null) + !isNaN(null)
console.log('typeof !parseInt(null) + !isNaN(NULL)=',typeof !parseInt(null) + !isNaN(null))
/*
 parseInt(null) = NaN  => !NaN = true => typeof true = "boolean"
 isNaN(null) = false  => !false = true
 
 "boolean" + true = "booleantrue"
*/


m()
var m = 1

function m() {
	console.log(m)
}

m()








