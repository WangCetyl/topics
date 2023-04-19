/*
   顯示: Number()  parseInt() parseFloat()
   隱式
  +
  1、除字符串 对象以外全部转换为数字  使用Number()
  2、字符串，对象转换为字符串

  其他减乘除模 一律使用Number转换为数字

  +-號後面全部轉為數字，注意-好後面需要（）,否則變為負數

  ==後面也是 全部變為數字
  --  ++
*/

console.log('1 + undefined=' , 1 + undefined);//NaN
console.log('1 + "undefined"=' , 1 + 'undefined');//1undefined
console.log('1 + null =' , 1 + null);//1

console.log('1 + [] =' , 1 + []);//1
console.log('1 + {} =' , 1 + {});//1[object Object]
console.log('{} + 1  =' , {}+1  );//[object Object]1  如果在浏览器中结果为1
console.log('1 + function(){} =' , 1 + function(){});//1 + function(){} = 1function(){}

console.log("'2'/'2' = ", '2'/'2');//'2'/'2' =  1
console.log("'3'%'2' = ", '3'%'2');//'3'/'2' =  1
console.log(" true*'2' = ", true*'2');//true*'2' =  2
console.log(" -true = ", -true);//-true =  -1
console.log(" -'34' = ", -'234');//-'34' =  -234
