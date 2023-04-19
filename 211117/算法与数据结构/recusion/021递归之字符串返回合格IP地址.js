/*
 给定一个只包含数字的字符串，复原它并返回所有可能的 IP 地址格式。
 有效的 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
 例如："0.1.2.201" 和 "192.168.1.1" 是 有效的 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效的 IP 地址。
 链接：https://leetcode-cn.com/problems/restore-ip-addresses
*/

/*
    substr(start,length)表示从start位置开始，截取length长度的字符串
    substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符
    str.slice(beginIndex[, endIndex])extracts a section of a string and returns it as a new string, without modifying the original string.
    str.charAt('index') 获取字符串索引index位的值
*/
{

    const strReturnQualifiedIP = (str,finresult=[]) => {
        console.log(str)
        const strLen0 = str.length
        if(strLen0===0||strLen0>12) return finresult
        /*
            判断切割下来的字符串是否满足IP段的条件，
            1.不能为空str!='',
            2.转换为数字后 在[0,255]范围内
            3.对于切割后长度一位字符，满足1,2直接合格；如果是2个长度，第一位不能为0；如果是3个长度：第一位不能为0，并且前两位不能都为0
        */
        const isStrQulified = (str) => {
            const strLen = str.length
            if(str!==''&&parseInt(str)<=255&&parseInt(str)>=0){
                if(strLen===1) {
                    return true
                }else if(strLen===2&&parseInt(str.charAt(0))!==0){
                    return true
                    //注意3个长度的要求，第一个不能为0，第1个第2个不能同时为0
                }else if(strLen===3&&parseInt(str.charAt(0))!==0&&(!(parseInt(str.charAt(0))===0&&parseInt(str.charAt(1))===0))){
                    return true
                }
            }
            return false
        }

        /*
          *@str  需要切割的字符串
          *@t  递归的层级，设置从1开始，
          *@result 每个递归完成的结果
        */
        const recusiveFn = (str,t=1,result=[]) => {
            //由于ip字段为1~3的数组，所以切割的话可以1,2,3三种切分法
            for(let i = 1;i<=3;i++) {
                //需要切割切割的字符的长度
                const strLen = str.length
                //将str切割从首字母开始，长度为1,2,3
                const IPsection = str.substr(0,i)
                //剩余的字符，第i个下标到最后
                const IPRest = str.substr(i,strLen-1)
                //剩余字符串的长度
                const IPRestLen = IPRest.length
                //判断点；剩余的字符最大最小长度值。根据递归的层级来计算，IP地址共4段，每段为1~3为数字。所以第一层切割后，余下的字符串长度
                //必须满足4-t位最少每位1个 最多每位3个
                const RestStrMaxNum = (4-t)*3
                const RestStrMinNum = 4-t
                //根据IP地址4段，只需要切割3次，所以递归的边界就是第三次。
                if(t<3) {
                    //前三次，如果满足切割下的子字符串符合isStrQulified要求，并且剩余字符长度也符合要求，就递归到下一层
                    //注意，由于是数组保存值，每次递归的话必须克隆上一层的result结果
                    if(isStrQulified(IPsection)&&IPRestLen>=RestStrMinNum&&IPRestLen<=RestStrMaxNum) {
                            let result1 = [...result]
                            result1.push(IPsection)
                            let result11 = [...result1]
                            recusiveFn(IPRest,t+1,result11)
                    }
                }else if(t===3){
                    //第三层递归为最后一次，此时同时对切割下来的子字符串和剩余的字符串验证是否合格，如果合格就保存到最后结果数组中
                    //同时不要忘记，保存之前要克隆result结果，将克隆后的结果添加到最后finresult数组中
                    if(isStrQulified(IPsection)&&isStrQulified(IPRest)){
                        let result13 = [...result]
                        result13.push(IPsection)
                        result13.push(IPRest)
                        finresult.push(result13)
                    }
                }
            }
        } 
        recusiveFn(str,1,[])
        //根据题目要求使用.将四段数据连接
        finresult = finresult.map(item=>item.join('.'))
        return finresult
    }
    console.log(strReturnQualifiedIP('25525511135',[]))
    console.log(strReturnQualifiedIP('0000',[]))
    console.log(strReturnQualifiedIP('010010',[]))
    console.log(strReturnQualifiedIP('101023',[]))
    console.log(strReturnQualifiedIP('189890080001023',[]))
}
