{
	/* 
		确定以下等式成立
		(a==1)&&(a==2)&&(a==3) = true
	*/
	let a = [1,2,3]
	console.log((a.shift()==1)&&(a.shift()==2)&&(a.shift()==3))
}
{
	/* 
		==为隐式类型转换。
		null == undefined  true
		NaN == NaN  false
		对象 == 任意  //对象首先调用原型链上的 toString()方法，再调用Number方法转化为数字
		其他一律转换为数字
		本方法利用对象会调用toString()方法的特点，自定义一个toString方法，累加
	*/
	let a = {
		i:0,
		toString() {
			return ++this.i
		}
	}
	// console.log(a)
	// console.log(a)
	// console.log(a)
	console.log((a==1)&&(a==2)&&(a==3))
}
{
	/* 
		确定以下等式成立
		(a==1)&&(a==2)&&(a==3) = true
	*/
	function A() {
		let i =1
		return function(){
			return i++
		}
	}
	let a= A()
	console.log((a()==1)&&(a()==2)&&(a()==3))
}

{
	let i = 0
	Object.defineProperty(window,'a',{
	    get(){
	        return i+=1;
	    }
	})
	console.log((a==1)&&(a==2)&&(a==3))
}
{
	let i = 0
	Reflect.defineProperty(window,'a1',{
	    get(){
	        return i+=1;
	    }
	})
	// console.log(a)
	console.log((a1==1)&&(a1==2)&&(a1==3))
}
// {
// 	let i = 0
// 	new Proxy({}, Reflect.defineProperty(window,'a2',{
// 	    get(){
// 	        return i+=1;
// 	    }
// 	}));
// 	// console.log(a2)
// 	// console.log(a2)
// 	// console.log(a2)
// 	console.log((a2==1)&&(a2==2)&&(a2==3))
// }

{
	function * A() {
		yield 1
		yield 2
		yield 3
	}

	let a0 = A()
	let a = a0.next().value
	console.log(a)
	console.log(a)
	console.log(a)
}