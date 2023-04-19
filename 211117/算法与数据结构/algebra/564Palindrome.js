/* 
    回文数字间隔
*/  
 /*
    判断是否是回文数
    @n  输入的数
    @isPalindrome 返回值true/false
 */

//字符串转换
const checkPalindrome1 = (n,isPalindrome = false) => {
    //将数的各个位的数拆分到一个数组中
    //1 判断这个数的位数
    let nStr = String(n)
    let nNum = nStr.length
    //字符串取中值，无论奇数 偶数，
    let halfNArrLen = Math.ceil(nNum/2)
    //将首位对比的结果放入judgeArr中
    let judgeArr = []
    for(let i = 0; i< halfNArrLen; i++) {
        judgeArr.push(nStr[i] === nStr[nStr.length-1-i])
    }
    isPalindrome = judgeArr.every(item => item)
    return isPalindrome
}

let arr1 = []
let intervalArr1 = []
for(let i = 100000000; i< 1000000000;i++) {
    if(checkPalindrome1(i)) {
        arr1.push(i)
    }
}
for(let i = 1; i< arr1.length;i++) {
    intervalArr1.push(arr1[i]-arr1[i-1])
}
// console.log(arr1)
// console.log(intervalArr1)//1
console.log([...new Set(intervalArr1)])//1

/*
  回位数的间隔规律 按照数字的位数间隔数字是有迹可循的
  位数          间隔数字                                 数字10次幂数字        对应的间隔数字个数             对应的值同幂的关系(幂数的一半10的指数，混合)
   1              1                                          0              Math.floor(0/2)+1 =1              10^0  Math.ceil(0/2) [0]
   2              11                                         1              Math.floor(1/2)+1 =1              10^0+10^1 Math.ceil(1/2) [0,1]
   3              10 11                                      2              Math.floor(2/2)+1 =2              10^0+10^1,10^1 Math.ceil(2/2) [0,1]
   4              11 110                                     3              Math.floor(3/2)+1 =2              10^0+10^1,10^1+10^2,  Math.ceil(3/2) [0,1,2]
   5              11 100 110                                 4              Math.floor(4/2)+1 =3              10^0+10^1,10^1+10^2,10^2  Math.ceil(4/2)  [0,1,2]
   6              11 110 1100                                5              Math.floor(5/2)+1 =3              
   7              11 110 1000 1100                           6              Math.floor(6/2)+1 =4
   8              11 110 1100 11000                          7              Math.floor(7/2)+1 =4
   9              11 110 1100 10000 11000                    8              Math.floor(8/2)+1 =5


*/