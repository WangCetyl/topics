function fn () {
    console.log(1)
}
function fn2 () {
    console.log(2)
}

// fn指向改为fn2但是还是执行 fn 
fn.call(fn2)  //1
//首先fn通过原型链机制找到Function.prototype上的call方法，并且让call方法执行->此时的
//call方法中this还是fn->在call方法执行过程中，首先让fn中的this关键词变为fn2，然后在让
//fn方法执行->当时此时fn方法中的执行没有涉及this，所以结果仍然是console.log(1)
// fn.call此时指向已经改变为fn2，但是最终执行this还是fn所以答案为1，
fn.call.call.call(fn2)//2 
//前面的一串 fn.call 并没有调用，只是获取对象的call属性，所以，这一串的结果是寻找调用
//Function.prototype.call 属性。最终执行的是最后一个call(fn2)
//同上
// 所以那一串可以看做 Function.prototype.call.call(fn2), 或者fn3.call 。
// 先fn通过原型链机制找到Function.prototype上的call方法->然后寻找到的call方法继续如同第一步向上继续
//寻找function.prototype.call.等到倒数第二个call的时候可以看做fn3.call.call(fn2)——>此时call方法中
//this是fn3.call,->在最后一个call方法执行过程中将fn3.call中的this指向fn2->此时再执行fn3.call，这时
//fn2.call已经是fn2了，结果就是2

//两条题目比较  假设 function.prototype.call = function xxxx() {}
//第一条 fn.call可以转化为  xxxx(fn2) 此时fn中方法已经指向了fn2.但是执行还是fn1，除非涉及this，否则就是执行fn
//而第二题可以转化为 xxxx.xxxx(fn2),也就是说xxxx需要执行两次，在第一次执行xxxx()的过程中xxxx已经转向了fn2，最
 //后内部实际执行的是xxxx()，此时就是执行fn2
//也就是说call函数最后执行的就是前面的引用函数

Function.prototype.call(fn)  //Function.prototype是个空函数，this就是个空函数所以执行无结果

Function.prototype.call.call.call(fn)//1