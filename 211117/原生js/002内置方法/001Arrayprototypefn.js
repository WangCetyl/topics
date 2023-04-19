/*
    数组扁平换

 */

{
    let arr = [12,3,5,[3,54,6,57,6,[5,[4]],7],[43,[5],46]]
    Array.prototype.myFlat = function () {
        let result = []
        let _this = this
        function A(arr) {
            for(let i=0;i<arr.length;i+=1) {
                  if(Array.isArray(arr[i])) {
                    A(arr[i])
                    continue
                }else {
                    result = [...result,arr[i]]
                }
            }
        }
        A(_this)
        return result
    }
    console.log('myflat',arr.myFlat())
}
