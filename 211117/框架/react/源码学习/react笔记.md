#   1.什么是React？  
- React是一个用于构建用户界面的JavaScript库 核心专注于视图，实现组件化
#   2.组件化的好处
#   3.jsx语法的本质
```
    import React from 'react'
    import ReactDom from 'react-dom'

    //element的定义以下两个是等价的
    const element = '<h1 className='root1'>这里是标题</h1>'
    const element = React.creatElement('h1',{className:root1},'这里是标题')'
    ReactDom.render(element, document.getElementById('root'))
```
-   jsx 本质是React.creatElemnt()函数,该函数有三个以上参数，第一个是标签类型(tag)
-   第二个参数是标签的属性集合（对象），第三及以上个是子元素.
-   该函数会返回一个普通的js对象，也就是react元素，又叫虚拟dom，vdom
-   {
    +   type:'h1',
    +   props:{
        *   'className':'root1',
        *   'children':'这里是标题'
    +   }
-   }
#   4.组件  
##  我们把页面分为若干个独立的部分，单独编写，单独维护
-   1.一个返回普通React元素的函数就是一个合法的React组件 
-   2.组件需要并且只能返回一个React根元素 
-   3.组件名称必须大写字母开头 
```
    //函数组件 函数组件没有实例，直接返回props中的值，所有无需this.props只是一个形参
    function Hello(props) {//收集属性对象props是，将之传入Hello函数，并得到一个返回的React元素
        return <h1> hello {props.name }</h1>
    }
    //类组件 
    class Hello extends React.Component {
        constructor(props) {//实例化类组件的时候，将props挂到 //this.props上，所以获取值只能是this.props
            super(props)
        }
        render() {//调用render方法，返回react元素
            <h1> hello {this.props.name}</h1>
        }
    }
    let w = {className:'hello',id:'root2',age:1,name:'lewis'}
    ReactDom.render(<Hello {...w} />,document.getElementById('root))
```
#   5.手写React.createElment函数 
```
    class Component{
        static isReactComponent = true
        constructor(props){
            this.props = props;
        }
    }
    function ReactElement(type,props){
      const element = {type,props};//Welcome1
      return element;
    }
    function createElement(type,config={},children){
        let propName;
        const props = {};
        for(propName in config){
            props[propName] = config[propName];
        }
        //props.children = Array.from(arguments).slice(2);
        
        const childrenLength = arguments.length - 2;
        if(childrenLength==1){
            props.children = children;
        }else if(childrenLength>1){
            props.children = Array.from(arguments).slice(2);
        }
        
        return ReactElement(type,props);
    }
    export default {createElement,Component};
```
#   6.手写ReactDom。render函数
```
    //element参数可以是一个字符串，数字，可是一个常规对象，也可以是一个react组件(函数，类组件)
    function render(element,parentNode){

        //如果element是字符串或者数字，直接使用creatTextNode()函数，插入到父节点上去
        if(typeof element == 'string'||typeof element == 'number'){
           return  parentNode.appendChild(document.createTextNode(element));
        }
        let type,props;
        type = element.type;//Welcome1
        props = element.props;
        //如果是类组件
        if(type.isReactComponent){
            let returnedElement = new type(props).render();
            type = returnedElement.type;//"h1"
            props = returnedElement.props;//{id:'welcome'}
        }else if(typeof type == 'function'){//如果是函数组件
            let returnedElement = type(props);
            type = returnedElement.type;//"h1"
            props = returnedElement.props;//{id:'welcome'}
        }
        let domElement = document.createElement(type);//span
        for(let propName in props){
            //处理特殊类型className直接给className赋值
            if(propName == 'className'){
                domElement.className = props[propName];
            }else if(propName == 'style'){//处理style类型
                let styleObj = props[propName];// {color: 'red',fontSize: '50px'}
                //for(let attr in styleObj){
                //    domElement.style[attr] = styleObj[attr];
               // } fontSize=>font-size
                //['color','fontSize']=>['color:red','fontSize:50px']=>'color:red;fontSize:50px'
                let cssText = Object.keys(styleObj).map(attr=>{
                     return `${attr.replace(/([A-Z])/g,function(){return "-"+arguments[1].toLowerCase()})}:${styleObj[attr]}`;
                 }).join(';');
                domElement.style.cssText = 'color:red;font-size:50px';
            }else if(propName == 'children'){
                //let children = Array.isArray(props.children)?props.children:[props.children];
                props.children.forEach(child=>render(child,domElement));
            }else{
                domElement.setAttribute(propName,props[propName]);
            }
        }
        parentNode.appendChild(domElement);
        //componentDidMount
    }
    export default {render}
```
#   7，纯函数特点
-   1.不能改变入参的值 
-   2.也不能改变函数作用域之外的变量值 
-   3.纯函数返回的结果是根据入参确定的，确定了参数，就确定了返回结果。不能改变返回值  
#   8.状态 
-   1.组件的数据来源有两个地方，分别是属性对象和状态对象
-   2.属性是父组件传递过来的(默认属性，属性校验)
-   3.状态是自己内部的，改变状态唯一的方式就是setState
-   4.属性和状态的变化都会引起数据变化，视图变换
#   9. react绑定事件中的this
-   1.在constructor 中 this.eventfn = this.eventfn.bind(this)
-   2.定义 eventfn时候使用箭头函数 const eventfn = () => {}
-   3.在组件的标签中使用 onClick = {() => this.eventfn}
#   10. react中setState函数
-   1.this.setState({num：num+1})参数可以是一个对象，此时异步时候会合并对象，只执
-   行一次，例如同时设置两个，但页面显示还是加了1，智慧执行最后一个
-   2.this.setState((num) => num+1)参数可以是一个函数，此时可以同步更改，
-   如果设置两个这个时候后结果就是2
#   11.ref的三种实现方式 
-   1.ref='numA' 
-   2.ref= instance  => this.numA = instance 
-   3.this.numA = createRef()

