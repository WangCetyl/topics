/*
    使用async  await
    将定时器包括到new Promise中

 */

const delay1 = (time) => new Promise((resolve) => setTimeout(resolve, time));

console.log(0);
await delay1(1000);
console.log(1);