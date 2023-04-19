/*
 * @params
 * @tagname:string the moving tag's name
 * @movedistance: the distance tag move
 */
;(function(window){
    function move(tagname,movedistance) {
        const tagDoms = document.querySelectorAll(tagname)
        const tagDomlength = tagDoms.length
        tagDoms.forEach((item,index) => {
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
                        if(indexleft>=0&& tagDoms[indexleft]){
                            tagDoms[indexleft].style.transform =  `translateY(${distance}px)`
                            tagDoms[indexleft].style.transition = 'transform 0.2s ease-in'
                            indexleft--
                        }
                        if(indexright<=tagDomlength-1&&tagDoms[indexright]){
                            tagDoms[indexright].style.transform =  `translateY(${distance}px)`
                            tagDoms[indexright].style.transition = 'transform 0.2s ease-in'
                            indexright++
                        }
                        if(indexleft<0&&indexright>tagDomlength-1){
                            clearInterval(timer)
                        }
                    },100)
                }
                (itemTranslateYnum === 'none'||itemTranslateYnum==='0')? move(movedistance):move('0')
            }
        })

    }
    window.move =  move 
})(window)



