

{
    async function async1() {
        console.log('async1 start');
        let res = await async2();
        console.log('res',res)
        console.log(1)
        //更改如下：
        let res1 = await async3()
        console.log('res1',res1)
        setTimeout(function() {
            console.log('setTimeout1')
            setTimeout(function() {
                console.log('setTimeout11')
            },0)

        },0)
    }
    async function async2() {
        //更改如下：
        setTimeout(function() {
            console.log('setTimeout2')
            setTimeout(function() {
                console.log('setTimeout22')
            },0)
        },0)
    }

    async function async3() {
        //更改如下：
        setTimeout(function() {
            console.log('setTimeout3')
            setTimeout(function() {
                console.log('setTimeout33')
            },0)
        },0)
    }
    console.log('script start');

    setTimeout(function() {
        console.log('setTimeout4');
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
    script start
    async1 start 
    promise1
    script end
    undefined
    1
    promise2
  undefined
  undefined
  setTimeout4
  setTimeout2
  setTimeout3
  setTimeout1
  setTimeout22
  setTimeout33
  setTimeout11

/*
    逻辑分析
    1，首先script宏任务开始 按代码从上到下变量提升，函数变量名提升并且赋值  async1 async2 
    2. 从上到下执行代码  25 执行 script start 
    3. 27setTimeout3 放进宏任务队列
    4. 30 执行async async1函数  
       5行 打印async1 start 
       6行 await  将async1的执行中断等到次轮执行栈中代码执行完再回头执行 执行async2
    5, 15 执行 async2  内容为setTimeout2 ，所以直接settimeout2中代码将放入宏队列，
    7  32 为 new Promise 直接执行其中代码 33 打印promise1，resolve()后继续注册 promise2微任务
    8  执行39 打印 script end
    9  此时执行栈中任务结束 回归到async1中 await 后面的任务继续执行
    10 由于此时宏任务还未执行 所以res值为undefiend，接着打印1
    11 此时遇到第二个await 中断async1的任务执行，执行await后的async3，将settimeout1放入宏队列
    11 此时结束开始从微任务中调取代码，promise2，打印 promise2
    12 在回到async1中继续执行任务，打印res1，undefined，将settimeout1放入宏队列
    12 此时同步和微任务任务执行结束  打印 undefined
    13 开始执行宏任务setTimeout4  打印 setTimeout4
    14 开始执行宏任务setTimeout2  打印 setTimeout2 继续将setTimeout22放入宏队列
    15 开始执行宏任务setTimeout3 打印setTimeout3，继续将setTimeout33放入宏队列
    15 开始执行宏任务setTimeout1 打印setTimeout1，继续将setTimeout11放入宏队列
    15 开始执行宏任务setTimeout22 打印setTimeout22
    15 开始执行宏任务setTimeout33 打印setTimeout33
    15 开始执行宏任务setTimeout11 打印setTimeout11
 */
}





