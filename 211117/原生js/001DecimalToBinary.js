/*
  十进制转二进制
  用十进制数除以2，取所有余数按倒序顺序链接，同时数值除以2取直到数变为1
  将最后的该数值1或者0添加为第一位

  十进制转任意进制数(小等于16)
  用十进制数除以进制数，取所有余数按倒序顺序链接，同时数值除以进制数取直到数变为小于进制数
  将最后的该数值添加为第一位

 */
/*考虑到10进制以后大于9的数字会被转化为26个英文字母表单*/
const numMoreThan9ConvertToaAlph = (num) => {
    if (num < 10) return num
    switch(num) {
        case 10:
        return 'a'
        break;
        case 11:
        return 'b'
        break;
        case 12:
        return 'c'
        break;
        case 13:
        return 'd'
        break;
        case 14:
        return 'e'
        break;
        case 15:
        return 'f'
        break;
    }
}
const DecimalToBinary = (decnum, systemnum=2) => {
    let result  = []
    while(decnum > systemnum-1) {
        result.unshift(numMoreThan9ConvertToaAlph(decnum%systemnum))
        decnum = Math.floor(decnum/systemnum)
    }
    result.unshift(numMoreThan9ConvertToaAlph(decnum))
    result = result.join('')
    // 判断一下如果是8位数的前面加一个0，如果16进制前面加0X
    // if(systemnum === 2) return '0b' + result
    if(systemnum === 8) return '0' + result
    if(systemnum === 16) return '0x' + result
    return result
}

for(let i = 9999; i<10000; i++) {
    let i2 = DecimalToBinary(i,2)
    let i8 = DecimalToBinary(i,8)
    let i16 = DecimalToBinary(i,16)
    console.log(`${i}的二进制 = `, i2)
    console.log(`${i}的八进制 = `,i8)
    console.log(`${i}的十六进制 = `,i16)
    console.log(`${i2}的十进制 =`,parseInt(i2,2))
    console.log(`${i8}的十进制 =`,parseInt(i8,8))
    console.log(`${i16}的十进制 =`,parseInt(i16,16))
}

