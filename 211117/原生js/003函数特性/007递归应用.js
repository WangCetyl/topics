
window.onload = function() {
    const liDoms = document.querySelectorAll('li')
    const liDomlength = liDoms.length
    liDoms.forEach((item,index) => {
        item.onclick = function(){
            const reg =/[,\(\)]/gu
            const itemTranslateY = window.getComputedStyle(item).transform
            let itemTranslateYnum
            let timer = null
            if(itemTranslateY != 'none') {
                let temp = itemTranslateY.split(reg)
                itemTranslateYnum = temp[temp.length-2].trim()
            }else {
                itemTranslateYnum = 'none'
            }
            function move(distance) {
                item.style.transform = `translateY(${distance}px)`
                item.style.transition = 'transform 0.2s ease-in'
                let indexleft = index-1
                let indexright = index +1
                clearInterval(timer)
                timer = setInterval(()=>{
                    if(indexleft>=0&& liDoms[indexleft]){
                        liDoms[indexleft].style.transform =  `translateY(${distance}px)`
                        liDoms[indexleft].style.transition = 'transform 0.2s ease-in'
                        indexleft--
                    }
                    if(indexright<=liDomlength-1&&liDoms[indexright]){
                        liDoms[indexright].style.transform =  `translateY(${distance}px)`
                        liDoms[indexright].style.transition = 'transform 0.2s ease-in'
                        indexright++
                    }
                    if(indexleft<0&&indexright>liDomlength-1){
                        clearInterval(timer)
                    }
                },100)
            }
            (itemTranslateYnum === 'none'||itemTranslateYnum==='0')? move('200'):move('0')
        }
    })
}   