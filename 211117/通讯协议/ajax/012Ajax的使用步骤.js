  var xmlHttpRequest;  //定义一个变量用于存放XMLHttpRequest对象
 //定义一个用于创建XMLHttpRequest对象的函数
 function createXMLHttpRequest()
{
		if(window.ActiveXObject)
		{
			   //IE浏览器的创建方式
			   xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}else if(windew.XMLHttpRequest)
	   {
			  //Netscape浏览器中的创建方式
			  xmlHttpRequest = new XMLHttpRequest();
		}
}
//响应HTTP请求状态变化的函数
function httpStateChange()
{
	  //判断异步调用是否完成
	 if(xmlHttpRequest.readyState == 4)
	{
			//判断异步调用是否成功,如果成功开始局部更新数据
			if(xmlHttpRequest.status == 200||xmlHttpRequest.status == 0)
			{
				   //查找节点
				   var node = document.getElementById("myDIv");

					//更新数据

					node.firstChild.nodeValue = xmlHttpRequest .responseText;
			}
			else
		   {
				 //如果异步调用未成功,弹出警告框,并显示出错信息
				 alert("异步调用出错/n返回的HTTP状态码为:"+xmlHttpRequest.status + "/n返回的HTTP状态信息为:" + xmlHttpRequest.statusText);
		   }
	 }
 }
//异步调用服务器段数据
function getData(name,value)
{                   
   //创建XMLHttpRequest对象
   createXMLHttpRequest();
   if(xmlHttpRequest!=null)
   {
		//创建HTTP请求
		xmlHttpRequest.open("get","ajax.text",true)
	   //设置HTTP请求状态变化的函数
		xmlHttpRequest.onreadystatechange = httpStateChange;
	   //发送请求
	  xmlHttpRequest.send(null);
	}
}