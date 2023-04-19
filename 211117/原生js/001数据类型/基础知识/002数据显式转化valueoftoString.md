# 对象的valueof() toString()方法
## 各种基本类型数据 对应的包装对象
- 1.数字      Number
- 2.字符串    String
- 3.布尔值    Boolean
- 4.null      
- 5.undefined
- 6.数组      Array
- 7.函数      Function
- 6.对象      Object

- 除了null undefined，其他类型(数字需用()包裹)都可以调用，valueOf() toString()两种方法
- valueOf  返回对象对应的原始值
- toString 返回对象的字符串表示形式
## 调用结果：
- 1. 数字、字符串、布尔值
    valueOf   数据本身（原始值形式）
    toString  数据转换成字符串的形式  
- 2. 数组
    valueOf   数据本身（对象形式）
    toString  去掉中括号，外面加引号,(本质为调用数组join(',')后的结果)
- 3. 函数
    valueOf   数据本身（对象形式）
    toString  函数外面加引号
- 4. 对象
    valueOf   数据本身（对象形式）
    toString  [object Object]
## Number函数转化对象数据的转换原理
- 1.首先调用valueOf方法  如果返回的是原始数据形式 则直接使用Number，结束返回该值。
- 2.如果返回的还是对象数据，则继续调用toString()方法
- 3.toSting方法如果返回的是原始类型数据，则继续调用Number，结束返回值
- 2.如果返回的还是对象数据，就报错

## String函数转化对象数据的转换原理
- 1.首先调用toString方法  如果返回的是原始数据形式 则直接使用String，结束返回该值。
- 2.如果返回的还是对象数据，则继续调用valueOf方法
- 3.valueOf方法如果返回的是原始类型数据，则继续调用String，结束返回值
- 2.如果返回的还是对象数据，就报错