
/*

 	编写一个程序，将数组扁平化，并且除去重复部分数据，最终得到一个升序并且不重复的数组

 */
let arr = [1,2,3,[1,111,11111,44444,[34,46,656,656,5]],[1,2,3],[22,44,55,66,[45,322,89]]]

{

	// 方法一  Array.prototype.flat(Infinity)  参数Infinity表示无穷级

	let arr1 = arr.flat(Infinity)

	arr1 = [...new Set(arr1)].sort((a,b)=>{
		return a - b
	})

	arr2 = Array.from(new Set (arr1)).sort((a,b)=>{
		return a - b
	})
	console.log("arr1=",arr1)
	console.log("arr2=",arr2)

}

{
	//方法二  使用toString(),join()方法


	let  arr3 = [...new Set(arr.toString().split(',').map(item => {
	    return Number(item)
	}))].sort( (a,b)=> {
		return a-b
	})

	let arr4 = [...new Set(arr.join(',').split(',').map((item)=> {
		return Number(item)
	}))].sort((a,b)=> {
		return a-b
	})

	//注意如果使用正则来split，要使用?: 表示不捕获 
	let arr5 = [...new Set(arr.join('|').split(/(?:,|\|)/g).map((item)=> {
		return Number(item)
	}))].sort((a,b)=> {
		return a-b
	})

	console.log("arr3=",arr3)
	console.log("arr4=",arr4)
	console.log("arr5=",arr5)

}

{

	//方法三  使用JSON.stringify()方法

	let arr6 = JSON.stringify(arr)
	arr6 = arr6.split(/(?:,|\[|\])/g)
	arr6 = arr6.filter(item => {
		if(!"") {return item}
	})
	arr6 = arr6.map((item)=> {
		return Number(item)
	})
	arr6 = new Set(arr6)
	arr6 = [...arr6].sort((a,b)=> {
		return a-b
	})

	let arr7 = JSON.stringify(arr)
	arr7 = arr7.replace(/(\[|\])/g,'')

	arr7 = arr7.split(',')
	arr7 = arr7.map(item=>Number(item))
	arr7 = new Set(arr7)
	arr7 = [...arr7].sort((a,b)=> {
		return a-b
	})
	console.log("arr6=",arr6)
	console.log("arr7=",arr7)
}

{

	/*使用some方法 结合[].concat()*/
   
	while(arr.some(item => Array.isArray(item))){
		arr = [].concat(...arr)
	}

	let arr8 = [...new Set(arr)].sort((a,b) => {
		return a-b
	})
    console.log('arr8=',arr8)
}

{
	/*使用递归*/
   
	function ArrayFlat(arr,arr9 = []) {
		for (let i = 0 ; i< arr.length ; i++) {
			if( Array.isArray(arr[i])) {
				ArrayFlat(arr[i])
				return
			}
		    arr9.push(arr[i])
			
		}
	    return arr9
	}

    let arr9 = [...new Set(ArrayFlat(arr,[]))].sort((a,b)=> {
    	return a-b
    })
	console.log('arr9=',arr9)	
  
    ;( function () {
    	function ArrayFlat(arr,arr9 = []) {
			for (let i = 0 ; i< arr.length ; i++) {
				if( Array.isArray(arr[i])) {
					ArrayFlat(arr[i])
					return
				}
			    arr9.push(arr[i])
			}
		    return arr9
		}
		// console.log(this)
		Array.prototype.ArrayFlat = ArrayFlat
    })()
    let arr91 =  [...new Set(arr.ArrayFlat(arr,[]))].sort((a,b)=> {
    	return a-b
    });
	console.log('arr91=',arr91)	


	/*抽象化*/

	;( function() {
		function ArrayFlat1() {
			let result = [],
				_this = this; 
			let fn = (arr) => {
				for(let i = 0 ; i< arr.length ; i++) {
					if(Array.isArray(arr[i])) {
						fn(arr[i])
						continue
					}
					result.push(arr[i])
				}
			}
			fn(_this)
			return result
		}
		Array.prototype.ArrayFlat1 = ArrayFlat1
	})()

	arr = [...new Set(arr.ArrayFlat1())].sort((a,b)=> {
		return a-b
	})

	console.log('arr10=',arr)
}