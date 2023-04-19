var moveItem = document.getElementsByTagName('label');

for (let i = 0; i < moveItem.length; i++) {
    //动态设置label元素id
    moveItem[i].setAttribute('id', 'label' + i);
    moveItem[i].ondragstart = function (ev) {
        //dataTransfer.setData() 方法设置被拖数据的数据类型和值
        ev.dataTransfer.setData("id", this.id);
    };
}
document.getElementById('right').ondragover = function (ev) {
    ev.preventDefault(); //阻止向上冒泡
}
document.getElementById('right').ondragenter = function (ev) {
    ev.target.classList.add('over')
}
document.getElementById('right').ondragleave = function (ev) {
    ev.target.classList.remove('over')
}
document.getElementById('right').ondrop = function (ev) {
    ev.preventDefault();
    ev.target.classList.remove('over')
    var id = ev.dataTransfer.getData('id');
    var elem = document.getElementById(id); //当前拖动的元素
    var toElem = ev.toElement.id; //放置位置
    if (toElem == 'right') {
        //如果为container,元素放置在末尾
        this.appendChild(elem);
    } else {
        //如果为container里的元素，则插入该元素之前
        this.insertBefore(elem, document.getElementById(toElem));
    }
}

document.getElementById('left').ondragover = function (ev) {
    ev.preventDefault(); //阻止向上冒泡
}
document.getElementById('left').ondragenter = function (ev) {
    ev.target.classList.add('over')
}
document.getElementById('left').ondragleave = function (ev) {
    ev.target.classList.remove('over')
}
document.getElementById('left').ondrop = function (ev) {
    ev.preventDefault();
    ev.target.classList.remove('over')
    var id = ev.dataTransfer.getData('id');
    var elem = document.getElementById(id);
    var toElem = ev.toElement.id;
    if (toElem == 'left') {
        //如果为container,元素放置在末尾
        this.appendChild(elem);
    } else {
        //如果为container里的元素，则插入该元素之前
        this.insertBefore(elem, document.getElementById(toElem));
    }
}