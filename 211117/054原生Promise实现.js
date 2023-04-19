/*
    使用ES5语法私实现Promise功能
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
        onResolved = (typeof onResolved === 'function'? onResolved : result => result) 
        onRejected = (typeof onRejected === 'function'? onRejected : error => throw error)

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

    Promise.prototype.catch = function(onRejected) {
        const _this = this  
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
            setTimeout(() => {
                handler(onRejected)
            },0)
           
    }
    }

    Promise.resolve = function(result) {

    }

    Promise.catch = function(error) {

    }
    //返回一个promise，只有数组中所有promise都成功才成功，否则失败
    Promise.all = function(promiselist) {

    }

    Promise.race = function() {

    }
    window.Promise1 = Promise 
})(window)