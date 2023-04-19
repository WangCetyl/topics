JS中的加号+运算符详解
阅读目录

开始
加号+运算符
类型转换
加法
加法的示例
回到顶部
加号+运算符
在 JavaScript 中，加法的规则其实很简单，只有两种情况:

把数字和数字相加
把字符串和字符串相加
所有其他类型的值都会被自动转换成这两种类型的值。 为了能够弄明白这种隐式转换是如何进行的，我们首先需要搞懂一些基础知识。

让我们快速的复习一下。 在 JavaScript 中，一共有两种类型的值:

原始值(primitives)
undefined
null
boolean
number
string
对象值(objects)：除了原始值外，其他的所有值都是对象类型的值，包括数组(array)和函数(function)。
回到顶部
类型转换
加法运算符会触发三种类型转换：

转换为原始值
转换为数字
转换为字符串
通过 ToPrimitive() 将值转换为原始值
JavaScript 引擎内部的抽象操作 ToPrimitive() 有着这样的签名:

ToPrimitive(input，PreferredType?)
可选参数 PreferredType 可以是 Number 或者 String。 它只代表了一个转换的偏好，转换结果不一定必须是这个参数所指的类型（汗），但转换结果一定是一个原始值。 如果 PreferredType 被标志为 Number，则会进行下面的操作来转换input

如果 input 是个原始值，则直接返回它。
否则，如果 input 是一个对象。则调用 obj.valueOf() 方法。 如果返回值是一个原始值，则返回这个原始值。
否则，调用 obj.toString() 方法。 如果返回值是一个原始值，则返回这个原始值。
否则，抛出 TypeError 异常。
如果 PreferredType 被标志为 String，则转换操作的第二步和第三步的顺序会调换。 如果没有 PreferredType 这个参数，则 PreferredType 的值会按照这样的规则来自动设置：

Date 类型的对象会被设置为 String
其它类型的值会被设置为 Number
通过 ToNumber() 将值转换为数字
下面的表格解释了 ToNumber() 是如何将原始值转换成数字的

参数	结果
undefined	NaN
null	+0
boolean	true被转换为1,false转换为+0
number	无需转换
string	由字符串解析为数字。例如，"324"被转换为324
如果输入的值是一个对象，则会首先会调用 ToPrimitive(obj, Number) 将该对象转换为原始值， 然后在调用 ToNumber() 将这个原始值转换为数字。

通过ToString()将值转换为字符串
下面的表格解释了 ToString() 是如何将原始值转换成字符串的

参数	结果
undefined	"undefined"
null	"null"
boolean	"true" 或者 "false"
number	数字作为字符串。比如，"1.765"
string	无需转换
如果输入的值是一个对象，则会首先会调用 ToPrimitive(obj, String) 将该对象转换为原始值， 然后再调用 ToString() 将这个原始值转换为字符串。

实践一下
下面的对象可以让你看到引擎内部的转换过程。

复制代码
var obj = {
valueOf: function () {
console.log("valueOf");
return {}; // not a primitive
}，
toString: function () {
console.log("toString");
return {}; // not a primitive
}
}
复制代码
Number 作为一个函数被调用(而不是作为构造函数调用)时，会在引擎内部调用 ToNumber() 操作:

> Number(obj)
valueOf
toString
TypeError: Cannot convert object to primitive value
回到顶部
加法
有下面这样的一个加法操作。

value1 + value2
在计算这个表达式时，内部的操作步骤是这样的

将两个操作数转换为原始值 (以下是数学表示法的伪代码，不是可以运行的 JavaScript 代码):
 prim1 := ToPrimitive(value1)
 prim2 := ToPrimitive(value2)
PreferredType 被省略，因此 Date 类型的值采用 String，其他类型的值采用 Number。

如果 prim1 或者 prim2 中的任意一个为字符串，则将另外一个也转换成字符串，然后返回两个字符串连接操作后的结果。
否则，将 prim1 和 prim2 都转换为数字类型，返回他们的和。
下面的表格就是 + 运算符对于不同类型进行运算后，得到的结果类型

----------------------------------------------------------------------------------------
           | undefined | boolean | number | string | function | object | null   | array
----------------------------------------------------------------------------------------
undefined  | number    | number  | number | string | string   | string | number | string
boolean    | number    | number  | number | string | string   | string | number | string
number     | number    | number  | number | string | string   | string | number | string
string     | string    | string  | string | string | string   | string | string | string
function   | string    | string  | string | string | string   | string | string | string
object     | string    | string  | string | string | string   | string | string | string
null       | number    | number  | number | string | string   | string | number | string
array      | string    | string  | string | string | string   | string | string | string
-------------------------------------------------------------------------------------------
本表适用于 Chrome 13, Firefox 6, Opera 11 and IE9。

回到顶部
加法的示例
预料到的结果
当你将两个数组相加时，结果正是我们期望的:

> [] + []
''
[] 被转换成一个原始值：首先尝试 valueOf() 方法，该方法返回数组本身(this):

> var arr = [];
> arr.valueOf() === arr
true
此时结果不是原始值，所以再调用 toString() 方法，返回一个空字符串(string 是原始值)。 因此，[] + [] 的结果实际上是两个空字符串的连接。

将一个数组和一个对象相加，结果依然符合我们的期望:

> [] + {}
'[object Object]'
解析：将空对象转换成字符串时，产生如下结果。

> String({})
'[object Object]'
所以最终的结果其实是把 "" 和 "[object Object]" 两个字符串连接起来。

更多的对象转换为原始值的例子:

复制代码
> 5 + new Number(7)
12
> 6 + { valueOf: function () { return 2 } }
8
> "abc" + { toString: function () { return "def" } }
'abcdef'
复制代码
意想不到的结果
如果 + 加法运算的第一个操作数是个空对象字面量，则会出现诡异的结果(Firefox console 中的运行结果):

> {} + {}
NaN
这个问题的原因是，JavaScript 把第一个 {} 解释成了一个空的代码块（code block）并忽略了它。 NaN 其实是表达式 +{} 计算的结果 (+ 加号以及第二个 {})。 你在这里看到的 + 加号并不是二元运算符「加法」，而是一个一元运算符，作用是将它后面的操作数转换成数字，和 Number() 函数完全一样。例如:

> +"3.65"
3.65
以下的表达式是它的等价形式:

复制代码
+{}
Number({})
Number({}.toString())  // {}.valueOf() isn’t primitive
Number("[object Object]")
NaN
复制代码
为什么第一个 {} 会被解析成代码块（code block）呢？ 因为整个输入被解析成了一个语句：如果左大括号出现在一条语句的开头，则这个左大括号会被解析成一个代码块的开始。 所以，你也可以通过强制把输入解析成一个表达式来修复这样的计算结果: （译注：我们期待它是个表达式，结果却被解析成了语句）

> ({} + {})
'[object Object][object Object]'
一个函数或方法的参数也会被解析成一个表达式:

> console.log({} + {})
[object Object][object Object]
经过前面的讲解，对于下面这样的计算结果，你也应该不会感到吃惊了:

> {} + []
0
在解释一次，上面的输入被解析成了一个代码块后跟一个表达式 +[]。 转换的步骤是这样的:

复制代码
+[]
Number([])
Number([].toString())  // [].valueOf() isn’t primitive
Number("")
0
复制代码
有趣的是，Node.js 的 REPL 在解析类似的输入时，与 Firefox 和 Chrome(和Node.js 一样使用 V8 引擎) 的解析结果不同。 下面的输入会被解析成一个表达式，结果更符合我们的预料:

> {} + {}
'[object Object][object Object]'
> {} + []
'[object Object]'