/*
    Promise后续的then 执行是取决去上一个Promise或者then的返回结果(默认返回的是promise实例)
    注意 在then以后会默认返回一个promise实例，如果在其中需要执行异步的操作，必须在then中使用 
    new Promise首先包裹
*/

// new Promise((res,rej) => {
//     res('p1')
// })
// .then(value => console.log(value))
// .then(value => console.log(value))

/*
    p1
    undefined
 */



new Promise((res,rej) => {
    rej('p2')
})
.then(null,reason => {
    console.log(reason)
    throw 'p3'
})//p2
.then(null,reason=> console.log(reason))//p3
.catch(reason => console.log(reason))//無輸出

/*
    p2
    p3
 */
