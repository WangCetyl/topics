/*
  设二叉树的根节点所在层数为1，层序遍历就是从所在二叉树的根节点出发，
  首先访问第一层的树根节点，然后从左到右访问第2层上的节点，
  接着是第三层的节点，以此类推，自上而下，自左至右逐层访问树的结点的过程就是层序遍历。
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
    const LevelOrder =(bt,forEachArr=[]) => {
        forEachArr.push(bt)
        while(forEachArr.length) {
            let temp = forEachArr.shift()
            if(temp) {
                console.log(temp.value)
            }
            if(temp.left) {
                forEachArr.push(temp.left)
            } 
            if(temp.right) {
                forEachArr.push(temp.right)
            }
        }
    }
    LevelOrder(btree)
}

{
    const LevelOrder2 =(bt) => {
        const createLevelOrderqune = (bt,forEachArr=[]) => {
            forEachArr.push(bt)
            while(bt.left) {
                // console.log(bt.left)
                return createLevelOrderqune(bt.left,forEachArr)
            }
            return forEachArr
        }
        const LevelOrderquen = createLevelOrderqune(bt,[])
        // console.log(LevelOrderquen)
        let i = 0
        while(LevelOrderquen.length) {
            let temp = LevelOrderquen.shift()
            if(i===0&&temp.value) {
                console.log(temp.value)
            }
            if(temp.left){
                console.log(temp.left.value)
            }
            if(temp.right){
                console.log(temp.right.value)
            }
            i++
        }
    }
    // console.log(LevelOrder2(btree))
}