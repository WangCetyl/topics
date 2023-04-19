{
	/* 1 call apply 区别，哪个性能更好
	   都是用来改变this指向，call传参 一个一个传，而apply是以数组形式传
	   fn.call(obj,arg1,arg2,.....)
	   fn.apply(obj,arg)
	   arg必须是数组
	   这两个都是函数prototype上的方法
	   bind只是修改函数this指向，预存，不像call，apply都是改变this后需要执行
	   行对而言call 性能略微好一些，尤其参数数量大于3个的时候

	*/
	let arr = [10,2,30,1,1,1,1,1,1,1,1,23,12,4,4,32,5,345,635,6,37,36,7,367,132,43,2,52,3252,56337,7648,625,25,2526267,262627,6727272727,76,74,847,8],
		obj = {};
	function fn(x,y,z) {console.log(arguments)}


	console.time('apply1')
	fn.apply(this,arr)
	console.timeEnd('apply1')

	let timestart1 = new Date()
    fn.apply(this,arr)
	let timeend1 = new Date()
	console.log((timeend1 - timestart1) + 'ms')
    
	console.time('call1')
	fn.call(this,...arr)
	console.timeEnd('call1')

	let timestart2 = new Date()
	fn.call(this,...arr)
	let timeend2 = new Date()
	console.log(( timeend2- timestart2) + 'ms')
	/*
	  任何测试都是根环境相关，关系到电脑的cpu 内存，GPU等
	 */
}

{
	/*
		实现(5).add(3).minus(2)，使其输出结果为:6

		将数值放在圆括号中，数字就会自动转化为基本包装类型，就可以使用点运算符调用方法了
	 */
	
	Number.prototype.add = function (number) {
    if (typeof number !== 'number') {
        throw new Error('请输入数字～');
    }
    return this.valueOf() + number;
	};
	Number.prototype.minus = function (number) {
	    if (typeof number !== 'number') {
	        throw new Error('请输入数字～');
	    }
	    return this.valueOf() - number;
	};
	console.log((5).add(3).minus(2));

	
}
{
	/*箭头函数比普通函数的区别

		1.语法上比普通函数更简洁(ES6中每一种函数都可以使用形参赋默认值和剩余运算符)
		2.箭头函数没有自己的this,它里面的this从属于上下文（继承函数所处上下文中的this）使用 call/apply等任何方式服务费给变this的指向
	*/

	function fn() {
		return function(y) {
			return x + y 
		}
	}

	let fn1 = x => y => x + y

	let obj = {
		name:'Obj'
	}

	function fn2() {
		console.log(this)
	}
	fn2.call(obj)  //{name: "Obj"}


	let fn3 = ()=> console.log(this)
	fn3.call(obj)
	// Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
	
	document.body.onclick = ()=> {
		//this:wiNdow 不是当前操作BODY
	}

	document.body.onclick = function() {
		//this:body
		
		arr.sort(function(a,b){
			//这里的thiswindow, 回调函数的this是window
			return a-b
		})
	}

	//回调函数：是吧一个函数值B作为实参传递给另外一个函数A，函数A在执行的时候，可以吧传递进来的函数B去执行(执行N次，可传值，可以修改THIS)

    function each(arr,cb) {
    	for(let i =1;i<arr.length;i++) {
    		cb(arr[i],i)
    		cb(arr,arr[i],i)
    	}
    }
	
	each([1,2,3,4,5,6],function(item,index){
		console.log(item,index)
	})

}