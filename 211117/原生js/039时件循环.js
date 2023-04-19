
/*
 宏任务task: script setTimeout setInterval DOM事件  setImmediatetime
           鼠标事件，键盘事件，ajax, setTimeout ,setInterval, 主线程的整体代码（script标签）也是一个宏任务
	
 微任务mircotask: async/await  Promise.then(), Mutaion Oberver Object.observe process.nextTick,
 1.执行宏任务队列中的第一个任务,执行完后移除它

2.执行所有的微任务，执行完后移除它们

3.执行下一轮宏任务（重复步骤2）
 */
{
	async function async1() {
		console.log('async1 start');
		await async2();
		console.log('async1 end');
	}
	async function async2() {
		console.log('async2');
	}
	console.log('script start');
	setTimeout(function () {
		console.log('setTimeout');
	}, 0)
	async1();
	new Promise(function (resolve) {
		console.log('promise1');
		resolve();
	}).then(function () {
		console.log('promise2');
	});
	console.log('script end');

	/*
	script start
	async1 start
	async2
	promise1
	script end
	async1 end
	'promise2
	setTimeout
	*/
}












