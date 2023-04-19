/*
  函数调用 函数本身
*/

function fn(x) {
    if(x === 1) return 1
    return fn(x-1) + x
}

console.time('fn')
console.log(fn(3000))//55  这种递归效率低下，内存容易溢出 
console.timeEnd('fn')

/*
  尾递归   递归必须调用一个纯自己函数，本质是将参数缓存，提高性能
*/

function tailfn(y,result) {
  if(y===1) return result
  return tailfn(y-1,y+result)
}
console.time('tailfn')
console.log(tailfn(3000,1));
console.timeEnd('tailfn')