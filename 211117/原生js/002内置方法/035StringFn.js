/*
	charAt：根据索引获取指定位置的字符
	charCodeAt:获取指定字符的ASII码值(Unicode编码值)
	@params
		n[number] 获取字符指定的索引
	@return
		返回查找的字符
		找不到字符返回空字符而不是undefined，或者对应的编码值

*/
let str = 'wanglewisnuourAAAew1SSS4323984gjslehka'

console.log(str[19])//1
console.log(str.charAt(19))//1
console.log(str.charCodeAt(19))//49
console.log(String.fromCharCode(49))//1
console.log(str[1009])//undefined
console.log(str.charAt(1009))//''
console.log(str.charCodeAt(1009))//NaN

/*
	字符串截取常用方法
	substr：n,m,从索引n开始截取m字符，如果m缺省，直接截取到末尾
	substring:n,m从索引n开始,寻找到索引m处，不包含m,m>n 否则返回空字符
	slice:同substring一样，但是slice支持负数作为索引，其余两个方法不可以
	@params
		substr：n,m,从索引n开始截取m字符，如果m缺省，直接截取到末尾
		substring:n,m从索引n开始,寻找到索引m处，不包含m,m>n 否则返回空字符
		slice:同substring一样，但是slice支持负数作为索引，其余两个方法不可以
	@return
		

*/
console.log(str.substr(1,9))//anglewisn
console.log(str.substring(1,9))//anglewis
console.log(str.slice(1,9))//anglewis
console.log(str.substring(-4,-1))//''
console.log(str.slice(-4,-1))//ehk

/*
	toLowerCase,toUpperCase
	@params
		toLowerCase(),转小写
	    toUpperCase(),转大写
	@return
		返回第指定开头下的第一个索引，或者最后一个索引

*/
let str1 = 'sjZF'
console.log(str1.toLowerCase())//sjzf
console.log(str1.toUpperCase())//SJZF
console.log(str1.substr(0,1).toUpperCase()+ str1.substr(1))//SjZF

/*
	split([分割符])：把字符串按照指定的分隔符拆分成数组（对应数组中的join）
	split支出传递正则表达式

*/

let str2 = 's,jfkljk,jkljl,jljl'
let str3 = 's-jfkljk-jkljl,jljl'
let strArr = str2.split(',')
let strArr1 = str3.split(/(\-|\,)/gi)

console.log(str2)//s,jfkljk,jkljl,jljl
console.log(strArr)//[ 's', 'jfkljk', 'jkljl', 'jljl']
console.log(strArr.join('-'))//'s-jfkljk-jkljl-jljl'
console.log(strArr1)//[ 's', '-', 'jfkljk', '-', 'jkljl', ',', 'jljl' ]


/*
	replace(oldStr,newStr);实现新字符替换老字符
	只能替换一次，所以一般使用正则

*/
let strreplace = 'wewiwais'

strreplace.replace('w','-')
console.log(strreplace.replace('w','-'))//'-ewiwais'  只能替换一次，所以一般使用正则

let strreplace1 = 'wangWangwang'
console.log(strreplace1.replace(/w/gi,'-'))//-ang-ang-ang
