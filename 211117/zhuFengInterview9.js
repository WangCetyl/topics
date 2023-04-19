

/* 
	在JavaScript的立即执行的具名函数A内修改A的值时到底发生了什么？
	https://segmentfault.com/q/1010000002810093
*/

(function A() {
    console.log(A); // [Function A]
    A = 1;
    console.log(window.A); // undefined
    console.log(A); // [Function A]
})()


(function A1() {
    console.log(A1); // undefined
    var A1 = 1;
    console.log(window.A1); // undefined
    console.log(A1); // 1
})()


function A2() {
    console.log(A2); // [Function A]
    A2 = 1;
    console.log(window.A2); // 1
    console.log(A2); // 1
}
A2();