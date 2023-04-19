
var a = 10
a.pro = 10
console.log("a.pro =", a.pro)
console.log("a =", a)
console.log("a.pro+a =", a.pro + a)

var s = 'hello'

s.pro = 'world'

console.log("s.pro + s =",s.pro + s)

/*
	NaN               
	undefinedhello
	
	js引擎内部在处理对某个基本类型 a 进行 如a.pro的操作时，会在内部临时创建一个
	对应的包装类型(对数字类型来说就是Number类型)的临时对象，并把对基本类型的操作
	代理到对这个临时对象的身上，使得对基本类型的属性访问起来像对象一样，但是一旦
	操作完成，临时对象就销毁了，下次在访问时，就会重建立临时对象，当然就返回NaN,undefined

*/