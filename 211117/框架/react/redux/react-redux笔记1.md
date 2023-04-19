# react-redux
## react-redux基本使用
```
  import React,{Component} from 'react';
  import actions from '../store/actions/counter';
  import {connect} from '../react-redux';
   class Counter extends Component{
     render(){
         console.log(this.props);
         return (
             <>
               <p>{this.props.number}</p>
               <button onClick={this.props.increment}>+</button>
               <button onClick={this.props.decrement}>-</button>
               <button onClick={this.props.asyncIncrement}>过一秒后加1</button>
               <button onClick={this.props.promiseIncrement}>promise加1</button>
             </>
         )
     }
  }
  //<button onClick={()=>this.props.dispatch({type:'INCREMENT'})}>INCREMENT</button>
  // {number:0}=> {number:0}将成为当前组件的属性对象
  //1 状态可能很大，但此组件用的很少。 2.可能需要增加或者 减少或者修改一些属性 
  //即使映射的会不会也会触发渲染,也是为了性能优化
  const mapStateToProps = state=>state;
  const mapDispatchToProps = (dispatch) => {
    return {
      increment: (...args) => dispatch(actions.increment(...args)),
      decrement: (...args) => dispatch(actions.decrement(...args))
    }
  }
  //conect负责连接仓库和组件
  export default connect(
      mapStateToProps,
      actions
  )(Counter);
```
## 手写react-redux基本代码
### 定义context 上下文传递数据
```
  import React from 'react';
  const ReduxContext = React.createContext(null);
  export default ReduxContext;
```
### 定义Provide
```
  import React, { Component } from 'react'
  import ReduxContext from './context';
  export default class Provider extends Component {
    render() {
      return (
        <ReduxContext.Provider value={{store:this.props.store}}>
          {this.props.children}
        </ReduxContext.Provider>
      )
    }
  }
```
### 定义connect
```
  import React,{Component} from 'react';
  import {bindActionCreators} from '../redux';
  import ReduxContext from './context';
  export default function(mapStateToProps,mapDispatchToProps){
     return function(WrappedComponent){
       return class extends Component{
            static contextType = ReduxContext
            constructor(props,context){
                super(props);//context={store:this.props.store}
                this.state = mapStateToProps(context.store.getState());
            }
            componentDidMount(){
                this.unsubcribe = this.context.store.subscribe(()=>{
                    this.setState(mapStateToProps(this.context.store.getState()));
                });
            }
            componentWillUnmount(){
              this.unsubcribe();
            }
            render(){
                 let actions={}
                if(typeof mapDispatchToProps == 'function'){
                  actions = mapDispatchToProps(this.context.store.dispatch);
                }else{
                  actions = bindActionCreators(mapDispatchToProps,this.context.store.dispatch);
                }
                
                return <WrappedComponent dispatch={this.context.store.dispatch} {...this.state} {...actions}/>
            }
       }
     }
  }
```
### index主文件
```
  import Provider from './Provider';
  import connect from './connect';
  export {
      Provider,
      connect
  }
```