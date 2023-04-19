/*
    Function.prototype.call(context, arg1,arg2...)  方法
    call 方法使得调用函数 改变 this指向 到context，接收多个参数
*/

{ 

    Function.prototype.mycall = function (context, ...args) {
        //1,将this，指向context  ，可以在context中定义调用call函数的fn指向context
        //排除  null undefined,同时防止context为基本类型数字需要转换为object
        if (context!==null||context!==undefined) {
            context = (context !== 'object'||context !== 'function')?Object(context):context
    
        }
        context.fn = this 
        //第二部 执行 context.fn 
        const result = context.fn(...args)
        // 最后删除context上面的这个fn属性
        delete context.fn
    
        return result
    } 
}

Function.prototype.mycall = function (context) {
    //1,将this，指向context  ，可以在context中定义调用call函数的fn指向context
    //排除  null undefined,同时防止context为基本类型数字需要转换为object
    if (context!==null||context!==undefined) {
        context = (context !== 'object'||context !== 'function')?Object(context):context

    }

    //也可以使用evel(this.toString().replace('this','context'))
    context.fn = this 
    //拼接参数，除去第一个context
    let args = []
    for(let i =1; i <= arguments.length -1 ; i++) {
        args.push("arguments[" + i + "]")
    }
    //利用toString的特性将数组args按照字符串代入
    const result = evel('context.fn(' + args +')')

    //第二部 执行 context.fn 
    // 最后删除context上面的这个fn属性
    delete context.fn

    return result
} 

Function.prototype.myapply = function (context, args) {
    //1,将this，指向context  ，可以在context中定义调用call函数的fn指向context
    //排除  null undefined
    (context!==null|context!==undefined|)? (context.fn = this):window.fn = this
    //第二部 执行 context.fn 
    const result = context.fn(...args)
    // 最后删除context上面的这个fn属性
    delete context.fn

    return result
} 

Function.prototype.mybind = function (context,...args) {
    //1,bind返回一个函数，函数的this指向context
    const that = this  
    return function (...args2) {
        return that.mycall(context,...args,...args2)
    }
 
}