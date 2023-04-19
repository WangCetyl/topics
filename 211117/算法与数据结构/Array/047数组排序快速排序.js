/* 
   数组排序
*/  

// let arr =[]
// for(let i=0;i<100000;i++) {
//     let tmp = Math.ceil(Math.random()*100000)
//     arr.push(tmp)
// }


{
    /*
        快速排序
        思路：
        1、选择数组中间数作为基数，并从数组中取出此基数；
        2、准备两个数组容器，遍历数组，逐个与基数比对，较小的放左边容器，较大的放右边容器；
        3、递归处理两个容器的元素，并将处理后的数据与基数按大小合并成一个数组，返回。
    */
     let arr =[32,546,76,7,87,95,3,6,36,3,48,5,9,4762,52,5,464,0,98,9,77,90,68,47,36654,454,2,52]
     console.time('quicksort')
     function quicksort (arr) {
        let left = []
        let right = []
        let mid = arr[0]
        if(arr.length <= 1) {
            return arr
        }else {
            for(let i=1; i<arr.length; i += 1) {
                if(arr[i]<mid) {
                    left.push(arr[i])
                }else {
                    right.push(arr[i])
                }
            }
            return quicksort(left).concat(mid,quicksort(right))
        }
     }
     arr = quicksort(arr)
     console.timeEnd('quicksort')
     // console.log(arr)
}