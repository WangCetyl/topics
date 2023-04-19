/*
	JS数据类型检测

*/

let dataType = [ Number, String, Boolean, Array, Function, Object, Date,RegExp ]
let testData = [1,'aaa',{1:2},new Date, new RegExp('a'),null,undefined,function(){console.log(1)}]
for(let i = 0; i< dataType.length; i++ ) {
	console.dir(dataType[i])
}

/*
[object : Number]
[object : String]
[object : Boolean]
[object : Array]
[object : Function]
[object : Object]
[object : Date]
[object : RegExp]

*/

function typeTest(Obj) {
	let str = Object.prototype.toString.call(Obj)
	return str.match(/\[object (.*)\]/)[1].toLowerCase()
	//return str
}

for(let i = 0; i< testData.length; i++ ) {
	console.log(typeTest(testData[i]))
}

/*
number
string
object
date
regexp
null
undefined
function

*/