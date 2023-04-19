{
	/*
	
		如何将一个字符串的大小写取反(大写变小写，小写变大写)
	 */
	
	console.time('str')
	let str ="jdfklasjKKlHJKHw王金龙的练习题,4958092,djkljUIU"
	let m = str.split('')
	for (let i =0; i <m.length; i++) {
		//判断字母大小写还可以 字符。toLowCase()====字符
		//ASCII吗也可以 字符.charCodeAt()转换成数字
		if(m[i]>='A'&&m[i]<='Z') {
			m[i] = m[i].toLowerCase()
		}else if(m[i]>='a'&&m[i]<='z'){
			m[i] = m[i].toUpperCase()
		}
	}
	str = m.join('')
	console.log(str)
    console.timeEnd('str')

	console.time('str1')
	let str1 ="jdfklasjKKlHJKHw王金龙的练习题,4958092,djkljUIU"
	str1 = str1.replace(/[a-zA-Z]/g , (s)=> {

		return s.toLowerCase()!==s ? s.toLowerCase() : s.toUpperCase()
				
		// if(s>='A'&&s<='Z') {
		// 	return s = s.toLowerCase()
		// }else if(s>='a'&&s<='z'){
		// 	return s = s.toUpperCase()
		// }
	})

	console.log(str1)
    console.timeEnd('str1')
}

{

	/*
	从一个字符创中查找某个字符片段，如果有返回第一次获得的字符位置。
	 
	循环原始字符串每一项，让每一项从当前位置截取T.lenght个字符，然后比较，如果不一样，继续循环，如果命中，返回当前索引，结束循环
	 */
	~function() {

		function myIndexOf(T) {


			let lenT = T.length,
			    letS = this.length, 
			    res = -1
			    resArr = []

			if (lenT > letS ) { return -1} 
			for(let i = 0; i<= letS - lenT ; i++) {

				if(this.substr(i,lenT)===T) {
					res = i
					resArr.push(i) 
				}
			}

			if (resArr.length == 0) { return -1} 
			return resArr[0]

		}

		function myIndexsOf2(T) {
			let reg =  new RegExp(T)
			console.log(reg.exec(this))
			if(reg.exec(this)) {
				return reg.exec(this).index
			}else {

				return -1
			}

		}

		String.prototype.myIndexOf = myIndexOf
		String.prototype.myIndexsOf2 = myIndexsOf2

	}()

	let S = 'wangjinlowwnmygjmufskloiohfwwaoslo'
	    T='m'
	console.log(S.myIndexOf(T))
	console.log(S.myIndexsOf2(T))



}

