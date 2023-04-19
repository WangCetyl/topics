/*
  　 队列是一种先进先出的数据结构，元素只能添加到队尾，而对元素的删除，修改，
    检索只能在队头进行。与栈的差异是很明显的。同样队列的实现可以基于链表，也
    可以基于数组。和栈的基本操作差不多，但队列多了一个指针（标号）指向末尾的
    元素，因为需要在末尾插入元素。
*/

{
  // 声明队列的数据结构 数组
  class Arrayqueue {
    constructor (arr=[]) {
      if(Array.isArray(arr)) {
        this.queue = arr
      }else {
        this.queue = [...arguments]
      }
      this.head = this.queue[0]
      this.size = this.queue.length
      this.forEach = this.queue.forEach
    }
    //进队
    enqueue =(val) => {
      this.queue.push(val)
      this.size++
    }
    //dequeue出队
    dequeue=() => {
      this.queue.shift()
      this.head = this.queue[0]
      this.size--
    }

    clear = () => {
      this.queue.length = 0
    }
    isEmpty = (arr=this.queue,isEmptyboolean=false) => {
      isEmptyboolean = arr.length? false : true
      return isEmptyboolean
    }
  }

  let a = new Arrayqueue([1,2,3])
  // let a = new Queue(1,2,3)
  a.enqueue(4)
  a.enqueue(5)
  a.enqueue(6)
  a.dequeue()
  a.dequeue()
  console.log(a)
  console.log(a.head)
  console.log(a.isEmpty())
  // a.queue.forEach(item => console.log(item))
  // console.log(a.clear())
}
{
  //队列的实现循环数组
  class LoopArrayqueue {
    constructor (arr=[]) {
      if(Array.isArray(arr)) {
        this.queue = arr
      }else {
        this.queue = [...arguments]
      }
      this.head = this.queue[0]
      this.size = this.queue.length
      this.rear = this.queue[(this.size-1)>=0?(this.size-1):0]
    }
    //进队
    enqueue =(val) => {
      this.queue.push(val)
      this.size++
      this.rear = this.queue[this.size-1]
    }
    //dequeue出队
    dequeue=() => {
      this.head = this.queue[1]||this.queue[0]
      this.queue.shift()
      this.size--
    }

    clear = () => {
      this.queue.length = 0
    }
    isEmpty = (arr=this.queue,isEmptyboolean=false) => {
      isEmptyboolean = arr.length? false : true
      return isEmptyboolean
    }
  }

  let a = new LoopArrayqueue([1,2,3])
  // let a = new Queue(1,2,3)
  a.enqueue(4)
  a.enqueue(5)
  a.enqueue(6)
  a.dequeue()
  a.dequeue()
  console.log(a)
  console.log(a.head)
  console.log(a.isEmpty())
}
{
  //队列的实现 链表版

  class Node {
    constructor(val){
      this.val = val
      this.next = null
    }
  }

  class LinkedListQueue {
    constructor(arr=[]) {
      if(Array.isArray(arr)) {
        arr = arr.map(item => new Node(item))
      }else {
        arr = [...arguments]
      }
      let arrLen = arr.length
      for(let i = 0; i<arrLen-1; i++) {
         arr[i].next = arr[i+1]
      }
      this.queue = arr[0]
      this.rear = arr[arr.length-1]
      this.dummyHead = new Node(null)
      this.dummyHead.next = this.queue
      this.size = arrLen
    }
    //为保持该队列的添加，删除为O(1),dummyHead头部为删除，rear尾部删除
    //enqueue入队放在尾部，使用rear指针。
    //1，将rear.next指向 需要连接的节点
    //2.将rear移到新的节点上  rear = new node
    enqueue =(val) => {
      let temp = new Node(val)
      this.rear.next = temp
      this.rear = temp 
      this.size++
      // return this.queue
    }
    //dequeue  出队放在队列top上，按顺序,
    //1先将虚拟头部指针的next直接指向队列的第二节点，dh.next 指向q.next,
    //2将第一个节点的next指向null，q.next指向null。
    //3 将队列等于虚拟头部的next，q等于dh.next
    dequeue=() => {
      // this.head.next.next = null
      this.dummyHead.next = this.queue.next
      this.queue.next = null
      this.queue = this.dummyHead.next
      this.size--
      // return this.queue
    }

    getSize =() => {
      return this.size
    }

  }

  let a = new LinkedListQueue([1,2,3])
  a.enqueue(4)
  a.enqueue(5)
  a.dequeue()
  a.enqueue(6)
  a.dequeue()
  console.log('queue=',a.queue)
  console.log('dummyHead=',a.dummyHead)
  console.log('rear=',a.rear)
  console.log('size=',a.getSize())
  // a.enqueue(0)
  // console.log(a)
}
