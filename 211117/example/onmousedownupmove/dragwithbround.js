/*
	拖曳一个方块，设置临界距离

 */

let box1 = document.getElementById('box1')
box1.onmousedown = function (event) {
	event = event || window.event
	//元素box1的初始位置
	let box1domX = box1.offsetLeft
	let box1domY = box1.offsetTop 
	console.log(box1domX,box1domY)
	//整个视窗的宽 高
	let documentX = document.documentElement.offsetWidth
	let documentY = document.documentElement.offsetHeight 
	console.log(documentX,documentY)

	//box1的宽高
	let box1width = box1.offsetWidth
	let box1height = box1.offsetHeight
	console.log(box1width,box1height)

	//边界值  根据视图的大小设置左右上下的边界值，本题就是在视窗范围内
	let leftLimitX = 0
	let rightLimitX = documentX - box1width
	let toplimitY  = 0
	let bottomlimitY  = documentY - box1height
	console.log(leftLimitX,rightLimitX,toplimitY,bottomlimitY)

	//鼠标down下去的初始位置
	let  csX = event.clientX
	let  csY = event.clientY
	box1.setCapture && box1.setCapture();

	document.onmousemove = function(event) {

		 event = event || window.event
		// 鼠标移动时的位置
		let cendX = event.clientX 
		let cendY = event.clientY

		//鼠标移动的距离
		let disX = cendX - csX
		let disY = cendY - csY

		//移动后的最后移动位置。等于初始位置加上 鼠标移动的距离
		let lastbox1donX = box1domX + disX
		let lastbox1domY = box1domY + disY

		//最后判断dom的最后位置是否在临界值以内，如果超过就设置在临界值上
		if(lastbox1donX < leftLimitX) {//判断是否小于左边临界值，
			lastbox1donX = leftLimitX
		}

		if(lastbox1donX > rightLimitX) {//判断是否大于右边临界值
			lastbox1donX = rightLimitX
		}  

		if(lastbox1domY < toplimitY) {//判断是否小于上边临界值
			lastbox1domY = toplimitY
		}

		if(lastbox1domY > bottomlimitY) {//判断是否大于下边临界值
			lastbox1domY = bottomlimitY
		}
		
		box1.style.left = lastbox1donX + 'px'
		box1.style.top = lastbox1domY + 'px'
	}

	document.onmouseup = function(e) {
		document.onmousemove = document.onmouseup = null
		box1.releaseCapture && box1.releaseCapture()
	}

	return false
	// event.preventDefault()
}