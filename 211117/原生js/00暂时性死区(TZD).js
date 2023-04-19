/*
    1.ES6 规定，如果代码区块中存在 let 和 const 命令声明的变量，这个区块对这些变量从一开始就形成了封闭作用域，
    直到声明语句完成，这些变量才能被访问（获取或设置），否则会报错ReferenceError。
    这在语法上称为“暂时性死区”（英temporal dead zone，简 TDZ），即代码块开始到变量声明语句完成之间的区域。
　　2.通过 var 声明的变量拥有变量提升、没有暂时性死区，作用于函数作用域：
   当进入变量的作用域（包围它的函数），立即为它创建（绑定）存储空间，立即被初始化并被赋值为 undefined　　　
    当执行到变量的声明语句时，如果变量定义了值则会被赋值
   3.通过 let 声明的变量没有变量提升、拥有暂时性死区，作用于块级作用域：
    当进入变量的作用域（包围它的语法块），立即为它创建（绑定）存储空间，不会立即初始化，也不会被赋值
    访问（获取或设置）该变量会抛出异常 ReferenceError
    当执行到变量的声明语句时，如果变量定义了值则会被赋值，如果变量没有定义值，则被赋值为undefined
    4.通过 const 声明的常量，需要在定义的时候就赋值，并且之后不能改变，暂时性死区与 let 类似。
    所以　在块级作用域中， let 和 const 声明的变量、常量在声明语句执行完成之前不能访问（包括声明语句本身）。


 */
{
    var t = 12

    if(1) {
        console.log(t)//12
    }
}

{
    var t = 12

    if(1) {
        let t
        console.log(t)//undefined
    }
}

{
    var t = 12

    if(1) {
        let t
        var t
        console.log(t)//Identifier 't' has already been declared
    }
}

{
    var t = 12

    if(1) {
        var t
        let t
        console.log(t)//Identifier 't' has already been declared
    }
}

{
    var t = 12

    if(1) {
        console.log(t)//00暂时性死区(TZD).js:14 Uncaught ReferenceError: Cannot access 't' before initialization
        let t
    }
}

