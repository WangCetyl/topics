
/*
*   逗号运算符
*   1、将多个表达式放在一条语句里，按照从左到右的顺序执行每一个表达式，返回最后一个表的结果(在一条语句里执行多个运算)
*   2、优先级最低，最后才会有运算逗号
*   3、并不是所有的逗号都是操作符，声明变量，函数参数里的逗号都不是操作符
*
*
*   应用场景:
*   1、声明多个变量(不是逗号运算符)，可以用变量解构赋值代替
*   2、for循环里声明多个条件
*   3、交换两个变量的值
*/

console.log(1,3,4);//1,3,4
console.log((1,3,4));//4

//alert(1,3,4)//'1'
//alert((1,3,4))//'4'

let a = 3
const b =(a++, 20,30)
console.log(a,b)//4,30

//注意这种情况的循环过程，
//1. i=0，j=0 => k=i+j => j++,i++ => i<2 j<3(逗号运算符起作用，所以只判断最后一个条件j<3是否成立，不成立立刻结束)
//2. i=1，j=1 => k=i+j => j++,i++ => i<2 j<3
//
for(var i=0,j=0,k;i<2,j<3;i++,j++) {
    k =i+j
    console.log(k)
}
//0,2,4
for(var i=0,j=0,k;i<3,j<2;i++,j++) {
    k =i+j
    console.log(k)
}

//0,2

for(var i=0,j=0,k;i<2,j<10;i++,j+=2) {
    k =i+j
    console.log(i,j,k)
}
// 0 0 0
// 1 2 3
// 2 4 6
// 3 6 9
// 4 8 12

for(let i=0,j=0,k;i<2,j<10;i++,j+=2) {
    k =i+j
    console.log(i,j,k)
}

// 0 0 0
// 1 2 3
// 2 4 6
// 3 6 9
// 4 8 12
// 

//交换变量
{
    let a =10
    let b= 20
    let c
    console.log(a,b);
    c=a
    a = b
    b = c   
    console.log(a,b);
    //10 20
    //20 10
}
{
    let a =10
    let b= 20
    console.log(a,b);
    a =[b][b=a,0] 
    //=> a = [20][b=10,0](在第二个数组中b=10，b值改变,并且整个第二个数组中逗号运算符运算,变为[0],同时a=[20][0]=20)
    console.log(a,b);
    //10 20
    //20 10
}