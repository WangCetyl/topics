/*
    归并排序mergesort
    思路：
    掌握 归并排序 的 基本思想与过程、代码实现、时间复杂度
    1、基本思想与过程：先递归的分解数列，再合并数列（分治思想的典型应用）
    　　（1）将一个数组拆成A、B两个小组，两个小组继续拆，直到每个小组只有一个元素为止。
    　　（2）按照拆分过程逐步合并小组，由于各小组初始只有一个元素，可以看做小组内部是有序的，合并小组可以被看做是合并两个有序数组的过程。
    　　（3）对左右两个小数列重复第二步，直至各区间只有1个数。
    　　下面对数组【42,20,17,13,28,14,23,15】进行归并排序，模拟排序过程如下：
　　第一步：拆分数组，一共需要拆分三次（logN）；
　　　　第一次拆成【42,20,17,13】，【28,14,23,15】，
　　　　第二次拆成【42,20】，【17,13】，【28,14】，【23,15】，、
　　　　第三次拆成【42】，【20】，【17】，【13】，【28】，【14】，【23】，【15】；
　　　　第三次拆成【42】，【20】，【17】，【13】，【28】，【14】，【23】，【15】；
　　　　第三次拆成【42】，【20】，【17】，【13】，【28】，【14】，【23】，【15】；
   第二步：逐步归并数组，采用合并两个有序数组的方法，每一步其算法复杂度基本接近于O(N)
　　　　第一次归并为【20,42】，【13,17】，【14,28】，【15,23】
　　　　第二次归并为【13,17,20,42】，【14,15,23,28】，
　　　　第三次归并为【13, 14, 15, 17, 20, 23, 28, 42】
*/
// let arr =[]
// for(let i=0;i<10;i++) {
//     let tmp = Math.ceil(Math.random()*100)
//     arr.push(tmp)
// }
{
    
    let arr =[1,5,2,3,9]
    // let arr =[1,5,2,3,9,4,6,7,8]
    // let arr =[32,546,76,7,87,95,3,6,36,3,48,5,9]
    function separate (arr) {
        let len = arr.length
        if(len<=1){ 
            console.log(arr)
            return arr
        }else {
            let mid = Math.floor(arr.length/2)
            let left = arr.slice(0,mid)
            let right = arr.slice(mid)
            separate(left)
            separate(right)
            return merge(separate(left),separate(right))
        }

    }
    // separate(arr)
    
    function merge (l,r) {
        let res = []
        console.time('mergesort')
        while(l.length&&r.length) {
            if(l[0] < r[0]) {
                res.push(l.shift())
            }else {
                res.push(r.shift())
            }
        }

        while(l.length) {
            res.push(l.shift())
        }

        while(r.length) {
            res.push(r.shift())
        }
        console.timeEnd('mergesort')
        return res
    }
    arr = separate(arr)
    // console.log(arr)
}

// {
//     let arr =[32,546,76,7,87,95,3,6,36,3,48,5,9]
//     function MergeSort(array) {
//         let len = array.length;
//         if (len <= 1) {
//             return array;
//         }
//         let num = Math.floor(len / 2);
//         let left = MergeSort(array.slice(0, num));
//         let right = MergeSort(array.slice(num, array.length));
//         return merge(left, right);

//         function merge(left, right) {
//             let [l, r] = [0, 0];
//             let result = [];
//             while (l < left.length && r < right.length) {
//                 if (left[l] < right[r]) {
//                     result.push(left[l]);
//                     l++;
//                 } else {
//                     result.push(right[r]);
//                     r++;
//                 }
//             }
//             result = result.concat(left.slice(l, left.length));
//             result = result.concat(right.slice(r, right.length));
//             return result;
//         }
//     }
//    console.log(MergeSort(arr))
// }