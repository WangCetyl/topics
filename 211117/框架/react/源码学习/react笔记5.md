# React Purecomponent&Memo
## Purecomponent
-  实例代码
```
  import React, { Component} from 'react'
  import  PureComponent from './PureComponent';

  class Counter extends PureComponent{
      render(){
          console.log('Counter render')
          return <div>{this.props.number}</div>
      }
  }
  export default class App extends PureComponent {
    constructor(props){
      super();
      this.state = {title:'计数器',number:0};
      this.inputRef = React.createRef();
    }
    add = ()=>{
        this.setState({
          number:this.state.number+parseInt(this.inputRef.current.value)
        });
    }
    render() {
      console.log('App render')
      return (
        <div>
          <Title title={this.state.title}/>
          <Counter number={this.state.number}/>
          <input ref={this.inputRef}/>
          <button onClick={this.add}>+</button>
        </div>
      )
    }
  }

  class Title1 extends PureComponent{
      render(){
          console.log('Title render')
          return <div>{this.props.title}</div>
      }
  }
  function Title(props){
      console.log('Title render ')
      return <div>{props.title}</div>
  }
  function memo(FuncComponent){
    return class  extends PureComponent{
        render(){
            return <FuncComponent {...this.props}/>
        }
    }
  }
  function memo2(FuncComponent){
      return class  extends PureComponent{
          render(){
              return FuncComponent(this.props);
          }
      }
    }
  Title = memo2(Title);
```
## 自我实现Purecompent
```
  import React, { Component } from 'react'

  export default class PureComponent extends Component {
    isPureComponent = true
    //传入新的属性对象和状态对象，然后返回一个是否需要更新的boolean值
    shouldComponentUpdate(nextProps,nextState){
       return !shallowEqual(this.props,nextProps)||!shallowEqual(this.state,nextState);
    }
  }

  //浅比较 比较obj1和obj2是否相等，如果相等的话则返回true,不相等返回false,只比较第一层
  function shallowEqual(obj1,obj2){
    if(obj1 === obj2){
      return true;
    }
    if(typeof obj1 !='object' || obj1 === null ||typeof obj2 !='object' || obj2 === null){
      return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if(keys1.length != keys2.length){
      return false;
    }
    for(let key of keys1){
        if(!obj2.hasOwnProperty(key) || obj1[key]!=obj2[key]){
          return false;
        }
        /* if(obj2.hasOwnProperty(key)){
            if(obj1[key] != obj2[key]){
              if(typeof obj1[key] == 'object' && typeof obj2[key] == 'object'){
                  return shallowEqual(obj1[key],obj2[key]);
              }
            }
        }else{
            return false;
        } */
    }
    return true;
  }
```
## 自我实现Memo
```
  function memo(FuncComponent){
  return class  extends PureComponent{
        render(){
            return <FuncComponent {...this.props}/>
        }
    }
  }
  function memo2(FuncComponent){
    return class  extends PureComponent{
        render(){
            return FuncComponent(this.props);
        }
    }
  }
```
