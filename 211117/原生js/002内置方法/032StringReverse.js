/*
  不使用字符串的方法，将字符串  "abcd.efgh.mnhm" 翻转为 "mnhm.efgh.abcd"
   解题思路 考虑正则捕获 字符串 
*/

let str = 'abcd.efgh.mnhm'
let str1 = 'blog.csdn.net'



function resStr( sourceStr, resStr='') {
	let reg = /([a-z]+)/gi//正则捕获字符串
	let m = sourceStr.match(reg) 
	for(var i= m.length-1;i>=0; i--) {
		if(i!=0) {
			resStr =resStr + m[i]+"."
		}else {
			resStr += m[i]
		}
	}
	return resStr
}


let resstr = resStr(str)
let resstr1 = resStr(str1)

console.log(str,'\n',resstr)
console.log(str1,'\n',resstr1)

