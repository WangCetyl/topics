

{
    async function a1 () {
        console.log('a1 start')
        await a2()
        console.log('a1 end')
    }
    async function a2 () {
        console.log('a2')
    }

    console.log('script start')

    setTimeout(() => {
        console.log('setTimeout')
    }, 0)

    Promise.resolve().then(() => {
        console.log('promise1')
    })

    a1()

    let promise2 = new Promise((resolve) => {
        resolve('promise2.then')
        console.log('promise2')
    })

    promise2.then((res) => {
        console.log(res)
        Promise.resolve().then(() => {
            console.log('promise3')
        })
    })
    console.log('script end')
/*
    Chrome IE firefox中运行结果如下:
    script start =>a1 start => a2 => promise2=>
    'script end' =>'promise1'=>a1 end => promise2.then=> promise3 => setTimeout

    node 中运行结果:
    script start =>a1 start => a2 => promise2=>
    'script end' =>'promise1=> promise2.then'=> promise3=>a1 end  => setTimeout
*/
}






