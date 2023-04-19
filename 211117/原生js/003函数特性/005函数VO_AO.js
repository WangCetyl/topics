/*
   全局对象
  在整个文件都是其作用域的范围
  顶层对象
  在浏览器环境指的是window对象，在Node指的是global对象联系在ES5中，顶层对象的属性与全局变量是等价的。
   VO：Variable Object的简写，就是变量对象。
   AO：Activation Object的简写，叫做活动对象。
   VO（变量对象）包含：函数的形参（arguments）、函数声明（FunctionDeclaration, FD）、
   变量声明（VariableDeclaration，var）三个内容。
*/

var x = 1
const h = 4 
let d = 44
function test(x,y) {
  const h1 = 4 
  let d1 = 144
  var x = 101
  function subtest(m) {
    var n = 14
    function sub2test(z) {
      return x + y + m + n + z + h1 + h+d1
    }
    return sub2test(8)
  }
  return subtest(7)
}

var w = test(11,24)
console.log(w);
/*
  解析步骤
  {
    1.在断点var x = 1前，所有var和函数申明的变量都已经创建，组成一个Global window对象,该对象中具体内容
      包括浏览器中所有内置属性，方法，也包括代码中的所需变量提升的变量，以及函数地址
      该window对象就是Global的VO
      本例中
      window： {
        x: undefined
        test: ƒ test(x,y)
          arguments: null
          caller: null
          length: 2
          name: "test"
          prototype: {constructor: ƒ}
          __proto__: ƒ ()
          [[FunctionLocation]]: 005函数VO_AO.js:17
          [[Scopes]]: Scopes[1]
           0: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
        w: undefined
        addEventListener: ƒ addEventListener()
        alert: ƒ alert()
        atob: ƒ atob()
        ..........
      }
      此时所有var 变量均为undefined，函数变量test已指向函数地址，函数地址(堆)中已经创建该函数的变量对象
        arguments:null
        caller:null
        length:2(形参个数)
        name:test
        prototype，
        以及作用域链数组
        [[Scopes]]:Scopes[1]。
  }
  {
    2.从第一行开始执行代码 在断点 var w = test(11,24)前window AO中x=1 赋值,
      同时根据ES6语法const let声明的对象开始创建，赋值，生成script VO对象
      Script:
        d: 44
        h: 4
      而函数test中的作用域数组添加了这个script变量对象
      test: ƒ test(x,y)
          arguments: null
          caller: null
          length: 2
          name: "test"
          prototype: {constructor: ƒ}
          __proto__: ƒ ()
          [[FunctionLocation]]: 005函数VO_AO.js:17
          [[Scopes]]: Scopes[2]
          0: Script {h: 4, d: 44}
          1: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
      其他未变
  }
  {
    3.从断点 var w = test(11,24)后，到函数test内 const h1 = 4; 函数test开执行，
      第三个作用域变量对象VO test生成,其中形参 x，y创建，并且被初始化赋值传入的11,24，注意尽管test还var变量x
      但是由于形参中已隐形创建，初始化了x，此时var中 x将覆盖形参中的x，但是还是保留原来的初始化值
      创建this 指向Window。
      test中的arguments对象初始化数据 
      arguments: Arguments(2) [11, 24, callee: ƒ, Symbol(Symbol.iterator): ƒ]
      内部的子函数subtest变量对象被创建，并且subtest中存在包含三个作用域变量对象的数组
      subtest: ƒ subtest(m)
        arguments: null
        caller: null
        length: 1
        name: "subtest"
        prototype: {constructor: ƒ}
        __proto__: ƒ ()
        [[FunctionLocation]]: 005函数VO_AO.js:21
        [[Scopes]]: Scopes[3]
        0: Closure (test) {y: 24, x: 11}
        1: Script {h: 4, d: 44}
        2: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
      this: Window
      x: 11
      y: 24
  }
  {
    4.在断点 return subtest(7)之前 添加 const let创建的新变量d1: 144  h1: 4，var的 x赋值101
      同时test(Closure)下的添加d1,h1,x,y的值。但是如果const let 申明的变量没有调用，该值不会出现在Closure
    Local
      d1: 144
      h1: 4
      subtest: ƒ subtest(m)
          arguments: null
          caller: null
          length: 1
          name: "subtest"
          prototype: {constructor: ƒ}
          __proto__: ƒ ()
          [[FunctionLocation]]: 005函数VO_AO.js:21
          [[Scopes]]: Scopes[3]
          0: Closure (test) {y: 24, x: 101, h1: 4, d1: 144}
          1: Script {h: 4, d: 44}
          2: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
      this: Window
      x: 101
      y: 24
  }
  {
    5.从断点 return subtest(7)后到 进入subtest函数内部的 var n = 14前，新的作用域变量对象subtest
      初始化完成，其中参数m 创建，初始化赋值，n是var申明 所以 提升，undefined。
      变量对象中 sub2test函数 创建，其中作用域变量对象有四层
   Local
      m: 7
      n: undefined
      sub2test: ƒ sub2test(z)
          arguments: null
          caller: null
          length: 1
          name: "sub2test"
          prototype: {constructor: ƒ}
          __proto__: ƒ ()
          [[FunctionLocation]]: 005函数VO_AO.js:23
          [[Scopes]]: Scopes[4]
          0: Closure (subtest) {m: 7, n: undefined}
          1: Closure (test) {y: 24, x: 101, h1: 4, d1: 144}
          2: Script {h: 4, d: 44}
          3: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
      this: Window
  }
  {
    6 在断点return x + y + m + n + z + h1 + h+d1 前 sub2test函数中隐式变量z 创建，初始化 z=8,
      Local
        this: Window
        z: 8
      Closure (subtest)
        m: 7
        n: 14
      Closure (test)
        d1: 144
        h1: 4
        x: 101
        y: 24
        Script
        d: 44
        h: 4
      Script
        d: 44
        h: 4
      Global
  }
  {
    7.在sub2test return 完成后 变为 在下一步 该执行上下文栈 回收 消除
      Local
        Return value: 306
        this: Window
        z: 8
      Closure (subtest)
        m: 7
        n: 14
      Closure (test)
        d1: 144
        h1: 4
        x: 101
        y: 24
        Script
        d: 44
        h: 4
      Script
        d: 44
        h: 4
      Global
  }
  {
    8.断点 return sub2test(8)后
     Local
        Return value: 306
        m: 7
        n: 14
        sub2test: ƒ sub2test(z)
        this: Window
     Closure (test)
        d1: 144
        h1: 4
        x: 101
        y: 24
        Script
        d: 44
        h: 4
      Script
        d: 44
        h: 4
      Global
  }
  {
    9.断点return subtest(7)后
    Local
      Return value: 306
      d1: 144
      h1: 4
      subtest: ƒ subtest(m)
      arguments: null
      caller: null
      length: 1
      name: "subtest"
      prototype: {constructor: ƒ}
      __proto__: ƒ ()
      [[FunctionLocation]]: 005函数VO_AO.js:21
      [[Scopes]]: Scopes[3]
      0: Closure (test) {y: 24, x: 101, h1: 4, d1: 144}
      1: Script {h: 4, d: 44}
      2: Global {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
      this: Window
      x: 101
      y: 24
    Script
      d: 44
      h: 4
    Global
  }
  {
    10 最后一步console.log(w)执行后 ，此时只有 Script中的const let变量，以及
        Global,只有等到浏览页面关闭后变量对象消失
    Script
        d: 44
        h: 4
    Window
    Global
  }

*/
