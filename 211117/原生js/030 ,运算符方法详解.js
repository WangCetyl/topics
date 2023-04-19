
/*
	

*/
console.log(1,2,3) //1,2,3
console.log((1,2,3))  //3

alert(1,2,3) //"1"
alert((1,2,3))  //"3"


for(var i=0,j=0,k;i<10,j<10;i++,j++){
	k = i + j
}
console.log(k)  //18  以上for括号中，以分号为段落，
//第一段是变量声明，中间是个,运算符，所以实际上只有j<0这个条件有效，第三段表示ij各自++。如果let声明，结果报错k is not defined

//交换变量
//通常操作 
let a = 1,
    b = 2,
	c;
console.log(a,b)//1,2
c = a
a = b 
b = c

console.log(a,b) //2,1

let a1 = 11,
    b1 = 21;
	
a1 =[b1][b1=a1,0]
console.log(a1,b1)//21 11
/*
  a1 =[b1][b1=a1,0] ==> a1 =[11][b1=21,0] ==> a1 =[b1][b1=a1,0] 第二个[]可以看做是索引值 ==> a1 =[11][0] ==> a1 = 11
*/

//es6中  结构复制更简单
let a2 = 12,
    b2 = 22;
	
	[a2,b2] = [b2,a2]
	
console.log(a2,b2)//22,12

