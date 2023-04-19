console.log('start')
Promise.resolve().then(() => {
    console.log(0);
    // let a =  Promise.resolve(4);
    // console.log('a=',a)
    // return a;
    return Promise.resolve(4);
}).then((res) => {
    console.log(res)
})

Promise.resolve().then(() => {
    console.log(1);
    // return Promise.resolve(7);
}).then((res) => {
    console.log(2);
    // console.log(res)
}).then(() => {
    console.log(3);
    // return Promise.resolve(7);
}).then((res) => {
    console.log(5);
    // console.log(res)
}).then(() =>{
    console.log(6);
})
console.log('end')

// console.log('start1')
// // let a =
// console.log(Promise.resolve(console.log('middle1')))
// console.log('end')
/*
    结果 0,1,2,3,4,5,6
    分析：
    Promise.resolve()立即执行 返回一个promise实例 状态为fullfilled，
    两个promise链式调用，简称A，B;首先从A开始。
    1.A中Promise.resolve() 立即执行返回一个 promise对象，返回值为undefined，由于then函数中回调函数为异步执行，其中内容
        console.log(0);
        return Promise.resolve(4);注册到微队列中等待
    2.B调用开始，同A立即执行返回一个 promise对象，返回值为undefined，由于then函数中回调函数为异步执行，其中内容
        console.log(1)注册到微队列中等待
    3.从微队列中弹出A中第一个then内容，执行，打印0，同时返回一个Promise.resolve(4)


 */


// {
//     let a = Promise.resolve()
//     .then(() => {
//         console.log(0);
//         return Promise.resolve(4);
//     })
//     .then((res) => {
//         console.log(res)
//     })

//     let a1 = Promise.resolve()
//     .then(() => {
//         console.log(1);
//     })
//     .then(() => {
//         console.log(2);
//     })
//     .then(() => {
//         console.log(3);
//     })
//     .then(() => {
//         console.log(5);
//     })
//     .then(() => {
//         console.log(6);
//     })

// }