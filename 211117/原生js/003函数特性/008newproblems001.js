/*
    如何手工实现一个new
    new 的实现原理:
    创建一个空对象，构造函数中的this指向这个空对象
    这个新对象被执行 [[原型]] 连接
    执行构造函数方法，属性和方法被添加到this引用的对象中
    如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。
*/

// {
//     // Function.prototype._new = (function(){
//     let _new = function(){
//         //创建新对象
//         let target = {}
//         //将一个参数(构造函数) 单独提出, 并且将其它参数分为一类
//         let [constructor, ...args] = [...arguments]
//         //将新建对象的_proto_指向构造函数的原型对象
//         target._proto_ = constructor.prototype
//         //执行构造函数的apply方法,this 指向target,
//         let result = constructor.apply(target, args)
//         //如果返回结果存在并且为对象或者函数返回该结果
//         if(result && typeof result ==='object'|| typeof result === 'function' ) {
//             return result
//         }
//         //否则返回target
//         return target
//     }

//    let arr = _new(Array,1,2,4)//[1,2,4]
//     let fun = _new(Function,'x','y','console.log(x+y)')//使用构造函数的时候最后一个参数(字符串)是执行代码
//     let obj = _new(Object,{'a':5})//使用构造函数的时候最后一个参数(字符串)是执行代码
//     let obj2 = _new(Object,5)//使用构造函数的时候最后一个参数(字符串)是执行代码
//     let num =_new(Number,3)//使用构造函数的时候最后一个参数(字符串)是执行代码
//     console.log(arr)
//     console.log(fun)
//     console.log(obj)
//     console.log(obj2)
//     console.log(num)
// }
{
    // Function.prototype._new = (function(){
    let _new = function(){
        //创建新对象
        let target, result 
        //将一个参数(构造函数) 单独提出, 并且将其它参数分为一类
        let [constructor, ...args] = [...arguments]
        //考虑到如果将Number,String,Boolean代入，会认为是function,所以constructor转为Object
        if(constructor===Number||constructor===String||constructor===Boolean) {
            constructor = Object
        }
        //将新建对象的_proto_指向构造函数的原型对象
        target = Object.create(constructor.prototype)
        //如果返回结果存在并且为对象或者函数返回该结果
        // return result
        // if(result && typeof result ==='object'|| typeof result === 'function' ) {
        if(result instanceof Object ) {
            return result
        }

        // console.log(target)
        // target._proto_ = constructor.prototype
        //执行构造函数的apply方法,this 指向target,
        result = constructor.apply(target, args)
        //否则返回target
        return result
    }


    // let arr = _new(Array,1,2,4)//[1,2,4]
    // let fun = _new(Function,'x','y','console.log(x+y)')//使用构造函数的时候最后一个参数(字符串)是执行代码
    // let obj = _new(Object,{'a':5})//使用构造函数的时候最后一个参数(字符串)是执行代码
    // let obj2 = _new(String,'5')//使用构造函数的时候最后一个参数(字符串)是执行代码
    // let num =_new(Number,3)//使用构造函数的时候最后一个参数(字符串)是执行代码
    // let date =_new(Date,'2003/02/02')//使用构造函数的时候最后一个参数(字符串)是执行代码
    let date =_new(Date,2006,0,12,22,19,35)//使用构造函数的时候最后一个参数(字符串)是执行代码
    // let regex =_new(RegExp,'abc','g')//使用构造函数的时候最后一个参数(字符串)是执行代码
    // console.log(arr)
    // console.log(fun)
    // console.log(obj)
    // console.log(obj2)
    // console.log(num)
    console.log(date)
    // console.log(regex)
    
}
