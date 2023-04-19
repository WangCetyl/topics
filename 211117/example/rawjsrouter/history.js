
function gorouter(config={'page': 1},title='page1',path) {
    history.pushState(config,title,path)
}

window.onpopstate = function() {
    console.log(window.location)
    console.log(history.length)
    
}

setTimeout(gorouter,1000,'/page1')
setTimeout(gorouter,5000,{'page': 2},'page2','/page2')
setTimeout(gorouter,10000,{'page': 3},'page3','/page3')

let i = 0
function aaa() {
    aaaa.innerHTML = i
    i++
}
setTimeout(aaa,1000)
setTimeout(aaa,5000)
setTimeout(aaa,14000)

setTimeout(function() {
    aaaa.innerHTML = 'page3'
},10000)

