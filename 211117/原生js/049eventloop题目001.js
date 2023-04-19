

{
    async function async1() {
        console.log('async1 start');
        await async2();//
        new Promise(function(resolve) {
            console.log('promise2');
            resolve();
        })
        .then(function() {
            console.log('then2');
        });
    }
    async function async2() {
        //async2做出如下更改：
        new Promise(function(resolve) {
            console.log('promise1');
            resolve();
        })
        .then(function() {
            console.log('then1');
        });
    }
    console.log('script start');

    setTimeout(function() {
        console.log('setTimeout');
    }, 0)
    async1();

    new Promise(function(resolve) {
        console.log('promise3');
        resolve();
    })
    .then(function() {
        console.log('then3');
    });

    setTimeout(function() {
        console.log('setTimeout2');
    }, 0)
    console.log('script end');
/*
    Chrome IE firefox nodejs11之后中运行结果如下:
    script start =>'async1 start' => promise1 => promise3=>
    'script end' =>then1'=>promise2 => then3=> then2 =>undefined=> setTimeout

    node 11之前中运行结果:
    script start =>'async1 start' => promise1 => promise3=>
    'script end' =>then1'=> then3 =>promise2=> then2 => setTimeout
*/

/*
    1，首先script宏任务开始 按代码从上到下变量提升，函数变量名提升并且赋值  async1 async2 
    2. 从上到下执行代码  25 执行 script start 
    3. 27setTimeout 放进宏任务队列
    4. 30 执行async async1函数  
       5行 打印async1 start 
       6行 await 将async1的执行中断等到本轮执行栈中代码执行完再回头执行 执行async2 
    5, 15 执行 async2  内容为new promise 中直接执行 18行打印 promise1，resolve()后 注册微任务 then1
    6  此时继续执行30行 async1()调用后面的代码
    7  32 为 new Promise 直接执行其中代码 33 打印promise3，resolve()后继续注册 then3微任务
    8  执行39 打印 script end
    9  此时从微任务中调取代码，先是then1  打印then1，执行过then1后 async1中await 等待async2执行完毕，得到
        返回结果。开始async1后续代码执行
    10 执行7 行 的new promise 打印 promise2 resolve()后在注册微任务then2
    11  按顺序继续执行微任务 then3 打印 then3  微任务then2 打印then2
    12 此时微任务执行结束  打印 undefined
    13 开始执行宏任务  打印 setTimeout

 */
}




