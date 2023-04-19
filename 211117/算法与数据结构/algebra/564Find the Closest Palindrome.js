/* 
    给定一个整数 n ，你需要找到与它最近的回文数（不包括自身）。
   “最近的”定义为两个整数差的绝对值最小。
    示例 1:
    输入: "123"
    输出: "121"
    注意:
    n 是由字符串表示的正整数，其长度不超过18。
    如果有多个结果，返回最小的那个。
    链接：https://leetcode-cn.com/problems/find-the-closest-palindrome
*/  
/*
    设n是一任意自然数。若将n的各位数字反向排列所得自然数n1与n相等，则称n为一回文数。例如，若n=1234321，则称n为一回文数；
    但若n=1234567，则n不是回文数。 [1] 
    注意：
    1.偶数个的数字也有回文数124421
    2.小数没有回文数
*/
 /*
    判断是否是回文数
    @n  输入的数
    @isPalindrome 返回值true/false
 */
//数组转换
const checkPalindrome = (n,isPalindrome = false) => {
    //最小的回文数是0，所以如果小于0 为false
    if (n<0) return isPalindrome = false
    //将数的各个位的数拆分到一个数组中
    //1 判断这个数的位数
    let nNum = Math.floor(Math.log(n)/Math.log(10))
    //保存各个位数的数组
    let nArr = []
    //拆分
    while (nNum>=0) {
        //从10的nNum次方开始除，取整
        nArr.push(parseInt(n/Math.pow(10,nNum)))
        //减去最大的一位数字
        n=n-parseInt(n/Math.pow(10,nNum))*Math.pow(10,nNum)
        //位数减一
        nNum--
    }
    //数组取中值，无论奇数 偶数，
    let halfNArrLen = Math.ceil(nArr.length/2)
    //将首位对比的结果放入judgeArr中
    let judgeArr = []
    for(let i = 0; i< halfNArrLen; i++) {
        judgeArr.push(nArr[i] === nArr[nArr.length-1-i])
    }
    isPalindrome = judgeArr.every(item => item)
    return isPalindrome
}
//字符串转换
const checkPalindrome1 = (n,isPalindrome = false) => {
    //最小的回文数是0，所以如果小于0 为false
    if (n<0) return isPalindrome = false
    //将数的各个位的数拆分到一个数组中
    //1 判断这个数的位数
    let nStr = String(n)
    let nNum = nStr.length
    //字符串取中值，无论奇数 偶数，
    let halfNArrLen = Math.ceil(nNum/2)
    //将首位对比的结果放入judgeArr中
    let judgeArr = []
    for(let i = 0; i< halfNArrLen; i++) {
        judgeArr.push(nStr[i] === nStr[nStr.length-1-i])
    }
    isPalindrome = judgeArr.every(item => item)
    return isPalindrome
}
{
    /*
        思路一：1.判断一个数是否是回文数
               2.以该数+1为起点，寻找回文数，最小的就停止
               3.以该数-1为起点，寻找回文数，最小的就停止
               两者比较取差值小的，如果差值一样大，并入数组显示
     */

    /*
     * @num 输入的数字
     * @result 返回的结果
     */
    
    const FindMinDistancePalindrome = (num,result=NaN) => {
        console.log(num)
        if(num === 0) return result =1
        let result1
        let result2
   
        //从num开始向后遍历，获取相差最小的回文数
        for(let j = num +1;j>num ;j++) {
            if(checkPalindrome(j)) {
                result1 = j
                break
            }
        } 
        //从num开始向后循环，获取相差最小的回文数     
        for(let j = num -1;j<num;j--) {
            if(checkPalindrome(j)) {
                result2 = j
                break
            }
        }
        //比较，如果前后回文数差值一样，放入数组，如果不同，去差值小的
        // console.log(result1-num,result1,num-result2,result2)
        if((result1 - num)===(num - result2)) {
            result = [result1,result2]
        }else {
            result = (result1 - num)<(num - result2)? result1:result2
        }

        return result
    }

    console.time('minPal1')
    // console.log(FindMinDistancePalindrome(4))
    // console.log(FindMinDistancePalindrome(35))
    // console.log(FindMinDistancePalindrome(99))
    // console.log(FindMinDistancePalindrome(1000))
    // console.log(FindMinDistancePalindrome(123))
    // console.log(FindMinDistancePalindrome(5870))
    // console.log(FindMinDistancePalindrome(57894))
    // console.log(FindMinDistancePalindrome(578943))
    // console.log(FindMinDistancePalindrome(10098778900811))
    console.timeEnd('minPal1')
}
{
    /*
        思路一：1.判断一个数是否是回文数
               2.以该数+1为起点，寻找回文数，最小的就停止
               3.以该数-1为起点，寻找回文数，最小的就停止
               两者比较取差值小的，如果差值一样大，并入数组显示
     */

    /*
     * @num 输入的数字
     * @result 返回的结果
     */
    
    const FindMinDistancePalindrome = (num,result=NaN) => {
        num = BigInt(num)
        console.log(num)
        let result1
        let result2
        if(num === BigInt(0)) return result = BigInt(1)
        //从num开始向后遍历，获取相差最小的回文数
        for(let j = num + BigInt(1);j>num ;j += BigInt(1)) {
            if(checkPalindrome1(j)) {
                result1 = j
                break
            }
        } 
        //从num开始向后循环，获取相差最小的回文数     
        for(let j = num -BigInt(1);j<num;j -=BigInt(1)) {
            if(checkPalindrome1(j)) {
                result2 = j
                break
            }
        }
        //比较，如果前后回文数差值一样，放入数组，如果不同，去差值小的
        // console.log(result1-num,result1,num-result2,result2)
        if((result1 - num)===(num - result2)) {
            result = [result1,result2]
        }else {
            result = (result1 - num)<(num - result2)? result1:result2
        }

        return result
    }

    console.time('minPal2')
    // console.log(FindMinDistancePalindrome(0))
    // console.log(FindMinDistancePalindrome(1))
    // console.log(FindMinDistancePalindrome(4))
    // console.log(FindMinDistancePalindrome(9))
    // console.log(FindMinDistancePalindrome(10))
    // console.log(FindMinDistancePalindrome(11))
    // console.log(FindMinDistancePalindrome(35))
    // console.log(FindMinDistancePalindrome(99))
    // console.log(FindMinDistancePalindrome(123))
    // console.log(FindMinDistancePalindrome(1000))
    // console.log(FindMinDistancePalindrome(5870))
    // console.log(FindMinDistancePalindrome(57894))
    // console.log(FindMinDistancePalindrome(578943))
    // console.log(FindMinDistancePalindrome(857892747908028))
    console.timeEnd('minPal2')
}

