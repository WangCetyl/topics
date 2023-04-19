# 数据类型显示转化的几种场景
## 内置String函数
-   1、基本数据类型、null、undefined的结果就是给数据就是给数据加上引号变成字符串
-   2、数组的结果为把所有中括号去掉，外面价格引号
-   3、对象的结果为'[object Object]'(除了日期对象)
-   4、函数的结果为在函数整体外面加个引号


## String函数转化对象数据的转换原理
- 1.首先调用toString方法  如果返回的是原始数据形式 则直接使用String，结束返回该值。
- 2.如果返回的还是对象数据，则继续调用valueOf方法
- 3.valueOf方法如果返回的是原始类型数据，则继续调用String，结束返回值
- 2.如果返回的还是对象数据，就报错

```
console.log("String(3) =", String(3)) 
console.log("String(null) =",String(null)) 
console.log("String(undefined) =",String(undefined)) 
console.log("String([1,2,'q']) =",String([1,2,'q'])) 
console.log("String({'a':1}) =",String({"a":1}),String(function() {console.log()})) 
String(new Date())//"Sat May 02 2020 14:41:41 GMT+0800 (中国标准时间)"
String(new RegExp())//"/(?:)/"
"3"
"null"
"undefined"
"1,2,q"
"[object Object]"
"function() {console.log()}"
"Sat May 02 2020 14:41:41 GMT+0800 (中国标准时间)"
"/(?:)/"           
```

