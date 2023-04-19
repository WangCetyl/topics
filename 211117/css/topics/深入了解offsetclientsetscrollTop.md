 本文是学习[中传思客](https://www.cnblogs.com/cuc-ygh/)在慕课网开的课程[《前端跳槽面试必备技巧》](https://coding.imooc.com/class/evaluation/129.html#Anchor)的学习笔记。课程地址：[https://coding.imooc.com/class/evaluation/129.html#Anchor](https://coding.imooc.com/class/evaluation/129.html#Anchor)。

　如果你在面试的时候面试官让你谈谈对盒模型的理解，你是不是不知从何谈起。这种看似简单的题其实是最不好答的。

  下面本文章将会从以下几个方面谈谈盒模型。

-   基本概念：标准模型 和IE模型
-   CSS如何设置这两种模型
-   JS如何设置获取盒模型对应的宽和高
-   实例题（根据盒模型解释边距重叠）
-   BFC（边距重叠解决方案）

## 基本概念

盒模型的组成大家肯定都懂，由里向外content,padding,border,margin.

盒模型是有两种标准的，一个是标准模型，一个是IE模型。

![](https://images2017.cnblogs.com/blog/1265396/201711/1265396-20171119143703656-1332857321.png)

![](https://images2017.cnblogs.com/blog/1265396/201711/1265396-20171119144229156-49945808.png)

 从上面两图不难看出在标准模型中，盒模型的宽高只是内容（content）的宽高，

而在IE模型中盒模型的宽高是内容(content)+填充(padding)+边框(border)的总宽高。

## css如何设置两种模型

这里用到了CSS3 的属性 box-sizing

/* 标准模型 */ box-sizing:content-box; /*IE模型*/ box-sizing:border-box;

## JS获取宽高

通过JS获取盒模型对应的宽和高，有以下几种方法：

为了方便书写，以下用dom来表示获取的HTML的节点。

1.  dom.style.width/height 

　　这种方式只能取到dom元素内联样式所设置的宽高，也就是说如果该节点的样式是在style标签中或外联的CSS文件中设置的话，通过这种方法是获取不到dom的宽高的。

 2. dom.currentStyle.width/height 

　　这种方式获取的是在页面渲染完成后的结果，就是说不管是哪种方式设置的样式，都能获取到。

　　但这种方式只有IE浏览器支持。

 3. window.getComputedStyle(dom).width/height

　　这种方式的原理和2是一样的，这个可以兼容更多的浏览器，通用性好一些。

 4. dom.getBoundingClientRect().width/height

　　这种方式是根据元素在视窗中的绝对位置来获取宽高的

 5.dom.offsetWidth/offsetHeight

　　这个就没什么好说的了，最常用的，也是兼容最好的。

## 边距重叠

什么是边距重叠

如下图，父元素没有设置margin-top，而子元素设置了margin-top：20px;可以看出，父元素也一起有了边距。

![](https://images2017.cnblogs.com/blog/1265396/201711/1265396-20171119160218265-419904943.png)

上图的代码

![复制代码](https://common.cnblogs.com/images/copycode.gif)

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style> *{ margin:0; padding:0;
        } .demo{ height:100px; background: #eee;
        } .parent{ height:200px; background: #88f;
        } .child{ height:100px; margin-top:20px; background: #0ff; width:200px;
        }
    </style>
</head>
<body>
    <section class="demo">
        <h2>此部分是能更容易看出让下面的块的margin-top。</h2>
    </section>
    <section class = "parent">
        <article class="child">
            <h2>子元素</h2> margin-top:20px; </article>
        <h2>父元素</h2> 没有设置margin-top </section>
</body>
</html>

![复制代码](https://common.cnblogs.com/images/copycode.gif)

## 边距重叠解决方案(BFC)

首先要明确BFC是什么意思，其全英文拼写为 Block Formatting Context 直译为“块级格式化上下文”

### BFC的原理

1.  内部的box会在垂直方向，一个接一个的放置
2.  每个元素的margin box的左边，与包含块border box的左边相接触（对于从做往右的格式化，否则相反）
3.  box垂直方向的距离由margin决定，属于同一个bfc的两个相邻box的margin会发生重叠
4.  bfc的区域不会与浮动区域的box重叠
5.  bfc是一个页面上的独立的容器，外面的元素不会影响bfc里的元素，反过来，里面的也不会影响外面的
6.  计算bfc高度的时候，浮动元素也会参与计算

###  怎么取创建bfc

1.  float属性不为none（脱离文档流）
2.  position为absolute或fixed
3.  display为inline-block,table-cell,table-caption,flex,inine-flex
4.  overflow不为visible
5.  根元素

### 应用场景

1.  自适应两栏布局
2.  清除内部浮动 
3.  防止垂直margin重叠

#### 看一个垂直margin重叠例子

代码

![复制代码](https://common.cnblogs.com/images/copycode.gif)

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style> *{ margin:0; padding:0;
        } .top{ background: #0ff; height:100px; margin-bottom:30px;
        } .bottom{ height:100px; margin-top:50px; background: #ddd;
        }
    </style>
</head>
<body>

    <section class="top">
        <h1>上</h1> margin-bottom:30px; </section>
    <section class="bottom">
        <h1>下</h1> margin-top:50px; </section>

</body>
</html> 

![复制代码](https://common.cnblogs.com/images/copycode.gif)

 效果图

![](https://images2017.cnblogs.com/blog/1265396/201711/1265396-20171119161022452-975612504.png)

 用bfc可以解决垂直margin重叠的问题

关键代码

![复制代码](https://common.cnblogs.com/images/copycode.gif)

<section class="top">
        <h1>上</h1> margin-bottom:30px; </section>

    <!-- 给下面这个块添加一个父元素，在父元素上创建bfc -->
    <div style="overflow:hidden">
        <section class="bottom">
            <h1>下</h1> margin-top:50px; </section>
    </div>

![复制代码](https://common.cnblogs.com/images/copycode.gif)

效果图 

![](https://images2017.cnblogs.com/blog/1265396/201711/1265396-20171119163900593-72016238.png)

关于bfc的应用的案例这里就不在一一举出了，大家去网上找一些其他的文章看一下。

欢迎补充