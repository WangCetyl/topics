/*
  　链表用来存储有序的元素集合，与数组不同，链表中的元素并非保存在连续的存储空间内，
    每个元素由一个存储元素本身的节点和一个指向下一个元素的指针构成。当要移动或删除
    元素时，只需要修改相应元素上的指针就可以了。对链表元素的操作要比对数组元素的操
    作效率更高。
    要实现链表数据结构，关键在于保存head元素（即链表的头元素）以及每一个元素的next
    指针，有这两部分我们就可以很方便地遍历链表从而操作所有的元素。可以把链表想象成
    一条锁链，锁链中的每一个节点都是相互连接的，我们只要找到锁链的头，整条锁链就都
    可以找到了。链表最后一个元素的next值为null
*/

// 声明链表的节点ES5
// let Node = function (element) {
//     this.element = element;
//     this.next = null;
// };

// 声明链表的节点ES6
class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

// 声明链表的数据结构
class NodeList {
  constructor (arr) {
    // 声明链表的头部节点
    let head = new Node(arr.shift())
    let next = head
    arr.forEach(item => {
      next.next = new Node(item)
      next = next.next
    })
    return head
  }
}

class LinkedList {
    constructor() {
      this.length = 0;
      this.head = null;
    }
    getElementAt (position) { // 返回链表中索引所对应的元素
      if (position < 0 || position >= this.length) return null;
      let current = this.head;
      for (let i = 0; i < position; i++) {
          current = current.next;
      }
      return current;
    }
    append (element) {// 向链表中添加节点
      let node = new Node(element);
      // 如果当前链表为空，则将head指向node
      if (this.head === null) {
        this.head = node;
      }
      else {
          // 否则，找到链表尾部的元素，然后添加新元素
          let current = this.getElementAt(this.length - 1);
          current.next = node;
      }
      this.length++;
    } 
    insert (position, element) {// 在链表的指定位置插入节点
       // position不能超出边界值
      if (position < 0 || position > this.length) return false;
      let node = new Node(element);
      if (position === 0) {
          node.next = this.head;
          this.head = node;
      }
      else {
          let previous = this.getElementAt(position - 1);
          node.next = previous.next;
          previous.next = node;
      }
      this.length++;
      return true;
    } 
    removeAt (position) {// 删除链表中指定位置的元素，并返回这个元素的值
       // position不能超出边界值
      if (position < 0 || position >= this.length) return null;
      let current = this.head;
      if (position === 0) this.head = current.next;
      else {
          let previous = this.getElementAt(position - 1);
          current = previous.next;
          previous.next = current.next;
      }
      this.length--;
      return current.element;
    } 
    remove (element) {} // 删除链表中对应的元素
    indexOf (element) {// 在链表中查找给定元素的索引
      let current = this.head;
      for (let i = 0; i < this.length; i++) {
          if (current.element === element) return i;
          current = current.next;
      }
      return -1;
    } 
    isEmpty () { // 判断链表是否为空
      return this.length === 0;
    }
    size () {// 返回链表的长度
      return this.length;
    } 
    getHead () {// 返回链表的头元素
       return this.head;
    } 
    clear () { // 清空链表
      this.head = null;
      this.length = 0;
    }
    toString () {// 辅助方法，按指定格式输出链表中的所有元素，方便测试验证结果
      let current = this.head;
      let s = '';
      while (current) {
        let next = current.next;
        next = next ? next.element : 'null';
        s += `[element: ${current.element}, next: ${next}] `;
        current = current.next;
      }
      return s;
    } 
}

