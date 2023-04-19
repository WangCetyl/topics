{
	var b = 10;
	(function b(){
		b = 20;
		console.log('b=',b);//[Function: b]  
		console.log('++++++++++++++++++++++++++')
	})();
}


{
	var b = 10;
	(function b(){
		window.b = 20;
		console.log('b=',b);//[Function: b] 
		console.log('window.b=',window.b)//window.b= 20  注意在node环境中会出现 window is not defined ，所以需要在浏览器环境中调试
		console.log('++++++++++++++++++++++++++')
	})();
}

{
	var b = 10;
	(function b(){
		var b = 20; // IIFE内部变量;
		console.log('b=',b);// b= 20
		console.log('++++++++++++++++++++++++++')
	})();
}

{
	
	var sayHello;
	console.log(typeof(sayHey)); //=>function    
	console.log(typeof(sayHo)); //=>undefined
 
    function sayHey() {
        console.log("sayHey");
    }
    sayHello = function sayHo() {
        console.log("sayHello");
    }
    console.log(sayHello)
    function sayHey() {
        console.log("sayHey2");
    }
    sayHello = function sayHo() {
        console.log("sayHello2");
    }
 
	sayHey(); // => sayHey2    
	sayHello(); // => sayHello2
	console.log(sayHello)
}