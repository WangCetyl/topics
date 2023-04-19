//本fun 获取任意浏览器的元素的css属性值
function getcssstyle(el, attr) {
    // 对于传进来的attr参数也需要进行兼容处理，一些属性如opacity
    let val = null
    // 考虑到各种变量的val格式不一样 需要进行分类表示处理。该reg表示 数字+单位形式的结果
    // 这些均可以使用parseFloat来处理直接获取数值。
    let reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i
    //判断getComputedStyle这个方法是否在window中，如果有就使用这个方法
    if ('getComputedStyle' in window) {
        val = window.getComputedStyle(el, null)[attr]
    }else  {//对于IE 6 7 8使用下面的使用currentStyle
        if(attr === 'opacity') {
            val = el.currentStyle['filter']
            // 此时结果是alpha(opacity=10)()里面的需要捕获 ？：表示只匹配不捕获
            reg = /(\d+(?:\.\d+)?)/i
            val = parseFloat(val.match(reg)[0])/100
            return val
            
        }else {
            val = el.currentStyle[attr]
        }
    }
    if (reg.test(val)) {
        val = parseFloat(val)
    }
    return val
}