/*
    给定一个整数数组，请找出两个元素之间的最大差，较小值的元素必须位于较大元素之前
*/
function sortArr(arr) {
    return arr.sort((a,b) => b-a)
}

const arr = [0,3,5,7,8,2,6,1,9,10,15,13,11,12,99,22,44,67]
const arr1 = [99,22,4,44,5,67,7,11,9,235,14,8]
const arr2 =  [2, 5, 1, 4, 9, 6, 3, 7]
const arr3 =  [3,5,7,8,2,500,6,1,9,10,15,13,0,11,12,100,200,300,400,300,2, 5, 1, 4, 9, 6, 300, 7]
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
// console.log(Math.max.apply(null,testArray))
/*
    思路一:
    1.复制原数组(sort方法后数组会变所以要colone),排序，从大到小，
    2.获取排序后的最大值和最小值，在原数组中获得最大值的最后一个位置索引，最小值的第一个位置索引。
    3.1如果最小值的索引小于最大值，最小最大值相减，就是结果
    3.2如果最小值索引大于最大值索引，开始以排序后的数组for循环，
    3.2.1在原数组中获取某个item的最后一个索引号，切割数组，使得最大值为最后一个，获取该数组最小值，相减，存入结果数组
    3.2.2在结果数组中获取最大值就是结果
   
*/
{
    function getMaxGap(arr){
        let arrSorted = [...arr]
        let reuslt//最终返回的值
        // console.log('origin arr=',arr)
        const max = Math.max(...arr)
        const min = Math.min(...arr)
        //考虑到可能数组出现重复最大元素，可以获取最后面的一个位置index
        const maxIndex = arr.lastIndexOf(max)
        //相反如果是最小值有多个，可以考虑最前面的一个位置index
        const minIndex = arr.indexOf(min)
        if(minIndex<maxIndex) {
            // console.log(max,min)
            // console.log(maxIndex,minIndex)
            return result = max - min
        }else {
            let resultArr = []//各个包含最大值数组的最大差
            arrSorted = sortArr(arrSorted)
            const arrSortedLength = arrSorted.length 
            for(let i=0;i<=arrSortedLength-1;i++) {
                const itemIndexInArr = arr.lastIndexOf(arrSorted[i])
                const newArrIncludeMax = arr.slice(0,itemIndexInArr+1)
                const maxThisItem = arrSorted[i] - Math.min.apply(null,newArrIncludeMax)
                // console.log(newArrIncludeMax,maxThisItem)
                // console.log(arrSorted[i],Math.min.apply(null,newArrIncludeMax),maxThisItem)
                resultArr.push(maxThisItem)
            }
            // console.log('resultArr=',resultArr)
            return result = Math.max.apply(null,resultArr)
        }
    }

    // console.log(getMaxGap(arr),getMaxGap(arr1),getMaxGap(arr2),getMaxGap(arr3))
    console.time('getMaxGap')
    // console.log(getMaxGap(testArray))
    console.timeEnd('getMaxGap')
}
/*
    将每个数组的差值缓存，只保留最大值，不用 resultArray存储 实际效果同原来差不多
*/
{
    function getMaxGap1(arr){
        let arrSorted = [...arr]
        let result//最终返回的值
        // console.log('origin arr=',arr)
        const max = Math.max(...arr)
        const min = Math.min(...arr)
        //考虑到可能数组出现重复最大元素，可以获取最后面的一个位置index
        const maxIndex = arr.lastIndexOf(max)
        //相反如果是最小值有多个，可以考虑最前面的一个位置index
        const minIndex = arr.indexOf(min)
        if(minIndex<maxIndex) {
            // console.log(max,min)
            // console.log(maxIndex,minIndex)
            return result = max - min
        }else {
            arrSorted = sortArr(arrSorted)
            const arrSortedLength = arrSorted.length 
            for(let i=0;i<=arrSortedLength-1;i++) {
                const itemIndexInArr = arr.lastIndexOf(arrSorted[i])
                const newArrIncludeMax = arr.slice(0,itemIndexInArr+1)
                const maxThisItem = arrSorted[i] - Math.min.apply(null,newArrIncludeMax)
                if(result===undefined||result< maxThisItem) {
                    result = maxThisItem
                }
            }
            // console.log('resultArr=',resultArr)
            return result 
        }
    }

    // console.log(getMaxGap(arr),getMaxGap(arr1),getMaxGap(arr2),getMaxGap(arr3))
    console.time('getMaxGap1')
    // console.log(getMaxGap1(testArray))
    console.timeEnd('getMaxGap1')
}

