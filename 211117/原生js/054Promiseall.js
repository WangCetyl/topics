/*
    原理：
    The Promise.all() method takes an iterable of promises as an input, and returns a single Promise
    that resolves to an array of the results of the input promises. This returned promise will resolve 
    when all of the input's promises have resolved, or if the input iterable contains no promises. 
    It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, 
    and will reject with this first rejection message / error.

    Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，
    输入的所有promise的resolve回调的结果是一个数组。这个Promise的resolve
    回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。它的reject
    回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且
    reject的是第一个抛出的错误信息。

    使用Promise.all的语法使用
    参数为一个可遍历的数组 Set Map，数组中每一项都是一个promise实例
    如果全部成功返回一个数组，数组中的每一个值对应参数中每一个的实例结果
    如果有一个失败，就返回第一个失败的结果

    使用Promise.race
    原理：
    Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
    语法使用
    参数为一个数组，数组中每一项都是一个promise实例
    无论实例中成功与否 返回第一个出现结果的
*/

const p1 = Promise.resolve('p1')
const p2 = Promise.resolve('p2')
const p3 = Promise.resolve('p3')
const p4 = Promise.reject('p4')
const p5 = Promise.reject('p5')
const p6 = new Promise((resolve,reject) =>setTimeout(() => resolve('p6'),1000))
const p7 = new Promise((resolve,reject) =>setTimeout(() => resolve('p7'),2000))
const p8 = new Promise((resolve,reject) =>setTimeout(() => resolve('p8'),3000))

const p10 = Promise.all([p1,p2,p3,p6])// ["p1", "p2", "p3", "p6"]
const p11 = Promise.all([p1,p2,p3,p4,p5])// p11 rejected all p4
const p12 = Promise.all([p1,p5,p4])//p12 rejected all p5
const p13 = Promise.race([p1,p2,p3,p6])// p13 resolved race p1
const p14 = Promise.race([p6,p7,p8])// p14 resolved race p6
const p15 = Promise.race([p6,p7,p8,p4])// p15 rejected race p4
const p16 = Promise.race([p1,p7,p8,p4])// p16 resolved race p1

const p17 = Promise.all([10,11,12,13])//
const p18 = Promise.race([10,11,12,13])// 

p10.then(value => console.log('p10 resolved all',value),reason => console.log('p10 rejected all',reason))
p11.then(value => console.log('p11 resolved all',value),reason => console.log('p11 rejected all',reason))
p12.then(value => console.log('p12 resolved all',value),reason => console.log('p12 rejected all',reason))
p13.then(value => console.log('p13 resolved race',value),reason => console.log('p13 rejected race',reason))
p14.then(value => console.log('p14 resolved race',value),reason => console.log('p14 rejected race',reason))
p15.then(value => console.log('p15 resolved race',value),reason => console.log('p15 rejected race',reason))
p16.then(value => console.log('p16 resolved race',value),reason => console.log('p16 rejected race',reason))


p17.then(value => console.log('p17 resolved all',value),reason => console.log('p17 rejected all',reason))
p18.then(value => console.log('p18 resolved race',value),reason => console.log('p18 rejected race',reason))

/*
    p11 rejected all p4
    p12 rejected all p5
    p13 resolved race p1
    p15 rejected race p4
    p16 resolved race p1
    p17 resolved all (4) [10, 11, 12, 13]
    p18 resolved race 10
    p10 resolved all (4) ["p1", "p2", "p3", "p6"]
    p14 resolved race p6

 */
