/* 
    Given a string s, consider all duplicated substrings: (contiguous) substrings of s 
    that occur 2 or more times. The occurrences may overlap.
    Return any duplicated substring that has the longest possible length. If s does not 
    have a duplicated substring, the answer is "".
    Example 1:
    Input: s = "banana"
    Output: "ana"
    Example 2:
    Input: s = "abcd"
    Output: ""
    给出一个字符串 S，考虑其所有重复子串（S 的连续子串，出现两次或多次，可能会有重叠）。
    返回任何具有最长可能长度的重复子串。（如果 S 不含重复子串，那么答案为 ""。）
    链接：https://leetcode-cn.com/problems/longest-duplicate-substring
*/
{
/*
   思路一:
        1.由于子字符串是连续的，所以可以暴力切割字符串，获取每一个长度的字串。
        2.从最大长度字串开始切割，然后检查是否有重复，如果有，就立即退出。返回字串。结束后如果没有，就返回

*/
    const longestDuplicateSubstring = (s,result=[]) => {
        let sLen = s.length
        s= s.toLowerCase()
        for(let i=0; i<sLen-1;i++) {
            let temp = {}
            for(let j=0;j<=i+1;j++) {
                let subString = s.substr(j,sLen-1-i)
                if(temp[subString]) {
                    temp[subString]++
                }else {
                    temp[subString] = 1
                }
            }
            for(let [k,v] of Object.entries(temp)) {
                if(v>1) {
                    result.push([k,v])
                }
            }
            //这个条件是求得最长的，如果注释了，就是求所有重复的字串
            // if(result.length>0) {
            //     break
            // }
            // console.log(Object.entries(temp))
        }
        // return result
        if(result.length===0) {
            console.log('没有重复的字符子串')
        }else {
            if(result.length===1) {
                result.forEach(item => {
                    console.log( `最长的子字符串${item[0]}出現了${item[1]}次` +  '\n')
                })
            }else {
                result.forEach(item => {
                    console.log( `子字符串${item[0]}，长度为${item[0].length},一共出現了${item[1]}次` +  '\n')
                })
            }
        }
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    }  

    longestDuplicateSubstring('fa')
    longestDuplicateSubstring('fajkhkj')
    longestDuplicateSubstring('banana')
    longestDuplicateSubstring('fajkhkfajkhkbananafajkhkabbananacbanana')
    longestDuplicateSubstring('jaaljfkljlkafjkaljfkjflasjkaljflajlajlfkjlakfjlkajflajflajflajflkjalkfjlajflkajflajflajlfjalfjl')
}