/*
    思路二：
    1.从数组中取出最大值，最小值，获得最大值的最后一个位置索引，最小值的第一个位置索引。
    2.比较最大值最小值的索引大小：
        2.1如果最小值在最大值的前面，两者差值就是解
        2.2如果最小值在最大值后面，切割原数组为二，按照最大值索引为界，第一个从第一个到最大值为最后一项，第二组从最大值后
           一位到最后一位。(此情况下，两元素的可能最大差值，只可能在第二个数组中)
            2.2.1.对于第一组，获取最小值，得出最大值最小值的差值，缓存
            2.2.1对于第二组，继续 1~2.2.1的不知递归，当后一个数组长度小于2时，返回如下值:
                  2.2.2.1:如果是一个，直接返回0
                  2.2.2.2:如果是二个，直接返回后一位减前一位。
*/

{
    function getMaxGap3(arr){
        // console.log('origin arr=',arr)
        let resultArr = []
        function getMaxGapRecursive(arr){
            const max = Math.max(...arr)
            const min = Math.min(...arr)
            //考虑到可能数组出现重复最大元素，可以获取最后面的一个位置index
            const maxIndex = arr.lastIndexOf(max)
            //相反如果是最小值有多个，可以考虑最前面的一个位置index
            const minIndex = arr.indexOf(min)
            if(minIndex<maxIndex) {
                resultArr.push(max - min)
            }else {
                const arrLeft = arr.slice(0,maxIndex+1)
                const arrRight = arr.slice(maxIndex+1)
                arr= null
                const minInArrLeft = Math.min(...arrLeft) 
                resultArr.push(max-minInArrLeft)
                if(arrRight.length<=1) {
                    resultArr.push(0)
                }else if(arrRight.length===2) {
                    resultArr.push(arrRight[1]-arrRight[0])
                    return resultArr
                }else {
                    getMaxGapRecursive(arrRight)
                } 
            }
        }
        getMaxGapRecursive(arr)
        console.log('lastResultArr=',resultArr)
        const result = Math.max(...resultArr)
        return result
    }

    // console.log(getMaxGapRecursive(arr),getMaxGapRecursive(arr1),getMaxGapRecursive(arr2),getMaxGapRecursive(arr3))
    console.time('getMaxGapRecursive')
    console.log(getMaxGap3(testArray))
    console.timeEnd('getMaxGapRecursive')
}
{
    function getMaxGapRecursive(arr,resultArr = []){
        const max = Math.max(...arr)
        const min = Math.min(...arr)
        //考虑到可能数组出现重复最大元素，可以获取最后面的一个位置index
        const maxIndex = arr.lastIndexOf(max)
        //相反如果是最小值有多个，可以考虑最前面的一个位置index
        const minIndex = arr.indexOf(min)
        if(minIndex<maxIndex) {
            resultArr.push(max - min)
            return resultArr
        }else {
            const arrLeft = arr.slice(0,maxIndex+1)
            const arrRight = arr.slice(maxIndex+1)
            arr= null
            const minInArrLeft = Math.min(...arrLeft) 
            resultArr.push(max-minInArrLeft)
            if(arrRight.length<=1) {
                resultArr.push(0)
                return resultArr
            }else if(arrRight.length===2) {
                resultArr.push(arrRight[1]-arrRight[0])
                return resultArr
            }else {
                return getMaxGapRecursive(arrRight,resultArr)
            } 
        }
    }
    

    // console.log(getMaxGapRecursive(arr),getMaxGapRecursive(arr1),getMaxGapRecursive(arr2),getMaxGapRecursive(arr3))
    console.time('getMaxGapRecursive2')
    console.log(getMaxGapRecursive(testArray),'\n',Math.max(...getMaxGapRecursive(testArray)))
    console.timeEnd('getMaxGapRecursive2')
}
{
    function getMaxGapRecursive(arr,result){
        const max = Math.max(...arr)
        const min = Math.min(...arr)
        //考虑到可能数组出现重复最大元素，可以获取最后面的一个位置index
        const maxIndex = arr.lastIndexOf(max)
        //相反如果是最小值有多个，可以考虑最前面的一个位置index
        const minIndex = arr.indexOf(min)
        if(minIndex<maxIndex) {
            if(!result) {
                result = max - min
            }else {
                (result >(max-min))?result:result = max-min
            }
            return result
        }else {
            const arrLeft = arr.slice(0,maxIndex+1)
            const arrRight = arr.slice(maxIndex+1)
            arr= null
            const minInArrLeft = Math.min(...arrLeft) 
            if(!result) {
                result = max - minInArrLeft
            }else {
                (result >(max-minInArrLeft))?result:result = max-minInArrLeft
            }
            if(arrRight.length<=1) {
                result>0?result:result = 0
                return result
            }else if(arrRight.length===2) {
                result>(arrRight[1]-arrRight[0])?result:result = arrRight[1]-arrRight[0]
                return result
            }else {
                return getMaxGapRecursive(arrRight,result)
            } 
        }
    }
    

    // console.log(getMaxGapRecursive(arr),getMaxGapRecursive(arr1),getMaxGapRecursive(arr2),getMaxGapRecursive(arr3))
    console.time('getMaxGapRecursive3')
    console.log(getMaxGapRecursive(testArray))
    console.timeEnd('getMaxGapRecursive3')
}
