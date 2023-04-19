// 普通文档流的情况下，元素的ele的offfsetTop/offsetLeft的父级参考元素就会说body
// 如果元素，或者该元素的祖先元素设置position:relative/absolute/fixed的情况下，父级参考元素就发生
// 变化，变成该元素最近的拥有以上position设置的祖先元素上。
// 具体offsetTop/Left值就是 该元素的外边框到父级参考元素的内边框的值
//本方法就是获取任意一个元素相对于body的 offsetTop/Left值

function offset (el) {
    let totalleft = null;
    let totaltop = null;
    let par = el.offsetParent;
    totalleft += el.offsetLeft
    totaltop += el.offsetTop
    
    // 如果父级参照元素不是body，就继续循环累加,因为body的父级参照元素是null
    while(par) {
        // left或者top偏移值添加父级参照元素的左/上边框值，除非浏览器是IE 8
        if(navigator.userAgent.indexOf("MSIE 8.0") === -1) {//只要不是IE 8就需要加父级参照元素的边框
            totalleft += par.clientLeft
            totaltop += par.clientTop
        } 
         // left或者top偏移值添加父级参照元素的左/上边偏移值
        totalleft += par.offsetLeft
        totaltop += par.offsetTop
        // 将par继续上一级
        par = par.offsetParent

    }
    return {
        left:totalleft,
        top:totaltop
    }
    
}