/*暂时性死区就是由于，let/const声明变量时没有变量提升所导致的。或者我们可以理解为，
在变量仅创建，还没有初始化之时就使用了变量。*/

let a = 2;
{
    console.log(a);
    var a = 1;
}
//Identifier 'a' has already been declared

let a = 2;
{
    console.log(a);
    let a = 1;
}

{
  var arr = [];
  for (const i = 0; i < 10; i++) {
      arr[i] = function(){
        console.log(i)
      }
  }
  //但是由于let却有一丝丝的不同，循环体内部（子作用域）在每一次循环执行的时候都会
  //生成一个新的作用域。不同的子作用域内部接受传进来的不同的i值。
  //Uncaught TypeError: Assignment to constant variable.
    
}
//VM579:3 Uncaught ReferenceError: Cannot access 'a' before initialization
/*
 第一段代码报错是因为，对于var声明的变量，是不存在块级作用域的，因此我们用let和var
 在全局执行环境中声明了a变量两次，从而报错。
第二段代码报错是因为let声明的变量a绑定了{}，使{}成为块级作用域，块级作用域内部的变
量不再受外部的影响，又因为变量a的调用在变量a的声明之前，所以产生了暂时性死区的问题

*/