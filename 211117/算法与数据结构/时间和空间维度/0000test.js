
{
    for(let i =1;i< 10; i++) {
        let n = Math.pow(10, i)
        let sum = 0
        console.time(`10的${i}`)
        for(let j = 0;j < n;j++) {
            sum +=j
        }
        console.log(sum)
        console.timeEnd(`10的${i}`)
    }


}