/*
  <
  >
  <=
  >=
  ==
  1.如果兩邊都是字符串  比較unicode碼大小
  2.如果兩邊都是原始類型數據包含一邊是字符串 轉化為數字比較  NaN與任何一個比較都是flase 包括自己
  3.如果一方是對象，向調用valueof  stringto ，如果變成字符串 規則1，如果是數字規則2

  總結：
  除了兩邊都是 字符串，或者 字符串與對象 ，或者 對象與對象 （全部比unicode編碼
  其餘全部轉化為數字 

*/

console.log('2' < [1]);//false 
console.log([2] > [111]);//  '2'>'111'注意是兩個字符串unicode比較 true

console.log('[]>=0 =', []>=0)// 0>= 0 true
console.log('{}>=3 =', {}>=3)//NaN>=3  false
console.log('{}>=true =', {}>=true)//NaN>=1  false
console.log('{}>undefined =', {}>=undefined)//NaN>=NaN false
console.log('{}>={} =', {}>={})//'[object Object]'>='[object Object]'  true
console.log('{}>="/"' ,{}>="/")  //'[object Object]'>='/' => 91>47  true