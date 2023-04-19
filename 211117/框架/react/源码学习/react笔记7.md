# React render props
## Javascript中渲染属性
-  redner props 是指一种在React 组件之间使用一个值为函数的prop共享代码的简单技术
-  具有render props的组件接收一个函数，该函数返回一个React元素，并且调用塔而不是
-  实现自己的渲染逻辑
-  render prop是一个用于告知组件需要渲染什么内容的函数props
## 代码实例
-  MouseTracker类的实现
```
import React, { Component } from 'react'
export default class MouseTracker extends Component {
    constructor() {
        super();
        this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event)=>{
        this.setState({
            x:event.clientX,
            y:event.clientY
        });
    }
    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.children(this.state)}
            </div>
        )
    }
}
```
- Picture类组件代码
```
import React,{Component} from 'react';
export default class Picture extends Component {
    render() {
        return (
            <>
                <img src="http://localhost:3000/bg.jpg"/>
                <p>当前鼠标的位置是 x={this.props.x} y={this.props.y}</p>
            </>
        )
    }
}
```
- 所有类似Picture的，且需要MouseTracker功能的组件 传入即可
```
  import React from 'react';
  import ReactDOM from 'react-dom';
  import MouseTracker from './components/MouseTracker'
  import Picture from './components/Picture'
  ReactDOM.render(
    <MouseTracker>
      {
        (value) => <Picture {...value}>
      }
    <MouseTracker/>
    ,document.getElementById('root'));
  //render props
```
- render props的最后包装实现
```
  import React from 'react';
  import ReactDOM from 'react-dom';
  import MouseTracker from './components/MouseTracker'
  import Picture from './components/Picture'
  ReactDOM.render(
    <MouseTracker render = {(value) => <Picture {...value}>}/>
    ,document.getElementById('root'));
  //render props
 <!-- 此时MouseTracker组件中的render() 函数 经过修改如下-->
  render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        )
    }
```
- HOC的方式改写MouseTraker
```
import React,{Component} from 'react';
import MouseTracker from './MouseTracker';
function withMouseTracker(Comp){
   return props=><MouseTracker render={data=><Comp {...props} {...data}/>}/>;
}
class Picture extends Component {
    render() {
        return (
            <>
                <img src="http://localhost:3000/bg.jpg"/>
                <p>当前鼠标的位置是 x={this.props.x} y={this.props.y}</p>
            </>
        )
    }
}
export default withMouseTracker(Picture);
```
```
import React, { Component } from 'react'

export default class MouseTracker extends Component {
    constructor() {
        super();
        this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event)=>{
        this.setState({
            x:event.clientX,
            y:event.clientY
        });
    }
    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        )
    }
}

```
```
import React from 'react';
import ReactDOM from 'react-dom';
import Picture from './components/Picture'
ReactDOM.render(<Picture/>, document.getElementById('root'));
```