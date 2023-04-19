/*
    
    一个未排序的数组包含 n 个连续数字中的 n-1 个数字，找到缺失的数字，要求时间复杂度为 O(n)
    数组去重
    给定一个整数数组，请找出两个元素之间的最大差，较小值的元素必须位于较大元素之前
    给定一个整数数组，返回一个数组，其中 output[i] 等于自身以外的所有元素的乘积，要求时间复杂度为 O(n)
    求两个数组的交集
*/

const arr = [0,3,5,7,8,2,6,1,9,10,15,13,11,12,99,22,44,67]
const arr1 = [99,22,4,44,5,67,7,11,9,235,14,8]
const arr2 =  [2, 5, 1, 4, 9, 6, 3, 7]
/*
    思路一:
    连续数字中 缺损的数字满足相互差值 为 1,2,1

*/
{
    function getMissItem(arr) {
        let result
        const arrSort = arr.sort((a,b) => a-b)
        console.log(arrSort)
        for(let i=0;i<=arrSort.length-3;i++){
            // console.log(arrSort[i],arrSort[i+1],arrSort[i+2],arrSort[i+3]);
            // console.log((arrSort[i+1]-arrSort[i])===1&&(arrSort[i+2]-arrSort[i+1])===2&&(arrSort[i+3]-arrSort[i+2])===1);
            // if ((arrSort[i+1]-arrSort[i])===1&&(arrSort[i+2]-arrSort[i+1])===2&&(arrSort[i+3]-arrSort[i+2])===1){
            if ((arrSort[i+1]-arrSort[i])===1&&(arrSort[i+2]-arrSort[i+1])===2){
                result = arrSort[i]+2 
                break
            }else {
                result = "没有符合要求的数字"
            }
        }   
        return result
    }
    console.log(getMissItem(arr))
    console.log(getMissItem(arr1))
    console.log(getMissItem(arr2))
}

{
    const arrayOfIntegers = [2, 5, 1, 4, 9, 6, 3, 7];
    const upperBound = 9;
    const lowerBound = 1;

    findMissingNumber(arrayOfIntegers, upperBound, lowerBound); // 8
    function findMissingNumber(arrayOfIntegers, upperBound, lowerBound) {
      let sumOfIntegers = 0;
      for (let i = 0; i < arrayOfIntegers.length; i++) {
        sumOfIntegers += arrayOfIntegers[i];
      }

      upperLimitSum = (upperBound * (upperBound + 1)) / 2;
      lowerLimitSum = (lowerBound * (lowerBound - 1)) / 2;

      theoreticalSum = upperLimitSum - lowerLimitSum;

      return theoreticalSum - sumOfIntegers;
    }
    console.log(findMissingNumber())
}