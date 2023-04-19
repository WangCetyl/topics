
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
    </body>
</html>
```

## 1 多选题
关于外部样式表下列说法正确的是？（选择两项） 
```
A 外部样式表的引入标签是style
B 外部样式表的引入标签是link
C 外部样式表的引入标签要放在head标签中
D 外部文件的路径地址要放在rel属性中

BC
```
## 2 多选题
关于CSS的link与导入式引用外部样式表，下列说法正确的是？（选择两项） 
```
A 使用link链入外部样式，页面加载完后，才会加载样式
B 使用link链入外部样式，页面加载时会同时加载样式
C 使用导入式，页面加载完后，才会加载样式
D 使用导入式，页面加载时会同时加载样式 

BC
```

## 3 多选题
- 如果我们只要文本内容 “4”的字体颜色变为红色，其他的字体不变色，样式表中该怎样写？（选择两项）

```
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <ul>
        <li>li1</li>
        <li>li2</li>
        <li>li3</li>
    </ul>
    <div>4</div>

    A div:last-child{color:red} //由于是在body标签下面， 很复杂不一定是div为最后一个
    B div:nth-child(5){color:red;}
    C div:nth-of-type(4){color:red;} 
    D div:nth-child(3){color:red;} 
    答案 B C
    使用:nth-child() 顺序选择器的时候 实际情况与选择器标签类型无关，只同所在位置相关
    例如  我需要ul下全部变红  可以如下写
    ul:nth-child(4){color:red;}
    对于混合标签下 同类标签的顺序选择 使用:nth-of-type()，这样就是同一类的标签的顺序答案C 就如此
    另外 注意body下面最後一個子标签可能是script 所以选择的时候比较复杂，最好最外层有个div 包裹比较好

```

## 4 多选题
- 如果我们只要文本内容 " 标题5 "的字体颜色变为红色，其他的字体不变色，样式表中该怎样写？（选择两项）

```
    <body>
        <h1>标贴p</h1>
        <p>标题1</p>
        <p>标题2</p>
        <p>标题3</p>
        <p>标题4</p>
        <p>标题5</p>
    </body>

    A p:nth-last-of-type(1){color:red} 
    B p:last-of-type(1){color:red;}
    C p:last-of-type{color:red;} 
    D p:nth-last-child{color:red;}
    答案 A C
    last-of-type等同于nth-last-of-type(1)
```


## 5 单选题
关于以下代码运行结果说法正确的是？（选择一项）
h2[class~=s] {
    color: chartreuse;
}
```
    <h2 class="one s">one s</h2>
    <h2 class="one s teo">one s teo</h2>
    <h2 class="one sole">one sole</h2>
    <h2 class="one for">one for</h2>
    <h2 class="sone">sone</h2>

A one、two变红
B three、four、five变红
C one、two、three、four、five都变红
D one、two、three、four、five都不变红

A
img[alt] 选择有alt属性的img标签
img[alt="故宫"] 选择alt属性是故宫的img标签
img[alt^="北京"] 选择alt属性以北京开头的img标签
img[alt$="夜景"] 选择alt属性以夜景结尾的img标签
img[alt*="美"] 选择有alt属性中含有美字的img标签
img[alt~="手机拍摄"]选择有alt属性中有空格隔开的手机拍摄字样的img标签
img[alt|="参赛作品"]选择有alt属性以“参赛作用-”开头的img标签
```

## 6 多选题
下列关于:checked选择器说法正确的是？（选择二项） 
```
A:checked 选择器匹配每个已被选中的 input 元素（只用于单选按钮和复选框）。
B:checked 选择器匹配每个已被选中的 input 元素（适用于所有表单元素）。
C:checked 选择器目前主流的浏览器都能兼容
D :checked只有Opera浏览器兼容

AC
```

## 7单选题
将p标签里的文字字体设置为宋体，并将通用字体集sans-serif做为备选字体，下列哪一项是正确的？（选择一项）
```
A style=" font-family:'宋体',sans-serif;"
B style="font-family:"宋体",sans-serif;"
C style="font-family:'宋体' sans-serif;"
D style="font-family:'宋体'、 sans-serif;"

A  注意字体之间需要,隔开，双引号里面要有单引号
```
## 8单选题
关于font属性的简写，下列选项中哪个语法正确？（选择一项） 
```
A font：italic small-caps bold 12px "黑体" ;
B font：italic,small-caps,bold,12px, "黑体" ;
C font："黑体" 12px italic small-caps bold ;
D font：12px "黑体" italic small-caps bold ;

