/*
  给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
示例:
输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:
必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。
来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/move-zeroes
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
*/
let testArr = []
for(let k =0;k<50000;k++) {
    // let temp = Math.random()>0.5 ? 1*(Math.random()*1000000).toFixed(0):-1*(Math.random()*1000000).toFixed(0)
    /*注意因为！优先级高于%;所以 先（）%值再取反！;否则会出现除零以外全部是true，并且取模后正负值取决于第一个数，
        所以使用===0比较好
    */
    if((k%13)===0) {
        testArr.push(0)
    }else {
        let temp = Math.random()>0.5 ? 1*(Math.random()*10000).toFixed(0):-1*(Math.random()*10000).toFixed(0)
        testArr.push(temp)
    }
}
console.log(testArr)
{
    let arr = []
    // arr = [0,1,0,3,12]
    arr = [0,0,0,0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,1,0,0,0,0]
    arr = [0,1111,0,0,1,0,3,1,0,33,0,100,1232,3,52,0,234,343,0,23423423,5543,53453,46,7,7,47,77,48,9,9,0,0,0] // let arr = [0,1,0,3,12]
    arr = [...testArr]
    console.log(arr)
    /*for循环 如果arr[i]=0,删除arr[i],添加到最后一位，同时索引和索引最大值减少1 i--，arrLen--*/
    function MoveZeros(arr) {
        let arrLen = arr.length
        for(let i =0; i<arrLen; i++) {
            if(arr[i]===0) {
                arr.splice(i,1)
                arr.push(0)
                i--
                arrLen--
            }
        }
        return arr
    }

    console.time('MoveZeros')
     console.log(MoveZeros(arr))
    console.timeEnd('MoveZeros')
    arr = []

}
{
    /*查找出0的索引，如果存在就删除该项 同时循环次数加一，结束循环后从后插入 删除数量的0*/
    let arr = []
    // arr = [0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,1,0,0,0,0]
    arr = [0,1111,0,0,1,0,3,1,0,33,0,100,1232,3,52,0,234,343,0,23423423,5543,53453,46,7,7,47,77,48,9,9,0,0,0] // let arr = [0,1,0,3,12]
    arr = [...testArr]
    function MoveZeros(arr,count = 0) {
        while(arr.indexOf(0)!==-1) {
            arr.splice(arr.indexOf(0),1)
            count++
        }
        // for(let i=0;i<count;i++) {
        //     arr.push(0)
        // }
        arr=arr.concat(new Array(count).fill(0))
        return arr
    }

    console.time('MoveZeros11')
     console.log(MoveZeros(arr))
    console.timeEnd('MoveZeros11')
    arr = []
}
{
    /*查找出0的索引，如果存在就删除该项 同时循环次数加一，结束循环后从后插入 删除数量的0*/
    let arr = []
    // arr = [0,1,0,3,12]
    arr = [0,0,0,0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,1,0,0,0,0]
    arr = [0,1111,0,0,1,0,3,1,0,33,0,100,1232,3,52,0,234,343,0,23423423,5543,53453,46,7,7,47,77,48,9,9,0,0,0] // let arr = [0,1,0,3,12]
    arr = [...testArr]
    function MoveZeros(arr,count = 0) {
        const arrLen = arr.length
        while(( arr =arr.splice(0,arrLen-count)).indexOf(0)!==-1) {
            arr.splice(arr.indexOf(0),1)
            count++
        }
        arr=arr.concat(new Array(count).fill(0))
        return arr
    }

    console.time('MoveZeros12')
     console.log(MoveZeros(arr))
    console.timeEnd('MoveZeros12')
    arr = []
}
{
    /*查找出0的索引，如果存在就删除该项 同时循环次数加一，结束循环后从后插入 删除数量的0*/
    let arr = []
    arr = [0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,1,0,0,0,0]
    arr = [0,1111,0,0,1,0,3,1,0,33,0,100,1232,3,52,0,234,343,0,23423423,5543,53453,46,7,7,47,77,48,9,9,0,0,0] // let arr = [0,1,0,3,12]
    arr = [...testArr]
    function MoveZeros(arr,count = 0) {
        const arrLen = arr.length
        arr.splice(arr.indexOf(0),1)
        count++
        arr = arr.concat(new Array(count).fill(0))
        if((arr=arr.splice(0,arrLen-count)).indexOf(0)!==-1) {
            arr = arr.concat(new Array(count).fill(0))
            return MoveZeros(arr,count)
        }
        return arr = arr.concat(new Array(count).fill(0))
    }

    console.time('MoveZeros13')
    console.log(MoveZeros(arr))
    console.timeEnd('MoveZeros13')
    arr = []
}
{
    /*过滤掉0 看看看看差几项，后面再补上*/
    let arr = []
    // arr = [0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,12]
    // arr = [0,0,0,0,1,0,3,1,0,0,0,0]
    arr = [0,1111,0,0,1,0,3,1,0,33,0,100,1232,3,52,0,234,343,0,23423423,5543,53453,46,7,7,47,77,48,9,9,0,0,0] // let arr = [0,1,0,3,12]
    arr = [...testArr]
    function MoveZeros(arr) {
        const arrLen = arr.length
        arr = arr.filter( item=> item !==0)
        const lengthGap = arrLen - arr.length
        // for(let i=0;i<lengthGap;i++) {
        //     arr.push(0)
        // }
        arr=arr.concat(new Array(lengthGap).fill(0))
        return arr
    }

    console.time('MoveZeros2')
    console.log(MoveZeros(arr))
    console.timeEnd('MoveZeros2')
    arr = []
}