```
    class Sum extends React.Component{
      add = ()=>{
        let numA = this.refs.numA.value;
        let numB = this.refs.numB.value;
        let result = parseFloat(numA)+parseFloat(numB);
        this.refs.result.value = result;
      }
      render(){
        return (
          <>
           <input ref="numA"/>+<input ref="numB"/><button onClick={this.add}>=</button><input ref="result"/>
          </>
        )
      }
    }
    class Sum2 extends React.Component{
      add = ()=>{
        let numA = this.numA.value;
        let numB = this.numB.value;
        let result = parseFloat(numA)+parseFloat(numB);
        this.result.value = result;
      }
      render(){
        return (
          <>
           <input ref={inst=>this.numA = inst}/>+<input ref={inst=>this.numB = inst}/><button onClick={this.add}>=</button><input ref={inst=>this.result = inst}/>
          </>
        )
      }
    }
    function createRef(){
      return {current:null}
    }
    class Sum3 extends React.Component{
      constructor(props){
        super(props);
        this.numA = createRef();//{current:numAInput}
        this.numB = createRef();//{current:numBInput}
        this.result = createRef();//{current:resultInput}
      }
      add = ()=>{
        let numA = this.numA.current.value;
        let numB = this.numB.current.value;
        let result = parseFloat(numA)+parseFloat(numB);
        this.result.current.value = result;
      }
      render(){
        return (
          <>
           <input ref={this.numA}/>+<input ref={this.numB}/><button onClick={this.add}>=</button><input ref={this.result}/>
          </>
        )
      }
    }
    ReactDOM.render(<Sum3/>,document.getElementById('root'));
```
#   12.react forward ref的使用
-   https://reactjs.org/docs/forwarding-refs.html
-   1.函数组件没有实例，但是ref属性是注册在实例上的。所有有了forwardRef来帮助
-   函数组件传递ref属性
```
    //Consider a FancyButton component that renders the native button DOM //element:

    function FancyButton(props) {
      return (
        <button className="FancyButton">
          {props.children}
        </button>
      );
    }

    //In the example below, FancyButton uses React.forwardRef to obtain the //ref passed to it, and then forward it to the DOM button that it renders:
    const FancyButton = React.forwardRef((props, ref) => (
      <button ref={ref} className="FancyButton">
        {props.children}
      </button>
    ));

    // You can now get a ref directly to the DOM button:
    const ref = React.createRef();
    <FancyButton ref={ref}>Click me!</FancyButton>;
```
-   This way, components using FancyButton can get a ref to the underlying
-   button DOM node and access it if necessary—just like if they used a DOM
-   button directly.
-   Here is a step-by-step explanation of what happens in the above example:
-   1.We create a React ref by calling React.createRef and assign it to a ref
-   variable.
-   2.We pass our ref down to <FancyButton ref={ref}> by specifying it 
-   as a JSX attribute.
-   3.React passes the ref to the (props, ref) => ... function inside
-   forwardRef as a second argument.
-   4.We forward this ref argument down to <button ref={ref}> by specifying it
-    as a JSX attribute.
-   5.When the ref is attached, ref.current will point to the <button> DOM node
