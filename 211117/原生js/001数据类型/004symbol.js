/*Symbol无法容其他类型数据进行运算 否则报错*/
// console.log(Symbol('a') + 1)//Uncaught TypeError: Cannot convert a Symbol value to a number

/*Symbol不可以转化为数字*/
// console.log(Number(Symbol('a')))//Uncaught TypeError: Cannot convert a Symbol value to a number

/*Symbol可以转化为字符串*/
console.log(String(Symbol('a')))  
console.log(Symbol('a').toString())//Symbol(a)

/*Symbol可以转化boolean true*/
console.log(Boolean(Symbol('a')))  //true

/*Symbol 作为对象的键时候 需要使用[]来定义 和取值*/
const a = Symbol('a')
const a1 = Symbol('a1')

const obj = {
    a:1,
    [a]:1,
    [a1]:2
}

console.log(obj)//{a: 1, Symbol(a): 1}
console.log(obj[a1])//2
console.log(obj.a1)//undefined

/*对象中 Symbol值为键的数据无法通过 for in  for of Object.keys(),JSON.stringfied().Object.getOwenPropertyName()获取 */

for(key in obj) {
    console.log(key)
}
// a

for(b of Object.entries(obj)) {
    console.log(b)
}
// (2) ["a", 1]

console.log(Object.keys(obj))//["a"]
console.log(Object.getOwnPropertyNames(obj)) //["a"]
console.log(Object.getOwnPropertySymbols(obj))//[Symbol(a), Symbol(a1)] 

