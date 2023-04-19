/*
    js中由于小数处理的不精确的问题解决
    1.对于小数部分 各自乘以最高小数个数的10的倍数，在除以这个数
    2.使用用Number.toFixed()四首五入
*/

console.log('0.2+0.1 =', 0.1+0.2) //0.2+0.1 = 0.30000000000000004
console.log('0.2+0.1.toFixed() =', (0.1+0.2).toFixed(1)) //0.2+0.1 = 0.3
console.log('0.2+0.1 =', (0.1*10+0.2*10)/10) //0.2+0.1 = 0.3

console.log('0.2349+0.166 =', 0.2349+0.166) //0.2349+0.166 = 0.40090000000000003
console.log('0.2349+0.166.toFixed() =', (0.2349+0.166).toFixed(4)) //0.2349+0.166 = 0.4009
console.log('0.2349+0.166 =', (0.2349*10000+0.166*10000)/10000) //0.2349+0.166 = 0.4009

{
    /*获取小数点后的数字个数*/
    function getDigitsNum(Num) {
        if(typeof Num !== 'number') throw new Error('请您输入一个数字')
        if(Num.toString().split('.').length <= 1) return '这个数字没有小数'
        return Num.toString().split('.').pop().length
    }
    
    /*获取运算表达式中所有的数字*/
    let reg = /(\d+\.*\d*)/ug
    let data = 5+33.33+77.33*849385*0.0889789
    console.log(JSON.stringify(5+33.33+77.33*849385*0.0889789))
}

{

    const str = 'lews\
arguments'

console.log(str)
}

console.log(Boolean(Symbol('a'))) 