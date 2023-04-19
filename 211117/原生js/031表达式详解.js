
/*
	

*/
let a = 2
a.a = 12
console.log(a.a)//undefined  注意非对象，附属性的时候，js会将其转换为对象（叫做包装对象）所以不报错，但是赋值后就销毁，所以不能获得值，打印为undefined

console.log((2).b,(2)['b'])//undefined,undefined
console.log(1.a)//这个会报错，这个.会被认为是小数点
console.log(1..a,1.['a'])//undefined  这个不报错，是因为 第一个.为小数点，第二个看做属性点
console.log(1 .a,1 ['a'])
/*
  a1 =[b1][b1=a1,0] ==> a1 =[11][b1=21,0] ==> a1 =[b1][b1=a1,0] 第二个[]可以看做是索引值 ==> a1 =[11][0] ==> a1 = 11
*/


