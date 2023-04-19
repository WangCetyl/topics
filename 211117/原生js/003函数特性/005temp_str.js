

/*
  ES5中 字符串需要拼接
  ES6中 直接使用``来作为模板字符串

*/

var temp = "<h1>ES5中标签不能换行，如果换行需要使用+拼接</h1>" +
			"<p>换行了</p>"

const temp1 = `<h1>ES6中标签可以换行</h1>
				<p>换行了</p>
             `
/* 
    标签函数定义
    标签使您可以用函数解析模板字符串。
    标签函数的第一个参数包含一个字符串值的数组。其余的参数与表达式相关。
    最后，你的函数可以返回处理好的的字符串（或者它可以返回完全不同的东西，
    全看标签函数的处理）。用于该标签的函数的名称可以被命名为任何名字。
*/

let x = 'm', y= 'n';
function Price1(strings, x ,y ) {
    return {
        arg1:strings,
        x,
        y
    }
}

Price1`你是${x}hello${y}通知`
// {arg1: Array(3), x: "m", y: "n"}
//     arg1: (3) ["你是", "hello", "通知", raw: Array(3)]
//     x: "m"
//     y: "n"
/* strings 是一个数组,每一项就是 传入字符串模板中以${}为间隔的各个字符串  上例中就是 ["你是", "hello", "通知"*/
/* x,y 传入字符串模板中以${}中的值,根据${}的数量 来确定实际参数个数*/

function Price (strings, type) {
  let s1 = strings[0]
  const retailPrice = 20
  const wholeSalePrice = 16
  let showTxt
  if (type === 'retail') {
    showTxt = '购买单价是：' + retailPrice
  } else {
    showTxt = '购买的批发价是：' + wholeSalePrice
  }
  return `${s1}${showTxt}`
}

let showTxt = Price`您此次的${'retail'}`
console.log(showTxt)


const fn = function() {
  const [a,b,c,...rest] = [...arguments]
  return {
    a,
    b,
    c,
    rest
  }
}

let w = fn`中国${1}日本${2}印度${3}俄罗斯`
console.log(w)

/*
  {a: Array(4), b: 1, c: 2, rest: Array(1)}
    a: (4) ["中国", "日本", "印度", "俄罗斯", raw: Array(4)]
    b: 1
    c: 2
    rest: [3]
*/