# Redux 
## redux react代码实例（基本计数器）
  ```
    import React,{Component} from 'react';
    import {bindActionCreators} from '../redux';
    import store from '../store';
    import actions from '../store/actions/counter1';
    let boundActions = bindActionCreators(actions,store.dispatch);

    export default class Counter extends Component{
       state = {number:store.getState().counter1}
       componentDidMount(){
           this.unsubscribe = store.subscribe(()=>{
               //store.getState()={counter1:0,counter2:0}
               this.setState({number:store.getState().counter1});
           });
       }
       componentWillUnmount(){
        this.unsubscribe();
       }
       render(){
           return (
               <>
                 <p>{this.state.number}</p>
                 <button onClick={boundActions.increment}>+</button>
                 <button onClick={boundActions.decrement}>-</button>
               </>
           )
       }
    }
  ```
  ## createStore的自我实现代码
  +  isPlainObject 函数创建
  ```
    export default function isPlainObject(obj){
       if(typeof obj != 'object' || obj === null){
         return false;
       }
       return Object.getPrototypeOf(obj) === Object.prototype;
     /*   let xx = obj;
       while(Object.getPrototypeOf(xx)){//proto.__proto__.__proto__.__proto__ Object.prototype
        xx = Object.getPrototypeOf(xx);
       }
       return Object.getPrototypeOf(obj)  === xx; */
    }
  ```
  +  ActionTypes函数的实现
  ```
    const ActionTypes = {
        INIT:`@@redux/INIT`
    }
    export default ActionTypes;
  ```
  +   createStore创建
  ```
    import isPlainObject from "./utils/isPlainObject";
    import ActionTypes from "./utils/actionTypes";

    export default function createStore(reducer,preloadedState){
        if(typeof reducer != 'function'){
            throw new Error('reducer必须是一个函数');
        }
        let currentReducer = reducer;//当前的处理器
        let currentState = preloadedState;//当前状态
        let currentListeners = [];//定义一数组保存当前的监听函数
        function getState(){//返回当前状态
            return currentState;
        }
        
        function dispatch(action){//{type:'xx'}
            if(!isPlainObject(action)){
                throw new Error('action必须是一个纯对象');
            }
            if(typeof action.type =='undefined'){
                throw new Error('action的type属性不能是 undefined');
            }
            currentState = currentReducer(currentState,action);
            for(let i=0;i<currentListeners.length;i++){
                const listener = currentListeners[i];
                listener();
            }
            return action;
        }
        <!-- 订阅的返回值就是取消，如果不缓存返回值，就只有执行订阅步骤 -->
        function subscribe(listener){
            <!-- 执行订阅开始，赋值订阅标识符为true -->
            let subscribed = true;
            <!-- 将需要执行的方法，放入监听数组中 -->
            currentListeners.push(listener);
            <!-- 返回取消函数 -->
            return function unsubscribe(){
                 <!-- 判断是否已取消，及订阅标识符是否为false，如false直接return -->
                if(!subscribed) return ;
                <!-- 删除需要取消的监听函数 -->
                const index = currentListeners.indexOf(listener);    
                currentListeners.splice(index,1);
                <!-- 订阅标识符赋值false -->
                subscribed = false;
            }
        }
        <!-- 初始化action值 -->
        dispatch({type:ActionTypes.INIT});
        return {
            getState,
            dispatch,
            subscribe
            
        }
    }
  ```
## bindActionCreators函数的实现
  
  +  bindActionCreators是redux的一个API，作用是将单个或多个ActionCreator转化为
  +  dispatch(action)的函数集合形式。开发者不用再手动
  +  dispatch(actionCreator(type))，而是可以直接调用方法。
  +  目的就是简化书写，减轻开发负担。
    ```
    function bindActionCreator(actionCreator,dispatch){
        return function(){
            return dispatch(actionCreator.apply(this,arguments));
        }
    }
    export default function bindActionCreators(actionCreators,dispatch){
        if(typeof actionCreators == 'function'){
            return bindActionCreator(actionCreators,dispatch);
        }
        const boundActionCreators = {};
        for(const key in actionCreators){
            boundActionCreators[key] = bindActionCreator(actionCreators[key],dispatch);
        }
        return boundActionCreators;
    }
    ```
## combineReducers函数的实现
-  随着应用变得复杂，需要对 reducer 函数 进行拆分，拆分后的每一块独立负责管理 state 
-  的一部分。combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 
-  value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 
-  createStore。合并后的 reducer 可以调用各个子 reducer，并把它们的结果合并成一个 
-  state 对象。state 对象的结构由传入的多个 reducer 的 key 决定。
```
  <!-- 参数reducers是对象结构，key:子reducer函数 -->
  export default function(reducers){
    <!-- 首先reducers参数中key值 -->
    const reducerKeys = Object.keys(reducers);//['counter1','counter2']
    <!-- 返回一个合并后的reducer函数，参数state默认空，action共享 -->
    return function (state={},action){//state={counter1:0,counter:0}
      <!-- 定义合并后的state为nextState -->
      const nextState = {};//下一个状态对象
      for(let i=0;i<reducerKeys.length;i++){
          <!-- 获取key值 -->
          const key = reducerKeys[i];//counter1
          <!-- 根据key值获取各个reducer -->
          const reducer = reducers[key];//counter1
          <!-- 根据key值获取初始的状态值 -->
          const previousStateForKey = state[key];
          <!-- 根据初始状态值获得合并后的返回状态值 -->
          const nextStateForKey = reducer(previousStateForKey,action);
          <!-- 添加这个直到合并后的state中 -->
          nextState[key] = nextStateForKey;
      }
      return nextState;
    }
  }

  /**
  let reducers = combineReducers({
      counter1,//0
      counter2//0
  });
 */
```