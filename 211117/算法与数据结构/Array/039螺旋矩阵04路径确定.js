
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
	链接：https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof
*/

{
	/*
		思路：
		1.确定字符串首字母的位置保存在数组firstLetterStart中，如果firstLetterStart长度为0立即返回false，无解
		2.从firstLetterStart中循环取出开始值，开始验证。满足坐标在数组中，数组值不等于null(null 表示试过的坐
		  标值替换为null)，数组值等于切割值，为真/true，将该坐标值替换为null(根据需求确定替换值)，赋值
		  状态值为true 返回该状态值，否则返回状态值为false
		3.在真的情况下递归，有四个方向，挑选一个开始，如果返回值为真，继续从下一层四个方向中挑选一个递归；如果返回
		  值为false，从同层中剩余的三个中挑选一个按照第一个的方式递归。如果第二个还是为false，就试第三个，如果第三个也为、
		  false就递归同层第四个。如果还是false就无解，返回false
		4.在同层递归中成功的进入下一层试错，直到所有字母值均取完 终止递归
	*/
	const arr = [["a","b","c","e"],
				 ["s","f","c","s"],
				 ["a","d","e","e"]]
	const arr1= [["a","b","c","e"],
				 ["a","f","f","s"],
				 ["a","d","e","a"]]
	// const str = 'bfce'
	// const str = 'bfced'
	const str = 'bfcedasa'
	const str1 = 'fsa'
    /*
	 *@arr 需要验证的数组
     *@str 需要验证的字符串
     */

	function isExistInArr(arr,str) {
		const X = arr.length
		const Y = arr[0].length
		//确定首字母的位置 保存在数组firstLetterStart中，注意要使用双重for循环，
		const firstLetterStart = []
		for(let i =0;i<X;i++) {
			for(let j =0;j<Y;j++) {
				if(arr[i][j] === str[0]){
					firstLetterStart.push([i,j])
				}
			}
		}
		if(firstLetterStart.length===0) return false
		let firstLetterStart1 = [...firstLetterStart]
		//从firstLetterStart中取出开始值，进行循环 递归
		while(firstLetterStart1.length) {
			const [x0,y0] = firstLetterStart1.shift()
			let strArr = str.split('')
			//确定递归方程
			/*
			 *@arr 需要验证的数组
			 *@strLetter 需要验证的字母值
			 *@x 需要验证的数组值的x坐标
			 *@y 需要验证的数组值的y坐标
			 *@isExist 验证后的状态值，true/false
			 */
			function tryTail(arr,strLetter,x,y,isExist) {
				//判断行走的坐标是否在数组中
				let indexCheck = x>=0&&x<X&&y<Y&&y>=0
				//满足数组坐标在数组中，数组值不等于null(null 表示走过的坐标值替换为null)，数组值等于切割值
				if(indexCheck&&arr[x][y]&&arr[x][y]===strLetter){
					isExist = true
					arr[x][y] = null//如果满足条件 将值改为null，下一次判断的时候就只要是null就跳过
					if(strArr.length) {//判断路径字母是否全部验证
						const strLetter = strArr.shift() //缓存验证的字母值
						//在四个方向中挑选一个，试错，返回状态，如果成功就递归到下一层四个方向，如果为不成功，就在同级剩余
						//三个中选一个再次试错，重复第一个方向的操作
						let result = tryTail(arr, strLetter, x, y+1, isExist)
						if(!result) {
							let result1 = tryTail(arr, strLetter, x+1, y, isExist)
							if(!result1) {
								let result2 = tryTail(arr, strLetter, x, y-1, isExist)
								if(!result2) {
									let result3 = tryTail(arr, strLetter, x-1, y, isExist)
									return result3
								}
							}else {
								return result1
							}
						}else {
							return result
						}
					}
					return isExist
				}
				return isExist = false
			}
			let finresult = tryTail(arr,strArr.shift(),x0,y0)
			console.log(arr)
			if(finresult) return finresult
		}
		return false
	}
	console.time('isExistInArr')
	console.log(isExistInArr(arr, str))
	console.log(isExistInArr(arr1, str1))
	console.timeEnd('isExistInArr')
}


