js 作用域

//全局作用域
var w = "wanglewis_w"
console.log(w)
function fnn1(){
	console.log(w)
	w ="wanglewis_fnn"
	console.log(w)
}
fnn1()
if(true) {
	console.log(w,'inif')
}
console.log(w,'outif')
//wanglewis_w
//wanglewis_w
// wanglewis_fnn
//wanglewis_fnn inif
//wanglewis_fnn outif 注意全局作用域 变量在哪里改变 变量就变成什么值
------------------------------------------------------------------------------
var m1 = "m-g"
console.log(m1,'g1')
function fnn1(){
	console.log(m1,'f1')
	m1 ="m_fnn"
	console.log(m1,'f2')
}
console.log(m1,'g2')
fnn1()
console.log(m1,'g3')
if(true) {
	console.log(m1,'inif')
}
console.log(m1,'outif')
//m-g g1
//m-g g2
// m-g f1
//m_fnn f2
//m_fnn g3
//m_fnn inif
//m_fnn outif
------------------------------------------------------------------------------
//函数作用域
function fn14() {
	var a14 =100
	console.log(a14,'fn1')
}
console.log(a14)
fn14()
console.log(a14)//注意函数作用域 只能在函数中有效，除了就报错
//VM7841:5 Uncaught ReferenceError: a14 is not defined  at <anonymous>:5:13

function fn141() {
	var a141 =100
	console.log(a141,'fn1')
}
fn14()
var a141 ="我出来 全局了"
console.log(a141)
//100 "fn1"
//我出来 全局了

------------------------------------------------------------------------------------------------
var i =2
while(i) {
	i--
	var a142 ="我出来 全局了_out0"
	function fn142() {
		console.log(a142,'fn142_0')
		var a142 =100
		console.log(a142,'fn142_1')
	}
	fn142()
	var a142 ="我出来 全局了_out1"
	console.log(a142)
}
//我出来 全局了_out0 fn142_0
//"fn142_1"
//我出来 全局了_out1

//我出来 全局了_out0 fn142_0
//"fn142_1"
//我出来 全局了_out1
================================================================================================
var a16="我是全局变量g0"
console.log(a16,'outf0')//我是全局变量g0 outf0
function fa16() {
	console.log(a16,'inf0')//我是全局变量g0 inf0
	//var a16="我是函数变量f0"//注意此时赋值不需要var 否则var之前的函数内的a16为undefined
	a16="我是函数变量f0"
	console.log(a16,'inf0')//我是函数变量f0 inf0
}
fa16()
console.log(a16,'outf1')//我是函数变量f0 outf1
var a16="我是全局变量g1"
console.log(a16,'outf2')//我是全局变量g1 outf2
==============================================================================================
var a16="我是全局变量g0"
console.log(a16,'outf0')//我是全局变量g0 outf0
function fa16() {
	console.log(a16,'inf0')//undefined "inf0"
	var a16="我是函数变量f0"//注意此时赋值不需要var 否则var之前的函数内的a16为undefined
	console.log(a16,'inf0')//我是函数变量f0 inf0
}
fa16()
console.log(a16,'outf1')//我是全局变量g0 outf1
var a16="我是全局变量g1"
console.log(a16,'outf2')//我是全局变量g1 outf2

----------------------------------------------------------------------------------------------------
function fn15() {
	var a15 =100
	console.log(a15,'fn1')
}

fn15()//100 "fn1"

------------------------------------------------------------------

//块极作用域,var时没有
if(true) {
	var a16 =100
	console.log(a16,'inif')
}

console.log(a16,'outif')
//100 "inif"       100 "outif"
------------------------------------------------------------------------
//块极作用域,let const 时有
if(true) {
	let a17 =100
	console.log(a17,'inif')
}
console.log(a17,'outif')
//100 "inif"
//Uncaught ReferenceError: a17 is not defined at <anonymous>:6:13