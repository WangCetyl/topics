js 盒子模型：

　　通过js中提供的一系列属性和方法获取页面中元素的样式信息值。

　　一、client系类—》只读属性不可设置 (当前元素的私有属性，和内容溢出没关系，如果给容器设置了高度，就采用设置的高度，如果没设置，就采用自适应之后的高度)

　　　　（1）clientHeight / cilentWidth  内容的高度/宽度 加上 上下/左右填充值。

　　　　　　clientHeight  = height + padding-top + padding-bottom

　　　　　　clientWidth  = width + padding-left + padding-right

　　　　（2）clientLeft / clientTop 左/右边框的宽度

　　　　　　clientLeft = borderLeftWidth；

　　　　　　clientTop = borderTopHeight；

　　二、offset系类 只读属性不可设置 (当前元素的私有属性，和内容溢出没关系，如果给容器设置了高度，就采用设置的高度，如果没设置，就采用自适应之后的高度)　　

　　　　（1）offsetHeight/offsetWidth    内容的高度/宽度 加上 上下/左右填充值  加上上下/左右边框。 

　　　　　　offsetHeigh = clientHeight + 2clientTop；

　　　　　　offsetWidth = clientWidth + 2clientLeft；

　　　　（2）offsetParent  当前元素的父级参照物，在同一个平面中最外层的元素是它里面所有元素的父级参照物，一般来说body是所有元素的父级参照物，但是当脱离文档结构时父级参照物发生改变即通过position定位来实现

　　　　　　　　position:absolute; position:relative;position:fixed 都可以改变父级参照物

　　　　（3）offsetLeft/offsetTop   当前元素的外边框距离基于父级参照物内边框的偏移量

　　三、scroll系列

　　　　（1）scrollHeight/scrollWidth 只读属性不可设置

　　　　　　  当容器内容没有溢出的时候和clientHeight/clientWidth 获取的值是一模一样的；

　　　　　　  当容器内容有溢出的时候，获取的规则如下：

　　　　　　  scrollWidth 真实内容宽度加上左填充

　　　　　　  scrollTop  真实内容高度加上上填充

　　　　　　  他们获取到的结果都是约等于的值，因为对于同一个浏览器设置overflow:hidden和不设置是有区别的，对于不同的浏览器获取到的值也是不同

　　　　（2）scrollLeft/scrollTop 既可读取也可以设置  滚动条卷去的宽度和高度

　　四、关于js盒子模型取值问题：通过这13个属性获取的值不可能出现小数，因为浏览器自动回进行四舍五入。

　　五、对于浏览器本身的盒子模型信息

　　　　clientWidth/clientHeight  是当前浏览器可视区域（一屏幕）的宽和高

　　　　scrollWidth/scrollHeight  当前页面的真实内容的宽和高（所有屏幕的宽和高即整个页面的高）是一个约等于的值；为兼容通过以下方式进行获取或者设置   document.documentElement[attr] || document.body[attr]

　　　　（1）获取浏览器的可视区域的宽或者高（一屏幕的宽或者高）

　　　　　　document.docementElement.clientWidth || document.body.clientWidth

　　　　　　document.docementElement.clientHeight || document.body.clientHeight

　　　　（2）设置浏览器滚动条卷去的高  

　　　　　　document.documentElement.scrollTop= 0;

　　　　　　document.body.scrollTop = 0;

　　六、获取页面元素中的某一个具体的样式属性值

　　　　（1）元素.style.属性名  // box.style.height

　　　　　　弊端：只能获取定义了的行内样式的属性值，不能获取样式变中定义的样式属性值（无法实现css和html的分离）；

　　　　（2）window.getComputedStyle这个方法获取浏览器计算过得所有的样式，没有定义的样式也能获取到；

　　　　　　window.getComputedStyle(当前要操作的元素对象，当前元素的伪类【一般不写伪类写null】)   获取的结果是CSSStyleDeclaration 这个类的一个实例：包含了当前元素的所有样式集合。

　　　　　　window.getComputedStyle(box,null)["height"];

　　　　　　弊端：在IE6-IE8不兼容，但是在IE6-IE8下使用currentStyle来获取浏览器计算过得所有的样式；

　　　　　　元素.currentStyle     box.currentStyle.height

　　　　　　处理兼容：

　　　　　　（1）使用try...catch 处理兼容　　　

                              /*  
　　　　　　　　　　功能：获取当前浏览器计算过得所有的样式对应的attr对应的值  
　　　　　　　　　　参数：curEle 当前要操作的元素对象，attr字符串类型的值，我们要获取的当前元素的属性名  
　　　　　　　　　　返回值：返回获取到当前元素的attr属性的值

　　　　　　　　*/

　　　　　　　　getCss:function(curEle,attr){  
　　　　　　　　　　var curAttrVal = null;  
　　　　　　　　　　try{  
　　　　　　　　　　　　curAttrVal = window.getComputedStyle(curEle,null)[attr];  
　　　　　　　　　　　}catch(e){

　　　　　　　　　　    curAttrVal = curEle.currentStyle[attr];  
　　　　　　　　　　}

　　　　　　　　　　return curAttrVal;

　　　　　　　　}

　　　　　　　弊端：

　　　　　　　　1、必须保证try中的代码在低版本浏览器中报错，否则catch中的语句不会执行

　　　　　　　　2、不管是什么浏览器，try中的语句都会先执行一遍，比较消耗性能

　　　　　　（2）检测当前浏览器中是否存在当前的属性或者方法，存在即兼容

　　　　　　getCss:function(curEle,attr)

　　　　　　{  
　　　　　　　　var curAttrVal = null;

　　　　　　　　if("getCumputedStyle" in window){

　　　　　　　　　　curAttrVal = window.getComputedStyle(curEle,null)[attr];

　　　　　　　　}

　　　　　　　　else{

　　　　　　　　　　curAttrVal = curEle.currentStyle[attr];

　　　　　　　　}

　　　　　　　　return curAttrVal ;

　　　　　　}