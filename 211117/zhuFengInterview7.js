{
	/*
		实现一个$attr(name,value)遍历
		属性为name，值为value的元素集合
	 */
	
	let $attr = (name,value)=> {

		let nodes = document.getElementsByTagName("*")
	    let nodesNameValuearr = [] 
		for(let i = 0; i < nodes.length ; i++) {
			if (nodes[i].getAttribute(name)) {
				let classNameList = nodes[i].getAttribute(name)
				if(name === 'class') {
					// let classNameListArr = classNameList.split(' ')
					// for(let k = 0 ; k <= classNameListArr.length ; k ++) {
					// 	if(classNameListArr[k] == value) {
					// 		nodesNameValuearr.push(nodes[i])
							
					// 	}
					// }

				    let reg = new RegExp('\\b'+value+'\\b')
				    if(reg.test(classNameList)) {
				    	nodesNameValuearr.push(nodes[i])
				    }


				}else {
				    if(classNameList == value) {
				    	nodesNameValuearr.push(nodes[i])
				    } 

				}


			}
		}

		return nodesNameValuearr

	}
	
    console.log($attr('myatt','helll'))
    console.log($attr('id','ul111'))
    console.log($attr('class','li11'))

}