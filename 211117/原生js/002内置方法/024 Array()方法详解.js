
/*
	new Array(number) 中参数只有一个数字，表示创建一个长度为nmber的空数组
	new Array(string|true|null) 中参数只有一个非数字，表示创建一个以此值为内容的数组
	new Array(1,'b',null) 中参数大于一个值，表示创建一个以这些值为内容的数组
*/

let arr = new Array(2)
console.log(arr)//[empty × 2]

let arrnull = new Array(null)
console.log(arrnull)//[null]

let arrstr = new Array('str')
console.log(arrstr)//['str']

let arrtrue = new Array(true)
console.log(arrtrue)//[true]

let arrundefined = new Array(undefined)
console.log(arrundefined)//[undefined]

let arrmoreargs = new Array(1,'b',null,NaN)
console.log(arrmoreargs)//[ 1, 'b', null, NaN ]
