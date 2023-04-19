![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJ5VXa9rticIWKRx4Nfw1rdVh0yKGaXLeaX6ojN0hld4BEykv85jzGsbQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 一、是什么

DNS（Domain Names System），域名系统，是互联网一项服务，是进行域名和与之相对应的 IP 地址进行转换的服务器

简单来讲，`DNS`相当于一个翻译官，负责将域名翻译成`ip`地址

-   IP 地址：一长串能够唯一地标记网络上的计算机的数字
    
-   域名：是由一串用点分隔的名字组成的 Internet 上某一台计算机或计算机组的名称，用于在数据传输时对计算机的定位标识
    

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJSGNM0XRekhhp937Ehyib6KUVB3C8Q2icAzbgY1snPOvhjf6mblVbanNw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 二、域名

域名是一个具有层次的结构，从上到下一次为根域名、顶级域名、二级域名、三级域名...

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJQZkdsTSicRrUy8SLGsz9G5B1iceTDyyOHmjkMr5LNFSoD8nuXmlkCz9A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

例如`www.xxx.com`，`www`为三级域名、`xxx`为二级域名、`com`为顶级域名，系统为用户做了兼容，域名末尾的根域名`.`一般不需要输入

在域名的每一层都会有一个域名服务器，如下图：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJSyr0qMH7msFkwicaGs2hKwKmBwxtLq5GELFoXAJ3ZYNvzKwxh9iap8xg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

除此之外，还有电脑默认的本地域名服务器

## 三、查询方式

DNS 查询的方式有两种：

-   递归查询：如果 A 请求 B，那么 B 作为请求的接收者一定要给 A 想要的答案
    

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

-   迭代查询：如果接收者 B 没有请求者 A 所需要的准确内容，接收者 B 将告诉请求者 A，如何去获得这个内容，但是自己并不去发出请求
    

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJY61MibjHbtq9WQYzL03wY2dFfy4lmk7kufBHclm7eSXjykvxdKN7WqQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 四、域名缓存

在域名服务器解析的时候，使用缓存保存域名和`IP`地址的映射

计算机中`DNS`的记录也分成了两种缓存方式：

-   浏览器缓存：浏览器在获取网站域名的实际 IP 地址后会对其进行缓存，减少网络请求的损耗
    
-   操作系统缓存：操作系统的缓存其实是用户自己配置的 `hosts` 文件
    

## 五、查询过程

解析域名的过程如下：

-   首先搜索浏览器的 DNS 缓存，缓存中维护一张域名与 IP 地址的对应表
    
-   若没有命中，则继续搜索操作系统的 DNS 缓存
    
-   若仍然没有命中，则操作系统将域名发送至本地域名服务器，本地域名服务器采用递归查询自己的 DNS 缓存，查找成功则返回结果
    
-   若本地域名服务器的 DNS 缓存没有命中，则本地域名服务器向上级域名服务器进行迭代查询
    

-   首先本地域名服务器向根域名服务器发起请求，根域名服务器返回顶级域名服务器的地址给本地服务器
    
-   本地域名服务器拿到这个顶级域名服务器的地址后，就向其发起请求，获取权限域名服务器的地址
    
-   本地域名服务器根据权限域名服务器的地址向其发起请求，最终得到该域名对应的 IP 地址
    

-   本地域名服务器将得到的 IP 地址返回给操作系统，同时自己将 IP 地址缓存起来
    
-   操作系统将 IP 地址返回给浏览器，同时自己也将 IP 地址缓存起
    
-   至此，浏览器就得到了域名对应的 IP 地址，并将 IP 地址缓存起
    

流程如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSEqlDcYXxzZZiaV2hNg3icQJKZMS9DG8QoEz05Paf4PhyuJFyibXwEGP5UwtRe9KQat1icicRaFbM6pAw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 参考文献

-   https://zh.wikipedia.org/wiki/%E5%9F%9F%E5%90%8D%E7%B3%BB%E7%BB%9F
    
-   https://www.cnblogs.com/jmilkfan-fanguiju/p/12789677.html
    
-   https://segmentfault.com/a/1190000039039275
    
-   https://vue3js.cn/interview
    

--The End--

系列正在更新：6/14

点击下方卡片解锁更多

![JS每日一题](http://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibR1zyictLmupbzrdsFTbiamzNlMsjqhtT5GCIu6WmqOUaHFdSDWvTpU5pRpe56YKqELdiaZxmSt3fEUA/0?wx_fmt=png)

**JS每日一题**

每天一道经典前端面试题， 采用60秒语音答题模式（禁文字答题），群管理输出标准答案次日推送至群内供大家复盘参考，坚持做到事事有回音，题题有答案

224篇原创内容

公众号

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQlhvwgjwXCquTYgmE9M3TksGiaJIIiaDbgSQM2pbB3PiaCd2JVrlbClPMaBGe5ftUXibjByKBMybHzrw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

创作不易，星标、点赞、在看 三连支持