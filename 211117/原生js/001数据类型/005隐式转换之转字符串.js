/*
  顯示  String()  String.prototype.slice.call()//後邊對 null undefined無法轉換  會報錯
  隱式
  有字符串，對象的+
   alert  typeof document.write  


*/

console.log('1 + [] =' , 1 + []);//1
console.log('1 + {} =' , 1 + {});//1[object Object]
console.log('{} + 1  =' , {}+1  );//[object Object]1  如果在浏览器中结果为1
console.log('1 + function(){} =' , 1 + function(){});//1 + function(){} = 1function(){}

alert(4) //'4'
console.log([1,3,5] + null)//"1,3,5null"
 