A  
font简写
font-style | font-variant | font-weight | font-size | line-height | font-family
font{font:italic small-caps bold 12px/1.5em arial,verdana;}
```

## 9 多选题
下列哪个方法可以让p标签里文本的首行缩进两个字？（选择两项） 
提 
```
A 给p标签设置属性 text-indent：2em;
B 给p标签设置属性 text-indent：1em;
C 在文本的第一行最前面加上八个空白字符&nbsp;
D 把文本的第一行缩进两个空格即可

AC
```
## 10 单选题
判断代码 正确描述

```
    .box1 .box2 ul {
        color:green
    }
    li:first-child {
        color:red
    }
    li {
        color:blue
    }
    .box1 .box2 {
        color:pink;
    }
    <div class="box1">
        <div class="box2">
            <ul>
                <li>1111</li>
                <li>2222</li>
                <li>3333</li>
            </ul>
        </div>
    </div>
A 第一个li是红色，其他两个li是绿色
B 第一个li是红色，其他两个li是蓝色
C 第一个li是蓝色，其他两个li是绿色
D 第一个li是蓝色，其他两个li是粉色

B
第一等：代表内联样式，如: style=””，权值为1000。
第二等：代表ID选择器，如：#content，权值为100。
第三等：代表类，伪类和属性选择器，如.content，权值为10。
第四等：代表类型选择器和伪元素选择器，如div p，权值为1。
本题中 第一，第四只是定义li的父元素，父父元素的颜色，此时li只是继承，权重为0
第二个定义第一个li为红色
第三个定义所有li颜色为蓝色，但是同第二个相比权重第，所以第一个仍旧是红色

```

## 11 多选题
以下关于border-radius的说法正确的是？(选择两项) 
```
A border-radius有三个值的话，分表代表对左上角、右上角、和右下角的设置，左下角不改变。
B border-radius有三个值的话，第一个值表示对左上角的设置，第二个值表示对右上角和左下角的设置，第
三个值表示对右下角的设置。
C border-radius有两个属性值的话，第一个值表示左上角和右下角，第二个值表示右上角和左下角。
D border-radius有两个属性值的话，分别表示对左上角和右上角的设置，其他的角不改变。

B C
如果是两个值，那么 top-left和bottom-right相等，为第一个值，top-right和bottom-left值相等，为第二个值。 
这里写图片描述 
如果是三个值，那么第一个值是设置top-left，而第二个值是 top-right 和 bottom-left 并且他们会相等,第三个值是设置 bottom-right。 
这里写图片描述 
如果是四个值，那么第一个值是设置 top-left， 而第二个值是 top-right 第三个值 bottom-right 第四个值是设置 bottom-left 
```
## 12 单选题
下列关于background-repeat的说法正确的是？（选择一项）
```
A background-repeat默认值是 repeat-x
B background-repeat默认值是repeat
C background-repeat默认图片居中显示
D background-repeat默认图片不重复
B
```
## 13 单选题

```
将背景的绘制区域规定到内容框，应使用属性background-clip属性中哪个属性值？（选择一项）
A border-box
B padding-box
C content-box
D none-box

C
background-clip: border-box|padding-box|content-box; 默认border-box
border-box	背景被裁剪到边框盒。	
padding-box	背景被裁剪到内边距框。
content-box	背景被裁剪到内容框。
```
## 14 单选题
下列哪项是错误的？（选择一项） 
```
A background-position：center;
B background-position:40% 40%;
C background-position:40% 30px;
D background-position:40 30;//除0外 需要添加单位，否则无法判断是百分数还是像素

D
如果以left right center等，您仅规定了一个关键词，那么第二个值将是"center"。默认值：0% 0%。
如果以x% y%等，第一个值是水平位置，第二个值是垂直位置。左上角是 0% 0%。右下角是 100% 100%。如果您仅规定了一个值，另一个值将是 50%。
如果以xpos ypos，第一个值是水平位置，第二个值是垂直位置。左上角是 0 0。单位是像素 (0px 0px) 或任何其他的 CSS 单位。如果您仅规定了一
个值，另一个值将是50%。您可以混合使用 % 和 position 值。
```
## 15 单选题
下列关于transform: skew(45deg);的变化表述正确的是？（选择一项）
```
A 元素的水平方向顺时针倾斜45度，竖直方向倾斜0度
B 元素的水平方向顺时针倾斜45度，竖直方向倾斜45度
C 元素的水平方向逆时针倾斜45度，竖直方向倾斜0度
D 元素的水平方向逆时针倾斜45度，竖直方向倾斜45度

A
skew的坐标同正常坐标不同，x轴向下，y轴向右
改题正确答案是 垂直方向逆时针45度，水平方向不变
答案待定
```