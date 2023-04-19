/*
   Promise 的 then 的 注册微任务队列 和 执行 是分离的。
    注册 : 是完全遵循 JS 和 Promise 的代码的执行过程。
    执行 : 先 同步，再 微任务 ，再 宏观任务。 
https://juejin.cn/post/6844903987183894535


    promise第一个then 注册时候 如下:
    必须等new Promise中的同步代码结束才可以注册(此时状态不一定已经确定了)。Promise，resolve等静态方法也是同步立刻执行的
    promise的第二个then，注册事件如下
    必须等上一个then中的同步代码结束才可以注册(此时状态不一定已经确定了)。Promise，resolve等静态方法也是同步立刻执行的
    如果遇到其中有return new Promise的情况，此时注册必须要等这个return后面的状态确定后才能注册
    如果遇到其中有return Promise.resolve()/reject()的情况，此时注册需要先将含有结果值的promise压入微任务栈，等这个任务
    弹出后，注册这个promise的then(空的)，这时return Promise.resolve() 才算执行完毕，接着执行下一then，完成后，再注册包含
    这个return Promise.resolve() 的then后面的then

 */

{
     new Promise(resolve => {
        resolve(1);
        console.log(4)
        
        return new Promise(resolve => resolve())
        then(() => {
            // t2
            console.log(2)
        })
        .then(() => {
            // t2
            console.log(6)
        });
    }).then(t => {
        // t1
        console.log(t)
    });
    console.log(3);
}
{
    new Promise(resolve => {
        resolve(1);
        
        Promise.resolve().then(() => {
            // t2
            console.log(2)
        });
        console.log(4)
    }).then(t => {
        // t1
        console.log(t)
    });
    console.log(3);
    //4321
    /*
        解析 1 new Promise中代码为同步，其中同步代码执行完后才开始注册then 方法
             本题目中， new Promise中 先resolve一个值1，从而改变整个Prmose状态为fullfilled，值为1，
             接着立即执行Promise.resolve()方法，该方法返回一个promise，状态fullfilled，返回值undefined，同时 将他后面的第一个then注册
             到微队列。
             最后执行console.log(4),结果台输出4
             此时整个new Promise内部执行完毕，注册该promise后的第一个then到微队列，此时微队列已有一个then方法需要，这个排到第二
             2.new Promise部分结束，执行下一行代码 console.log(3),console输出3
             3.同步代码执行完毕，开始弹出微队列中2个任务执行，按顺序，打印2,1

    */
}

{
    /**/
    new Promise((resolve, reject) => {
        console.log('promise1',1)
        resolve()
    })
    .then(() => {
        console.log('then11',2)
        new Promise((resolve, reject) => {
            console.log('promise2',3)
            resolve()
        })
        .then(() => {
            console.log("then21",4)
            new Promise((resolve, reject) => {
               console.log('promise3',5)
               resolve()
            })
            .then(() => {
                console.log("then31",7)
            })
            .then(() => {
                console.log("then32",9)
            })
        })
        .then(() => {
            console.log("then22",8)
         })
    })
    .then(() => {
        console.log("then12",6)
    })


    /*
        第二个 then 的注册，需要等待 外部的第一个 then 的同步代码执行完成
        执行new promise, promise部分直接执行，resolve后 注册第一个then微任务 t11放入微任务队列，跳出promise(注意第二个then需要从
        第一个then同步执行部分结束后才触发注册)
        promise1 1 
        因为只有一个微任务t11注册，从mircrotask中取出，执行cl(t11)
        then11 2 
        cl后 出现第二个promise，执行同步执行部分 cl(p2)，resolve后注册微任务t21,此时t11可执行任务完成 跳出p2,进入p1中，触发t12任务注册到微任务队列
        promise2 3 
        微任务注册完毕，从队列中取出，执行，先是t21，执行cl(t21)
        then21 4
        出现第三个promise，执行立即执行部分，cl(p3),resolve后注测p3第一个then微任务 t31，跳出p3，t21可执行部分结束，触发注册 t22微任务
        promise3 5
        继续从微任务队列中取出t12
        then12 6
        执行完t12 取出t31任务执行，结束后 触发注册t32
        then31 7
        继续从队列中取出t22执行
        then22 8
        提取最后一个任务t32执行
        then32 9
     */
}

{
    new Promise((resolve, reject) => {
      console.log("外部promise");
      resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        return new Promise((resolve, reject) => {
          console.log("内部promise");
          resolve();
        })
        .then(() => {
        console.log("内部第一个then");
        })
        .then(() => {
        console.log("内部第二个then");
        });
    })
    .then(() => {
        console.log("外部第二个then");
    });

    /*
        注意这道题目，同上下题比较，这里外部第一个then中是 return Promise，这就需要将这个Promise的两个then同时执行完成才，注册外部第二个then
        输出为
        外部promise  
        外部第一个then
        内部promise
        内部第一个then
        内部第二个then
        外部第二个then 


    */

}

