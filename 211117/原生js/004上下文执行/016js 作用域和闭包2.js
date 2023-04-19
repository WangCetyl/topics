创建若干个标签，点击每个标签时，显示改标签的序号

for(let i=0;i<10;i++) {
	var a = document.createElement('a')
	a.innerHTML = i + '<br/>'
	a.addEventListener('click',function(e){
		 e.preventDefault(); 
		alert(i)
	})
	document.body.appendChild(a)
}


--------------------------------------------------

for(var i=0;i<10;i++) {
	(function(i){
		var a = document.createElement('a')
		a.innerHTML = i + '<br/>'
		a.addEventListener('click',function(e){
			 e.preventDefault(); 
			alert(i)
		})
		document.body.appendChild(a)
	})(i)
	
}