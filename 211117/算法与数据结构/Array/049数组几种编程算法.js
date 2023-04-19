/*
    给定一个整数数组，找到从三个整数中产生的最大乘积。
*/
//从小到大排序
    function sortArr(arr) {
        return arr.sort((a,b) => b-a)
    }


    const arr1 = [1,2,3,6,77,8,9,4,76,5,68] //[77, 76, 68, 9, 8, 6, 5, 4, 3, 2, 1] 397936
    const arr2 = [1,2,3,6,77,8,-9,4,76,5,68]//[77, 76, 68, 8, 6, 5, 4, 3, 2, 1, -9] 397936
    const arr3 = [-1,-2,-3,-6,-77,-8,-9,-4,-76,-5,-68]//[-1, -2, -3, -4, -5, -6, -8, -9, -68, -76, -77] -6
    const arr4 = [1,2,-3,6,77,8,9,4,-76,5,68]//[77, 68, 9, 8, 6, 5, 4, 2, 1, -3, -76] 47124
    const arr5 = [1,2,-3,6,77,8,9,4,-76,5,68]//[77, 68, 9, 6, 5, 4, 2, 1, -3, -8, -76] 47124
    const arr6 = [1,2,-3,6,77,8,9,4,-76,5,-68]//[77,9, 6, 5, 4, 2, 1, -3, -8,-68,-76] 397936
    const unsortedArray = [-10, 7, 29, 30, 5, -10, -70];

    const testArray = []
    for(let k =0;k<10000;k++) {
        let temp = Math.random()>0.5 ? (Math.random()*100).toFixed(2):-(Math.random()*100).toFixed(2)
        testArray.push(temp)
    }
    // console.log(testArray)
// computeProduct(unsortedArray); // 21000
/*暴力解法*/
{
    function test1(arr,arrresult=[]) {
        for(i = 0; i<=arr.length-3;i++) {
            for(j=i+1;j<=arr.length-2;j++) {
                for(m=j+1;m<=arr.length-1;m++) {
                    arrresult.push(arr[i]*arr[j]*arr[m])
                    // console.log(`${arr[i]}*${arr[j]}*${arr[m]}=${arr[i]*arr[j]*arr[m]}`)
                }
            }
        }
        // console.log(sortArr(arrresult))
        return sortArr(arrresult)[0]
    }

    console.log(test1(arr1),test1(arr2),test1(arr3),test1(arr4),test1(arr5),test1(arr6))
    console.time('test1')
    // console.log(test1(testArray))
    console.timeEnd('test1')
}
/*
    暴力算法优化，使用变量缓存结果，

*/
{
    function test12(arr,result) {
        result = arr[0]*arr[1]*arr[2]
        for(i = 0; i<=arr.length-3;i++) {
            for(j=i+1;j<=arr.length-2;j++) {
                for(m=j+1;m<=arr.length-1;m++) {
                    result > arr[i]*arr[j]*arr[m] ? result : result = arr[i]*arr[j]*arr[m]
                }
            }
        }
        // console.log(sortArr(arrresult))
        return result
    }

    console.log(test12(arr1),test12(arr2),test12(arr3),test12(arr4),test12(arr5),test12(arr6))
    console.time('test12')
    // console.log(test12(testArray))
    console.timeEnd('test12')
}
/*
   优化解题思路1
   1, 如果全是正数或者全是负数或者只有一个负数，找出最大的三个数，乘积必然最大
   2, 如果大于两个负数，分别取出正整数，负整数，组成两个个新数组，负数组中取出最小的两个相乘，乘以最大的正整数，
      同正整数数组中最大三个数乘积比较，取大的
 */
{
    function test2(arr) {
        const arrSort = sortArr(arr)
        const ifAllPostive = arrSort.every(item => item>=0)
        const ifAllNegtive = arrSort.every(item => item<0)
        // console.log(ifAllPostive,ifAllNegtive)
        const arrplus = arrSort.filter(item => item>=0)
        const arrsubs = arrSort.filter(item => item<0)
        const arrsubslength = arrsubs.length
        // console.log(arrsubslength)
        let result 
        const max1 =  arrSort[0]*arrSort[1]*arrSort[2]
        const max2 =  arrplus[0]*arrsubs[arrsubslength-1]*arrsubs[arrsubslength-2]
        if(ifAllPostive||ifAllNegtive||arrsubslength===1) {
            result = max1
        }else{
            (max1>max2) ? (result = max1) : (result = max2)
        }
        return result
    }
    console.log(test2(arr1),test2(arr2),test2(arr3),test2(arr4),test2(arr5),test2(arr6))
    console.time('test2')
    console.log(test2(testArray))
    console.timeEnd('test2')

}

/*
    优化解题思路2
    在优化思路2的基础上，获取排序后的前三个乘积同最大值同两个最小值的比较

*/
{
    function test21(arr) {
        const arrSort = sortArr(arr)
        const arrlength = arrSort.length
        let result 
        const max1 =  arrSort[0]*arrSort[1]*arrSort[2]
        const max2 =  arrSort[0]*arrSort[arrlength-1]*arrSort[arrlength-2];
        // console.log(max1,max2);
        max1>max2 ? (result = max1) : (result = max2)
        return result
    }
    console.log(test21(arr1),test21(arr2),test21(arr3),test21(arr4),test21(arr5),test21(arr6))
    console.time('test21')
    console.log(test21(testArray))
    console.timeEnd('test21')
}

{
    function sortIntegers(a, b) {
      return a - b;
    }

    function computeProduct(unsorted) {
      const sortedArray = unsorted.sort(sortIntegers);
      const array_n_element = sortedArray.length - 1;

      let product1 = 1;
      let product2 = 1;

      for (let x = array_n_element; x > array_n_element - 3; x--) {
        product1 = product1 * sortedArray[x];
      }

      product2 = sortedArray[0] * sortedArray[1] * sortedArray[array_n_element];

      if (product1 > product2) return product1;

      return product2;
    }
    console.log(computeProduct(arr1),computeProduct(arr2),computeProduct(arr3),computeProduct(arr4),computeProduct(arr5),computeProduct(arr6))
    console.time('computeProduct')
    console.log(computeProduct(testArray))
    console.timeEnd('computeProduct')
}


