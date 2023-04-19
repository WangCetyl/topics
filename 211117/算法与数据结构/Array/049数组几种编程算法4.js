/*
    给定一个整数数组，返回一个数组，其中 output[i] 等于自身以外的所有元素的乘积，要求时间复杂度为 O(n)
*/
const arr = [0,3,5,7,8,2,6,1,9,10,15,13,11,12,99,22,44,67]
const arr1 = [99,22,4,44,0,5,67,7,11,9,235,0,14,8]
const arr2 =  [2, 5, 1, 4, 9, 6, 3, 7]
const arr3 =  [2, 5, 1, 4, 9]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
const testArray = []
// for(let k =0;k<125500;k++) {
for(let k =0;k<125500;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*1000000).toFixed(0):-1*(Math.random()*1000000).toFixed(0)
    let temp = Math.random()>0.5 ? 1*(Math.random()*1000000).toFixed(0):-1*(Math.random()*1000000).toFixed(0)
    testArray.push(temp)
}

/*
    要求时间复杂度是O(n)，for遍历如是
    思路：
    1.检查是否有0值
        1.1: 如果有且只有一个，获得其索引，除该索引以外所有值均为0,该位置为剩余其他数据积
        2.2: 如果大于一个位置为0，所有输出均为0
        2.3: 如果没有0，for 遍历，新数组添加值，该值为所有数之积除以该值
*/

{
    function arrMutiply(arr) {
        const firstIndex = arr.indexOf(0)
        const lastIndex = arr.lastIndexOf(0)
        const arrLength = arr.length
        let totoalMutiplyResult
        let result = new Array(arrLength).fill(0)
        if(firstIndex===-1&&lastIndex===-1) {//无0情况
            totoalMutiplyResult = arr.reduce((a,b) => a*b)
            // console.log('没有0',totoalMutiplyResult)
            for(let i =0;i<=arrLength-1;i++) {
                const item = totoalMutiplyResult/arr[i]
                // console.log(item)
                result[i] = item
            }
            return result
        }else if(firstIndex>= -1&&lastIndex>=-1&&firstIndex==lastIndex) {//有一个0
            const newArr = arr.filter(item => item !=0)
            totoalMutiplyResult = newArr.reduce((a,b) => a*b)
            // console.log('一个0',totoalMutiplyResult)
            result.splice(firstIndex,1,totoalMutiplyResult)
            return result
        }else {//有两个及以上0
            return result
        }
    }

    console.log(arrMutiply(arr))
    console.log(arrMutiply(arr1))
    console.log(arrMutiply(arr2))
    console.log(arrMutiply(arr3))
}