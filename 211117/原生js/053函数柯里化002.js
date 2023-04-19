
/*
    函数柯里化”是指将多变量函数拆解为单变量的多个函数的依次调用, 可以从高元函数动态地生成
    批量的低元的函数。简单讲:就是利用函数执行,可以形成一个不销毁的私有作用域,把预先处理的
    内容都存在这个不...
*/
function curry(fn, length) {
    length = length||fn.length;
    return function(...rest) {
        if (rest.length >= length ) {
            return fn.call(null, ...rest)
        }
        return curry.call(null, fn.bind(null,...rest), length - rest.length)
    }
}
function add ( ) {
// function add (a,v,c) {
    let result = Array.from(arguments).reduce((a, b) => a + b)
    console.log(result)
}

function multply( ) {
// function multply(a,b,c) {
    let result = Array.from(arguments).reduce((a, b) => a * b)
    console.log(result)
}

let fn = curry(add,5);

let fn2 = curry(multply,4)

fn(1)(2)(3)(5)(8); // 6
fn(1,2)(3)(5,8); // 6
fn(1,2)(3,5,8); // 6

fn2(4)(2)(3)(6); // 24
fn2(4,2)(3,6); // 24
fn2(4,6)(2,3); // 24
