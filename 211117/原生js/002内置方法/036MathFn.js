/*
	Math.abs() 获取绝对值如果传入的不是数字值，首先Number转换，再输出
	@params
		
	@return
		

*/


console.log(Math.abs(-19))//19
console.log(Math.abs('-1'))//1
console.log(Math.abs('fd2'))//NaN
console.log(Math.abs('2fd'))//NaN
console.log(Math.abs([1]))//1
console.log(Math.abs([1,2]))//NaN

/*
	Math.ceil/floor
	向上向下取整	

*/

console.log(Math.ceil(-19.12))//-19
console.log(Math.floor(-19.12))//-20
console.log(Math.ceil(19.12))//20
console.log(Math.floor(19.12))//19
console.log(Math.ceil('11df'))//NaN
console.log(Math.floor('11df'))//NaN
console.log(Math.ceil([1.1]))//2
console.log(Math.floor([1.1]))//1

/*
	Math.round()
	四首五入
*/
console.log(Math.round(-19.12))//-19
console.log(Math.round(-19.5))//-19
console.log(Math.round(-19.9))//-19
console.log(Math.round(19.5))//20
console.log(Math.round(19.12))//19
console.log(Math.round('11df'))//NaN
console.log(Math.round([1.1]))//1

/*
	Math.max()/Math.min()
	取最大值，最小值
*/

console.log(Math.max(19,12))//19
console.log(Math.min(19,12))//19

let a = [123,43,54,5,46,54,76,764,847,847,84]
console.log(Math.min.apply([],a))//5
console.log(Math.max.apply([],a))//847

/*
	Math.random()
	获取0~1之间的随机小数
*/

let aa = Math.random()


//获取[n,m]之间的随机整数 
//let w = Math.ceil(Math.random()*(m-n))+n
for(let i = 1;i<4;i++) {

	console.log(`这是第${i}`,Math.ceil(Math.random()*(10-1)))
}