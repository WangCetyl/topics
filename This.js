This

This 要在执行的时候才能确认，定义时无法确认
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

//作为构造函数中的this
function Foo(name) {
	console.log(this)//Foo {}
	this.name = name
	console.log(this)//Foo {name: "张珊"}
}

var foo = new Foo("张珊")

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











