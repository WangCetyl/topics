# 需要处理的action
```
  export default   {
      increment(){
          //store.dispatch({type:INCREMENT})
          return {type:types.INCREMENT};
      },
      decrement(){
          //store.dispatch({type:DECREMENT});
          return {type:types.DECREMENT};
      },
      //延时一秒加1
      asyncIncrement(){
          return function(dispatch,getState,amount){
              setTimeout(()=>{
                  dispatch({type:types.INCREMENT,payload:amount});
              },1000);
          }
      },
      promiseIncrement(){
          return {
              type:types.INCREMENT,
              payload:new Promise((resolve,reject)=>{
                 setTimeout(function(){
                      let result = Math.random();
                      if(result<0){
                          resolve({number:result});
                      }else{
                          reject({number:result});
                      }
                 },1000);
              })
          }
      },
      loadData(){
          return {
              type:'LOADDATA',
              payload:new Promise((resolve,reject)=>{
                 return fetch().then(res=>res.json());
              })
          }
      }
  }
```
# redux-thunk 中间件
```
  <!-- 由于action必须是一个纯对象(也就是这个对象直接指向Object.prototype),所以
       当需要异步执行action的时候，例如
       action = {
          increasment() {
            return {type:INCREASMENT}
          },
          asynIecreasement() {
             return () => {
                setTimeout(() => {
                  dispatch({type:INCREASMENT})
                },1000)
             }
          }
       }

       必须使用中间件预处理这个异步asynIecreasement，redux-thunk&promise
       &saga大量中间件出现了 
  -->
  function createThunkMiddleware(extraArgument){
     return ({dispatch,getState})=>next=>action=>{
        if(typeof action === 'function'){
          return action(dispatch,getState,extraArgument);
        }else{
            next(action);
        }
     }
  }
  const thunk = createThunkMiddleware();
  thunk.withExtraArgument = createThunkMiddleware;
  export default thunk;
```
# redux-promise 中间件
```
  function isPromise(obj){
    return !!obj&&(typeof obj == 'object' || typeof obj == 'function')&& (typeof obj.then == 'function')
  }
  export default function({dispatch,getState}){
    return next=>action=>{
      return isPromise(action.payload)?action.payload.then(result=>{
          dispatch({...action,payload:result});
      }).catch((error)=>{
          dispatch({...action,payload:error,error:true});
          return Promise.reject(error);
      }):next(action);
    }
  }
```