#React16源码解析(三)-ExpirationTime
React源码解析系列文章欢迎阅读：  
[React16源码解析(一)- 图解Fiber架构](https://segmentfault.com/a/1190000020736966)  
[React16源码解析(二)-创建更新](https://segmentfault.com/a/1190000020736982)  
[React16源码解析(三)-ExpirationTime](https://segmentfault.com/a/1190000020736992)  
[React16源码解析(四)-Scheduler](https://segmentfault.com/a/1190000020737020)  
[React16源码解析(五)-更新流程渲染阶段1](https://segmentfault.com/a/1190000020737050)  
[React16源码解析(六)-更新流程渲染阶段2](https://segmentfault.com/a/1190000020737054)  
[React16源码解析(七)-更新流程渲染阶段3](https://segmentfault.com/a/1190000020737059)  
[React16源码解析(八)-更新流程提交阶段](https://segmentfault.com/a/1190000020737069)  
正在更新中...

在我的上篇文章中，ReactDOM.render过程中的updateContainer函数里面有个计算到期时间的函数：

```
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  // 这里传入了currentTime和当前的Fiber对象调用了这个计算expirationTime的函数
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```

在上篇文章讨论的setState和forceUpdate中同样的也要计算expirationTime，这篇文章就来分析expirationTime是如何计算的。

## 为什么需要ExpirationTime？

React16带来的最振奋人心的改动就是Fiber架构，改变了之前react的组件渲染机制，新的架构使原来同步渲染的组件现在可以异步化，可中途中断渲染，执行更高优先级的任务。释放浏览器主线程。

所以每一个任务都会有一个优先级，不然岂不是会乱套了..... ExpirationTime就是优先级，它是一个过期时间。

## computeExpirationForFiber

在计算ExpirationTime之前调用了requestCurrentTime得到了一个currentTime。这个函数里面牵扯了一些复杂的关于后面知识的逻辑，我们先不深究，大家就先理解为一个当前时间类似的概念。

```
function computeExpirationForFiber(currentTime: ExpirationTime, fiber: Fiber) {
  let expirationTime;
    // ......
    if (fiber.mode & ConcurrentMode) {
      if (isBatchingInteractiveUpdates) {
        // 交互引起的更新 
        expirationTime = computeInteractiveExpiration(currentTime);
      } else {
        // 普通异步更新
        expirationTime = computeAsyncExpiration(currentTime);
      }
    } 
    // ......
  }
  // ......
  return expirationTime;
}
```

在异步更新中，这里我们看到有两种计算更新的方式。computeInteractiveExpiration和computeAsyncExpiration

## computeInteractiveExpiration

```
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,//150
    HIGH_PRIORITY_BATCH_SIZE,//100
  );
}
```

## computeAsyncExpiration

```
export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;

export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,//5000
    LOW_PRIORITY_BATCH_SIZE,//250
  );
}
```

## computeExpirationBucket

查看上面两种方法，我们发现其实他们调用的是同一个方法：computeExpirationBucket，只是传入的参数不一样，而且传入的是常量。computeInteractiveExpiration传入的是150、100，computeAsyncExpiration传入的是5000、250。说明前者的优先级更高。那么我把前者称为高优先级更新，后者称为低优先级更新。

下面来看computeExpirationBucket方法的具体内容：

```
const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET +
    ceiling(
      currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}
```

看完之后，一脸懵。它在搞什么？别急，我们把公式整理一下：  
以低优先级更新为例，最终的公式是：((((currentTime - 2 + 5000 / 10) / 25) | 0) + 1) \* 25

其中只有只有currentTime是变量。

我们可以多试几个值看看：

```
((((101 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 600
((((102 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 625
((((105 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 625
((((122 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 625
((((126 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 625
((((127 - 2 + 5000 / 10) / 25) | 0) + 1) * 25 // 650
```

简单来说，最终结果是以25为单位向上增加的，比如说我们输入102 - 126之间，最终得到的结果都是625，但是到了127得到的结果就是650了，这就是除以25取整的效果。  
即，低优先级更新的expirationTime间隔是25ms，抹平了25ms内计算过期时间的误差，React让两个相近（25ms内）的得到update相同的expirationTime，目的就是让这两个update自动合并成一个Update，从而达到批量更新。

注：这里如果用高优先级更新去尝试多组数据，你会发现expirationTime间隔是10ms。

文章如有不妥，欢迎指正~