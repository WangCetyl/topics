/* 
    url = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E4%BD%93%E8%83%BD&fenlei=256'

*/

/*第一步  检查是否有query字符,  一个url中可以有多个?,所以第一次判断?后面的参数不能使用split('?') */
let url = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E4%BD%93%E8%83%BD&fenlei=256'
let resultobj = {}
if (url.split('?').length === 1) {
    return resultobj = {}
}

let quotaindex = url.indexOf('?')
/*第二步 截取query值后,使用split拆解 复制resultobj*/
let urlquery = url.substring(quotaindex+1,url.length-1) 
/*
    &ie=utf-8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E4%BD%93%E8%83%BD&fenlei=25
*/
/*第三步 使用split拆解 复制resultobj*/
let quaryarr  = urlquery.split('&')
quaryarr.forEach((item) => {
    let temparr = item.split('=')
    // console.log(temparr)
    resultobj[temparr[0]] = temparr[1]
})

/*第三步 也可以使用正则拆解截取值*/
let reg = /\&(.+?)=(.+?)/g
// let reg = /([^&?=]+) = ([^&?=]+)/g
// let arr1 = reg.exec(url)
let quqryarr2 = url.match(reg)
// url.replace(reg, function() {
//     // console.log(arguments)
// })

// console.log(arr1)
console.log(quqryarr2)
// 
// let reg1 = /\{\{(.+?)\}\}/g
// let str12 = 'j{{fk}}lajfkldj{{asklf}}jklf{{kl}}'

// // console.log(reg1.exec(str12))
// console.log(str12.match(reg1))