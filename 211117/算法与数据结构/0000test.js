 /*
    对于连续整数的数组，跳跃循环

  */
 

// const arr = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]
 // for(let i=0; i<=4; i++) {
 //   arr[i].splice(5,0,i)
 // }

 // console.log(arr)
let arr1 =[]
for(let i=0;i<100000;i++) {
    let tmp = Math.ceil(Math.random()*100000)
    arr1.push(tmp)
}

{
    let arr = arr1
    function arrMin(arr,min=arr[0],index = 0) {
        for(let i =1;i<arr.length;i++) {
            if(min>arr[i]) {
                min = arr[i]
                index = i
            }
        }

        return min
    }

    console.time('arrmin1')
    console.log(arrMin(arr))
    console.timeEnd('arrmin1')
}

{
    let arr = arr1
    console.time('arrmin1')
    console.log(Math.min(...arr))
    console.timeEnd('arrmin1')
}
 
// {
//     function A2 (a, result=[]) {
//         //確定數組的邊界，偶數就是一半 奇數就是一半加一
//         const board = (a%2) ? Math.ceil(a/2) : (a/2)
//         let i = 1
//         let m=1
//         let sum = 0
//         while(i<board){
//             console.log('enter',sum,m,i)
//             sum += i++
//             if(sum>a) {
//                 console.log('sum>a=',sum,m,i-1)
//                 sum = 0
//                 m=i
//             }
//             if(sum ===a) {
//                 console.log('sum===a=',sum,m,i-1)
//                 sum = 0
//                 m=i
//                 // result.push(creatArr(m, n))
//             }
//         }
//         return result
//     }
//     console.time('fm2')
//     // let res = A2(15)
//     // console.log(res)
//     console.timeEnd('fm2')
// }

// {
//     function test(count) {
//         for(let i=1;i<=count;i++){
//             //控制累加多少次
//             for(let j=2;;j++){
//                 console.log(i,j)
//                 let total=(i+(i+j-1))*(j/2);
//                 if(total>count){
//                     console.log('>',i,j)
//                     break;
//                 }else if(total===count){
//                     console.log('=',i,j)
//                     break;
//                 }
//             }
//         }
//     }
// }
// test(15)