{
    new Promise((resolve, reject) => {
      console.log("外部promise");
      resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
          console.log("内部promise");
          resolve(1);
        })
          .then((res) => {
            console.log(res)
            console.log("内部第一个then");
          })
          .then(() => {
            console.log("内部第二个then");
          });
    })
    .then((res) => {
        console.log(res)
        console.log("外部第二个then");
     });
  /*
       外部promise  
        外部第一个then
        内部promise
        1
        内部第一个then
        undefined
        外部第二个then 
        内部第二个then

   */

}

{
    new Promise((resolve, reject) => {
      console.log("外部promise");
      resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        let p = new Promise((resolve, reject) => {
          console.log("内部promise");
          resolve();
        })
        p.then(() => {
            console.log("内部第一个then");
          })
        p.then(() => {
            console.log("内部第二个then");
          });
    })
    .then(() => {
        console.log("外部第二个then");
    });


    /*
    这段代码的差异，就是内部的 Promise 的代码的写法变了，不再是链式调用。
    这里怎么理解呢？
    这里在执行内部的 new Promise 的 resolve 执行完成之后（扭转了该 Promise 的状态），new Promise 之后的两个同步 p.then 是两个执行代码语句，
    都是同步执行，自然是会同步注册完。
    两种方式的最主要的区别是：
    链式调用的注册是前后依赖的
    比如上面的外部的第二个 then 的注册，是需要外部的第一个的 then 的同步代码执行完成。
    变量定义的方式，注册都是同步的
    比如这里的 p.then 和 var p = new Promise 都是同步执行的。
    所以这里的代码执行就比较清晰了，内部都执行完成之后（因为都优先于外部的第二个 then 的注册）,再执行外部的第二个 then ：
    output:
    外部promise
    外部第一个then
    内部promise
    内部第一个then
    内部第二个then
    外部第二个then
 */

}

{
    let p = new Promise((resolve, reject) => {
      console.log("外部promise");
      resolve();
    })
    p.then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
          console.log("内部promise");
          resolve();
        })
          .then(() => {
            console.log("内部第一个then");
          })
          .then(() => {
            console.log("内部第二个then");
          });
      })
    p.then(() => {
        console.log("外部第二个then");
      });
    /*
        复制代码这段代码中，外部的注册采用了非链式调用的写法，根据上面的讲解，我们知道了外部代码的 p.then 是并列同步注册的。
        所以代码在内部的 new Promise 执行完，p.then 就都同步注册完了。
        内部的第一个 then 注册之后，就开始执行外部的第二个 then 了（外部的第二个 then 和 外部的第一个 then 都是同步注册完了）。
        然后再依次执行内部的第一个 then ,内部的第二个 then。
        output:
        外部promise
        外部第一个then
        内部promise
        外部第二个then
        内部第一个then
        内部第二个then
     */
}

{
    new Promise((resolve, reject) => {
      console.log("外部promise");
      resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
          console.log("内部promise");
          resolve();
        })
          .then(() => {
            console.log("内部第一个then");
          })
          .then(() => {
            console.log("内部第二个then");
          })   
          .then(() => {
            console.log("内部第三个then");
          })  
          .then(() => {
            console.log("内部第四个then");
          })
        return new Promise((resolve, reject) => {
          console.log("内部promise2");
          resolve();
        })
          .then(() => {
            console.log("内部第一个then2");
          })
          .then(() => {
            console.log("内部第二个then2");
          });
    })
    .then(() => {
        console.log("外部第二个then");
      });

    /*
               执行结果             注册
               外部promise"         [外p1 then1]  立刻执行new Promise中同步代码，同时注册外部P1的第一个then
               "外部第一个then，                   此时微队列只有一个外部p1then，弹出，执行它，第一行输出结果
               内部promise          [内p1then1,]   接着执行外p1第一then中new promise，再注册内部p1的第一个then
               "内部promise2"        [内p1then1,"内p2then1"] 接着继续执行return后的第二个new Promise，此时外部的p1.then2，需要等这个外部p1.then调用结束才能注册
               "内部第一个then"       [,"内p2 then1"，内p1 then2",] 此时外部p1的第一个then中同步代码执行完毕，从微任务队列中弹出内p1.then执行，同时注册内p1.then2
                "内部第一个then2"    [内p1 then2","内p2then2"] 再弹出内p2。then1，执行，同时注册内部p2.then2
                "内部第二个then"     ["内p2then2",] 再弹出内p1。then2，执行，同时注册内部p2.then3
                "内部第二个then2"  [内p1.then3]
                "内部第三个then"    [内p1.then4]
                "内部第四个then"    [外p.then2]
                "外部第二个then"
     */
}

