

{
    async function async1() {
        console.log('async1 start');
        await async2();
        //更改如下：
        setTimeout(function() {
            console.log('setTimeout1')
            setTimeout(function() {
                console.log('setTimeout5')
            },0)

        },0)
    }
    async function async2() {
        //更改如下：
        setTimeout(function() {
            console.log('setTimeout2')
            setTimeout(function() {
                console.log('setTimeout4')
            },0)
        },0)
    }
    console.log('script start');

    setTimeout(function() {
        console.log('setTimeout3');
    }, 0)
    async1();

    new Promise(function(resolve) {
        console.log('promise1');
        resolve();
    }).then(function() {
        console.log('promise2');
    });
    console.log('script end');
/*
    Chrome IE firefox nodejs中运行结果如下:
    script start =>'async1 start' => promise1 =>'script end'
    => promise2 =>'setTimeout3'=>=> 'setTimeout2=> 'setTimeout1 
    => setTimeout4 =>setTimeout5
*/
/*
    逻辑分析
    1，首先script宏任务开始 按代码从上到下变量提升，函数变量名提升并且赋值  async1 async2 
    2. 从上到下执行代码  25 执行 script start 
    3. 27setTimeout3 放进宏任务队列
    4. 30 执行async async1函数  
       5行 打印async1 start 
       6行 await 执行async2 等待async2的结果
    5, 15 执行 async2  内容为setTimeout2 直接放入宏队列
    6  注意 此时async2任务没有执行完毕，所以async1中的await还需要继续等待setTimeout2出结果，才能继续执行下面代码
       此时继续执行30行 async1()调用后面的代码
    7  32 为 new Promise 直接执行其中代码 33 打印promise1，resolve()后继续注册 promise2微任务
    8  执行39 打印 script end
    9  此时从微任务中调取代码，promise2，打印 promise2
    10 此时微任务执行结束  打印 undefined
    11 开始执行宏任务setTimeout3  打印 setTimeout3
    12 开始执行宏任务setTimeout2  打印 setTimeout2  此时setTimeout会有返回值 ，就继续执行8行后内容，
    13 将setTimeout1 加入
 */
}

{
    setTimeout(function() {
        console.log('setTimeout1')
        setTimeout(function() {
            console.log('setTimeout11')
            setTimeout(function(){
                console.log('setTimeout111')
            })
        },0)
    },0);
    setTimeout(function() {
        console.log('setTimeout2')
        setTimeout(function() {
            console.log('setTimeout22')
        },0)
    },1000);
    setTimeout(function() {
        console.log('setTimeout3')
        setTimeout(function() {
            console.log('setTimeout33')
        },0)
    },0);
    setTimeout(function() {
        console.log('setTimeout4')
        setTimeout(function() {
            console.log('setTimeout44')
        },0)
    },0)

    /*
        注意此时嵌套是从第一层开始依次执行，再依从第二层开始
        setTimeout1
        setTimeout2
        setTimeout3
        setTimeout4
        setTimeout11
        setTimeout22
        setTimeout33
        setTimeout44
        setTimeout111

     */
}




