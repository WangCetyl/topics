{
	/*
	
		在输入框中如何正确判断输入的是一个正确的网址，例如:用户输入一个字符串，验证是否符合URL网址格式
	 */
	
	let url = 'http://www.zhangsna.com/?tongzhi=1&&lihua=8#audio'
	/*
		url格式分析
		1.协议// http//https//ftp//
		2. 域名  wwww.sina.com.cn   www.baidu.com     
		3.请求路径   /  /index.html  
		4 ?问号传参 ？ xxxx=xxx&&xxxx=wwww
		5.哈希值  #dfsd

		以上除了2以外，其他都可以省
	 */
	
	let reg = /^((http|https|ftp):\/\/)?(([\w-]+\.)+[a-z0-9]+)((\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
	//^ 表示开头  $表示结尾 ：//前面需要加转义符\\,? 表示出现0次到1次  i表示忽略大小写
	console.log('test',reg.test(url))
	console.log('exec',reg.exec(url))
	console.log('match',url.match(reg))
	console.log('search',url.match(reg))


}