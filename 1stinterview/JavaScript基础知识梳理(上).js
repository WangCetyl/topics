本文作者: 董沅鑫
原文链接: https://godbmw.com/passages/2019-03-26-javascript-first/
版权声明: 本博客所有文章除特别声明外, 均采用 CC BY-NC-SA 4.0 许可协议. 转载请注明出处!


JavaScript基础知识梳理(上)

 内容速览 👇

普通函数和箭头函数的this
原始数据类型及其判断和转化方法
深浅拷贝及实现
JS事件模型
常见的高阶函数
普通函数和箭头函数的this
还是一道经典题目，下面的这段代码的输出是什么？（为了方便解释，输出放在了注释中）

function fn() {
  console.log(this); // 1. {a: 100}
  var arr = [1, 2, 3];

  (function() {
    console.log(this); // 2. Window
  })();

  // 普通 JS
  arr.map(function(item) {
    console.log(this); // 3. Window
    return item + 1;
  });
  // 箭头函数
  let brr = arr.map(item => {
    console.log("es6", this); // 4. {a: 100}
    return item + 1;
  });
}
fn.call({ a: 100 });

其实诀窍很简单，常见的基本是3种情况：es5普通函数、es6的箭头函数以及通过bind改变过上下文返回的新函数。

① es5普通函数：

函数被直接调用，上下文一定是window
函数作为对象属性被调用，例如：obj.foo()，上下文就是对象本身obj
通过new调用，this绑定在返回的实例上
② es6箭头函数： 它本身没有this，会沿着作用域向上寻找，直到global / window。请看下面的这段代码：


function run() {
  const inner = () => {
    return () => {
      console.log(this.a)
    }
  }

  inner()()
}

run.bind({a: 1})() // Output: 1

③ bind绑定上下文返回的新函数：就是被第一个bind绑定的上下文，而且bind对“箭头函数”无效。请看下面的这段代码：

function run() {
  console.log(this.a)
}

run.bind({a: 1})() // output: 1

// 多次bind，上下文由第一个bind的上下文决定
run
  .bind({a: 2})
  .bind({a: 1})
  () // output: 2

最后，再说说这几种方法的优先级：new > bind > 对象调用 > 直接调用

至此，这道题目的输出就说可以解释明白了。

原始数据类型和判断方法
题目：JS中的原始数据类型？

ECMAScript 中定义了 7 种原始类型：

Boolean
String
Number
Null
Undefined
Symbol（新定义）
BigInt（新定义）
注意：原始类型不包含Object和Function

题目：常用的判断方法？

在进行判断的时候有typeof、instanceof。对于数组的判断，使用Array.isArray()：

typeof：

typeof基本都可以正确判断数据类型
typeof null和typeof [1, 2, 3]均返回”object”
ES6新增：typeof Symbol()返回”symbol”
instanceof：

专门用于实例和构造函数对应

function Obj(value){ 
    this.value = value; 
}
let obj = new Obj("test");
console.log(obj instanceof Obj); // output: true

判断是否是数组：[1, 2, 3] instanceof Array

Array.isArray()：ES6新增，用来判断是否是’Array’。Array.isArray({})返回false。

原始类型转化
当我们对一个“对象”进行数学运算操作时候，会涉及到对象 => 基础数据类型的转化问题。

事实上，当一个对象执行例如加法操作的时候，如果它是原始类型，那么就不需要转换。否则，将遵循以下规则：

调用实例的valueOf()方法，如果有返回的是基础类型，停止下面的过程；否则继续
调用实例的toString()方法，如果有返回的是基础类型，停止下面的过程；否则继续
都没返回原始类型，就会报错
请看下面的测试代码：

let a = {
  toString: function() {
    return 'a'
  }
}

let b = {
  valueOf: function() {
    return 100
  },
  toString: function() {
    return 'b'
  }
}

let c = Object.create(null) // 创建一个空对象

console.log(a + '123') // output: a123
console.log(b + 1) // output: 101
console.log(c + '123') // 报错

除了valueOf和toString，es6还提供了Symbol.toPrimitive供对象向原始类型转化，并且它的优先级最高！！稍微改造下上面的代码：

let b = {
  valueOf: function() {
    return 100
  },
  toString: function() {
    return 'b'
  },
  [Symbol.toPrimitive]: function() {
    return 10000
  }
}

