{
	/*
	
		实现图片的懒加载
			1.前端性能优化的重要方案
				通过图片或者数据的延迟加载，我们可以加快页面渲染的速度，让第一次打开页面的速度变快
				只有滑动到某个区域，我们才加载真实的图片，这样也可以节省加载的流量
			2.处理方案
				把所有需要延迟加载的图片，用一个盒子包起来，设置宽高和默认的占位图
				开始让所有的IMG的SrC为空，把真实的图片地址放到IMG的自定义属性上，让IMG隐藏
				首屏等到所有其他资源都加载完成后，我们再开始加载图片
				对于很多图片，当需要页面滚动的时候，当前图片区域完全显示出来后，再加载
	 */
	 /*原生就是实现*/
	 // let imgBox1 = document.getElementById('imgBox1')
	 // let img1 = document.getElementById('img1')

     
  //    console.log(img1.getAttribute('data-img'))
 
  //    window.onload = ()=> {
  //    	 console.log('ok onload')
  //    	 setTimeout(()=> {
	 //     	img1.src = img1.getAttribute('data-img')
  //    	 },1000)
	 // }

  //    window.addEventListener('scroll',()=> {
  //    	 console.log('ok scroll')
  //    	 setAttribute()
	 //     if(imgBox1.getBoundingClientRect().y<=200) {
	 //     	img1.src = img1.getAttribute('data-img')
	 //     }
  //    })
}

{
	/*jquery 实现*/

	let $imgBox1 = $('#imgBox1')
	let $img1 = $('#img1')
	let $window = $(window)

	$window.on('load scroll',()=> {
		// $A 代表imgbox距离页面顶部的高度 ，是图片区域的高度加上  图片区域距离页面（body）的上偏移
		// $B 代表 浏览器可视区的高度（一屏高度） +  滚动条卷曲的高度
		let $A = $imgBox1.outerHeight() + $imgBox1.offset().top, 
		    $B = $window.outerHeight() + $window.scrollTop();

		if($A<$B) {
			$img1.attr('src',$img1.attr('data-img'))
		}

	})
}