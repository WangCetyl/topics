/*
  二进制转十进制
    1。数字的位数，
    2.每位数字值 乘以 该进制数字的（位次-1）次方
    3.各位相加
 */
/*将非数字的值转化为数字*/
const AlphConvertTonumMoreThan9 = (num) => {
    // 如果parseInt后是0直接返回0
    if(parseInt(num) ===0) return 0
    // 如果parseInt后是1~9直接返回 parseInt(num)
    if (parseInt(num)&& (parseInt(num)< 10)) return parseInt(num)
    // 其他情况为26个字母的话，转换相应值
    switch(num) {
        case 'a':
        return 10
        break;
        case 'b':
        return 11
        break;
        case 'c':
        return 12
        break;
        case 'd':
        return 13
        break;
        case 'e':
        return 14
        break;
        case 'f':
        return 15
        break;
    }
}
const BinaryToDecimal = (num, systemnum=2) => {
   let result = 0
   num = String(num)
   let numlength = num.length
   for(let i = 0; i<numlength; i++) {
       // console.log(num[i],AlphConvertTonumMoreThan9(num[i]),systemnum**(numlength-i-1))
       // result += AlphConvertTonumMoreThan9(num[i])*(systemnum**(numlength-i-1))
       result += AlphConvertTonumMoreThan9(num[i])* Math.pow(systemnum,(numlength-i-1))
   }

   return result
}

console.log(BinaryToDecimal(10011100001111,2))
// console.log(parseInt(10011100001111,2))
console.log(BinaryToDecimal('23417',8))
// console.log(parseInt('af12',16))
console.log(BinaryToDecimal('270f',16))

