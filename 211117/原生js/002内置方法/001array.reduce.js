
{
    function balancedParents (string) {
        return !string.split('').reduce((previous,char)=> {
            if(previous < 0) { return previous}
            if(char=="(") { return ++previous}
            if(char==")") { return --previous}
            
            return previous
        },0)
    }

    console.log(balancedParents('(((())))'))
    console.log(balancedParents('()()(((())))'))
    console.log(balancedParents(')(()(((())))'))

}

{
    /*
        arr.reduce(function(prev,cur,index,arr){
        ...
        }, init);
        或者
        arr.reduce(function(prev,cur,index,arr){
        ...
        },);
        arr 表示将要原数组；
        prev 表示上一次调用回调时的返回值，或者初始值 init;
        cur 表示当前正在处理的数组元素；
        index 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
        init 表示初始值。
        常用的参数只有两个：prev 和 cur。
    */
    // 数组求和，求乘积
    var  arr = [1, 2, 3, 4];
    var sum = arr.reduce((x,y)=>x+y)
    var mul = arr.reduce((x,y)=>x*y)
    console.log( sum ); //求和，10
    console.log( mul ); //求乘积，24

    //计算数组中每个元素出现的次数

    let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

    let nameNum = names.reduce((pre,cur)=>{
      if(cur in pre){
        pre[cur]++
      }else{
        pre[cur] = 1 
      }
      return pre
    },{})
    console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}

    // 数组去重
    let arr = [1,2,3,4,4,1]
    let newArr = arr.reduce((pre,cur)=>{
        if(!pre.includes(cur)){
          return pre.concat(cur)
        }else{
          return pre
        }
    },[])
    console.log(newArr);// [1, 2, 3, 4]

    // 将二维数组转化为一维
    let arr = [[0, 1], [2, 3], [4, 5]]
    let newArr = arr.reduce((pre,cur)=>{
        return pre.concat(cur)
    },[])
    console.log(newArr); // [0, 1, 2, 3, 4, 5]

    // 将多维数组转化为一维
    let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
    const newArr = function(arr){
       return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?newArr(cur):cur),[])
    }
    console.log(newArr(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]


    //对象里的属性求和
    var result = [
        {
            subject: 'math',
            score: 10
        },
        {
            subject: 'chinese',
            score: 20
        },
        {
            subject: 'english',
            score: 30
        }
    ];

    var sum = result.reduce(function(prev, cur) {
        return cur.score + prev;
    }, 0);
    console.log(sum) //60
}