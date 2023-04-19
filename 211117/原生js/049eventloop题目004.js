/*
    其实nodejs与浏览器的区别，就是nodejs的 MacroTask 分好几种，而这好几种又有不同的 task queue，而不同的 task queue 又有顺序区别，
    而 MicroTask 是穿插在每一种【注意不是每一个！】MacroTask 之间的。
    其实图中已经画的很明白：
    setTimeout/setInterval 属于 timers 类型；
    setImmediate 属于 check 类型；
    socket 的 close 事件属于 close callbacks 类型；
    其他 MacroTask 都属于 poll 类型。
    process.nextTick 本质上属于 MicroTask，但是它先于所有其他 MicroTask 执行；
    所有 MicroTask 的执行时机，是不同类型 MacroTask 切换的时候。
    idle/prepare 仅供内部调用，我们可以忽略。
    pending callbacks 不太常见，我们也可以忽略。

    所以我们可以按照浏览器的经验得出一个结论：

    先执行所有类型为 timers 的 MacroTask，然后执行所有的 MicroTask（注意 NextTick 要优先哦）；
    进入 poll 阶段，执行几乎所有 MacroTask，然后执行所有的 MicroTask；
    再执行所有类型为 check 的 MacroTask，然后执行所有的 MicroTask；
    再执行所有类型为 close callbacks 的 MacroTask，然后执行所有的 MicroTask；
    至此，完成一个 Tick，回到 timers 阶段；
    ……
    如此反复，无穷无尽……

    node 10 及之前的版本：
    要考虑上一个定时器执行完成时，下一个定时器是否到时间加入了任务队列中，如果未到时间，先执行其他的代码。
    比如：
    timer1 执行完之后 timer2 到了任务队列中，顺序为 timer1 -> timer2 -> promise resolve
    timer2 执行完之后 timer2 还没到任务队列中，顺序为 timer1 -> promise resolve -> timer2

    node 11 及其之后的版本：
    timeout1 -> timeout2 -> promise resolve
    一旦执行某个阶段里的一个宏任务之后就立刻执行微任务队列，这和浏览器端运行是一致的。
 */
{
    setTimeout(()=>{
        console.log('timer1')

        Promise.resolve().then(function() {
            console.log('promise1')
        })
    }, 0)

    setTimeout(()=>{
        console.log('timer2')

        Promise.resolve().then(function() {
            console.log('promise2')
        })
    }, 0)

    Promise.resolve().then(function() {
        console.log('promise3')
    })
/*
    在浏览器中它的输出顺序是 promise3=>timer1=>promise1=>timer2=>promise2。
    而在 Node11之前 中它的输出顺序变为了 promise3=>timer1=>timer2=>promise1=>promise2
    而在 Node11之后 中它的输出顺序变为了 promise3=>timer1=>promise1=>timer2=>promise2。
*/
}




