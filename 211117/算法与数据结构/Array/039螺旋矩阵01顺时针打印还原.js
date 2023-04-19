
/*
	链接：https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof
 	输入一个矩阵，m行，n列，按照从外向里以顺时针的顺序依次打印出每一个数字。
	示例 1：
	输入：matrix = [[1,2,3],
				   [4,5,6],
				   [7,8,9]]
	输出：[1,2,3,6,9,8,7,4,5]
	示例 2：
	输入：matrix = [
					[1,2,3,4],
					[5,6,7,8],
					[9,10,11,12]
				   ]
	输出：[1,2,3,4,8,12,11,10,9,5,6,7]
*/

{
	const arr =  [[1,2,3],[4,5,6],[7,8,9]]
	const arr1 = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
	const arr2 = [[1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16],[17,18,19,20,21,22,23,24],[25,26,27,28,29,30,31,32]]
	const arr3 = [[1,2,3,4,5,6,7,8,81],[9,10,11,12,13,14,15,16,161],[17,18,19,20,21,22,23,24,241],[25,26,27,28,29,30,31,32,321],[33,34,35,36,37,38,39,40,401]]
	const arr4 = [[1,2,3,4,5,6,7,8,81],
				  [9,10,11,12,13,14,15,16,161],
				  [17,18,19,20,21,22,23,24,241],
				  [25,26,27,28,29,30,31,32,321],
				  [33,34,35,36,37,38,39,40,401],
				  [41,42,43,44,45,46,47,48,481]]

	function spiral(arr,result=[]) {
		for(let i=0;i<=arr.length-1;i++) {
			// console.log(arr[i])
			if(i===0) {
				// console.log('arr[0]=',arr[0])
				result = result.concat(...arr[i])
			}else if(i==arr.length-1) {
				// console.log(`arr[${arr.length-1}] = ${arr[arr.length-1]}`)
				result = result.concat(arr[i].reverse())
			}else {
				// console.log(`arr[${i}]`,arr[i].pop())
				result.push(arr[i].pop())
			}
		}
		for(let j=arr.length-2;j>0;j--) {
			// console.log(`arr[${j}] = ${arr[j]}`)
			result.push(arr[j].shift())
		}
		arr.shift()
		arr.pop()
		// console.log(arr,result)
		if(arr.length>1) {
			return spiral(arr, result)
		}else {
			if(arr.length===1) {
				result = result.concat(arr[0])
			}
			// console.log(result)
			return result
		}		
	}

	console.time('spiral1')
	// console.log(spiral(arr, result=[]))
	// console.log(spiral(arr1, result=[]))
	// console.log(spiral(arr2, result=[]))
	// console.log(spiral(arr3, result=[]))
	console.log(spiral(arr4, result=[]))
	console.timeEnd('spiral1')
}

