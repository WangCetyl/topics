/*
  树是计算机科学中经常用到的一种数据结构。树是一种非线性的数据结构，以分层的方式存储数据。树被用来存储
  具有层级关系的数据，比如文件系统中的文件；树还被用来存储有序列表。从本篇开始，将会实现一种特殊的树——
  二叉树。
  二叉树具有诸多优点。相对于链表来说，二叉树在进行查找时速度非常快，而相对于数组来说，为二叉树添加或删除
  元素也非常快。
  二叉树是一种特殊的树，表现在它的子节点个数不超过两个。且二叉树的子树有左右之分，其次序不能任意颠倒。
  在实现二叉树时，采用的存储结构为链式存储结构，链式结构的意思是采用一个链表来存储一颗二叉树，二叉树中
  每一个节点用链表的一个节点来存储，在二叉树中，节点结构至少有三个域：数据域data，左指针域left，右指
  针域right，如下图所示：
*/

{
    let arr
    arr = [1,2,3,4,5,6,7,8,9,10,11,12]
    //1 节点
    class Node {
        constructor(value){
            this.value = value
            this.left = null 
            this.right = null 
        }
    }
    //2.树  考虑到树的形成多种多样，这里首先实现完全二叉树
    /*
      完全二叉树的特点：叶子结点只能出现在最下层和次下层，且最下层的叶子结点集中在树的左部。需要注意的
      是，满二叉树肯定是完全二叉树，而完全二叉树不一定是满二叉树。 [1]
     */
    const logFun = (n) => {
      //对数的换底公式 log2 a =(lna/ln2)
      return Math.ceil(Math.log(n)/Math.log(2))
    }


    const BTree = (arr,bt=null) => {
      //将所有数值节点化 数组
      const nodesArr = arr.map(item => new Node(item))
      console.log(nodesArr)
      //将数组换算为二叉树的层数
      const n = logFun(nodesArr.length)
      //计算二叉树节点遍历的数量，一直到倒数第二层，也就是最后一层之上的所有节点都要遍历赋值
      const forNum = Math.pow(2,n-1)
      bt = nodesArr[0]
      for(let i = 0;i <= forNum;i++) {
        //如果一个二叉树的节点为编号(索引)为n，其两个子二叉树的标号是2n 2n+1
        //相对于数组的索引，二叉树索引从1开始，这样第一层的1两个子树编号为2,3；
        //第二层的左子树编号2 它的子树编号为2*2=4 2*2+1 =5，右子树编号3，其子树编号为2*3=6，2*3+1=7
        //第三层第一左子树编号为4子树为4*2=8 4*2+1=9  以此类推
        //由于数组编号比bt编号小一 所以赋值的时候需要减一
        if(nodesArr[2*(i+1)-1]&&nodesArr[2*(i+1)-1]!=undefined){
          nodesArr[i].left =nodesArr[2*(i+1)-1]
        }else {
          break
        }
        if(nodesArr[2*(i+1)]&&nodesArr[2*(i+1)!=undefined]){
          nodesArr[i].right =nodesArr[2*(i+1)]
        }else {
          break
        }
      }
      return bt
    }

    console.log(BTree(arr))
}
