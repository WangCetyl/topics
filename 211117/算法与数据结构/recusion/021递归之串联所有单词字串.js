/*
    给定一个字符串 s 和一些长度相同的单词 words。找出 s 中恰好可以由 words 中所有单词串联形成的子串的起始位置。
    注意子串要与 words 中的单词完全匹配，中间不能有其他字符，但不需要考虑 words 中单词串联的顺序。
    链接：https://leetcode-cn.com/problems/substring-with-concatenation-of-all-words
*/

/*
    substr(start,length)表示从start位置开始，截取length长度的字符串
    substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符
    str.slice(beginIndex[, endIndex])extracts a section of a string and returns it as a new string, without modifying the original string.
    str.charAt('index') 获取字符串索引index位的值
*/
{

    /*
        思路:
        关键问题是需要将所有单词组合，形成所有的可能链接，再带到字符串s中匹配
    */
    /*
     *@str 给定需要查找的字符串
     *@words 所有给定的单词
     *@finresult  查找后需要输出的结果
     *
     * 
    */
    const isMatch = (str,words,hasResult=[]) => {
        //子字符串的长度  由于每个单词长度相同，组合后长度就是words数组长度同每个单词长度的积
        // let wordsLen = words.length
        //这里要String化一下。如果item是数字 就没有length属性
        // let itemLen = String(words[0]).length
        // let substringLen = wordsLen*itemLen

        //对于每个单词长度不一样的，可以for循环统计组合长度
        let substringLen = 0
        words.forEach(item => {
            const itemLen = String(item).length
            substringLen += itemLen
        })
        //将所有word进行组合，找出所有的匹配连接
            /*
             *@words 所有给定的单词
             *@result  递归后需要输出的连接结果
            */
        /*
           思路 
           1.对于任意两个单词A B，组合可能为AB BA,
           2.对于任意三个单词ABC,可以形成 AB AC BC三种2个组合，再同第三个单词配合 形成 AB C;AC B;BC A三种2*1的配对
             注意顺序2前1后，或者1前2后，否则出现结果不全重复的情况。 对于前面的2组合再执行1步骤，从而形成6种结果
             ABC BAC ACB CAB BCA CBA
           3.类推 n个任意单词ABC...N，可以形成A B~N;B AC~N;递归b~n,
        */
        //finresult是存储所有result的容器，独立在递归方程外
        let finresult=[]
        //递归函数如果words长度小于2 直接返回这个words
        //
        const allWordsCombation = (words,result =[]) => {
            const wordsLen = words.length
            if(wordsLen===0 || wordsLen===1) {
                let result1 = [...result]
                result1 = result1.concat(words)
                return result1
            }else if (wordsLen===2) {
                const result21 = [...words]
                const result22 = [...(words.reverse())]
                finresult.push([...result,...result21])
                finresult.push([...result,...result22])
            }else{
                //temrsult每次递归后的结果数组
                //tempArr每次递归后需要继续递归的words数组
                let tempArr = []
                let tempresult = []
                for(let i = 0; i<wordsLen; i++) {
                    let result1 = [...result]
                    result1.push(words[i])
                    tempresult.push(result1)
                    let temp = [...words.slice(0,i),...words.slice(i+1)]
                    tempArr.push(temp)
                }
                for(let j =0; j<tempArr.length;j++) {
                    // let finresult1 = [...finresult]
                    allWordsCombation(tempArr[j],tempresult[j])
                }
            }
        }
        allWordsCombation(words)
        finresult = finresult.map(item => item.join(''))
        // console.log(finresult)
        finresult.forEach(item => {
            for(let i = 0; i< str.length; i++) {
                if(str.substr(i,substringLen) === item) {
                    //注意对象的生成key写法不加[]i无法动态显示
                    // hasResult.push({i:item})
                    hasResult.push({[i]:item})
                    // hasResult.push({[`${i}`]:item})
                    // hasResult.push(i)
                }
            }
        })
        return hasResult
    }
    console.log(isMatch('11589324510901234578247194808870245139898895432179797',[1,2,3,4,5]))
    console.log(isMatch('11589324510901234578247194808870245139898895432179797',[19,4,7,48,82]))
    console.log(isMatch('1234523414532415',[1,2,3,4,5]))
    console.log(isMatch('barfoothefoobarman',["foo","bar"]))
    console.log(isMatch('wordgoodgoodgoodbestword',["word","good","best","word"]))
}
