运算规则如下
Abstract Equality Comparison
The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:
ReturnIfAbrupt(x).
ReturnIfAbrupt(y).
If Type(x) is the same as Type(y), then
Return the result of performing Strict Equality Comparison x === y.
If x is null and y is undefined, return true.
If x is undefined and y is null, return true.
If Type(x) is Number and Type(y) is String,
return the result of the comparison x == ToNumber(y).
If Type(x) is String and Type(y) is Number,
return the result of the comparison ToNumber(x) == y.
If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
If Type(x) is either String, Number, or Symbol and Type(y) is Object, then
return the result of the comparison x == ToPrimitive(y).
If Type(x) is Object and Type(y) is either String, Number, or Symbol, then
return the result of the comparison ToPrimitive(x) == y.
Return false.


Number(undefined)=NaN
Number(null)=0

例子一
'true'==true
左侧'true'的数据类型是String，右侧true的数据类型是Boolean。
首先满足第9条，所以布尔值true转成数值1，返回'true'==1的值；
其次'true'==1又满足第7条，所以字符串true根据上面讲的规则，转换成Nan，故返回NaN==1；
然后NaN都不等于任何值，包括它本身，即NaN==NaN返回false；所以最后'true'==true返回false。

例子二
0==null
在这个相等运算中，左侧0的数据类型是Number，右侧null的数据类型是Null（规范文档4.3.13节规定，内部Type运算的结果，与typeof运算符无关），所以根据上面的规则，前面11条都不满足，直到第12步才返回false。

例子三
{} + [] 
js解释器会将开头的 {} 看作一个代码块，而不是一个js对象，于是真正参与运算的是+[]，就是将[]转换为number，于是得出答案0
但是如果两个都是{}+{} 结果就是"[object Object][object Object]"  {a:1}+{}="[object Object][object Object]"
同理
1 {a: 1} + 2     // 2
4 {foo:[1,2,3]}[0];  // [0]
4 {}[100];  // [100]

例子四
[]+{}
这是两个复杂数据结构相加的例子，按照上面的rule，我们先将两个操作数转换为string，然后进行拼接，于是
[] -----> ''
{} -----> '[object Object]'
[] + {} = '[object Object]'
同理
2 2 + {a: 1}     // 2[object Object]
例子五
+ {a: 1}        // NaN  
+ 如果左边为空 你在这里看到的 + 加号并不是二元运算符「加法」，而是一个一元运算符，作用是将它后面的操作数转换成数字，和 Number() 函数完全一样。
> +"3.65"
3.65
1.由于左边为空 所以实际是右边独立计算
2.根据规则{a:1}先toString(),变成"[object object]"
3.字符串除非首位开始有数字字符，否则一律为NAN


> 5 + new Number(7)
12
> 6 + { valueOf: function () { return 2 } }
8
> "abc" + { toString: function () { return "def" } }
'abcdef'