{ 
	/*将一维数组变成二维螺旋数组
	const arr = [1, 2, 3, 4, 5, 6, 7, 8, 81, 161, 241, 321, 401, 481, 48, 
	47, 46, 45, 44, 43, 42, 41, 33, 25, 17, 9, 10, 11, 12, 13, 14, 15, 16,
	24, 32, 40, 39, 38, 37, 36, 35, 34, 26, 18, 19, 20, 21, 22, 23, 31, 30, 
	29, 28, 27]
	const arr4 = [[1,2,3,4,5,6,7,8,81],
	  [9,10,11,12,13,14,15,16,161],
	  [17,18,19,20,21,22,23,24,241],
	  [25,26,27,28,29,30,31,32,321],
	  [33,34,35,36,37,38,39,40,401],
	  [41,42,43,44,45,46,47,48,481]]
	*/
	/*
	 *@arr，需要转换的数组
	 *@reaultArr,最后转换成的二维数组
	 *@d 最后转换成的二维数组的行数
	 */
	const arr = [1, 2, 3, 6, 9, 8, 7, 4, 5]
	const arr1 = [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
	const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 16, 24, 32, 31, 30, 29, 28, 27, 26, 25, 17, 9, 10, 11, 12, 13, 14, 15, 23, 22, 21, 20, 19, 18]
	const arr3 =[1, 2, 3, 4, 5, 6, 7, 8, 81, 161, 241, 321, 401, 40, 39, 38, 37, 36, 35, 34, 33, 25, 17, 9, 10, 11, 12, 13, 14, 15, 16, 24, 32, 31, 30, 29, 28, 27, 26, 18, 19, 20, 21, 22, 23]
	const arr4 = [1, 2, 3, 4, 5, 6, 7, 8, 81, 161, 241, 321, 401, 481, 48, 
	47, 46, 45, 44, 43, 42, 41, 33, 25, 17, 9, 10, 11, 12, 13, 14, 15, 16,
	24, 32, 40, 39, 38, 37, 36, 35, 34, 26, 18, 19, 20, 21, 22, 23, 31, 30, 
	29, 28, 27]
	let testArray = []
	for(let i=0;i<100;i++) {
		testArray.push(i)
	}
	function toSpiral(arr,d=6) {
		let resultArr= new Array(d).fill(null)
		const arrLength = arr.length 
		//二维数组每个子数组的长度，及列数
		const subArrLength = arrLength/d
		//如果无法整除行数，从新输入新的arr 
		if(arrLength%d) throw new Error(`数组的长度${arrLength}除以${d}不等于0,请重新输入数组`)
			/*
			 *@arr，需要转换的数组，
			 *@i 需要遍历的二维数组的起始索引值，初始值为0
			 *@j 需要遍历的二维数组的结束索引值,初始值为d
			 *@linenum 遍历的二维数组时，需要切割的item数量初始值为subArrLength
			 */
		function toSpiralrecusive(arr,resultArr,i=0,j=d-1,linenum=subArrLength) {
			for(let m=i;m<=j;m++) {
				if(m===i) {
					const temp = arr.splice(0,linenum)
					if(resultArr[m]===null){
						resultArr[m] = new Array()
					}
					resultArr[m].splice(i,0,...temp)
				}else if(m===j) {
					const temp = arr.splice(0,linenum).reverse()
					if(resultArr[m]===null){
						resultArr[m] = new Array()
					}
					resultArr[m].splice(i,0,...temp)
				}else if(j-i>1){
					if(resultArr[m]===null){
						resultArr[m] = new Array()
					}
					resultArr[m].splice(i,0,arr.shift())
				}
			}
			for(let n=j-1;n>i;n--) {
				if(arr.length) {
					resultArr[n].splice(i,0,arr.shift())
				}
			}
			// console.log(resultArr)
			//统计一轮需要的元素个数，及linenum+(j-i)+linenum+(j-i)
			//如果arr的长度大于这个和，继续递归，否则单独插入
			//第二以后轮次递归的话需要i+1，j-1，linenum-2，所以数量统计为
			// const roundnum = (linenum-1)+(j-1-(i+1))+(linenum-1)+(j-1-(i+1))

			// if(arr.length>roundnum) {
			// 	toSpiralrecusive(arr,resultArr,i+1,j-1,linenum-2)
			// }else {
			// 	for(let m=i+1;m<=j-1;m++) {
			// 		resultArr[m].splice(i,0,arr.shift())
			// 	}
			// }	
			if(arr.length) {
				toSpiralrecusive(arr,resultArr,i+1,j-1,linenum-2)
			}
		}
		toSpiralrecusive(arr,resultArr)
		return resultArr
	}
	
	// console.log(toSpiral(arr,3))
	// console.log(toSpiral(arr1,3))
	// console.log(toSpiral(arr2,4))
	// console.log(toSpiral(arr3,5))
	// console.log(toSpiral(arr3,9))
	// console.log(toSpiral(arr4,6))
	// console.log(toSpiral(arr4,9))
	// console.log(toSpiral(testArray,5))
	// console.log(toSpiral(testArray,10))
	console.log(toSpiral(testArray,20))

}