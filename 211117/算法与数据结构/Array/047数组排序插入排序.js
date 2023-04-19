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
        插入排序 
                平均时间复杂度O(n*n)
                最差情况O(n*n)
                最好情况O(n)
                空间复杂度O(1)
                稳定性：稳定
        插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法。
        它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
        解法1: 1 从第二项开始,依次循环,第i项为例，同arr中i项之前的元素比较,从0项开始，如果值小于j项,则创建
                 临时数组。(也可以从后比较，如果大则分割数组)
               2.临时数组1:包含0~j-1项，临时数组2:包含j~i-1项，临时数组3包含i+1至最后一项
               3.临时数组1中push arr中第i项
               4 将数组arr重新 赋值 为三个临时数组的按序合并
    */
    let arr =[32,546,76,7,87,95,3,6,36,3,48,5,9,4762,52,5,464,0,98,9,77,90,68,47,36654,454,2,52]
    console.time('insertsort')
    for(let i=1;i<arr.length;i++) {
        for(let j=0;j<=i-1;j++) {
            // console.log(`${i}=>${j}`) 
            if(arr[i]<arr[j]) {
                arrtemp1 = arr.slice(0,j)
                arrtemp2 = arr.slice(j,i)
                arrtemp3 = arr.slice(i+1)
                arrtemp1.push(arr[i])
                arr = arrtemp1.concat(arrtemp2,arrtemp3)
                break
            }
        }
    }
    console.timeEnd('insertsort')
    // console.log(arr)
}

