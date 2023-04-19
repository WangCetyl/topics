/*给定一个数字，字符串，给出数字单词的所有组合结果*/

/*分析
  1 对于两个数字或者不同的字母 A B   只需要  AB 和AB互换成BA即可
  2 对于3个数字或字母， A B C,可以拆分成 前2个+后1个的形式，其中前两个的顺序在扣除后面的一个
    必须保持不变，这样有三种，AB+C  AC+B BC+A.此时前两个我们可以递归到第一点，再同第三个组合
  3.一次类推，三个以上，的N个，可以先分拆为(N-1) + 1个，当然，N-1个数的顺序在扣除1后必须保持不变
    N-1再递归，直到只剩下两个收敛。
  4.递归时候使用深度优先
*/
/*
    @words   给出的数字 字母可以是数字，字母或者字符串
    @finresult 最终结果保存在递归函数外的finresult中，在递归的最后一层保存
*/

function wordcombination(word,finresult = []) {
    let typeofword = 0
    //判断给出的word是什么类型，以便最后恢复
    typeofword = !typeofword? typeof word : typeofword
    // const wordcopy = typeofword === 'Object'?[...word]:word
    // console.log(wordcopy,typeofword)
    //将数组，字符串，数字全部转换为数组
    word = Array.isArray(word)? word :String(word).split('')
    //该方法将最终获得的finresult中结果，复原成原来的类型
    /* 
        @wordbeforetrue 是转换之前的
        @type 是初始类型值
    */
    function argtype (wordbeforreturn, type) {
        switch(type) {
            case 'number' : 
            return Number(wordbeforreturn.join(''));
            case 'object':
                return wordbeforreturn;
            case 'string':
                return wordbeforreturn.join('')
        }
    }
    /*
        @word 经过转换后的初始值
        @temresult 代表暂存的结果，从头[]开始代入，保留确定的结果即每次切出的最后一个值，逐级合并
    */
    function combination (word,temresult=[]) {
        // 获取代入word数组长度以便确定收敛
        const wordLen = word.length
        if (wordLen === 1||wordLen ===0) {
          
            finresult = finresult.concat(word, ...temresult)
        }else if (wordLen ===2 ) {
            // 注意逐级合并的时候需要clone暂存数组结果，这样返回上一层的时候就不会污染上一层temresult
            //  在word只剩下两项的时候，直接收敛递归，此时首先clone word值，使用colone值并入代入的temresult
            // 再将原word翻转(翻转操作同push一样，改变原数组)，并入代入的temresult
            let tem = [...word]
            tem.push(...temresult)
            // tem.push(lastitem)
            word.reverse()
            word.push(...temresult)
            // word.push(lastitem)
            //在最后收敛递归处，也就是最后结果的地方，并入finresult
            finresult.push(tem,word)
        }else {
            for(let i=wordLen -1; i >= 0; i--) {
                // 注意逐级合并的时候需要clone暂存数组结果，这样返回上一层的时候就不会污染上一层temresult
                let newtemresult = [...temresult]
                //将暂存结果合并
                newtemresult.unshift(word[i])
                //切出需要递归的下一层word
                let newword = [].concat(word.slice(0,i),word.slice(i+1))
                //将word和每层的暂存结果代入递归函数
                combination(newword, newtemresult)
            }
        }
    }
    //注意需要内部执行递归函数
    combination(word)
    //将最后的结果转化为初始类型，放在finresult中返回
    finresult = finresult.map(item =>argtype(item, typeofword) )
    return finresult
}
console.log(wordcombination(['fjs', 'sf', 'hsh', 'fef']))
console.log(wordcombination('fjef'))
console.log(wordcombination(18465))