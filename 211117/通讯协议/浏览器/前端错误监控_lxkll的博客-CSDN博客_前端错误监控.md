本文是学习慕课网上课程[前端跳槽面试必备技巧](https://coding.imooc.com/class/evaluation/129.html#Anchor)的学习笔记，便于之后复习。本文从以下几个方面说明错误监控：

1.前端错误的分类

2.错误的捕获方式

3.上报错误的基本原理

### 1.前端错误的分类

**即时运行错误：** 一般是代码错误

**资源加载错误**：图片、js、css等资源加载失败

### 2.错误的捕获方式

**即时运行错误的捕获方式：**

1.  **try…catch**
2.  **window.onerror**只能捕获即时运行错误，不能捕获资源加载错误。因为资源加载错误，并不会向上冒泡，object.onerror捕获后就会终止，所以window.onerror并不能捕获资源加载错误

```
window.onerror = function(msg, url, line)    console.log( "错误信息："+msg+ "\n所在文件："+ url  + "\n错误行号：" + line);  
```

**资源加载错误的捕获方式:**

1.  **object.onerror**    img标签、script标签都可以添加onerror事件，用来捕获资源加载错误；
2.  **performance.getEntries() ** 返回的将是一个数组,数组的每个元素代表对应的静态资源的信息,包含了页面中所有的已成功加载 HTTP 请求，可以与预期加载资源比较，通过这种方式，可以间接的拿到没有加载的资源错误。

         例如：

```
performance.getEntries().forEach(function(item){console.log(item.name)})
```

```
document.getElementsByTagName('img')
```

document.getElementsByTagName('img')获取的资源数组减去通过performance.getEntries()获取的资源数组，剩下的就是没有成功加载的，这种方式可以间接的捕获到资源加载错误。

     3.**Error事件捕获**   资源加载错误，虽然会阻止冒泡，但是不会阻止捕获。

首先在body中请求一个不存在的文件:

```
<script src="//baidu.com/test.js" type="text/javascript"></script>
```

使用Error事件捕获:

```
<script type="text/javascript">window.addEventListener('error', function(e){
```

如下图，成功捕获到错误

![](https://img-blog.csdnimg.cn/20190313145752511.png)

延伸提问：跨域的js运行错误可以捕获吗，错误提示是什么，应该怎么处理？

可以捕获到错误，但是错误的具体信息(如出错行号、出错详情)不能拿到

处理：步骤一：在script标签增加crossorigin属性，客户端

步骤二：设置js资源响应http头上加Access-Control-Allow-Origin:*/域名，服务端

### **3.上报错误的基本原理**

使用**AJAX通信**方式上报

利用**Image对象**上报 // 推荐使用

```
<script type="text/javascript">(new Image()).src = 'http://baidu.com/test?r=1234';
```

如下图，请求成功发出

![](https://img-blog.csdnimg.cn/20190313150056425.png)