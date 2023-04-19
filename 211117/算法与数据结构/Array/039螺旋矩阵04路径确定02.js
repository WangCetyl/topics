
/*
	请设计一个函数，用来判断在一个矩阵中是否存在一条包含某字符串所有字符的路径。路径可以从矩阵中的任意一格开始，每一步可以在矩
	阵中向左、右、上、下移动一格。如果一条路径经过了矩阵的某一格，那么该路径不能再次进入该格子。例如，在下面的3×4的矩阵中包含一条
	字符串“bfce”的路径（路径中的字母用加粗标出）。
	[["a","b","c","e"],
	["s","f","c","s"],
	["a","d","e","e"]]
	但矩阵中不包含字符串“abfb”的路径，因为字符串的第一个字符b占据了矩阵中的第一行第二个格子之后，路径不能再次进入这个格子。
	示例 1：
	输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
	输出：true
	示例 2：
	输入：board = [["a","b"],["c","d"]], word = "abcd"
	输出：false
	提示：
	1 <= board.length <= 200
	1 <= board[i].length <= 200
	扩展 找出所有可能的正确路径
*/

{
	/*
		思路：
		1.确定字符串首字母的位置保存在数组firstLetterStart中，如果firstLetterStart长度为0立即返回false，无解
		2.从firstLetterStart中循环取出开始值，开始验证。满足坐标在数组中，该坐标没有成功经过，数组值等于切割值，
		  将该坐标加入subResultArr中
		3.在满足2的情况下，如果没有确认完最后一个字母，就同时四个方向递归试错，如果已经确认完所有字母了，判断subResultArr
		  长度是否同str长度一样，如果相同就是满足条件，添加入最终的结果数组resultArr
	*/
	const arr = [["a","b","c","e"],
				 ["s","f","c","s"],
				 ["a","d","e","e"]]
	const arr1= [["a","a","a","e"],
	             ["a","s","s","a"],
				 ["s","f","f","s"],
				 ["a","d","e","a"]]
	const arr2= [["b","a","b","e"],
	             ["g","s","c","d"],
	             ["a","f","f","e"],
	             ["f","e","d","a"],
				 ["s","d","c","b"],
				 ["a","d","b","a"]]
	// const str = 'bfce'
	// const str = 'bfced'
	const str = 'bfcedasa'
	const str1 = 'fsa'
	const str2 = 'abcdef'
    /*
	 *@arr 需要验证的数组
     *@str 需要验证的字符串
     *@resultArr 验证的结果
     */

	function AllExistPathInArr(arr,str,resultArr) {
		let arrCopy=[]
		const X = arr.length
		const Y = arr[0].length
		//确定首字母的位置 保存在数组firstLetterStart中，注意要使用双重for循环，
		const firstLetterStart = []
		for(let i =0;i<X;i++) {
			arrCopy[i] =[]
			for(let j =0;j<Y;j++) {
				arrCopy[i][j] =arr[i][j]
				if(arr[i][j] === str[0]){
					firstLetterStart.push([i,j])
				}
			}
		}
		// console.log('arrCopy=',arrCopy,'\n','STR=',str,'\n','X=',X,'\n','Y=',Y)
		// console.log('firstLetterStart=',firstLetterStart)
		//如果首字母数组长度为0，代表数组中没有首字母，直接返回无解
		if(firstLetterStart.length===0) return new Error('该数组中不存在此路径')
		let firstLetterStart1 = [...firstLetterStart]
		//从firstLetterStart中取出开始值，进行循环 递归
		while(firstLetterStart1.length) {
			const [x0,y0] = firstLetterStart1.shift()
			const strLength = str.length
			let subresultArr = []
			//确定递归方程
			/*
			 *@arr 需要验证的数组
			 *@r 递归的轮数 从0开始，同时代表确认到哪一个字母
			 *@x 需要验证的数组值的x坐标
			 *@y 需要验证的数组值的y坐标
			 *@subresultArr 每条路径验证后结果数组
			 */
			function tryTail(arr,r,x,y,subresultArr) {
				const strLetter = str[r]//缓存验证的字母值
				//判断行走的坐标是否在数组中
				const indexCheck = x>=0&&x<X&&y<Y&&y>=0
				//判断是否走过这个坐标值,走过的都保存在subresultArr中
				const isNoPassed = (subresultArr.indexOf([x,y]) === -1)
				if(indexCheck&&isNoPassed&&arr[x][y]===strLetter){
					subresultArr.push([x,y]) 
					//为保证每条路径subresultArr的独立性，每级都需要克隆，代入下一级
					const subresultArr1 = [...subresultArr]
					const subresultArr2 = [...subresultArr]
					const subresultArr3 = [...subresultArr]
					const subresultArr4 = [...subresultArr]
					if(r<str.length) {//判断路径字母是否全部验证
						//从四个方向都去试错，满足条件的 将坐标添加到subresultArr中
						tryTail(arr,r+1, x, y+1, subresultArr1)
						tryTail(arr,r+1, x+1, y, subresultArr2)
						tryTail(arr,r+1, x, y-1, subresultArr3)
						tryTail(arr,r+1, x-1, y, subresultArr4)
					}
					if(r===strLength-1&&subresultArr.length===strLength) {//只有全部字母都被验证正确的才能够加入最终结果
						//此时字母是最后一个r=str.length-1，并且subresultArr长度等于字符串的长度
						resultArr.push(subresultArr)
					}
				}
			}
			tryTail(arr,0,x0,y0,[])
		}
		return resultArr
	}
	console.time('AllExistPathInArr')
	// console.log(AllExistPathInArr(arr, str))
	// console.log(AllExistPathInArr(arr1, str1,[]))
	console.log(AllExistPathInArr(arr2, str2,[]))
	console.timeEnd('AllExistPathInArr')
}


