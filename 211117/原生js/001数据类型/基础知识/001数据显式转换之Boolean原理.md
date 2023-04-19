# 数据类型显示转化的几种场景
## 内置Boolean函数
-   除了+0,-0,null,undefined,"",false,NaN,为false其余全部为true
```
Boolean(0);//false
Boolean(null);//false
Boolean(undefined);//false
Boolean("");//false
Boolean(" ");//true
Boolean(false);//false
Boolean(NaN)//false
```

