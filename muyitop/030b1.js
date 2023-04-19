{
	(function A() {
    console.log(A); // [Function A]
    A = 1;
    console.log(window.A); // undefined
    console.log(A); // [Function A]
}())
}


{
	(function A() {
    console.log(A); // undefined
    var A = 1;
    console.log(window.A); // undefined
    console.log(A); // 1
}())
}

