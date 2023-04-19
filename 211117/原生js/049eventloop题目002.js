
{
    async function async1() {
        console.log('async1 start');
        await async2();//注意遇到await 该表达式以后的代码执行权交出，相当于Promise.resolve(async2()).then(() => {console.log('async1 end'); })
        console.log('async1 end');
    }
    async function async2() {
        //async2做出如下更改：
        new Promise(function(resolve) {
            console.log('promise1');
            resolve();
        })
        .then(function() {
            console.log('promise2');
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
        console.log('promise4');
    });
    console.log('script end');
/*
    Chrome IE firefox中运行结果如下:
    script start =>'async1 start' => promise1 => promise3'=> 
    'script end' =>promise2=> => async1 end => promise4 => setTimeout
    node 中运行结果:
    script start =>'async1 start' => promise1 => promise3'=> 
   'script end' =>promise2=> => promise4 =>  async1 end => setTimeout
*/
}