{
    /*
     思路2:
        1.将输入的N各个位置上的数字拆分到数组中
        2.判断数字的位数，是奇数还是偶数
        2.1对与奇数调整中间的数，将中间数以后的数字置换成中间数以前的数字，
        2.2如果是偶数，平均切割数组，将前面的数据对称分配到后面。
        2.3将新的回文数result1同原数字比较，
        2.3.1如果大于元素，则往n减小的方向寻找回文数，区间为[n-(result1-n),n)，如果有resutl2,(如果没有result2=reuslt1)两个回文数比较，取同原数字差小者
        2.3.2如果小于元素，则往n增大的方向寻找回文数，区间为(n,n+(n-result1)),如果有resutl2,(如果没有result2=reuslt1)两个回文数比较，取同原数字差小者
    */
    const FindMinDistancePalindrome = (n,result=NaN) => {
        if(n === 0) return result =1
        console.log(n)
        let firsthalfNStr
        let middleNStr
        let secondhalNStr
        let resultStr
        let result1
        let result2
        let nCopy = n
        let nStr = String(n)
        let nNum = nStr.length
        //转换成回文数
        //1判断位数奇偶数
        if(nNum%2===0) {
            firsthalfNStr = nStr.substr(0,nNum/2)
            secondhalNStr = firsthalfNStr.split('').reverse().join('')
            resultStr = firsthalfNStr + secondhalNStr
            result1 = Number(resultStr)
            if(result1>n) {
                for(let i = n; i>= n-(result1-n);i--) {
                    if(checkPalindrome1(i)){
                        result2 = i
                        break
                    }else {
                        result2=result1
                    }

                } 
                if((result1-n)!==(n-result2)) {
                    result = (result1-n)<(n-result2)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }else if(result1<n) {
                for(let i = n; i<= n+ n-result1;i++) {
                    if(checkPalindrome1(i)){
                        result2 = i
                        break
                    }else {
                        result2 = result1
                    }
                }
                if((result1-n)!==(n-result2)) {
                    result = (n-result1)<(result2-n)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }else if(result1 = n) {
                for(let j = n +1;j>n ;j++) {
                    if(checkPalindrome1(j)) {
                        result1 = j
                        break
                    }
                } 
                //从num开始向后循环，获取相差最小的回文数     
                for(let j = n-1;j<n;j--) {
                    if(checkPalindrome1(j)) {
                        result2 = j
                        break
                    }
                }

                if((result1-n)!==(n-result2)) {
                    result = (result1-n)<(n-result2)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }
        }else if(nNum%2!==0) {
            firsthalfNStr = nStr.substr(0,Math.floor(nNum/2))
            middleNStr = nStr.substr(nNum/2,1)
            secondhalNStr = firsthalfNStr.split('').reverse().join('')
            resultStr = firsthalfNStr + middleNStr + secondhalNStr
            result1 = Number(resultStr)
            if(result1>n) {
                for(let i = n; i>=n-(result1-n);i--) {
                    if(checkPalindrome1(i)){
                        result2 = i
                    }else {
                        result2 = result1
                    }
                }
                if((result1-n)!==(n-result2)) {
                    result = (result1-n)<(n-result2)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }else if(result1<n) {
                for(let i = n; i<=n+n-result1;i++) {
                    if(checkPalindrome1(i)){
                        result2 = i
                    }else {
                        result2 = result1
                    }
                }
                if((result1-n)!==(n-result2)) {
                    result = (n-result1)<(result2-n)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }else if(result1 = n) {
                for(let j = n +1;j>n ;j++) {
                    if(checkPalindrome1(j)) {
                        result1 = j
                        break
                    }
                } 
                //从num开始向后循环，获取相差最小的回文数     
                for(let j = n-1;j<n;j--) {
                    if(checkPalindrome1(j)) {
                        result2 = j
                        break
                    }
                }
                if((result1-n)!==(n-result2)) {
                    result = (result1-n)<(n-result2)?result1:result2
                }else {
                    result = [result1,result2]
                }
            }
        }
        return result
    }
    console.time('minPal3')
    // console.log(FindMinDistancePalindrome(4))
    // console.log(FindMinDistancePalindrome(35))
    // console.log(FindMinDistancePalindrome(99))
    // console.log(FindMinDistancePalindrome(1000))
    // console.log(FindMinDistancePalindrome(123))
    // console.log(FindMinDistancePalindrome(5870))
    // console.log(FindMinDistancePalindrome(57894))
    // console.log(FindMinDistancePalindrome(578943))
    // console.log(FindMinDistancePalindrome(85789274790802812))
    console.timeEnd('minPal3')
}
{
    /*
     思路3:
        1.将输入的N字符串化
        2.判断数字的位数，是奇数还是偶数
        2.1对与奇数，将中间数以后的数字置换成中间数以前的数字倒序，
        2.2如果是偶数，平均切割数组，将前面数字的倒序对称分配到后面。
        2.3将缓存到的回文数result1同原数字比较，获得gap值
        2.4对于非(整数，以及整数+—-1的数字)，n长度的回文数，其间隔值是确定的，间隔值的数量为Math.floor(i/2)+1，其中i为n的10的次方幂数，
           间隔值同[0,Math.ceil(i/2)](i 同上)数组中的值相关。数组值为10的幂次方值，可以将数组转变为10^0,10^1
           对于偶数幂值，就是，数组中相邻两个值的相加(对于只有一个的就没有相加)
           对于奇数幂数，也是相邻连个值相加，同时包含最后一个值
       回位数的间隔规律 按照数字的位数间隔数字是有迹可循的
       位数  间隔数字                数字10次幂数字        对应的间隔数字个数            对应的值同幂的关系(幂数的一半10的指数，混合)
        1     1                         0              Math.floor(0/2)+1 =1          10^0  Math.ceil(0/2) [0]
        2     11                        1              Math.floor(1/2)+1 =1          10^0+10^1 Math.ceil(1/2) [0,1]
        3     10 11                     2              Math.floor(2/2)+1 =2          10^0+10^1,10^1 Math.ceil(2/2) [0,1]
        4     11 110                    3              Math.floor(3/2)+1 =2          10^0+10^1,10^1+10^2,  Math.ceil(3/2) [0,1,2]
        5     11 100 110                4              Math.floor(4/2)+1 =3          10^0+10^1,10^1+10^2,10^2  Math.ceil(4/2)  [0,1,2]
        6     11 110 1100               5              Math.floor(5/2)+1 =3              
        7     11 110 1000 1100          6              Math.floor(6/2)+1 =4
        8     11 110 1100 11000         7              Math.floor(7/2)+1 =4
        9     11 110 1100 10000 11000   8              Math.floor(8/2)+1 =5
        2.5分析gap值，如果gap是0，表示原来的数字就是回文数，此时，就以n为中心，从小到大加减间隔值，，直到获取回文数
                      如果gap不为0，此时将间隔值数组过滤，获取小于2*gap的元素。最终结果result只可能在[result1,n,n+gap]或者[n-gap,n,result1]区间中。
                      默认最终结果为result1，如果过滤后的间隔值数组如果长度为0，此时result1就是结果无需变动。如果过滤后数组有元素，分析
                      result1> n 和result1<n两种情况。第一种情况最终值在（n,result1]区间中，此时result1从大到小减间隔值，如果存在回文数
                      最终结果就是该值。同理第二种情况，[result1,n)，此时 result1从大到小加间隔值，如果存在回文数就是最终值，否则就是result1
                      为结果
    */
    const FindMinDistancePalindrome = (n,result=NaN) => {
        n = BigInt(n)
        console.log(n)
        if(n === 0) return result =1
        //将输入数字的字符串化后，切割变为，倒序，设置变量
        let firsthalfNStr//以中心切割前半段
        let middleNStr//如果位数是奇数，需要缓存中间位置的数字
        let secondhalNStr//将firsthalNStr倒序化，变成后半截
        let resultStr//最终改变成的回文数字符串
        let result1//将resultStr Number化，
        let result2//可能存在的比result1还近的回文数
        let nCopy = n//克隆原数据
        let nStr = String(n)
        let nNum = nStr.length//输入数字的长度，同幂值关系为-1

        //1根据原数字的奇偶位数，转换成回文数
        if(nNum%2===0) {
            firsthalfNStr = nStr.substr(0,nNum/2)
            secondhalNStr = firsthalfNStr.split('').reverse().join('')
            resultStr = firsthalfNStr + secondhalNStr
            result1 = BigInt(resultStr)
        }else if(nNum%2!==0) {
            firsthalfNStr = nStr.substr(0,Math.floor(nNum/2))
            middleNStr = nStr.substr(nNum/2,1)
            secondhalNStr = firsthalfNStr.split('').reverse().join('')
            resultStr = firsthalfNStr + middleNStr + secondhalNStr
            result1 = BigInt(resultStr)
        }
        //21.该数字10的幂数
        let powNum = nNum -1
        //22.该位数的回文数间隔值的数量为 Math.floor(i/2)+1 个，创建数组，保存所有的间隔值
        let intervalNumArr = new Array(Math.floor(powNum/2)+1).fill(null)
        //23.确定该位数的回文数的间隔值，该值同[0,Math.ceil(i/2)]区间值有关，及从0 到Math.ceil(i/2)的连续整数
        let intervalValueArr1 = []
        for(let i = 0;i<= Math.ceil(powNum/2);i++) {
            intervalValueArr1.push(i)
        }
        intervalValueArr1 = intervalValueArr1.map(item => Math.pow(10,item))
        //24具体的间隔值为intervalValueArr1数组中相邻两个数的相加。但是对于位数为奇数(幂次数为偶数)的需要额外添加一个最大值
        for(let i = 0;i<intervalValueArr1.length;i++) {
            if(intervalValueArr1[i+1]) {
                let temp = intervalValueArr1[i]+intervalValueArr1[i+1]
                intervalNumArr[i] =temp 
            }
            if(powNum%2===0) {
                intervalNumArr[intervalNumArr.length-1]=intervalValueArr1[intervalValueArr1.length-1]
            }
        }
        //考虑到如果数字加减，会导致位数的增减，此时回有另外一个间隔值2，添加进去
        intervalNumArr.push(2)
        intervalNumArr = intervalNumArr.sort((a,b) =>a-b)
        intervalNumArr = intervalNumArr.map(item => BigInt(item))
        //对于intervalNumber数组，也可以事先参考gap的值，将2倍gap以内的值添加进去。
        //3根据以求的的回文数result1 来求同原数字的差值
        let gap = BigInt((result1-n)>0?result1-n:n-result1)
        //如果gap为0，说明result1 = n原来数字就是回文数，此时就用该数字从最小间隔值开始加减间隔值，如果加减后是回位数就返回该值
        if(gap===0){
            for(let i =0; i< intervalNumArr.length;i++) {
                let nplusgap = n + intervalNumArr[i]
                let nsubgap = n - intervalNumArr[i]
                if(checkPalindrome1(nplusgap)&&checkPalindrome1(nsubgap)) {
                    result = [nsubgap,nplusgap]
                    break
                }  
                if(checkPalindrome1(nplusgap)) {
                    result = nplusgap
                    break
                }  
                if(checkPalindrome1(nsubgap)) {
                    result = nsubgap
                    break
                }
            }
        }else {//如果result1回文数，同原数字的距离不等于0，此时result只可能是在[result1,n)或者（n,result1]区间中
             //默认 结果是result = result1，此时也就包含和gap值小于等于数组中最小值
            result = result1
            //获取间隔数组中值小于gap的元素
            let gapArr = intervalNumArr.filter(item => item<=(gap+gap))
            // console.log(gapArr)
            let gapArrLen = gapArr.length
            if(result1>n) {//此时result的区间在[n-gap,n,result1]之间，将result1，减去间隔值(从大到小)，检查是否存在回文数，如果存在
                //再比较这个值result2同元素的差值是否等于gap，是，就有[result1,result2],不等就是result2；如果不存在回文数否则result就是result1,
                for(let i = gapArrLen-1;i>=0;i--) {
                     result2 = result1 - gapArr[i]
                     if(checkPalindrome1(result2)) {
                        if((n-result2)===(result1-n)) {
                            result = [result1,result2]
                        }else {
                            result = result2
                        }
                        break
                     }
                }
            }else if(result1<n){//此时result的区间在[result1,n)之间，将result1，加上间隔值(从大到小)，检查是否存在回文数，如果存在
                //result就是这个值，否则result就是result1
                  for(let i = gapArrLen-1;i>=0;i--) {
                     result2 = result1 + gapArr[i]
                     if(checkPalindrome1(result2)) {
                        if((result2-n)===(n-result1)) {
                            result = [result1,result2]
                        }else {
                            result = result2
                        }
                        break
                     }
                }
            }
        }
        return result
    }
    console.time('minPal4')
    // console.log(FindMinDistancePalindrome(0))
    // console.log(FindMinDistancePalindrome(1))
    // console.log(FindMinDistancePalindrome(4))
    // console.log(FindMinDistancePalindrome(9))
    // console.log(FindMinDistancePalindrome(10))
    // console.log(FindMinDistancePalindrome(11))
    // console.log(FindMinDistancePalindrome(35))
    // console.log(FindMinDistancePalindrome(99))
    // console.log(FindMinDistancePalindrome(123))
    // console.log(FindMinDistancePalindrome(1000))
    // console.log(FindMinDistancePalindrome(5870))
    // console.log(FindMinDistancePalindrome(57894))
    // console.log(FindMinDistancePalindrome(578943))
    // console.log(FindMinDistancePalindrome(5789433))
    // console.log(FindMinDistancePalindrome(57894345))
    // console.log(FindMinDistancePalindrome(578943267))
    console.log(FindMinDistancePalindrome(857892747485997068463525226759805647858969954765342363476487697908028))
    console.timeEnd('minPal4')
}
