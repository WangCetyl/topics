# React HOC 高阶组件
## Javascript中高阶组件的定义
-  高阶函数  把函数传入一个函数，返回一个新的函数 
-  高阶函数 jS中的函数要比一般语言中高级一些，其它语言Java是不能把函数作为
-  其它 函数的参数传递的，也不能把函数作为返回值
-  函数可以做为方法的参数和返回值

## 实例 Superinput
-  包裹函数代码1
```
  import React from 'react';
  export default function (Component, name) {
      return class extends React.Component {
          constructor() {
              super();
              this.state = {val: ''};
          }
          componentDidMount() {
              this.setState({
                  val: localStorage.getItem(name)
              });
          }
          render() {
              return <Component {...this.props} val={this.state.val}/>
          }
      }
  }
```
-  包裹函数代码2
```
  import React from 'react';
  export default function (Component) {
      //从属性对象中接收到了一个val属性，存放着英文名，调用接口取得中文名，然后作为value属性传给了Component
      return class extends React.Component {
          constructor() {
              super();
              this.state = {value: ''};
          }
          componentDidMount() {
             fetch('http://localhost:3000/translation.json').then(response=>response.json()).then(result=>{
             debugger;    
             this.setState({value:result[this.props.val]});
             })
             //{"zhangsan":"张三","lisi":"李四"}
          }
          render() {
              return <Component {...this.props} value={this.state.value}/>
          }
      }
  }
```
-  需要包裹的用户名组件
```
  import React, { Component } from 'react'
  import withLocal from './withLocal';
  import withAjax from './withAjax';
  class UserNameInput extends Component {
    render() {
      return (
        <input defaultValue={this.props.value}/>
      )
    }
  }
  //高阶组件的多层嵌套也是hooks解决的问题之一
  let UserNameInputWithAjax=withAjax(UserNameInput);
  let UserNameInputWithLocal=withLocal(UserNameInputWithAjax,'username');
  export default UserNameInputWithLocal;
```
-  需要包裹的邮件名组件
```
  import React, { Component } from 'react'
  import withLocal from './withLocal';
   class EmailInput extends Component {
    render() {
      return (
        <input defaultValue={this.props.value}/>
      )
    }
  }
  export default withLocal(EmailInput,'email');
```