/*
    请实现一个fibonacci函数，要求实现以下功能
    斐波那契数列为:[1,1,2,3,5,8,13,21,...]
    fibonacci(0) => 1
    fibonacci(4) => 5
    思路斐波那契数列 初始值为 1,1,然后后一个数为前两个数的和
 */

{
    /*
     *@x 需要的第几个f数   
     *思路   设置一个数组，由于f数的特点是第三位等于前两位的相加，所以设置一个数组，先保存前两位
     *       根据需要的个数，计算，第一，第二为1，从第三位开始，数组两位相加，掺入到第三位，同时
     *       shift()第一个。需要注意的是，此时相加的次数是x-2次
     *       从时间复杂度O角度 都是O(n)，但是从空间复杂度来说变为了O(1),O(n)
     */
    function fibonacci(x) {
        let f = [1,1]
        if(x<=1) {
            // return 1
            return 1
        } else {
            for(let i=0; i<=x-2; i+=1) {
                f.push(f[0]+f[1])
                f.shift()
            }
            return f[1] 
            // for(let i=0; i<=x; i+=1) {
            //     f.push(f[i]+f[i+1])
            // }
            // return f[x]
        }
    }
    console.time('for')
    console.log(fibonacci(1300))
    console.timeEnd('for')
}

{
    const fibonacci = (x) => {
        let a = 0;
        let b = 1;
        let i = 1;
        while(i++ <= x) {
            [a, b] = [b, a+b]
        }
        return b;
    }
    console.time('while')
    console.log(fibonacci(1300))
    console.timeEnd('while')
}

{

    function fibonacci(n) {
        const SQRT_FIVE = Math.sqrt(5);
        return Math.round( (SQRT_FIVE/5) * ( Math.pow((0.5 + SQRT_FIVE/2), n) - Math.pow((0.5 - SQRT_FIVE/2), n) ) );
    }   
    console.time('formula')
    console.log(fibonacci(1300))
    console.timeEnd('formula')
}

{    /*
     *@x 需要的第几个f数   
     *思路   直接递归 ，这种方法需要大量的重复计算，实际时间复杂度为O(1.618n次方) 
     *       任意形如 [公式] 的数列求通项，都可以令 [公式] 将递推公式简化为[公式] 从而求解通项公式
     *       F(n)=(1/√5)*{[(1+√5)/2]^n - [(1-√5)/2]^n}【√5表示根号5】
     *       该思路效果最差
     */
    function fibonacci(x) {
       if(x<=1) {
         return 1
       }else {
         return fibonacci(x-1) + fibonacci(x-2)
       }
    }
    console.time('recursive')
    // console.log(fibonacci(40))
    console.timeEnd('recursive')
}

{
    function fibonacci(x) {
        function fn(x,f0=1,f1=1) {
            if(x===0) {
                return f0
            }else {
                return fn(x-1,f1,f0+f1)
            }
        }
        return fn(x)
    }

    console.time('tailrecursive')
    console.log(fibonacci(1300))
    console.timeEnd('tailrecursive')
}

{
        // 使用缓存的基本思路
    // 1. 首先去缓存容器中查看缓存中是否有对应的数据,如果有,直接取出来使用
    // 2. 如果没有,就先计算结果,然后把结果存储到缓存容器中,方便下次复用
    
    // 创建一个空对象,作为缓存的容器
    var cache = { };
    var count = 0;
    function fib(n){
        // count++;
        if(n <=1){
            return 1;
        }
        if(cache[n]){
            return cache[n];
        }else{
            var ret = fib(n - 1) + fib(n - 2);
            cache[n] = ret;
            return ret;
        }
    }

    console.time('memofn')
    console.log(fib(1300));
    console.timeEnd('memofn')
    //总结:
    // 缓存: 存数据(该案例中,用键存月份,值存的对数)
    // 在js中,缓存中如何表示, 对象 || 数组
    // 使用缓存的思路:
    // 1. 先查看
    // 2. 没有再去计算,但是必须要存到缓存中
}