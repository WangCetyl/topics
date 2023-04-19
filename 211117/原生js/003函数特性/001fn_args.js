

function test(x,y,z) {
	console.log(test.length)//
	console.log(arguments.length)//
	console.log(arguments.callee===test)//
	console.log(arguments[2])
}

test(10,20)
/*
	3     test.length形参中没有有默认值的个数
	2     arguments.length表示执行时候的实际参数个数
	true  arguments.callee初始值就是正被执行的Function对象，用于在函数内部调用自身，
		  arguments·对象本身是个由函数调用时传入的实参组成的伪数组,访问单个参数的方式与访问数组元素的方式相同
	undefined   test(10,20)执行的时候就只传入了两个参数，所以【2】就是未定义了

*/
function test1(x=1,y=3,z) {
    console.log(test.length)//
    console.log(arguments.length)//
    console.log(arguments.callee===test1)//
    console.log(arguments[2])
}

test1(10,20,89,11)
/*
    1    test.length形参中没有有默认值的个数
    4     arguments.length表示执行时候的实际参数个数
    true  arguments.callee初始值就是正被执行的Function对象，用于在函数内部调用自身，
          arguments·对象本身是个由函数调用时传入的实参组成的伪数组,访问单个参数的方式与访问数组元素的方式相同
          Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    89   test(10,20)执行的时候就只传入了两个参数，所以【2】就是未定义了

*/

/*ES6中没有arguments 有 rest参数，并且rest直接就是数组*/
function test2 (x,y,...others){
    console.log(test2.length)//非rest 以及默认值参数的其他参数个数
    console.log(others)
}

test2(1,2,3,4)
test2(1,2,...[6,7])
/*
    2
    [3, 4]

    2
    [6,7]

 */

