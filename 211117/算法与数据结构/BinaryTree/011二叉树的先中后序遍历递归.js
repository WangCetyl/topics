/*
  二叉树前 中 后 序遍历。
  所谓的排序是按照父节点的访问情况而定
  前/先    根-左-右
  中       左-根-右
  后       左-右-根
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
            right:null
        }
    }
}
/*
                                                        1
                                2                                                      3
                      4                    5                               6                          7
               8             null    null        9                 null          null           10      null      

*/
console.dir(btree)

{
    /*firstOrder 前序  先根节点，后左支前序操作，后右支前序操作*/

    let firstOrder = (bt) => {
        //判断边界
        if(!bt) return 
        //先根节点
        console.log(bt.value)
        //接着左支前序操作 
        firstOrder(bt.left)
        //最后右支前序操作 
        firstOrder(bt.right)
    }

    firstOrder(btree)//1,2,4,8,5,9,3,6,7,10
    console.log('-------------------------------------------------------')
}
{
    /*inOrder 中序  先左支中序操作，再根节点，最后右支中序操作*/

    let inOrder = (bt) => {
        //判断边界
        if(!bt) return 
        //先左支中序操作 
        inOrder(bt.left)
        //在根节点
        console.log(bt.value)
        //最后右支中序操作 
        inOrder(bt.right)
    }

    inOrder(btree)//8,4,2,5,9,1,6,3,10,7
    console.log('-------------------------------------------------------')
}
{
    /*postOrder 后序  先左支后序操作，再右支后序操作，最后根节点，*/

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

    postOrder(btree)//8,4,9,5,2,6,10,7,3,1
    console.log('-------------------------------------------------------')
}