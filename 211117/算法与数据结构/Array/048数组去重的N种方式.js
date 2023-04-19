/**/


// for(let i=0; i<100;i++) {
//     arr.push(Math.ceil(Math.random()*10))
// }

{
    /*Set*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('Set')
    // let t1 = new Date().getTime()
    // let t1 = Date.now()
    let arr1 = [...new Set(arr)]
    // let t2 = Date.now()
    console.timeEnd('Set')//Set: 0.571ms
    // let t2 = new Date().getTime()
    // console.log((t2-t1)+'ms')
    console.log('arr=',arr.length)//
    console.log('arr1=',arr1,arr1.length)//
}

{
    /*array reduce*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('reduce')
    let arr1 = arr.reduce((pre,cur) => {
        if(!pre.includes(cur)) {
            pre.push(cur)
        }
        return pre
    },[])
    console.timeEnd('reduce') //reduce: 0.248ms
    console.log('arr=',arr.length)
    console.log('arr1=',arr1,arr1.length)//
}

{
    /*for循環*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('for')
    let arr1 = [ ]
    for(let i = 0; i<arr.length;i++) {
        if(!arr1.includes(arr[i])) {
            arr1.push(arr[i])
        }
    }
    console.timeEnd('for')//for: 0.033ms
    console.log('arr=',arr.length)//
    console.log('arr1=',arr1,arr1.length)//
}
{
    /*for2  思路  将数组第一项与后面的所有相对比，如包含则代替为none，最后过滤掉none*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('for2')
    for(let i = 0; i<arr.length-1;i++) {
       let arrtemp = arr.slice(i+1)
       if(arrtemp.indexOf(arr[i]) > -1) {
            arr.splice(i,1,'none')//如果直接使用splice(i,1)會導致數組塌陷問題，所以填满none
       }
    }
    arr1 = arr.filter((item) => item !=='none')

    console.timeEnd('for2')//for: 0.033ms
    console.log('arr=',arr.length)//
    console.log('arr1=',arr1,arr1.length)//
}

{
    /*object 去重*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('object')
    console.log('arr=',arr.length)//
    let obj = {}
    for (let i=0; i<arr.length; i++) {
        obj[arr[i]] = arr[i]
    }
    let arr1 = Object.keys(obj).map((item) => item*1)
    console.timeEnd('object')//object: 1.810ms
    console.log('arr1=',arr1,arr1.length)//
}

{
    /*while循環*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('while')
    console.log('arr=',arr.length)//
    let arr1 = [ ]
    while(arr.length!==0) {
        if(!arr1.includes(arr[0])) {
            arr1.push(arr[0])
        }
        arr.shift()
    }
    console.timeEnd('while')//while: 0.170ms
    console.log('arr1=',arr1,arr1.length)//
}
{
    /*sortcompare先排序 在相鄰對比，去重*/
    let arr = [2,3,4,2,4,5,6,67,635,7,8,47,8,3,34,5,5,252]
    console.time('sortcompar')
    console.log('arr=',arr.length)//
    arr.sort((a,b) => a-b)
    // for(let i=0;i< arr.length-1;i++) {
    //     if(arr[i]===arr[i+1]){
    //         arr.splice(i,1,'none')
    //     }    
    // }
    // let arr1 = arr.filter((item) => item !== 'none')
    // for(let i=0;i< arr.length-1;i++) {
    //     if(arr[i]===arr[i+1]){
    //         arr.splice(i,1)//为防止数组塌陷 需要i--
    //         i--
    //     }    
    // }
    //这里也可以使用正则捕获所有相同的相邻的数字,然后直接返货group中捕获值即可
    let str = arr.join('@') +'@'
    // str=2@2@3@3@4@4@5@5@5@6@7@8@8@34@47@67@252@635@
    let reg = /(\d+@)\1+/g //其中(\d+@)代表 数字@ \1代表重复前面的(\d+@) *表示任意次
    let arr1 = str.replace(reg,(m,n) => {
        // console.log(m,n)
        return n
    }).split('@')
    arr1.pop()
    arr1 = arr1.map(item=>item*1)
    console.timeEnd('sortcompar')//while: 0.170ms
    console.log('arr1=',arr1,arr1.length)//
}