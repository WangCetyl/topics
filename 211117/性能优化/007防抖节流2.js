

/* 
	防抖和节流
	1.防抖原理：多次触发时间时，只执行一次回调，在事件被触发n秒后执行回调，如果在n秒内再次被触发则重新开始
*/
{

	function debounce (fn,delay) {
		let timer = null
		return (...args) => {
			// console.log('this is:',args)
			clearTimeout(timer)
			timer = window.setTimeout(()=> {
				fn.apply(this,args)
			}, delay)
		}
	}

	let input1 = document.getElementById('input1')
	let fn = debounce(function(e){
		// console.log(e)
		console.log('防抖处理成功',e.target.value)
	},1000)

	input1.addEventListener('input',fn)
}
{

	// 上面的防抖函数可以简化如此
	let input1 = document.getElementById('input1')
	let timer = null
	input1.addEventListener('input',function(...args) {
		clearTimeout(timer)
		timer = setTimeout(()=> {
			console.log('mine防抖处理',[...arguments][0].target.value)
		},1000)
	})
}


{
	// 节流的原理?
	//规定在单位时间内只触发一次函数，如果触发多次，只有一次生效
	
	function throttle(fn,delay) {
		let timer = null;
		let flag = true
		return (...args) => {
			if(!flag) return
			clearTimeout(timer)
			flag = false
			timer = setTimeout(()=> {
				fn.apply(this,args)
				flag = true
			},delay)
			
		}
	}

	let input1 = document.getElementById('input1')
	let fn = throttle (function(e){
		// console.log(e)
		console.log('节流处理成功',e.target.value)
	},1000)

	input1.addEventListener('input',fn)


}