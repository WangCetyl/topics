/*

 正则表达式模版字符串
实现一个模版字符串：传入一个数据（对象/基础类型），和一段字符串格式的html模版，含有{{somedata}}/{{somedata.xxx}},替换成值
思路

使用(/\{\{(.+?)\}\}/g+replace全局匹配字符串中{{}}的内容，注意要使用？实现惰性匹配，否则可能匹配{{xxx}}{{xxx}}中间的所有部分
回调函数参数：m是整个内容，s1是括号内子表达式。
当s1为data，而且传入data类型是基础类型时，直接用值替代data
当s1不为data，split(".")分割字符串（子串个数不确定时，只能使用split，不能用正则），得到s1Key数组，数组为空或者data不是对象，不进行替换，也就是返回m
当数组不空而且data是对象时，遍历s1Key数组，对data递归查询要访问的value，最后替换为查询的值
*/
function templateStr(data, str) {
  // 匹配字符串中{{}}的内容，m是整个匹配，s1是括号内子表达式
  return str.replace(/\{\{(.+?)\}\}/g, (m, s1) => {
    //s1是data而且data为基础类型，直接用值替代data
    if (s1 === "data" && !(data instanceof Object)) return data;
    //s1Key保存字符串分割以后的key
    let s1Key = s1.split(".");
    //s1Key是空或者data不是对象，返回匹配的m，不替换
    if (!s1Key || !(data instanceof Object)) return m;
    //s1Key不空而且data是对象
    let i = 1; //i指向当前key的索引
    let value = data; //value指向当前的obj.key
    while (value[s1Key[i]]) {
      //obj.key存在时，
      value = value[s1Key[i]]; //替换value
      i++; //指针后移
    }
    return value; //obj.key不存在，查询完毕，用value替换匹配的m
  });
}
templateStr({ a: 1, b: { c: 2 } }, "<a href={{data.a}}>{{data.b.c}}</a>");
//"<a href=1>2</a>"
templateStr(5, "<a href={{data}}>{{data.b.c}}</a>");
//"<a href=5>{{data.b.c}}</a>"