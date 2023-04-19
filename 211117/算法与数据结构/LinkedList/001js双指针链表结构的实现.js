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
class DoubleLinkedList extends LinkedList.LinkedList {
  constructor() {
     super();
     this.tail = null;
  }
  append (element) {
     let node = new Node(element);

     // 如果链表为空，则将head和tail都指向当前添加的节点
     if (this.head === null) {
         this.head = node;
         this.tail = node;
     }
     else {
         // 否则，将当前节点添加到链表的尾部
         this.tail.next = node;
         node.prev = this.tail;
         this.tail = node;
     }

     this.length++;
  }
  getElementAt (position) {
     if (position < 0 || position >= this.length) return null;
     // 从后往前遍历
     if (position > Math.floor(this.length / 2)) {
         let current = this.tail;
         for (let i = this.length - 1; i > position; i--) {
             current = current.prev;
         }
         return current;
     }
     // 从前往后遍历
     else {
         return super.getElementAt(position);
     }
  }
  insert (position, element) {
     if (position < 0 || position > this.length) return false;

     // 插入到尾部
     if (position === this.length) this.append(element);
     else {
         let node = new Node(element);
         // 插入到头部
         if (position === 0) {
             if (this.head === null) {
                 this.head = node;
                 this.tail = node;
             }
             else {
                 node.next = this.head;
                 this.head.prev = node;
                 this.head = node;
             }
         }
         // 插入到中间位置
         else {
             let current = this.getElementAt(position);
             let previous = current.prev;
             node.next = current;
             node.prev = previous;
             previous.next = node;
             current.prev = node;
         }
     }
     this.length++;
     return true;
  }
  removeAt (position) {
     // position不能超出边界值
     if (position < 0 || position >= this.length) return null;

     let current = this.head;
     let previous;

     // 移除头部元素
     if (position === 0) {
         this.head = current.next;
         this.head.prev = null;
         if (this.length === 1) this.tail = null;
     }
     // 移除尾部元素
     else if (position === this.length - 1) {
         current = this.tail;
         this.tail = current.prev;
         this.tail.next = null;
     }
     // 移除中间元素
     else {
         current = this.getElementAt(position);
         previous = current.prev;
         previous.next = current.next;
         current.next.prev = previous;
     }
     this.length--;
     return current.element;
  }
  getTail () {
     return this.tail;
  }

  clear () {
     super.clear();
     this.tail = null;
  }

  toString () {
     let current = this.head;
     let s = '';

     while (current) {
         let next = current.next;
         let previous = current.prev;
         next = next ? next.element : 'null';
         previous = previous ? previous.element : 'null';
         s += `[element: ${current.element}, prev: ${previous}, next: ${next}] `;
         current = current.next;
     }

     return s;
  }
}

