
/*
    函数柯里化”是指将多变量函数拆解为单变量的多个函数的依次调用, 可以从高元函数动态地生成
    批量的低元的函数。简单讲:就是利用函数执行,可以形成一个不销毁的私有作用域,把预先处理的
    内容都存在这个不...
*/
function curry(fn, args) {
    // console.log('curry',this)
    let length = fn.length;
    args = args || [];
    return function(...rest) {
        // console.log('annon',this)
        let _args = [...args, ...rest];
        return _args.length < length ? curry.call(this, fn, _args) : fn.apply(this, _args);
    }
}

let fn = curry(function(a, b, c) {
    console.log(a + b + c);
});

let fn2 = curry((a,b,c) => console.log(a*b*c))

fn(1)(2)(3); // 6
fn(1,2)(3); // 6
fn(99,2)(3); // 6
fn(99)(2)(3); // 6
fn(99)(2,3); // 6

fn2(4)(2)(3); // 24
fn2(4,2)(3); // 24
fn2(4)(2,3); // 24
