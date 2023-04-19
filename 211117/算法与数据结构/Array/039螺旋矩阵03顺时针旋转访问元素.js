
/*
	在 R 行 C 列的矩阵上，我们从 (r0, c0) 面朝东面开始这里，网格的西北角位于第一行第一列，网格的东南角位于最后一行最后一列。
现在，我们以顺时针按螺旋状行走，访问此网格中的每个位置。每当我们移动到网格的边界之外时，我们会继续在网格之外行走（但稍后可能会返回到网格边界）。
最终，我们到过网格的所有 R * C 个空间。按照访问顺序返回表示网格位置的坐标列表。
示例 1：
输入：R = 1, C = 4, r0 = 0, c0 = 0
输出：[[0,0],[0,1],[0,2],[0,3]]
示例 2：
输入：R = 5, C = 6, r0 = 1, c0 = 4
输出：[[1,4],[1,5],[2,5],[2,4],[2,3],[1,3],[0,3],[0,4],[0,5],[3,5],[3,4],[3,3],[3,2],[2,2],[1,2],[0,2],[4,5],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1],[1,1],[0,1],[4,0],[3,0],[2,0],[1,0],[0,0]]
1 <= R <= 100
1 <= C <= 100
0 <= r0 < R
0 <= c0 < C
链接：https://leetcode-cn.com/problems/spiral-matrix-iii
*/

{
	/*
		思路 
		1.将数组转化为每个元素是其坐标数组[x，y]的形式
		2.确定初始坐标，m0,n0，添加该坐标
			2.1 第一次需要向左添加 m0 n0+1
	*/
	const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
	/*
	 *@m 为数组行数
	 *@n 为数组列数
	 *
	 */
	function spiralMapAllItems(m,n,m0,n0,x=1,resultArr=[]) {
		//1.将数组转笔为每个元素是其坐标数组[x，y]的形式
		let arr= new Array(m).fill(null)
		for(let i = 0; i<m; i++) {
			arr[i] =[]
			for(let j = 0; j<n; j++) {
				arr[i][j]=[i,j]
			}
		}
		// console.log(m,n,m0,n0,resultArr)
		console.dir(arr)
		/*
		 *@m0 起点行坐标			
		 *@n0 起点列坐标			
		 *@resultArr 结果数组 返回值		
		 *@x 旋转次数 初始值为1，每次加1		
		 */
		function spiralArr(m0,n0,resultArr,x) {
			// console.log('spiralArr',m,n,m0,n0,x,resultArr)
			//1.添加起点元素
			if(!resultArr.length) {
				resultArr.push([m0,n0])
			}
			//2添加东边一个元素，该动作只是第一次才如此操作，后续直接concat n0+1列
			//起点向东/右
			if(n0+x<n) {
				for(let i = m0-x+1;i<m0+x;i++) {
					if(i>=0&&i<m) {
						resultArr.push(arr[i][n0+x])
					}
				}
			}
			let temarr
			//3 向下一行，向西/左 获取去m0+x的项
			//切割数组m0+x行，从n0-x列到n0+x列，首先判断m0+x是否在arr中，如果不在不需要这些项
			//如果在arr中，判断n0-x是否大于等于0，如果是，以n0-x为起点，否则以0为起点。
			//对于n0+x 即使溢出，也按只计入最后一个为止
			if(m0+x<m&&n0-x>=0){
				temarr = arr[m0+x].slice(n0-x,n0+x+1).reverse()
				resultArr = resultArr.concat(temarr)
			}else if(m0+x<m&&n0-x<0) {
				temarr = arr[m0+x].slice(0,n0+x+1).reverse()
				resultArr = resultArr.concat(temarr)
			}
			//4.从下向上逐行添加n0-x列的 [m0+x-1,m0-x)的所有项，首先判断 n0-x列是否在数组中
			//  再次判断i是否在数组中，满足添加到结果数组中
			if((n0-x)>=0) {
				for(let i= m0+x-1;i>m0-x;i--){
					if(i>=0&&i<m){
						resultArr.push(arr[i][n0-x])
					}
				}
			}
			//5 从左到右，添加m0-x行。 获取该行从n0-x 到 n0+x的所有值，首先判断m0-x是否在数组arr中
			//再判断n0-x到n0+x中元素是否全部在arr中,类似于第3不操作
			if(m0-x>=0&&n0-x>=0) {
				temarr = arr[m0-x].slice(n0-x,n0+x+1)
				resultArr = resultArr.concat(temarr)
			}else if(m0-x>=0&&n0-x<0) {
				temarr = arr[m0+x].slice(0,n0+x+1)
				resultArr = resultArr.concat(temarr)
			}
			//6 此时一圈已经完成，判断resultArr的长度是否等于arr所有item的个数，如果是就已经结束
			//否则递归，开始第二圈
			if(resultArr.length<m*n) {
				return spiralArr(m0,n0,resultArr,x+1)
			}
			return resultArr

		}
		resultArr = spiralArr(m0, n0, resultArr,1)
		return resultArr
	}

    console.time('spiralMapAllItems')
	// console.log(spiralMapAllItems(1,4,0,0))
	// console.log(spiralMapAllItems(5,6,1,4))
	// console.log(spiralMapAllItems(5,5,2,2))
	console.log(spiralMapAllItems(5,5,0,0))
    console.timeEnd('spiralMapAllItems')
}

