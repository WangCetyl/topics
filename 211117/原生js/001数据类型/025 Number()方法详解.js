
/*
	Number()
	1. undefined        NaN
	2. null				0
	3. boolean          true:1; false:0
	4. string
		a.  空字符串  0
		b.  非空字符串，并且内容为纯数字（包含进制与科学表示法）转成对应的数字
		c. 	其他 都是NaN
	5. 数字  原来的数字
	6. 对象   
	    a.  对象 函数 NaN
		b.  空数组   0，
			非空数组 只有一个值且这个值可以转化为数字 则转化这个数字，否则全部为NaN
	parseInt(),parseFloat(),isNaN()在ES6里把这两个方法移植到了Number对象上，其他没有变化
	Number.isNaN(NaN)为true,其他为false,而window.isNaN()则不同
*/

console.log(
	"Number('012')=",Number('012'),'\n',
	"Number('0xff90')=",Number('0xff90'),'\n',
	"Number('5e2')=",Number('5e2'),'\n',
	"Number([2,9,3])=",Number([2,9,3]),'\n',
	"Number({1:2})=",Number({1:2}),'\n',
	"Number(function(){})=",Number(function(){}),'\n',
	"new Date()=",new Date(),'\n',
	"Number(new Date())=",Number(new Date()),'\n',
	"Number(new RegExp())=",Number(new RegExp()),'\n',
	"Number([])=",Number([]),'\n',
	"Number([null])=",Number([null]),'\n',
	"Number([1,'a'])=",Number([1,'a']),'\n',
	"Number(['a',0])=",Number(['a',0])
)

console.log('+++++++++++++++++')
console.log('isNaN("A")=',isNaN("A"),'\n','Number.isNaN("A")==',Number.isNaN("A"))

/*
 Number('012')= 12
 Number('0xff90')= 65424
 Number('5e2')= 500
 Number([2,9,3])= NaN
 Number({1:2})= NaN
 Number(function(){})= NaN
 new Date()= 2020-05-02T06:19:33.646Z
 Number(new Date())= 1588400373646
 Number(new RegExp())= NaN
 Number([])= 0
 Number([null])= 0
 Number([1,'a'])= NaN
 Number(['a',0])= NaN
 +++++++++++++++++
 isNaN("A")= true
 Number.isNaN("A")== false
*/
