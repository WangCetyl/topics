/*
	如果用一句话说明 this 的指向，那么即是: 谁调用它，this 就指向谁。
	但是仅通过这句话，我们很多时候并不能准确判断 this 的指向。因此我们需要借助一些规则去帮助自己：
	this 的指向可以按照以下顺序判断:
	1.全局环境中的 this
		浏览器环境：无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象 window;
		node 环境：无论是否在严格模式下，在全局执行环境中（在任何函数体外部），this 都是空对象 {};
	2.是否是 new 绑定
		如果是 new 绑定，并且构造函数中没有返回 function 或者是 object，那么 this 指向这个新对象。如下:
		构造函数返回值不是 function 或 object。 newSuper() 返回的是 this 对象。
		function Super() {
			this.age = age;
		}
		let a = new Super('24')
		console.log(a.age)、、24
		构造函数返回值是 function 或 object， newSuper()是返回的是Super种返回的对象。
		function Super(age) {
			this.age = age
			let obj = {a:12}
			return obj
		}
		let b = new Super('hello')
		console.log(b)//{a:12}
		console.log(b.age)//undefined
	3.函数是否通过 call,apply 调用，或者使用了 bind 绑定，如果是，那么this绑定的就是指定的对象【归结为显
		式绑定】。
		这里同样需要注意一种特殊情况，如果 call,apply 或者 bind 传入的第一个参数值是 undefined或者 null，
		严格模式下 this 的值为传入的值 null /undefined。非严格模式下，实际应用的默认绑定规则，this 指向全
		局对象(node环境为global，浏览器环境为window)
	4.隐式绑定，函数的调用是在某个对象上触发的，即调用位置上存在上下文对象。典型的隐式调用为: xxx.fn()
	    默认绑定，在不能应用其它绑定规则时使用的默认规则，通常是独立函数调用。
	    非严格模式：node环境，执行全局对象 global，浏览器环境，执行全局对象 window。
	    严格模式：执行 undefined
	5.箭头函数的情况：
		箭头函数没有自己的this，继承外层上下文绑定的this。
*/

// This 要在执行的时候才能确认，定义时无法确认
{
	//作为对象
	var a = {
		name: 'A',
		fn:function() {
			console.log(this)
			console.log(this.name)
		}
	}
	a.fn() //{name: "A", fn: ƒ}   A
	a.fn.call({name:'B'})//{name: "B"}  B
	var fn1=a.fn 
	fn1()//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
}

{
	//作为构造函数中的this
	function Foo(name) {
		console.log(this)//Foo {}
		this.name = name
		console.log(this)//Foo {name: "张珊"}
	}
	var foo = new Foo("张珊")
}

{
	//作为普通函数
	function f1() {
		console.log(this)
	}
	f1()//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
	f1.call()//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
	f1.apply()//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
	f1.bind()//ƒ f1() {console.log(this)}

	function f2(name) {
		console.log(this)
		console.log(this.name)
	}
	f2()//Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
	f2.call({name:"lewss_call"},"张珊_call")//{name: "lewss_call"} lewss_call
	f2.apply({name:"wang_apply"},["张珊_apply"])//{name: "wang_apply"} wang_apply
	f2.bind({name:"wang_bind"},"张珊_bind")//ƒ f2(name) {console.log(this) console.log(this.name)}

	const f22 = function (name) {
		console.log(this)
		console.log(this.name)
	}.bind({name:"wanglewis_bind"})

	f22("wanglewis")//{name: "wanglewis_bind"}  wanglewis_bind

}

console.log(this)











