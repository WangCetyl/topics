/*
	所谓私有数据，就是所只有函数内部可以访问的数据，或对象内部的方法可以访问的数据
*/

function createPerson() {
	var __name__ = "";
	return {
		get_Name: function () {return __name__},
		set_Name: function (value) {
			if(value.charAt(0)==="王") {
				__name__ = value
			}else {
				return new Error("输入的姓不对，请从新输入")
			}
		}
	}
	
	
}

var p = new createPerson()//注意如果函数返回的是一个对象，new 和不加new运算符结果都一样，但是本质不同，new后面是实例，不加new表示获得结果