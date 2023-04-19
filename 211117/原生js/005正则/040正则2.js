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
	/*
		当正则表达式使用 "g" 标志时，可以多次执行 exec 方法来查找同一个字符串中的成功匹配。当你这样做时，
		查找将从正则表达式的 lastIndex 属性指定的位置开始。（test() 也会更新 lastIndex 属性）。注意，
		即使再次查找的字符串不是原查找字符串时，lastIndex 也不会被重置，它依旧会从记录的 lastIndex 开始。
	 */
	console.log('exec',reg.exec(url))
	console.log('match',url.match(reg))
	console.log('search',url.match(reg))


}