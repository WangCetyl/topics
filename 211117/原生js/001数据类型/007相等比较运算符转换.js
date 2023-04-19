/*
  == 
  !=
  ===
  !==
  相等比较
  1、不同类型的原始类型数据比较，把所有的数据转换成数字进行对比
  2、null，undefined除了自己同自己，自己同对方，相等，其他任意都false
  3、对象与原始数据类型比较是，把对象转成原始值，在进行比较
  4、对象类型与对象类型比较，比较引用地址，排除引用地址相同

  总结:
  1、原始类型对比，转成数字对比
  2、对象类型对比
    2.1 对象同字符串 转换成Unicode码值
    2.2 对象与数字、布尔值比较、转换成数字
    2.3 对象与对象 比较引用地址
  3、null与undefined，自己与自己，自己与对方相等，其他一律不等false


*/

console.log('"2"==[2] =','2'=='2');// '2'== '1' true 
console.log('"1"==true =','1'==true);// '2'== '1' true 
console.log('"1"==true =','1'==true);// '2'== '1' true 
console.log('[]==[] =',[]==[]);// []==[] = false  比较相同地址 同true 不同false
const a = []
const b =  a
console.log('b==a =',b==a);// a==b =true 
console.log('{a:1}==[object Object]=', {a:1}=='[object Object]')//{a:1}=='[object Object]'=> '[object Object]'=='[object Object]'= true
