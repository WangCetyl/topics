/*
  输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
  例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，
  则重建二叉树并返回
*/

{ //思路  前（后）序来判断根节点值，中序来切割判断左右子树
  let preOrderArr 
  let inOrderArr 
      // preOrderArr = [1,2,4,8,5,9,3,6,7,10]
      // inOrderArr = [8,4,2,5,9,1,6,3,10,7]
      preOrderArr = [1,2]
      inOrderArr = [2,1]
  console.log(preOrderArr)
  console.log(inOrderArr)
  //1 节点
  class Node {
      constructor(value){
          this.value = value
          this.left = null 
          this.right = null 
      }
  }

  const recoverBTree = (preOrderArr,inOrderArr,bt=null) => {
    //获取整个树的根节点值，也就是前序结果的第一个值
    if(preOrderArr.length===0||inOrderArr.length===0) return bt
    const rootValue = preOrderArr.shift()
    //创建节点
    bt = new Node(rootValue)
    //找出中序中根节点值的位置
    const rootIndex = inOrderArr.indexOf(rootValue)
    //以该节点为中心，在中序数组中切割，不含根节点值，左边就是左子树，右边就是右子树
    const inOrderArrLeft = inOrderArr.slice(0,rootIndex)
    const inOrderArrRight = inOrderArr.slice(rootIndex+1,inOrderArr.length)
    //同时切割前序数组，根节点已经shift(),按照inOrderLeft，inOrderRight的长度从头部切去
    const preOrderArrLeft = preOrderArr.slice(0,inOrderArrLeft.length)
    const preOrderArrRight = preOrderArr.slice(inOrderArrLeft.length,preOrderArr.length)
    //将原前序中序数组清零 回收
    preOrderArr=inOrderArr=[]

    //判断，切割后的左右中序数组，如果长度为0 说明该子树为null，如果只有一个值，则该子树的指针指向
    //new Node(数组唯一的值)，否则就再次递归切割数组
    if(inOrderArrLeft.length===0) {
      bt.left = null
    }else if (inOrderArrLeft.length===1) {
      bt.left = new Node(inOrderArrLeft[0])
    }else {
      bt.left = recoverBTree(preOrderArrLeft,inOrderArrLeft,bt.left)
    }

    if(inOrderArrRight.length===0) {
      bt.right = null
    }else if (inOrderArrRight.length===1) {
      bt.right = new Node(inOrderArrRight[0])
    }else {
      bt.right = recoverBTree(preOrderArrRight,inOrderArrRight,bt.right)
    }
    return bt
    // console.log(preOrderArrLeft,preOrderArrRight)
    // console.log(inOrderArrLeft,inOrderArrRight)

  }
  let res = recoverBTree (preOrderArr,inOrderArr,bt=null)
  console.log(res)
  let postOrder = (bt) => {
    //判断边界
    if(!bt) return 
    //先左支后序操作 
    postOrder(bt.left)
    //接着右支后序操作 
    postOrder(bt.right)
    //最后根节点
    console.log(bt.value)
  }

  postOrder(res)
}

