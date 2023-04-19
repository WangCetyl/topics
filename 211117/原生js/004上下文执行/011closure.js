 
 {
	 function mixFunction(a){
		var result=[],i,n;
		n=a.length;
		for(i=0;i<n;i++){
			result[i]=function(){
				//Closure对外部变量是引用
				console.log("for i="+i);
				//return a[i];//a[i-1]
				console.log('a['+ i +']=',a[i])
			}
		}
		console.log(result)
		return result;
	}
	 var mixcall=mixFunction([10,20,30]);
	 var f=mixcall[0];
	 console.log(f());//?应该输出什么值
	 console.log("++++++++++++++++++++++++")
 }
 

 
 {
	 function mixFunction(a){
		var result=[],i,n;
		n=a.length;
		for(i=0;i<n;i++){
			result[i]=function(){
				//Closure对外部变量是引用
				console.log("for i="+i);
				result.push(a[i])
			}
		}
		console.log(result)
		return result;
	}
	 var mixcall=mixFunction([10,20,30]);
	 var f=mixcall[0];
	 console.log(f());//?应该输出什么值
	 console.log("++++++++++++++++++++++++")
 }
 
 