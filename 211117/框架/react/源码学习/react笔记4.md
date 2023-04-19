# React context(上下文)
## 前置基础Prop-Types
```
  import React, { Component } from 'react'
  import PropTypes from 'prop-types';
  let props = {
      name:'zhangsan',//字符串 必填 
      age:18,//数字 必填，而且不能小于18岁
      gender:'男',//只能是男 或者女
      isMarried:true,//是否已婚 这是一个布尔值
      hobby:['smoking','drinking'],//字符串数组
      position:{x:100,y:100} //拥有x y属性的对象
    }
  export default class Person extends Component {
    //默认值设置
    static defaultProps = {
        isMarried:false
    }  
    static propTypes = {
        name:PropTypes.string.isRequired,
        age:PropTypes.number.isRequired,
        gender:PropTypes.oneOf(['男','女']),
        isMarried:PropTypes.bool,
        hobby:PropTypes.arrayOf(PropTypes.string),
        position:PropTypes.shape({
            x:PropTypes.number,
            y:PropTypes.number
        }),
        //age大于18岁的要求，需要自定义属性才实现
        age(props,propName,componentName){
          if(props[propName]<18){
              return new Error(`Invalid Prop ${propName} supplied to 
                ${componentName}`);
          }
        }
    }  
    render() {
      return (
        <div>
            name:{this.props.name}
        </div>
      )
    }
  }

```
## 旧版上下文
<!-- ![avatar](./生命周期函数.png) -->
<!-- ![Alt text](./生命周期函数.png) -->
```
  import React, { Component } from 'react'
  import PropTypes from 'prop-types';
  class Header extends Component {
      //定义子上下文对象的属性和类型
      static childContextTypes = {
          name:PropTypes.string,
          age:PropTypes.number
      }
      //返回或者说定义真正的子上下文
      getChildContext(){
          return {
              age:10,
              name:'Header' 
          }
      }
      render() {
          console.log(this.context)
          return <div style={{ border: '5px solid green', padding: '5px' }}>
              
              <Title></Title>
          </div>
      }
  }
  class Title extends Component {
      //表示或者 说指定我要获取哪些上下文对象
      static contextTypes = {
          color: PropTypes.string,
          name:PropTypes.string,
          age:PropTypes.number
      }
      render() {
          console.log(this.context)
          return <div style={{ border: '5px solid orange', padding: '5px',color:this.context.color }}>
              Title
          </div>
      }
  }
  class Main extends Component {
      render() {
          return <div style={{ border: '5px solid blue', padding: '5px' }}>
              Main
              <Content></Content>
          </div>
      }
  }
  class Content extends Component {
      static contextTypes = {
          color: PropTypes.string,
          name:PropTypes.string,
          age:PropTypes.number,
          setColor:PropTypes.func
      }
      render() {
          return <div style={{ border: '5px solid pink', padding: '5px',color:this.context.color }}>
              Content
              <button onClick={()=>this.context.setColor('red')}>变红</button>
              <button onClick={()=>this.context.setColor('green')}>变绿</button>
          </div>
      }
  }
  export default class Page extends Component {

      constructor() {
          super();
          this.state = { color: 'gray'};
      }
      //定义子上下文对象的属性和类型
      static childContextTypes = {
          name:PropTypes.string,
          color:PropTypes.string,
          setColor: PropTypes.func
      }
      //返回或者说定义真正的子上下文
      getChildContext(){
          return {
              color:this.state.color,
              setColor:this.setColor,
              name:'Page' 
          }
      }
      setColor = (color)=>{
          this.setState({color});
      }
      render() {
          return (
              <div style={{ border: '5px solid red', padding: '5px' }}>
                  Page
                  <Header>
                      <Title>

                      </Title>
                  </Header>
                  <Main>
                      <Content>

                      </Content>
                  </Main>
              </div>
          )
      }
  }

```
## 新版上下文
<!-- ![avatar](./生命周期函数.png) -->
<!-- ![Alt text](./生命周期函数.png) -->
```
  import React, { Component } from 'react'
  import PropTypes from 'prop-types';
  //import ThemeContext from '.../ThemeContext';
  var REACT_CONTEXT_TYPE =  Symbol.for('react.context') ;
  var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
  //const ThemeContext = React.createContext();
  const ThemeContext = createContext();
  console.log('ThemeContext',ThemeContext)
  //ThemeContext={Provider,Consumer}
  function createContext(){
      class Provider extends Component{
          static value;
          $$typeof=REACT_PROVIDER_TYPE
          constructor(props){
              super(props);
              Provider.value = props.value;
              this.state = {value:props.value}
          }
          static getDerivedStateFromProps(props, state) {
              Provider.value = props.value;
              return {value:props.props};
          }
          render(){
              return this.props.children;
          }
      }
      class Consumer extends Component{
          render(){
              return this.props.children(Provider.value);
          }
      }
      return {$$typeof: REACT_CONTEXT_TYPE,Provider,Consumer}
  }
  class Header extends Component {
      render() {
          console.log(this.context)
          return <div style={{ border: '5px solid green', padding: '5px' }}>
                    <Title></Title>
                </div>
      }
  }
  class Title1 extends Component {
      static contextType = ThemeContext
      render() {
          this.context = Title.contextType.Provider.value;
          console.log(this.context)
          return <div style={{ border: '5px solid orange', padding: '5px', color: this.context.color }}>
              Title
          </div>
      }
  }
  function Title (props){
      return (
          <ThemeContext.Consumer>
             {
                 value=>(
                  <div style={{ border: '5px solid orange', padding: '5px', color: value.color }}>
                      Title
                  </div>
                 )
             }
          </ThemeContext.Consumer>
      )
  }
  class Main extends Component {
      render() {
          return <div style={{ border: '5px solid blue', padding: '5px' }}>
              Main
              <Content></Content>
          </div>
      }
  }
  class Content extends Component {
      static contextType = ThemeContext
      render() {
          this.context = Content.contextType.Provider.value;
          return <div style={{ border: '5px solid pink', padding: '5px', color: this.context.color }}>
              Content
              <button onClick={() => this.context.setColor('red')}>变红</button>
              <button onClick={() => this.context.setColor('green')}>变绿</button>
          </div>
      }
  }
  function Content1(){
      return (
          <ThemeContext.Consumer>
              {
                  value=>(
                      <div style={{ border: '5px solid pink', padding: '5px', color: value.color }}>
                          Content
                          <button onClick={() => value.setColor('red')}>变红</button>
                          <button onClick={() => value.setColor('green')}>变绿</button>
                      </div>
                  )
              }
          </ThemeContext.Consumer>
      )
  }
  export default class Page extends Component {
      constructor() {
          super();
          this.state = { color: 'red' };
      }
      setColor = (color) => {
          this.setState({ color });
      }
      render() {
          let ctx = {color:this.state.color,setColor:this.setColor};
          return (
              <ThemeContext.Provider value={ctx}>
                   <div style={{ border: '5px solid red', padding: '5px' }}>
                      Page
                      <Header>
                          <Title>

                          </Title>
                      </Header>
                      <Main>
                          <Content>

                          </Content>
                      </Main>
                  </div>
              </ThemeContext.Provider>
             
          )
      }
  }

```