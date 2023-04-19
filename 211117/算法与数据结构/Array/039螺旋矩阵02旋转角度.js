
/*
给你一幅由 N × N 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。
不占用额外内存空间能否做到？
示例 1:
给定 matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],
原地旋转输入矩阵，使其变为:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
示例 2:
给定 matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 
原地旋转输入矩阵，使其变为:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]
链接：https://leetcode-cn.com/problems/rotate-matrix-lcci
*/
// let testArray = []
// for(let i=0;i<10;i++) {
// 	testArray[i]=[]
// 	for(let j=0;j<10;j++){
// 		testArray[i].push(Math.ceil(Math.random()*10000))
// 	}
// }
// console.log(testArray)
{
	/*
		思路
		第一行变为最后一列，第二行变为倒数第二轮，依此类推 最后一行变为第一列
	 */
	const arr0 = [[1,2,3],[4,5,6],[7,8,9]]
	const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
	const arr1 =[ [ 5, 1, 9,11],[ 2, 4, 8,10],[13, 3, 6, 7],[15,14,12,16]]
	function spiral90D(arr,resultArr) {
		let arrLength = arr.length
		resultArr = new Array(arrLength).fill(null)
		for(let i=0;i<arrLength;i++) {
			const temp = new Array(arrLength).fill(null)
			resultArr[i] = []
			resultArr[i].splice(0,1,...temp)
		}
		//交互数据，使得09->00,19->01,29->02
		for(let i=resultArr.length-1;i>=0;i--) {
			for(let j=0;j<arrLength;j++) {
				resultArr[j][i] = arr[arrLength-1-i].shift()
			}
		}
		
		return resultArr
	}

	// spiral90D(arr)
	console.time('spiral90D0')
	console.log(spiral90D(arr0))
	// console.log(spiral90D(arr))
	// console.log(spiral90D(arr1))
	// console.log(spiral90D(testArray))
	console.timeEnd('spiral90D0')
}
{
	/*
		思路一 
		第一行变为最后一列，第二行变为倒数第二轮，依此类推 最后一行变为第一列
	 */
	const arr0 = [[1,2,3],[4,5,6],[7,8,9]]
	const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
	const arr1 =[ [ 5, 1, 9,11],[ 2, 4, 8,10],[13, 3, 6, 7],[15,14,12,16]]
	function spiral90D(arr) {
		//不额外开辟数组，使用原数组，从n行n列扩大为n行2n列
		let arrLength = arr.length
		for(let i=0;i<arrLength;i++) {
			const temp = new Array(arrLength).fill(null)
			arr[i].splice(arrLength,0,...temp)
		}
		//交互数据，使得09->00,19->01,29->02
		for(let i=arrLength*2-1;i>=arrLength;i--) {
			for(let j=0;j<arrLength;j++) {
				arr[j][i] = arr[arrLength*2-1-i][j]
			}
		}
		//删除数组中原来部分
		for(let i=0;i<arrLength;i++) {
			arr[i].splice(0,arrLength)
		}
		return arr
	}

	// spiral90D(arr)
	console.time('spiral90D')
	console.log(spiral90D(arr0))
	// console.log(spiral90D(arr))
	// console.log(spiral90D(arr1))
	// console.log(spiral90D(testArray))
	console.timeEnd('spiral90D')
}
{
	/*
		思路一 改进
		第一行变为最后一列，第二行变为倒数第二轮，依此类推 最后一行变为第一列
		第一次循环 由第一行取出数据，从0列开始 在每列最后一位插入元素，元素为第一行的shift()值
		第二次循环，由第二行取出数据，从0列开始，在每列倒数第二位置插入元素，元素为第二行的shift()值
		一次类推。
		要注意的是，每个数据提供行在给自己掺入元素值，会先shift(),也就是说长度先减一，在插入
		所以遇到此情景的时候，插入位置需要多前移一行
	 */
	const arr0 = [[1,2,3],[4,5,6],[7,8,9]]
	const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
	const arr1 =[ [ 5, 1, 9,11],[ 2, 4, 8,10],[13, 3, 6, 7],[15,14,12,16]]
	function spiral90D(arr) {
		let arrLength = arr.length
		//交互数据，使得09->00,19->01,29->02
		for(let i=arrLength-1;i>=0;i--) {
			const m = arrLength-1-i//m 是需要移出数据的那一行索引,从0开始，每次循环增加1，同时可以作为插入位置计数器，
			for(let j=0;j<arrLength;j++) {
				let insertindex = arr[j].length-m//每行数据需要插入的位置索引，从每行最后一位开始，每次循环前移一位
				if(m===j) {//如果提供数据的行在给本行插入数据的时候，插入位置需要多前移一位
					insertindex = arr[j].length-1-m
				}
				//arr[j]是需要插入元素的行，arr[m]是提供数据的行，操作的时候，先arr[m].shift()，再插入
				//所以当j===m的时候，及提供数据行给本行插入数据的时候，先shift，长度减一，在插入，此时，同其它行相比
				//位置需要额外前移一位
				arr[j].splice(insertindex,0,arr[m].shift())
			}
		}
		return arr
	}

	// spiral90D(arr)
	console.time('spiral90D1')
	console.log(spiral90D(arr0))
	// console.log(spiral90D(arr))
	// console.log(spiral90D(arr1))
	// console.log(spiral90D(testArray))
	console.timeEnd('spiral90D1')
}
{
	/*
		思路二 
		数组可以先按照中间行交换  4->8 1->92->6交换就是结果，在安按照对角线交换即可、
		[[1,2,3],              [[7,4,1],
	     [4,5,6],    -->       [8,5,2],
	     [7,8,9]]              [9,6,3]]
	     ---------------------------------------------
         [[1,2,3],      [[7,8,9],         [[7,4,1],
	     [4,5,6],  -->   [4,5,6],  -->    [8,5,2],
	     [7,8,9]]        [1,2,3]]         [9,6,3]]   
 		 --------------------------------------------
		[[5,1,9,11],	      [[15,13,2,5],
		 [2,4,8,10],   ---->   [14,3,4,1],
		 [13,3,6,7],           [12,6,8,9],
		 [15,14,12,16]]        [16,7,10,11]]
		 -------------13->14 2->12  5->16 1->7 10->9 4->6
		 [[5,1,9,11]             [[15,14,12,16],                   [[15,13,2,5],
		 [2,4,8,10],       ---->  [13,3,6,7],               ---->   [14,3,4,1],
		 [13,3,6,7],              [2,4,8,10],                       [12,6,8,9],
		 [15,14,12,16]]           [5,1,9,11]]                       [16,7,10,11]]
	 */
	const arr0 = [[1,2,3],
				  [4,5,6],
				  [7,8,9]]

	const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
	const arr1 =[ [ 5, 1, 9,11],
				  [ 2, 4, 8,10],
				  [13, 3, 6, 7],
				  [15,14,12,16]]
	function spiral90D2(arr) {
		const arrLength = arr.length
		const exChangeTimes = Math.floor(arrLength/2)
		//按照对称轴 交互数据，使得0与最后一行，1与倒数第二行.....交换
		for(let i=0;i<=exChangeTimes;i++) {
			for(let j=0;j<arrLength;j++) {
				const t= arr[i][j]
				arr[i][j] = arr[arrLength-1-i][j] 			
				arr[arrLength-1-i][j] = t
			}
		}
		for(let i=0;i<=exChangeTimes+1;i++) {
			for(let j=i;j<arrLength;j++) {
				const t= arr[i][j]
				arr[i][j] = arr[j][i] 			
				arr[j][i] = t
			}
		}
		return arr
	}

	// spiral90D(arr)
	console.time('exchange1')
	console.log(spiral90D(arr0))
	// console.log(spiral90D2(arr))
	// console.log(spiral90D2(arr1))
	// console.log(spiral90D(testArray))
	console.timeEnd('exchange1')
}
