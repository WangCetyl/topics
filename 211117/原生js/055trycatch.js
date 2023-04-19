/*
    try..catch
    在捕获函数中错误的时候，如果错误发生在函数内部的回调函数内异步执行的，无法catch到
*/

function a () {
    const m = Date.now()
    if(m%2) throw `${m}是奇数`
    console.log(`${m}是偶数`);
}

try {
    a()
}catch(e) {
    console.log('tc',e);
}
/*
   tc 1616726643725是奇数
   或者 1616726688320是偶数

 */

function a1 () {
    const m = Date.now()
    setTimeout(()=> {
        if(m%2) throw `${m}是奇数`
        console.log(`${m}是偶数`);
    },0)
}

try {
    a1()
}catch(e) {
    console.log('tc',e);
}
/*
   
    055trycatch.js:26 Uncaught 1616726771869是奇数
 */