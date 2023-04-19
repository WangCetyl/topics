/*
    使用ES5语法私实现Promise功能
    (1) 一个promise的当前状态只能是pending、fulfilled和rejected三种之一。
        状态改变只能是pending到fulfilled或者pending到rejected。状态改变不可逆。
    (2) promise的then方法接收两个可选参数，表示该promise状态改变时的回调
    (promise.then(onFulfilled, onRejected))。then方法返回一个promise，then 方法可以被同一个 promise 调用多次。
    Promise/A+并未规范race、all、catch方法，这些是ES6自己规范的
    1. 定义整体结构
    2. Promise构造函数的实现
    3. promise.then()/catch()的实现
    4. Promise.resolve()/reject()的实现
    5. Promise.all/race()的实现
    6. Promise.resolveDelay()/rejectDelay()的实现
    7. ES6 class版本
*/

(function(window){
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'
    //Promise构造函数
    function Promise(excutor) {
        const _this = this
        _this.status = PENDING//状态属性，初始值为pending
        _this.data = undefined//用来存储结果数据result or error
        _this.callbackarr = []//用来保存指定的回调函数onResolve onRejected
        //改变Prmomise状态，改为 resolved,指定成功result
        function resolve(result) {
            //如果当前状态不是PENDING,直接结束
            if(_this.status!==PENDING) return 
            _this.status = RESOLVED
            _this.data = result
            //异步调用所有缓存的成功的回调函数
            if(_this.callbackarr.length) {
                //启动一个延时为0的定时器，在定时器回调中执行所有成功onResolved
                setTimeout(function() {
                    _this.callbackarr.forEach((item) => {
                        item.onResolved(_this.data)
                    })
                },0)
            }
        }
        //改变Promise状态，改为rejected，指定失败error
        function reject(error) {
            //如果当前状态不是PENDING,直接结束
            if(_this.status!==PENDING) return 
            _this.status = REJECTED
            _this.data = error

            if(_this.callbackarr.length) {
                //启动一个延时为0的定时器，在定时器回调中执行所有失败的onRejected
                setTimeout(function() {
                    _this.callbackarr.forEach((item) => {
                        item.onRejected(_this.data)
                    })
                },0)
            }
        }

        //调用excutor 来启动任务
        try {//使用try catch,防止第三种改变状态的方式 throw error
            excutor(resolve, reject) 
        }catch(error) {//执行器执行出错，当前promise变为失败
            reject(error)
        }

        
    }
    /*
        用来指定成功/失败回调函数的方法
            1.)如果当前promise是pending，保存回调函数
            2.)如果当前promise是resolved，异步执行成功回调onResolved
            3.)如果当前promise是rejected，异步执行失败回调onRejected
        返回一个新的Promise对象 它的结果状态有onResolved或者onRejected中的结果决定
            1.1).抛出error ==>变为rejected，结果值为error
            1.2).返回值不是promise ==>变为resolved，结果值为返回值
            1.3）.返回值是promise ===>由这个promise的决定值来决定新的promise的结果(成功/失败)
    */
    
    Promise.prototype.then = function(onResolved, onRejected) {
        const _this = this
        //出现指定回调函数缺损的时候指定onResoved onRejected
        onResolved = typeof onResolved === 'function'? onResolved : value => value
        onRejected = typeof onRejected === 'function'? onRejected : value => {throw value}
        return new Promise((resolve,reject) => {
            //封装函数
            /*
                1.调用指定的回调函数callback
                2.根据callback()执行的结果来更新then()返回promise的状态
            */
            function handler(callback) {
                try{
                    const p2 = callback(_this.data)
                    if(p2 instanceof Promise) {
                        p2.then(
                            result => resolve(result),   
                            error => reject(error)
                        )
                    }else {
                        resolve(p2)
                    }
                }catch(err){
                    reject(err)                        
                }
            }
            if(_this.status===RESOLVED) {
                setTimeout(() => {
                    handler(onResolved)
                },0)
            }else if(_this.status===RESOLVED){
                setTimeout(() => {
                    handler(onRejected)
                },0)
            }else {//PENDING
                //保存回调函数
                _this.callbackarr.push({//将两个回调函数以对象的形式保存到Promise callbackarr中
                    onResolved(result){
                        handler(onResolved)
                    },
                    onRejected(error){
                        handler(onRejected)
                    }
                })
            }
        })
    }
    /*Promise.prototype.catch 就是then的一个语法糖*/
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected)
    }
    /*
        Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。如果这个值是一个 promise ，
        那么将返回这个 promise ；如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”
        这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象
        的多层嵌套展平。
        警告：不要在解析为自身的thenable 上调用Promise.resolve。这将导致无限递归，因为它试图展平无
        限嵌套的promise。一个例子是将它与Angular中的异步管道一起使用。在此处了解更多信息。
     */
    Promise.resolve = function(result) {
        const _this = this
        return new Promise((resolve,undefined) => {
            if(_this.data instanceof Promise) {//如果是个promise，Promise实例
                if(typeof(_this.data.then) == 'function') {//如果这个值是thenable
                    _this.data.then(resolve,reject)
                }
                return _this.data
            }else {//其他情况
                resolve(_this.data)
            }
        })

    }

    Promise.catch = function(error) {
        const _this = this 
        return new Promise((resolve,reject) => {
            reject(_this.data)
        })

    }
    /*
        参数为一个可遍历的数据结构数组，数组中每一项都是一个promise实例
        如果全部成功返回一个数组，数组中的每一个值对应参数中每一个的实例结果
        如果有一个失败，就返回第一个失败的结果
    */
    Promise.all = function(promiselist=[]) {

    }
/*
    使用Promise.race的语法使用
    参数为一个数组，数组中每一项都是一个promise实例
    无论实例中成功与否 返回第一个出现结果的

 */
    Promise.race = function(promiselist=[]) {
        
        return new Promise((resolve,reject) => {
            
        })

    }
    window.Promise1 = Promise 
})(window)