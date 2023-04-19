/* 
    输入一个正数N，输出所有和为N的连续正数序列
    例如：输入15
    结果：[[1,2,3,4,5],[4,5,6],[7,8]]
*/  

//分析 1 連續相加 所以只有可能小於等於該數的一半大小的兩個或以上的個數相加
//    2. 使用while 循環 從第0位開始，如果連加成立 立刻獲取，並且保存到result，再shift數組第一位
{
    function A (a, result=[]) {
        let a_arr = []
        //確定數組的邊界，偶數就是一半 奇數就是一半加一
        let borad = (a%2) ? Math.ceil(a/2) : (a/2)
        // let index = 0 
        for (let i = 0;i < borad ; i++) {
            a_arr[i] = i+1
        }
        while(a_arr.length!==0) {
            // console.log(a_arr)
            let sum = 0
            for(let i = 0; i<a_arr.length;i++) {
                sum += a_arr[i]
                if(sum === a)  {
                    // console.log(a_arr.length)
                    // console.log(i)
                    result.push(a_arr.slice(0,i+1))
                    break
                }
            }
            a_arr.shift()
        }
        return result
    }
    console.time('while')
    // let res = A(1000000)
    // console.log(res)
    console.timeEnd('while')
}
{
    function A1 (a, result=[]) {
        let a_arr = []
        //確定數組的邊界，偶數就是一半 奇數就是一半加一
        let borad = (a%2) ? Math.ceil(a/2) : (a/2)
        // let index = 0 
        for (let i = 0;i < borad ; i++) {
            a_arr[i] = i+1
        }
        for(let i=0;i<a_arr.length;i++) {
            let sum = 0
            for(let j = i; j<a_arr.length;j++) {
                sum += a_arr[j]
                if(sum === a)  {
                    result.push(a_arr.slice(i,j+1))
                    break
                }
            }
        }
        return result
    }
    console.time('for')
    // let res = A1(1000000)
    // console.log(res)
    console.timeEnd('for')
}
//思路二： 任何连续的整数m，n相加之和等于n(n+1)/2-m(m+1)/2+m = (n(n+1)-m(m-1))/2
//相对于思路一，减除数组a_arr的空间
{
    //对于区间[m,n]内的正整数,求和
    function addResult(m,n) {
        return  (n*(n+1)-m*(m-1))/2
    }
    //对于区间[m,n]内的正整数，求数组，使得数组0为m，n-m+1为n，中间连续
    function creatArr(m,n){
        let tem = new Array(n-m+1).fill(null)
        let result = tem.map(item => item = (m++))
        return result
    }
    function A2 (a, result=[]) {
        //確定數組的邊界，偶數就是一半 奇數就是一半加一
        const board = (a%2) ? Math.ceil(a/2) : (a/2)
        for(let i=1;i<board ;i++) {
            for(let j = i+1; j<=board;j++) {
                const temp = addResult(i, j)
                if(temp>a) break
                if(temp === a)  {
                    result.push(creatArr(i,j))
                    break
                }
            }
        }
        return result
    }
    console.time('fm')
    let res = A2(1000000)
    console.log(res)
    console.timeEnd('fm')
}
{
    /*
 * 输入一个正数N，输出所有和为N的连续正数序列
 * 例如：输入15
 * 结果：[[1,2,3,4,5],[4,5,6],[7,8]]
 */
    function createArr(n,len){
        let arr=new Array(len).fill(null),
            temp=[];
        arr[0]=n;
        arr=arr.map((item,index)=>{
            if(item===null){
                item=temp[index-1]+1;
            }
            temp.push(item);
            return item;
        });
        return arr;
    }
    function fn(count){
        let result=[];
        //=>求出中间值
        let middle=Math.ceil(count/2);
        //从1开始累加
        for(let i=1;i<=middle;i++){
            //控制累加多少次
            for(let j=2;;j++){
                //求出累加多次的和
                let total=(i+(i+j-1))*(j/2);
                if(total>count){
                    break;
                }else if(total===count){
                    result.push(createArr(i,j));
                    break;
                }
            }
        }
        return result;
    }
    console.time('zf')
    // let res = fn(1000000)
    // console.log(res)
    console.timeEnd('zf')
}