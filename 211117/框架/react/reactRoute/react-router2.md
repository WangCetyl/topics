# react-router 主要API代码实现
## Link 组件
```
  import React from 'react';
  import RouterContext from './context';
  export default class Link extends React.Component{
      static contextType = RouterContext
      render(){
          return (
            <!-- 如果仅仅hash路由以免即可 -->
            <!-- <a href={`#${this.props.to}`}>{this.props.children}</a> -->
              <a {...this.props} onClick={()=>this.context.history.push(this.props.to)} >{this.props.children}</a>
          )
      }
  }
```
## Switch 组件
```
  import React from 'react';
  import pathToRegexp from 'path-to-regexp';
  import RouterContext from './context';
  export default class Switch extends React.Component{
      static contextType = RouterContext
      render(){
         let {pathname} = this.context.location; //当前地址栏中的路径
         let children = Array.isArray(this.props.children)?this.props.children:[this.props.children];
         for(let i=0;i<children.length;i++){
             let child = children[i];
             let {path='/',exact=false} = child.props;
             let paramNames = [];
             let regexp = pathToRegexp(path,paramNames,{end:exact});
             let result = pathname.match(regexp);
             if(result){
               return child;// a 组件类型  b 组件的实例 c 虚拟DOM=d React元素
             }
         } 
         return null;
      }
  }
```
##  Redirect 组件
```
  import React from 'react';
  import RouterContext from './context';
  export default class Redirect extends React.Component{
      static contextType = RouterContext
      render(){
          this.context.history.push(this.props.to);
          return null;
      }
  }
```
## withRoute 实现
```
  import React from 'react'
  import Route from './Route';

  export default function(WrappedComponent){
      return props=><Route component={WrappedComponent}/>
  }
```
## Prompt 代码实现
```
  import React from 'react';
  import RouterContext from './context';
  export default class Prompt extends React.Component{
      static contextType = RouterContext
      componentWillUnmount(){
          this.context.history.block(null);
      }
      render(){
           let history = this.context.history;//从上下文中获取历史对象
           const {when,message} = this.props;
           if(when){
               history.block(message);
           }else{
               history.block(null);
           }
          return null;
      }
  }
```
## 路由守护 protected
```
  import React from 'react';
  import {Route,Redirect} from '../react-router-dom';
  //rest = {path:profile,exact:true}
  <!-- 目的为登录状态 才能够浏览某些页面。使用render-props来复用Route组件
       使用render属性后，在函数中进行判断是否登录。如果已经登录，直接渲染
       当前pathname的组件，如果没有，首先按跳转到Login组件，登录，同时将
       当前pathname的信息以状态的形式保存下来，
   -->

  export default function({component:Component,...rest}){
    return (
        <Route {...rest} render={
            props=>localStorage.getItem('login')?<Component {...props}/>:<Redirect to={{pathname:'/login',state:{from:props.location.pathname}}}/>
        }/>
    )
  }
```
## 路由高亮
```
  import React from 'react';
  import {Route,Link} from '../react-router-dom';
  import   './MenuLink.css'
  //这个菜单相对于Link多了一个功能，如果当前地址栏中的路径和自己匹配的话，则加一个漂亮的背景色
  //在Route要想指定渲染的内容有三种方式 component render children
  //component render只要在路径匹配的时候才会渲染，否则不渲染
  //children不管路径 匹配不匹配都会渲染
  export default function({to,exact,children}){
     return (
         <Route path={to} exact={exact} children={
           props=>{
               return <Link className={props.match?'active':''} to={to}>{children}</Link>;
           }
         } />
     )
  }
```