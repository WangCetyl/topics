{
	/*
		编写一种正则,用来验证此规则:一个6~16位的字符串，必须同时保证包含大小写字母和数字
	 ·	1.检验字符串长度为6~16
	 	reg = /\S{6,16}/  \S代表除非空白以外的一切字符
	 	2.包含字母和数字
	 	reg = /[A-Za-z0-9]/
	 */

	let str = 'Ffg9gggggf'

	let reg00 = /(?!^[A-Za-z]+$)(?!^[0-9]+$)(?!^[a-z0-9]+$)(?!^[A-Z0-9]+$)^[A-Za-z0-9]{6,16}$/

	// let reg =  /(\S{6,16})([A-Z]+)([a-z]+)([0-9]+)/
	// let reg =  /(^([A-Z]+)([a-z]+)([0-9]+$)){6,16}/
	let reg1=/\S{6,16}/
	let reg2=/[A-Z]+/
	let reg4=/[a-z]+/
	let reg3=/[0-9]+/


	console.log(reg00.test(str))
	console.log(reg.test(str))
	// console.log(reg.exec(str))
	console.log(reg1.test(str)&&reg2.test(str)&&reg3.test(str)&&reg4.test(str))
	console.log(reg1.test(str))
	console.log(reg2.test(str))
	console.log(reg3.test(str))
	console.log(reg4.test(str))
}

// {
// 	/*
// 		1~10包含数字字母 必须有下划线

// 	 */
	
// 	let reg = /(?!^[0-9a-zA-Z]+$)(^\w){1,10}$/
// }

{
	{
	/*
		英文字母 汉字组成的字符串，给英文单词前后加上空格

	 */
	
	let reg = /\b[a-z]+\b/ig

	let str = "China中国nihao镇江"

	str = str.replace(reg,item => {
		 
		console.log(item)
		return ' ' + item + ' '

	}).trim()

	console.log(str)
}
}