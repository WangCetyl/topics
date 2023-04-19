/*
    请实现一个函数 使得
    add(1)          //1
    add(1)(2)       //3
    add(1)(2)(3)    //6
    add(1)(2,3)     //6
    add(1,2)(3)     //6
    add(1,2,3)      //6

*/


function add () {
    let args,args2
    args = Array.from(arguments)
    function inner () {
        args2 = Array.from(arguments)
        let totalvalue = args2.reduce((a,b) => a+b)
        return totalvalue
    }
    if(args.length > args2) {
        let restarg = args.slice(1)
        return args[0] + inner(...restarg)
    }else {
        let totalvalue = args.reduce((a, b) => a + b)
        return totalvalue
    }
}
function add1 () {
    let args = Array.from(arguments)
   return function () {
       return args
   }    
}