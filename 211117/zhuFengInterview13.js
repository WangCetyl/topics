/*注意两条题的区别 B函数window下面有个B,B函数内还有一个私有的B，所以即使内部在定义B，无影响，但是
 A是全局的，所以有影响 
*/
var a = 0,
	b = 0;
function A(a) {
	A = function (b) {
		alert(a + b++);
	};
	alert(a++);
}
A(1);
A(2);

// 答案 字符串 '1' '4'


function B(a) {
	var B = function (b) {
		alert(a + b++);
	};
	alert(a++);
}
B(1);
B(2);
// 答案 字符串 '1' '2'