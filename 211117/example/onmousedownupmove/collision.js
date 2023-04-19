/*
	拖曳一个方块A,判断A是否碰上另一个方块B

	1，确定B方块的位置，
	   四条面的距离
	   
	

 */

const domA = document.getElementById('box1')
const domB = document.getElementById('box2')

//domA的宽高
const domAvalue = domA.getBoundingClientRect()
const domAWidth = domAvalue.width
const domAHeight = domAvalue.height


//计算domB的位置，四条线距离左上点的距离
const clientvalues = domB.getBoundingClientRect()
const domBLeftX = clientvalues.x//or (clientvalues.left)
const domBTopY = clientvalues.y //or (clientvalues.top)
const domBRightX = clientvalues.right
const domBBottomY = clientvalues.bottom 

//设置domA的边界条件
let leftLimitX = 0
let rightLimitX = document.documentElement.offsetWidth - domAWidth
let toplimitY  = 0
let bottomlimitY  = document.documentElement.offsetHeight - domAHeight
console.log(leftLimitX,rightLimitX,toplimitY,bottomlimitY)

domA.onmousedown = function(event) {
	event = event || window.event

	// domA的dom位置
	let domAleft = domA.offsetLeft
	let domAtop = domA.offsetTop

	//鼠标的起始位置
	let startX = event.clientX
	let startY = event.clientY
	console.log(domAleft,domAtop,startX,startY);

	domA.setCapture&&domA.setCapture()

	document.onmousemove = function(event) {
		event = event || window.event

		//鼠标的结束位置
		let endX = event.clientX
		let endY = event.clientY

		//鼠标的移动距离
		let disX = endX - startX
		let disY = endY - startY

		//此时domA的结束位置变为
		let domAleftlast = domAleft + disX
		let domAtoplast = domAtop + disY

		//设置边界条件
		if(domAleftlast< leftLimitX) {
			domAleftlast = leftLimitX
		}

		if(domAleftlast> rightLimitX) {
			domAleftlast = rightLimitX
		}
		if (domAtoplast < toplimitY) {
			domAtoplast = toplimitY
		}

		if (domAtoplast >bottomlimitY ) {
			domAtoplast = bottomlimitY
		}

		domA.style.left = domAleftlast + 'px'
		domA.style.top = domAtoplast + 'px'

		//在X轴方向 如果 domA Y值在domBTopY-domA.offsetHeight和domBBottomY之间，且domA的left
		//在domBLeftX-domA.offsetWidth,domBRightX 之间 碰撞
		// if((domAtoplast>=(domBTopY-domA.offsetHeight)&&domAtoplast<=domBBottomY)&&
		// 	(domAleftlast>=(domBLeftX-domA.offsetWidth)&&domAleftlast<=domBRightX)){
		// 	console.log(domAleftlast,domAtoplast,'左右撞上了')
		// }
		// //同理 在Y轴方向 ，X值在domBLeftX，domBRightX 之间，且domA的top 在
		// //domBTopY - domA.offsetHeight 和 domBBottomY 之间 碰撞
		// if((domAleftlast>=(domBLeftX - domA.offsetWidth)&&domAleftlast<=domBRightX)&&
		// 	((domAtoplast>=domBTopY - domA.offsetHeight)&&domAtoplast <=domBBottomY)){
		// 	console.log(domAleftlast,domAtoplast,'上下撞上了')
		// }

		// 另外一种判断，如果domAleftlast<(domBLeftX-domA.offsetWidth) || domAleftlast > domBRightX
		// ||domAtoplast < (domBTopY-domA.offsetHeight) ||domAtoplast > domBBottomY
		// 说明不在碰撞范围内
		if(domAleftlast<(domBLeftX-domA.offsetWidth) || domAleftlast > domBRightX
		   ||domAtoplast < (domBTopY-domA.offsetHeight) ||domAtoplast > domBBottomY){
		}else {
			console.log(domAleftlast,domAtoplast,'撞上了')
		}
		// console.log(domAleftlast,domBLeftX-domA.offsetWidth)
		// console.log(domAleftlast,domBRightX)
		// console.log(domAtoplast,domBTopY-domA.offsetHeight)
		// console.log(domAtoplast,domBBottomY)
	    
	}
	document.onmouseup = function() {
		document.onmousemove = document.onmouseup = null
	}

	return false
	// event.preventDefault()
}

