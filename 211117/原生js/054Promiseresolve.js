/*
    Promise.resolve 是异步执行，所以会将值放入队列顺序执行，注意如果里面再嵌套Promise.resolve/reject
    输出顺序就会不一样
*/

const p1 = Promise.resolve('p1')
const p2 = Promise.resolve('p2')
const p3 = Promise.resolve(Promise.resolve('p3'))
const p4 = Promise.resolve(Promise.reject('p4'))
const p5 = Promise.resolve('p5')

console.log(p1)
console.log(p2)
console.log(p3)
console.log(p4)
console.log(p5)
/*
   Promise {<fulfilled>: "p1"}
   Promise {<fulfilled>: "p2"}
   Promise {<fulfilled>: "p3"}
   Promise {<rejected>: "p4"}
   Promise {<fulfilled>: "p5"}
 */

p1.then(value => console.log(value),reason => console.log(reason))
p2.then(value => console.log(value),reason => console.log(reason))
p3.then(value => console.log(value),reason => console.log(reason))
p4.then(value => console.log(value),reason => console.log(reason))
p5.then(value => console.log(value),reason => console.log(reason))



/*
    p2
    p3
 */
