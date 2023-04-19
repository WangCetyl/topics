/*
  给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动
  窗口内的 k 个数字。滑动窗口每次只向右移动一位。返回滑动窗口中的最大值。
  链接：https://leetcode-cn.com/problems/sliding-window-maximum
*/


// 声明队列的数据结构
class Queue {
  constructor (arr=[]) {
    if(Array.isArray(arr)) {
      this.queue = arr
    }else {
      this.queue = [...arguments]
    }
    // this.forEach = this.queue.forEach
  }
  //进队
  enqueue =(val) => {
    this.queue.unshift(val)
    return this.queue
  }
  //dequeue出队
  dequeue=() => {
    return this.queue.pop()
  }

  clear = () => {
    this.queue.length = 0
    return this.queue
  }
  isEmpty = (arr=this.queue,isEmptyboolean=false) => {
    isEmptyboolean = arr.length? false : true
    return isEmptyboolean
  }
}