{
    new Promise((resolve, reject) => {
      console.log('外部promise');
      resolve();
    })
      .then(() => {
        console.log('外部第一个then');
        new Promise((resolve, reject) => {
          console.log('内部promise');
          resolve();
        })
          .then(() => {
            console.log('内部第一个then');
            return Promise.resolve()
          })
          .then(() => {
            console.log('内部第二个then');
          })
      })
      .then(() => {
        console.log('外部第二个then');
      })
      .then(() => {
        console.log('外部第三个then');
      }) 
      .then(() => {
        console.log('外部第四个then');
      })  
      .then(() => {
        console.log('外部第五个then');
      })

    /*
         执行结果              微任务队列                 执行解释
       外部promise            [外p1.then1]  首先执行外部new Promise内代码，打印结果，同时注册外p1.then1
       外部第一个then                        微任务只有一个外p1.then1，执行，首先打印
      '内部promise'          [内p1.then1,外p1.then2]    接着执行内部第一个new Promise，resolve()后注册内p1.then1,
                                                       同时外p1.then内部同步代码执行结束，注册外p1.then2
       '内部第一个then'       [外p1.then2,undeifned]    弹出内p1.then1，执行，首先打印，接着返回一个Promise.resolve,相对于前面return
                                                       new Promise需要等 内p1.then1代码全部执行结束，才能注册内p1.then2，这里又有不同
                                                       由于Promise.resolve是同步执行，所以此时会将结果值为undefined的promise加入微任务
       '外部第二个then'       [undeifned,外p1.then3]    接着弹出外p1.then2执行，同时添加注册外p1.then3
                                                       此时应该弹出值为undefined的promise执行，同时注册这个promise的then，但是没有then轮空
                                                       所以什么也没有微任务中只剩下一个外p1.then3
                             [外p1.then3]            
         外部第三个then'      [外p1.then4,内p1.then2]   弹出外p1.then3，执行，注册外p1.then4,此时内p1.then1内部同步代码执行结束，注册内p1.then2
        '外部第四个then'      [内p1.then2,外p1.then5,]  接下来就简单了，依次执行内p1.then2,外p1.then5,
        '内部第二个then'      [外p1.then5,]
        外部第五个then'
                                                       

    */

}
{
    new Promise((resolve, reject) => {
      console.log('外部promise');
      resolve();
    })
      .then(() => {
        console.log('外部第一个then');
        new Promise((resolve, reject) => {
          console.log('内部promise');
          resolve();
        })
          .then(() => {
            console.log('内部第一个then');
            return Promise.resolve().then(()=>console.log('promiseresovel第一个then'));
          })
          .then(() => {
            console.log('内部第二个then');
          })
      })
      .then(() => {
        console.log('外部第二个then');
      })
      .then(() => {
        console.log('外部第三个then');
      }) 
      .then(() => {
        console.log('外部第四个then');
      })  
      .then(() => {
        console.log('外部第五个then');
      })

    /*
         执行结果              微任务队列                 执行解释
       外部promise            [外p1.then1]  首先执行外部new Promise内代码，打印结果，同时注册外p1.then1
       外部第一个then                        微任务只有一个外p1.then1，执行，首先打印
      '内部promise'          [内p1.then1,外p1.then2]    接着执行内部第一个new Promise，resolve()后注册内p1.then1,
                                                       同时外p1.then内部同步代码执行结束，注册外p1.then2
       '内部第一个then'       [外p1.then2,undeifned,'promiseresovel第一个then'，]    弹出内p1.then1，执行，首先打印，接着返回一个Promise.resolve,相对于前面return
                                                       new Promise需要等 内p1.then1代码全部执行结束，才能注册内p1.then2，这里又有不同
                                                       由于Promise.resolve是同步执行，所以此时会将结果值为undefined的promise加入微任务.同时将
                                                       其后面的promiseresovel第一个then也加入队列
       '外部第二个then'       [undeifned,'promiseresovel第一个then'，外p1.then3]    接着弹出外p1.then2执行，同时添加注册外p1.then3
                                                       此时应该弹出值为undefined的promise执行，同时注册这个promise的then，但是没有then轮空
                                                       所以什么也没有微任务中只剩下'promiseresovel，外p1.then3
       'promiseresovel第一个then'  [外p1.then3]         return Promise.resolve()执行
        外部第三个then'      [外p1.then4,内p1.then2]   弹出外p1.then3，执行，注册外p1.then4,此时内p1.then1内部同步代码执行结束，注册内p1.then2
        '外部第四个then'      [内p1.then2,外p1.then5,]  接下来就简单了，依次执行内p1.then2,外p1.then5,
        '内部第二个then'      [外p1.then5,]
        外部第五个then'
                                                       

    */

}


