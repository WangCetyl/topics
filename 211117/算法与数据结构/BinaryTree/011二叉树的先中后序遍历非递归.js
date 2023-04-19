/*
  二叉树前 中 后 序遍历。
  所谓的排序是按照父节点的访问情况而定
  前/先    根-左-右
  中       左-根-右
  后       左-右-根
  非递归的情况是使用 栈(先进后出)或者队列(先进先出)将所需执行方程压入栈在取出访问
*/

const btree = {
    value:1,
    left:{
        value:2, 
        left:{
            value:4,
            left:{
                value:8
            },
            right:null
        }, 
        right:{
            value:5,
            left:null,
            right:{
                value:9
            }

        }
    },
    right:{
        value:3, 
        left:{
            value:6,
            left:null, 
            right:null
        }, 
        right:{
            value:7,
            left:{
                value:10,
                left:null,
                right:null
            }, 
        }
    }
}
/*
                                                        1
                                2                                                      3
                      4                    5                               6                          7
               8             null    null        9                 null          null           10      null      

*/
// console.dir(btree)

{
    /*preOrder 前序  先根节点，后左支前序操作，后右支前序操作*/

    let preOrder = (bt) => {
        let foStack = [bt]//定义一个栈，先将根压入栈
        //通过控制栈的压入压出，来循环
        while(foStack.length) {
            let item = foStack.pop()
            if(item) {
                //先访问根节点
                console.log(item.value)
                //由于栈是先进后出，先将后操作的右支压入，后将左支压入
                if(item.right) {
                    foStack.push(item.right)
                }
                if(item.left) {
                    foStack.push(item.left)
                }
            }
        }
    }

    preOrder(btree)//1,2,4,8,5,9,3,6,7,10
    console.log('-------------------------------------------------------')
}
{
    /*inOrder 中序  先左支中序操作，再根节点，最后右支中序操作*/
    let inOrder = (bt) => {
        let iostack = [bt.right,bt.value,bt.left]
        while(iostack.length) {
            let item = iostack.pop()
            if(item&&!item.right&&!item.left){
                console.log(item.value||item)
            }
            else if(item) {
                if(item.right) {
                    iostack.push(item.right)
                }
                iostack.push(item.value)
                if(item.left) {
                    iostack.push(item.left)
                }
            }
        }
    }
    console.time('inOrder')
    inOrder(btree)//8,4,2,5,9,1,6,3,10,7
    console.timeEnd('inOrder')
    console.log('-------------------------------------------------------')
}

{
    const inorder2 = (root) => {
        if (!root) { return; }
        const stack = [];
        let p = root;
        while (stack.length || p) {
            while (p) {
                stack.push(p);
                p = p.left;
            }
            const n = stack.pop();
            console.log(n.value);
            p = n.right;
        }
    };
    console.time('inorder2')
    inorder2(btree)
    console.timeEnd('inorder2')
    console.log('-------------------------------------------------------')
}
{
    /*postOrder 后序  先左支后序操作，再右支后序操作，最后根节点，*/

    let postOrder = (bt) => {
        let postack = [bt.value,bt.right,bt.left]
        while(postack.length) {
            let item = postack.pop()
            if(item&&!item.right&&!item.left){
                console.log(item.value||item)
            }
            else if(item) {
                postack.push(item.value)
                if(item.right) {
                    postack.push(item.right)
                }
                if(item.left) {
                    postack.push(item.left)
                }
            }
        }
       
    }
    console.time('postOrder')
    postOrder(btree)//8,4,9,5,2,6,10,7,3,1
    console.timeEnd('postOrder')
    console.log('-------------------------------------------------------')
}
{
    const postorder = (root) => {
        if (!root) { return; }
        const outputStack = [];
        const stack = [root];
        while (stack.length) {
            const n = stack.pop();
            outputStack.push(n);
            if (n.left) stack.push(n.left);
            if (n.right) stack.push(n.right);
        }
        while(outputStack.length){
            const n = outputStack.pop();
            console.log(n.value);
        }
    };

    console.time('postorder')
    postorder(btree);
    console.timeEnd('postorder')
}