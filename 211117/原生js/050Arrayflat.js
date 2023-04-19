/*
    数组扁平换

 */

{
    let arr = [1,[2,56,7],[85075,[1,7,8,[5,7],[8,7,8]],445,4,3,67,],[4,6,7,8],[6,78,8]]
    function arrflat(arr) {
        let result = []
        function A(arr) {
            for(let i=0;i<arr.length;i+=1) {
                  if(Array.isArray(arr[i])) {
                    A(arr[i])
                    continue
                }else {
                    result = [...result,arr[i]]
                }
            }
        }
        A(arr)
        return result
    }
    console.time('for')
    console.log( arrflat(arr))
    console.timeEnd('for')
}
{
    let arr = [1,[2,56,7],[85075,[1,7,8,[5,7],[8,7,8]],445,4,3,67,],[4,6,7,8],[6,78,8]]
    function arrflat(arr) {
        let result = []
        function A(arr) {
            while(arr.length) {
                if(Array.isArray(arr[0])) {
                    A(arr[0])
                }else {
                    result = [...result,arr[0]]
                }
                arr.shift()
            }
        }
        A(arr)
        return result
    }
    console.time('while')
    console.log( arrflat(arr))
    console.timeEnd('while')
}

{
    let arr = [1,[2,56,7],[85075,[1,7,8,[5,7],[8,7,8]],445,4,3,67,],[4,6,7,8],[6,78,8]]
    const newArr = function(arr){
       return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?newArr(cur):cur),[])
    }
    console.time('reduce')
    console.log(newArr(arr));
    console.timeEnd('reduce')
}

{
    let arr = [[[1]],[2,56,7],[85075,[1,7,8,[5,7],[8,7,8]],445,4,3,67,],[4,6,7,8],[6,78,8]]
    console.time('flatapi')
    let result = arr.flat(Infinity)
    console.log(result)
    console.timeEnd('flatapi')
}
{
    let arr = [[[1]],[2,56,7],[85075,[1,7,8,[5,7],[8,7,[8]]],[445],4,3,67,],[4,6,7,8],[6,78,8]]
    let reg = /[\=\,]/g
    console.time('reg')
    let str_arr = arr.join('=')
    let result = str_arr.split(reg).map(item=>item*1)
    console.log(result)
    console.timeEnd('reg')
}
{
    let arr = [[[1]],[2,56,7],[85075,[1,7,8,[5,7],[8,7,[8]]],[445],4,3,67,],[4,6,7,8],[6,78,8]]
    console.time('toString')
    let str_arr = arr.toString()
    let result = str_arr.split(',').map(item=>item*1)
    console.log(result)
    console.timeEnd('toString')
}
{
    let arr = [[[1]],[2,56,7],[85075,[1,7,8,[5,7],[8,7,[8]]],[445],4,3,67,],[4,6,7,8],[6,78,8]]
    console.time('some')
    while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    console.log(arr)
    console.timeEnd('some')
}

