/* 
   数组排序
*/  

let arr1 =[]
// arr1 =[32,546,76,7,87,95,3,6,36,3,48,5,9,4762,52,5,464,0,98,9,77,90,68,47,36654,454,2,52]
for(let i=0;i<10000;i++) {
    let tmp = Math.ceil(Math.random()*10000)
    arr1.push(tmp)
}


{
    /*
    选择排序
        是一个简单直观的排序方法，它的工作原理很简单，首先从未排序序列中找到最大的元素，放到已排序序列的末尾，
        重复上述步骤，直到所有元素排序完毕。
    2，算法描述
        1）假设未排序序列的第一个是最大值，记下该元素的位置，从前往后比较
        2）若某个元素比该元素大，覆盖之前的位置
        3）重复第二个步骤，直到找到未排序的末尾
        4）将未排序元素的第一个元素和最大元素交换位置
        5）重复前面几个步骤，直到所有元素都已经排序。
    */
    let arr = []
    arr = arr1
    function selectSort(arr) {
        for(let i=0; i<arr.length-1;i++) {
            let min = arr[i]
            let minindex = i 
            for(let j= i+1;j<arr.length;j++) {
                if(min>arr[j]) {
                    min = arr[j]
                    minindex = j//注意交换最小值的时候 同时交换最小是索引
                }
            }
            // console.log(min,minindex)
            arr.splice(minindex,1)
            arr.splice(i,0,min)
            // console.log(arr)
        }
        return arr
    }
    console.time('selectsort')
    selectSort(arr)
    // console.log(selectSort(arr))
    console.timeEnd('selectsort')
}
{
    /*
    选择排序
        是一个简单直观的排序方法，它的工作原理很简单，首先从未排序序列中找到最大的元素，放到已排序序列的末尾，重复上述步骤，直到所有元素排序完毕。
    2，算法描述
        1）假设未排序序列的第一个是最大值，记下该元素的位置，从前往后比较
        2）若某个元素比该元素大，覆盖之前的位置
        3）重复第二个步骤，直到找到未排序的末尾
        4）将未排序元素的第一个元素和最大元素交换位置
        5）重复前面几个步骤，直到所有元素都已经排序。
    */
    let arr = []
    arr = arr1
    function selectSort1(arr) {
        for(let i=0; i<arr.length-1;i++) {
            minInarr = Math.min.apply(null,arr.slice(i,arr.length))
            // minInarr = Math.min(...arr.slice(i,arr.length))
            // minIndex = temarr.indexOf(minInarr)           
            minIndex = arr.lastIndexOf(minInarr) //防止元素重复，所以获取最后一个这个值得索引          
            arr.splice(minIndex,1)
            arr.splice(i,0,minInarr)
        }
        return arr
    }
    console.time('selectsort2')
    selectSort1(arr)
    // console.log(selectSort1(arr))
    console.timeEnd('selectsort2')
}