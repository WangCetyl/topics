

var length = 10
var length1 = 10

function fn() {
	console.log(length)
}

function fn1() {
    console.log(this.length)
}

function fn2() {
    console.log(length1)
}

function fn3() {
    console.log(this)
}

var obj = {
	length:5,
    length1:5,
	method: function(fn){
		fn();
		arguments[0]()
	}
}

obj.method(fn,1)
// 10,10
obj.method(fn1,1)
// //undefined ,2 
obj.method(fn2,1)
//10 ,10 
obj.method(fn3,1)
//undefined ,undefined 

/*
  
*/

var length1 = 6;
function fn5 () {
    console.log(this)
    console.log(this.length1)
} 
var obj1 = {
    length1:5,
    method: function(fn){
        fn();//window.fn
        arguments[0]()//此时的this 实际上是arguments.fn()
        for(index in arguments ) {
            console.log(index)
        }
    }
}
obj1.method(fn5,1)
/*
    Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
    6
    Arguments(2) [ƒ, 1, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    undefined
*/
obj1.method(fn5,length1=100)
/*
    Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
    100
    Arguments(2) [ƒ, 100, callee: ƒ, Symbol(Symbol.iterator): ƒ]0: ƒ fn5()1: 100callee: ƒ (fn)length: 2Symbol(Symbol.iterator): ƒ values()__proto__: Object
    undefined
*/
obj1.method(fn5,length1=110)
/*
    Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
    110
    Arguments(2) [ƒ, 100, callee: ƒ, Symbol(Symbol.iterator): ƒ]0: ƒ fn5()1: 100callee: ƒ (fn)length: 2Symbol(Symbol.iterator): ƒ values()__proto__: Object
    undefined
*/
obj1.method(fn5,length1=10)
/*
    Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
    10
    Arguments(2) [ƒ, 100, callee: ƒ, Symbol(Symbol.iterator): ƒ]0: ƒ fn5()1: 100callee: ƒ (fn)length: 2Symbol(Symbol.iterator): ƒ values()__proto__: Object
    undefined
*/
obj1.method(fn5,1110)
/*
    Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
    10
    Arguments(2) [ƒ, 100, callee: ƒ, Symbol(Symbol.iterator): ƒ]0: ƒ fn5()1: 100callee: ƒ (fn)length: 2Symbol(Symbol.iterator): ƒ values()__proto__: Object
    undefined
*/