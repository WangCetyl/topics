/*
    参照axios封装 ajax
*/

/* 
1.函数的返回值为promise, 成功的结果为response, 异常的结果为error
2.能处理多种类型的请求: GET/POST/PUT/DELETE
3.函数的参数为一个配置对象
  {
    url: '',   // 请求地址
    method: '',   // 请求方式GET/POST/PUT/DELETE
    params: {},  // GET/DELETE请求的query参数
    data: {}, // POST或PUT请求的请求体参数 
  }
4.响应json数据自动解析为js对象/数组
*/

/* 
能发ajax请求的函数
1. 接收一个配置
2. 返回值是promise
3. 使用xhr发ajax请求
4. 携带请求参数
5. 取响应结果, 并更新promise状态
*/

function myaxios({
    url,
    method = 'GET',
    params = {},//axios中这个是query参数，而不是params参数.post put传参
    data ={} //put delete传参
}) {
    //准备query参数 {a:1, b:2} ==> a=1&b=2
    let quersStr = '' 
    Object.keys(params).forEach(item => {
        quersStr += `${item}=${params[item]}&`
    })
    if(quersStr) {//只有params不为空{}
        quersStr = quersStr.slice(0,quersStr.length)
        url +='?' + quersStr
    }

    return new Promise((resolve,reject) => {
        //创建xhr对象
        const xhr = new XMLHttpRequest()
        //绑定监听
        xhr.onreadystatechange = () => {
            const {readyState, status, statusText} = xhr
            //如果请求未结束，直接返回
            if(readyState!==4) return
            //请求成功，调用resolve
            if(status>=200 && status<300) {
                //封装一个代表相应的对象
                const response = {
                    data:JSON.parse(xhr.response),
                    status,
                    statusText
                }
                resolve(response)
            }else {
                reject(new Error(`requset error status is${status}`))
            }
            
            //请求失败，调用reject
        }
        //初始化
        xhr.open(method, url, true)
        //发送请求 
        if(method==='POST'||method==='PUT') {
            xhr.setRequsetHeader('Content-Type', 'application/json;charset=utf-8')
            xhr.send(JSON.stringify(data))
        } else {
            xhr.send()
        }
    })
}
