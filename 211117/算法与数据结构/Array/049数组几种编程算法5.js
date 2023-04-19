/*
    求两个数组的交集
*/
const arr = [0,3,5,7,8,2,6,1,9,10,15,13,11,12,99,22,44,67]
const arr1 = [99,22,4,44,0,5,67,7,11,9,235,0,14,8]
const arr2 =  [2, 5, 1, 4, 9, 6, 3, 7]
const arr3 =  [2, 5, 1, 4, 9]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
// const testArray =[-21, -48, -27, -30, 88, 64, 46, -75, 15, -91]
const testArray1 = []
const testArray2 = []
const testArray3 = []
const testArray4 = []
// for(let k =0;k<125500;k++) {
for(let k =0;k<125500;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*10000000).toFixed(0):-1*(Math.random()*10000000).toFixed(0)
    let temp = Math.random()>0.5 ? 1*(Math.random()*10000).toFixed(0):-1*(Math.random()*10000).toFixed(0)
    testArray1.push(temp)
}
for(let k =0;k<10;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*10000000).toFixed(0):-1*(Math.random()*10000000).toFixed(0)
    let temp = Math.random()>0.5 ? 1*(Math.random()*1000).toFixed(0):-1*(Math.random()*1000).toFixed(0)
    testArray2.push(temp)
}
for(let k =0;k<125500;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*10000000).toFixed(0):-1*(Math.random()*10000000).toFixed(0)
    let temp = Math.random()>0.5 ? 1*(Math.random()*10000).toFixed(0):-1*(Math.random()*10000).toFixed(0)
    testArray3.push(temp)
}
for(let k =0;k<10;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*10000000).toFixed(0):-1*(Math.random()*10000000).toFixed(0)
    let temp = Math.random()>0.5 ? 1*(Math.random()*1000).toFixed(0):-1*(Math.random()*1000).toFixed(0)
    testArray4.push(temp)
}

/*
    思路：
    利用Array.prototype.includes来判断，arr1中元素是否在arr2中，如果是添加到新数组中

*/

{
    function getIntersection (arr1,arr2) {
        //使用数组个数少的，作为遍历次数
        const arr1Lenght = arr1.length
        const arr2Lenght = arr2.length
        // console.log('arr1=',arr1.sort((a,b)=> a-b),arr1Lenght)
        // console.log('arr2=',arr2.sort((a,b)=> a-b),arr2Lenght)
        let result =[]
        function operation(arr1,arr2) {
            while(arr1.length) {
                const item = arr1.shift()
                if(arr2.includes(item)) {
                    result.push(item)
                }
            }
        }
        arr1Lenght<arr2Lenght?operation(arr1,arr2):operation(arr2, arr1)
        return result
    }

    // console.log(getIntersection(arr,arr1))
    // console.log(getIntersection(arr2,arr3))
    console.time('getIntersection')
    console.log(getIntersection(testArray1,testArray2))
    console.timeEnd('getIntersection')
}
{
    function getIntersection2 (arr1,arr2) {
        //使用数组个数少的，作为遍历次数
        const arr1Lenght = arr1.length
        const arr2Lenght = arr2.length
        // console.log('arr1=',arr1.sort((a,b)=> a-b),arr1Lenght)
        // console.log('arr2=',arr2.sort((a,b)=> a-b),arr2Lenght)
        let result =[]
        while(arr1.length) {
            const item = arr1.shift()
            if(arr2.includes(item)) {
                result.push(item)
            }
        }
        return result
    }

    // console.log(getIntersection(arr,arr1))
    // console.log(getIntersection(arr2,arr3))
    console.time('getIntersection2')
    console.log(getIntersection(testArray3,testArray4))
    console.timeEnd('getIntersection2')
}