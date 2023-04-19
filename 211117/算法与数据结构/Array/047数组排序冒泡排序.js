/* 
   数组排序
*/  

let arr =[]
for(let i=0;i<100000;i++) {
    let tmp = Math.ceil(Math.random()*100000)
    arr.push(tmp)
}

{
    /*  
        冒泡排序
                平均时间复杂度O(n*n)
                最差情况O(n*n)
                最好情况O(n)
                空间复杂度O(1)
                稳定性：稳定
        思路：a)比较两个相邻的元素，如果后一个比前一个大，则交换位置
         b) 第一轮的时候最后一个元素应该是最大的一个
         c) 按照第一步的方法进行两个相邻的元素的比较，由于最后一个元素已经是最大的了，所以最后一个元素不用比较。  
    */
    // let arr =[32,546,76,7,87,95,3,6,36,3,48,5,9,4762,52,5,464,0,98,9,77,90,68,47,36654,454,2,52]
    let i = arr.length
    console.time('bubblesort')
    while(i!==1) {
        for(let i=0;i<arr.length-1;i++) {
            if(arr[i]>arr[i+1]) {
                let tem = arr[i]
                arr[i] = arr[i+1]
                arr[i+1] = tem
            }
        }
        i--
    }
    console.timeEnd('bubblesort')
    // console.log(arr)
    // let arr1 =[32,546,76,7,87,95,3,6,36,3,48,5,9,4762,52,5,464,0,98,9,77,90,68,47,36654,454,2,52]
    // // let arr1 = [...arr]
    // console.time('bubblesort2')
    // for(let i=0;i< arr1.length-1; i++) {
    //     for(let j=0;j<arr1.length-i-1;j++) {
    //         if(arr1[j]>arr1[j+1]) {
    //             let tem = arr1[j]
    //             arr1[j] = arr1[j+1]
    //             arr1[j+1] = tem
    //         }
    //     }
    // }
    // console.timeEnd('bubblesort2')
    console.log(arr1)
}

