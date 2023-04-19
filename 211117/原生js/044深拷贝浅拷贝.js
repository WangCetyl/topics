/*浅copy*/
1、Object.assign({}, source)  //浅拷贝
2、JSON.parse(JSON.stringfy(obj))//1.如果循环引用会导致泄漏，2、无法复制函数，等特殊对象 3、无法复制constructor
function simpleCopy(obj1) {
   var obj2 = Array.isArray(obj1) ? [] : {};
   for (let i in obj1) {
       obj2[i] = obj1[i];
    }
   return obj2;
}
    

/*深copy 复制包括 对象 数组 函数*/
/*1.类型判断
    [object Number]
    [object String]
    [object Boolean]
    [object Array]
    [object Function]
    [object Object]
    [object Date]
    [object RegExp]
*/

function typeTest(Obj) {
    let str = Object.prototype.toString.call(Obj)
    return str.match(/\[object (.*)\]/)[1].toLowerCase()
    //return str
}

function deepClone(obj){
    let objClone 
    if(typeof obj !== 'object') return obj
    if(typeof obj === null) return null
    if(Array.isArray(obj)) {
        objClone = [];
    } else {
        /* 
            Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）
            给定对象的原型。如果没有继承属性，则返回 null
            var proto = {};
            var obj = Object.create(proto);
            Object.getPrototypeOf(obj) === proto; // true
            var reg = /a/;
            Object.getPrototypeOf(reg) === RegExp.prototype; // true
        */
        objClone = Object.create(Object.getPrototypeOf(obj))
    }
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
} 

function deepClone(obj) {
            //=>过滤特殊情况
    if (obj === null||obj === undefined) return obj;
    if (typeof obj !== "object") return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);

    //=>不直接创建空对象目的：克隆的结果和之前保持相同的所属类
    let newObj = new obj.constructor;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepClone(obj[key]);
        }
    }
    return newObj;
}