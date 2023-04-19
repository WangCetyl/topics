let hasval = window.location.hash

function hashrouter(hasval) {
  if(hasval ==='#a'){
    id.innerHTML = '这里是#a的hash路由' 
  }else if(hasval ==='#b') {
    id.innerHTML = '这里是#b的hash路由' 
  }else {
    id.innerHTML = '没有这个路由' 
  }
}
hashrouter(hasval)
// let aDom = document.getElementsByTagName('a')
window.addEventListener('hashchange',()=>{
  hasval = window.location.hash
  hashrouter(hasval)
});