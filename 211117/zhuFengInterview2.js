{
	/*箭头函数比普通函数的区别

		1.语法上比普通函数更简洁(ES6中每一种函数都可以使用形参赋默认值和剩余运算符)
		2.箭头函数没有自己的this,它里面的this从属于上下文（继承函数所处上下文中的this）使用 call/apply等任何方式服务费给变this的指向
		3.箭头函数中没有arguments这个伪数组，只能基于...arg（ES6y语法）来获得参数数组
		4.箭头函数无法作为构造函数new 实例,因为箭头函数没有prototype 
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

		arr.sort((a,b)=>{
			//改为箭头函数后 这里的this就是body了
			return a-b
		})


	}

	//回调函数：是吧一个函数值B作为实参传递给另外一个函数A，函数A在执行的时候，可以吧传递进来的函数B去执行(执行N次，可传值，可以修改THIS，并且可以设置)

    function each(arr,cb) {
    	for(let i =1;i<arr.length;i++) {
    		cb(arr[i],i-1)
    		let res = cb.call(arr,arr[i],i)
    		if(res ===false) break
    	}
    }
	
	each([1,2,3,4,5,6],function(item,index){
		if(item==5) {
			return false
		}
		console.log(this,item,index)

	})

	let ff = () => {
		console.log(arg)//这样无法获得arg  zhuFengInterview2.js:70 Uncaught ReferenceError: arg is not defined
	}

	// ff(3,4,5,6)
	let ff1 = (...arg) => {
		console.log('实参是=',arg)//这样无法获得arg 这样就可以获得arg数组
	}

	ff1(3,4,5,6)


	function fnf2 (name) {
		this.name = name
	}

	new fnf2
	let fnf = (name)=>{
		this.name = name
	}
	//new fnf  //fnf is not a constructor
}