console.log(b + 1) // output: 10001

最后，其实关于instanceof判断是否是某个对象的实例，es6也提供了Symbol.hasInstance接口，代码如下：

class Even {
  static [Symbol.hasInstance](num) {
    return Number(num) % 2 === 0;
  }
}

const Odd = {
  [Symbol.hasInstance](num) {
    return Number(num) % 2 !== 0;
  }
};

console.log(1 instanceof Even); // output: false
console.log(1 instanceof Odd); // output: true

深拷贝和浅拷贝
题目：实现对象的深拷贝。

在JS中，函数和对象都是浅拷贝（地址引用）；其他的，例如布尔值、数字等基础数据类型都是深拷贝（值引用）。

值得提醒的是，ES6的Object.assign()和ES7的...解构运算符都是“浅拷贝”。实现深拷贝还是需要自己手动撸“轮子”或者借助第三方库（例如lodash）：

手动做一个“完美”的深拷贝函数：https://godbmw.com/passages/2019-03-18-interview-js-code/

借助第三方库：jq的extend(true, result, src1, src2[ ,src3])、lodash的cloneDeep(src)

JSON.parse(JSON.stringify(src))：这种方法有局限性，如果属性值是函数或者一个类的实例的时候，无法正确拷贝

借助HTML5的MessageChannel：这种方法有局限性，当属性值是函数的时候，会报错

<script>
  function deepClone(obj) {
    return new Promise(resolve => {
      const {port1, port2} = new MessageChannel();
      port2.onmessage = ev => resolve(ev.data);
      port1.postMessage(obj);
    });
  }

  const obj = {
    a: 1,
    b: {
      c: [1, 2],
      d: '() => {}'
    }
  };

  deepClone(obj)
    .then(obj2 => {
      obj2.b.c[0] = 100;
      console.log(obj.b.c); // output: [1, 2]
      console.log(obj2.b.c); // output: [100, 2]
    })
</script>

JS事件流
事件冒泡和事件捕获
事件流分为：冒泡和捕获，顺序是先捕获再冒泡。

事件冒泡：子元素的触发事件会一直向父节点传递，一直到根结点停止。此过程中，可以在每个节点捕捉到相关事件。可以通过stopPropagation方法终止冒泡。

事件捕获：和“事件冒泡”相反，从根节点开始执行，一直向子节点传递，直到目标节点。

addEventListener给出了第三个参数同时支持冒泡与捕获：默认是false，事件冒泡；设置为true时，是事件捕获。

<div id="app" style="width: 100vw; background: red;">
  <span id="btn">点我</span>
</div>
<script>
  // 事件捕获：先输出 "外层click事件触发"; 再输出 "内层click事件触发"
  var useCapture = true;
  var btn = document.getElementById("btn");
  btn.addEventListener(
    "click",
    function() {
      console.log("内层click事件触发");
    },
    useCapture
  );

  var app = document.getElementById("app");
  app.onclick = function() {
    console.log("外层click事件触发");
  };
</script>


DOM0级 和 DOM2级
DOM2级：前面说的addEventListener，它定义了DOM事件流，捕获 + 冒泡。

DOM0级：

直接在html标签内绑定on事件
在JS中绑定on系列事件
注意：现在通用DOM2级事件，优点如下：

可以绑定 / 卸载事件
支持事件流
冒泡 + 捕获：相当于每个节点同一个事件，至少2次处理机会
同一类事件，可以绑定多个函数
常见的高阶函数
没什么好说的，跑一下下面的代码就可以理解了：

// map: 生成一个新数组，遍历原数组，
// 将每个元素拿出来做一些变换然后放入到新的数组中
let newArr = [1, 2, 3].map(item => item * 2);
console.log(`New array is ${newArr}`);

// filter: 数组过滤, 根据返回的boolean
// 决定是否添加到数组中
let newArr2 = [1, 2, 4, 6].filter(item => item !== 6);
console.log(`New array2 is ${newArr2}`);

// reduce: 结果汇总为单个返回值
// acc: 累计值; current: 当前item
let arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current);
const sum2 = arr.reduce((acc, current) => acc + current, 100);
console.log(sum); // 6
console.log(sum2); // 106
































