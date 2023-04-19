
#React16源码解析(四)-Scheduler
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

在 React16源码解析(二)-创建更新 这篇文章的最后，三种类型的更新最后都调用 scheduleWork 进入了任务调度。

```

scheduleWork(current, expirationTime)
```

## 设计思想

1、React将所有任务按照过期时间从小到大排列，数据结构采用双向循环链表。  
2、任务链表的执行准则：当前帧先执行浏览器的渲染等任务，如果当前帧还有空闲时间，则执行任务，直到当前帧的时间用完。如果当前帧已经没有空闲时间，就等到下一帧的空闲时间再去执行。注意，如果当前帧没有空闲时间但是当前任务链表有任务到期了或者有立即执行任务，那么必须执行的时候就以丢失几帧的代价，执行这些任务。执行完的任务都会被从链表中删除。

## 核心功能

1、维护时间片  
2、模拟浏览器 requestldleCallback API  
3、调度列表和超时判断

## 基础知识

阅读本文需要具备的基础知识：  
1、window.requestAnimationFrame  
2、window.MessageChannel  
3、链表操作

不会的童鞋可以先去了解哦~ 我这里就不详细介绍了。

## 进入正题 开始解读

![avatar](./ReactScheduler.png)


我们从之前的scheduleWork讲起。

### 全局变量

这里面用到了大量的全局变量，我在这里进行罗列，下面的讲解遇到全局变量可以到这里来查看：

```
isWorking：commitRoot和renderRoot开始都会设置为true，然后在他们各自阶段结束的时候都重置为false。用来标志是否当前有更新正在进行，不区分阶段。

nextRoot：用于记录下一个将要渲染的root节点

nextRenderExpirationTime：下一个要渲染的任务的ExpirationTime

firstScheduledRoot & lastScheduledRoot：用于存放有任务的所有root的单列表结构。在findHighestPriorityRoot用来检索优先级最高的root，在addRootToSchedule中会修改。

callbackExpirationTime & callbackID：callbackExpirationTime记录请求ReactScheduler的时候用的过期时间，如果在一次调度期间有新的调度请求进来了，而且优先级更高，那么需要取消上一次请求，如果更低则无需再次请求调度。callbackID是ReactScheduler返回的用于取消调度的 ID。

nextFlushedRoot & nextFlushedExpirationTime：用来标志下一个需要渲染的root和对应的expirtaionTime，注意：通过findHighestPriorityRoot找到最高优先级的，通过flushRoot会直接设置指定的，不进行筛选
```

### scheduleWork（计划任务）

我们更新完 fiber的 updateQueue之后，就调用 scheduleWork 开始调度这次的工作。scheduleWork 主要的事情就是找到我们要处理的 root设置刚才获取到的执行优先级，然后调用 requestWork。

1、找到更新对应的FiberRoot节点（scheduleWorkToRoot）按照树的结构通过fiber.return一层层的返回，直到找到根节点。在向上找的过程中不断的更新每个节点对应的fiber对象的childExpirationTime。并且alternate同步更新。  
注：childExpirationTime子树中最高优先级的expirationTime。

2、存在上一个任务，并且上一个执行没有执行完，执行权交给了浏览器，发现当前更新的优先级高于上一个任务，则重置stack（resetStack）  
注：resetStack会从nextUnitOfWork开始一步一步往上恢复，可以说前一个任务执行的那一半白做了~因为现在有更高优先级的任务来插队了！你说气不气，但是世界就是这么残忍。

3、OK上面的2符合条件之后，如果现在不处于render阶段，或者nextRoot !== root，则作为享受vip待遇的任务可以请求调度了：requestWork。  
注：如果正在处于render阶段，我们就不需要请求调度了，因为render阶段会处理掉这个update。

```
function scheduleWork(fiber: Fiber, expirationTime: ExpirationTime) {
  // 获取FiberRoot
  const root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) {
    return;
  }

  // 这个分支表示高优先级任务打断低优先级任务
  // 这种情况发生于以下场景：有一个优先级较低的任务（必然是异步任务）没有执行完，
  // 执行权交给了浏览器，这个时候有一个新的高优先级任务进来了
  // 这时候需要去执行高优先级任务，所以需要打断低优先级任务
  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime < nextRenderExpirationTime
  ) {
    // 记录被谁打断的
    interruptedBy = fiber;
    // 重置 stack
    resetStack();
  }
  // ......
  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime;
    // 请求任务
    requestWork(root, rootExpirationTime);
  }

  // 在某些生命周期函数中 setState 会造成无限循环
  // 这里是告知你的代码触发无限循环了
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    // Reset this back to zero so subsequent updates don't throw.
    nestedUpdateCount = 0;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a ' +
        'component repeatedly calls setState inside ' +
        'componentWillUpdate or componentDidUpdate. React limits ' +
        'the number of nested updates to prevent infinite loops.',
    );
  }
}
```

### requestWork（请求任务）

1、将Root加入到Schedule（addRootToSchedule），如果此root已经调度过（已经在scheduledRoot的单向链表中），可能更新root.expirationTime。  
它维护了一条 scheduledRoot 的单向链表，比如说 lastScheduleRoot == null，意味着我们当前已经没有要处理的 root，这时候就把 firstScheduleRoot、lastScheduleRoot、root.nextScheduleRoot 都设置为 root。如果 lastScheduleRoot !== null，则把 lastScheduledRoot.nextScheduledRoot设置为root，等 lastScheduledRoot调度完就会开始处理当前 root。

2、是否是同步任务？是：performSyncWork 否：scheduleCallbackWithExpirationTime

```
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  // 将Root加入到Schedule，更新root.expirationTime
  addRootToSchedule(root, expirationTime);
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }

  // 判断是否需要批量更新
  // 当我们触发事件回调时，其实回调会被 batchedUpdates 函数封装一次
  // 这个函数会把 isBatchingUpdates 设为 true，也就是说我们在事件回调函数内部
  // 调用 setState 不会马上触发 state 的更新及渲染，只是单纯创建了一个 updater，然后在这个分支 return 了
  // 只有当整个事件回调函数执行完毕后恢复 isBatchingUpdates 的值，并且执行 performSyncWork
  // 想必很多人知道在类似 setTimeout 中使用 setState 以后 state 会马上更新，如果你想在定时器回调中也实现批量更新，
  // 就可以使用 batchedUpdates 将你需要的代码封装一下
  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    // 判断是否不需要批量更新
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, true);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  // 判断优先级是同步还是异步，异步的话需要调度
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    // 函数核心是实现了 requestIdleCallback 的 polyfill 版本
    // 因为这个函数浏览器的兼容性很差
    // 具体作用可以查看 MDN 文档 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
    // 这个函数可以让浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，
    // 而且不会对像动画和用户交互这样延迟敏感的事件产生影响
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}

function addRootToSchedule(root: FiberRoot, expirationTime: ExpirationTime) {
  // Add the root to the schedule.
  // Check if this root is already part of the schedule.
  // 判断 root 是否调度过
  if (root.nextScheduledRoot === null) {
    // This root is not already scheduled. Add it.
    // root 没有调度过
    root.expirationTime = expirationTime;
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
      root.nextScheduledRoot = root;
    } else {
      lastScheduledRoot.nextScheduledRoot = root;
      lastScheduledRoot = root;
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
    }
  } else {
    // This root is already scheduled, but its priority may have increased.
    // root 已经调度过，判断是否需要更新优先级
    const remainingExpirationTime = root.expirationTime;
    if (
      remainingExpirationTime === NoWork ||
      expirationTime < remainingExpirationTime
    ) {
      // Update the priority.
      root.expirationTime = expirationTime;
    }
  }
}
```

### scheduleCallbackWithExpirationTime

1、如果有一个callback已经在调度（callbackExpirationTime !== NoWork ）的情况下，优先级大于当前callback（expirationTime > callbackExpirationTime），函数直接返回。如果优先级小于当前callback，就取消它的callback（cancelDeferredCallback(callbackID)）

2、计算出timeout然后scheduleDeferredCallback(performAsyncWork, {timeout})

```
function scheduleCallbackWithExpirationTime(
  root: FiberRoot,
  expirationTime: ExpirationTime,
) {
  // 判断上一个 callback 是否执行完毕
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    // 当前任务如果优先级小于上个任务就退出
    if (expirationTime > callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      // 否则的话就取消上个 callback
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    // 没有需要执行的上一个 callback，开始定时器，这个函数用于 devtool
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;
  // 当前 performance.now() 和程序刚执行时的 performance.now() 相减
  const currentMs = now() - originalStartTimeMs;
  // 转化成 ms
  const expirationTimeMs = expirationTimeToMs(expirationTime);
  // 当前任务的延迟过期时间，由过期时间 - 当前任务创建时间得出，超过时代表任务过期需要强制更新
  const timeout = expirationTimeMs - currentMs;
  // 生成一个 callbackID，用于关闭任务
  callbackID = scheduleDeferredCallback(performAsyncWork, {timeout});
}
```

### scheduleDeferredCallback

scheduleDeferredCallback 函数在是：Scheduler.js中的unstable\_scheduleCallback  
1、创建一个任务节点newNode，按照优先级插入callback链表  
2、我们把任务按照过期时间排好顺序了，那么何时去执行任务呢？怎么去执行呢？答案是有两种情况，1是当添加第一个任务节点的时候开始启动任务执行，2是当新添加的任务取代之前的节点成为新的第一个节点的时候。因为1意味着任务从无到有，应该 立刻启动。2意味着来了新的优先级最高的任务，应该停止掉之前要执行的任务，重新从新的任务开始执行。上面两种情况就对应ensureHostCallbackIsScheduled方法执行的两种情况。

```
function unstable_scheduleCallback(callback, deprecated_options) {
  var startTime =
    currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();

  // 这里其实只会进第一个 if 条件，因为外部写死了一定会传 deprecated_options.timeout
  // 越小优先级越高，同时也代表一个任务的过期时间
  var expirationTime;
  if (
    typeof deprecated_options === 'object' &&
    deprecated_options !== null &&
    typeof deprecated_options.timeout === 'number'
  ) {
    // FIXME: Remove this branch once we lift expiration times out of React.
    expirationTime = startTime + deprecated_options.timeout;
  } else {
    switch (currentPriorityLevel) {
      case ImmediatePriority:
        expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
        break;
      case UserBlockingPriority:
        expirationTime = startTime + USER_BLOCKING_PRIORITY;
        break;
      case IdlePriority:
        expirationTime = startTime + IDLE_PRIORITY;
        break;
      case NormalPriority:
      default:
        expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
    }
  }

  // 环形双向链表结构
  var newNode = {
    callback,
    priorityLevel: currentPriorityLevel,
    expirationTime,
    next: null,
    previous: null,
  };

  // Insert the new callback into the list, ordered first by expiration, then
  // by insertion. So the new callback is inserted any other callback with
  // equal expiration.
  // 核心思路就是 firstCallbackNode 优先级最高 lastCallbackNode 优先级最低
  // 新生成一个 newNode 以后，就从头开始比较优先级
  // 如果新的高，就把新的往前插入，否则就往后插，直到没有一个 node 的优先级比他低
  // 那么新的节点就变成 lastCallbackNode
  // 在改变了firstCallbackNode的情况下，需要重新调度
  if (firstCallbackNode === null) {
    // This is the first callback in the list.
    firstCallbackNode = newNode.next = newNode.previous = newNode;
    ensureHostCallbackIsScheduled();
  } else {
    var next = null;
    var node = firstCallbackNode;
    do {
      if (node.expirationTime > expirationTime) {
        // The new callback expires before this one.
        next = node;
        break;
      }
      node = node.next;
    } while (node !== firstCallbackNode);

    if (next === null) {
      // No callback with a later expiration was found, which means the new
      // callback has the latest expiration in the list.
      next = firstCallbackNode;
    } else if (next === firstCallbackNode) {
      // The new callback has the earliest expiration in the entire list.
      firstCallbackNode = newNode;
      ensureHostCallbackIsScheduled();
    }

    var previous = next.previous;
    previous.next = next.previous = newNode;
    newNode.next = next;
    newNode.previous = previous;
  }

  return newNode;
}
```

### ensureHostCallbackIsScheduled

1、判断是否已经存在有host callback，如果已经存cancelHostCallback()，然后开始requestHostCallback(flushWork, expirationTime)，传入flushWork就是冲刷任务的函数（随后讲解）和队首的任务节点的过期时间。这里我们没有立马执行flushWork，而是交给了requestHostCallback。因为我们并不想直接把任务链表中的任务立马执行掉，也不是一口气把链表中的所有任务全部都执行掉。JS是单线程的，我们执行这些任务一直占据着主线程，会导致浏览器的其他任务一直等待，比如动画，就会出现卡顿，所以我们要选择合适的时期去执行它。所以我们交给requestHostCallback去处理这件事情，把flushWork交给了它。这里你可以暂时把flushWork简单的想成执行链表中的任务。

注：这里我们想想，我们需要保证应用的流畅性，因为浏览器是一帧一帧渲染的，每一帧渲染结束之后会有一些空闲时间可以执行别的任务，那么我们就想利用这点空闲时间来执行我们的任务。这样我们立马想到一个原生api: requestIdleCallback。但由于某些原因，react团队放弃了这个api，转而利用requestAnimationFrame和MessageChannel pollyfill了一个requestIdleCallback。

```
function ensureHostCallbackIsScheduled() {
  // 调度正在执行 返回 也就是不能打断已经在执行的
  if (isExecutingCallback) {
    // Don't schedule work yet; wait until the next time we yield.
    return;
  }
  // Schedule the host callback using the earliest expiration in the list.
  // 让优先级最高的 进行调度 如果存在已经在调度的 直接取消
  var expirationTime = firstCallbackNode.expirationTime;
  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true;
  } else {
    // Cancel the existing host callback.
    // 取消正在调度的callback
    cancelHostCallback();
  }
  // 发起调度
  requestHostCallback(flushWork, expirationTime);
}
```

### requestHostCallback

1、这里有两个全局变量scheduledHostCallback、timeoutTime会被赋值，  
分别代表第一个任务的callback和过期时间。  
2、进入这个函数就会立马判断一下当前的任务是否过期，如果过期了，啥也别说了，赶紧去立马执行啊，管他浏览器空不空闲，浏览器你没得空也得赶紧给我执行了，这个任务是甲方提的，交付期限都过了，那还不赶紧的给办了，甲方爸爸是上帝啊。这里留一个疑问：是直接执行我们之前传入进来的flushWork吗？  
3、如果任务没有过期，交付时间还没到，那没事慢慢来，浏览器有空了咋们在做，毕竟我们都很忙，能拖就拖吧。所以不紧急的任务，我们交给requestAnimationFrameWithTimeout(animationTick)。

```
  requestHostCallback = function(callback, absoluteTimeout) {
    scheduledHostCallback = callback;
    timeoutTime = absoluteTimeout;
    // isFlushingHostCallback 只在 channel.port1.onmessage 被设为 true
    // isFlushingHostCallback表示所添加的任务需要立即执行
    // 也就是说当正在执行任务或者新进来的任务已经过了过期时间
    // 马上执行新的任务，不再等到下一帧
    if (isFlushingHostCallback || absoluteTimeout < 0) {
      // Don't wait for the next frame. Continue working ASAP, in a new event.
      // 发送消息，channel.port1.onmessage 会监听到消息并执行
      window.postMessage(messageKey, '*');
    } else if (!isAnimationFrameScheduled) {
      // If rAF didn't already schedule one, we need to schedule a frame.
      // TODO: If this rAF doesn't materialize because the browser throttles, we
      // might want to still have setTimeout trigger rIC as a backup to ensure
      // that we keep performing work.
      // isAnimationFrameScheduled 设为 true 的话就不会再进这个分支了
      // 但是内部会有机制确保 callback 执行
      isAnimationFrameScheduled = true;
      requestAnimationFrameWithTimeout(animationTick);
    }
  };
```

### requestAnimationFrameWithTimeout

这个函数其实可以理解为优化后的requestAnimationFrame。

1、当我们调用requestAnimationFrameWithTimeout并传入一个callback的时候，会启动一个requestAnimationFrame和一个setTimeout,两者都会去执行callback。但由于requestAnimationFrame执行优先级相对较高，它内部会调用clearTimeout取消下面定时器的操作。所以在页面active情况下的表现跟requestAnimationFrame是一致的。

2、requestAnimationFrame在页面切换到未激活的时候是不工作的，这时requestAnimationFrameWithTimeout就相当于启动了一个100ms的定时器，接管任务的执行工作。这个执行频率不高也不低，既能不影响cpu能耗，又能保证任务能有一定效率的执行。

稍等一下，我们以前使用requestAnimationFrame的时候，是需要循环调用自己的，不然不就只执行了一次…..它在哪里递归调用的呢？ 我们在仔细观察，这个函数传入了一个参数callback，这个callback是上一个函数传入进来的animationTick，这是什么东东？没见过啊？

```
var ANIMATION_FRAME_TIMEOUT = 100;
var rAFID;
var rAFTimeoutID;
var requestAnimationFrameWithTimeout = function(callback) {
  // schedule rAF and also a setTimeout
  // 这里的 local 开头的函数指的是 request​Animation​Frame 及 setTimeout
  // request​Animation​Frame 只有页面在前台时才会执行回调
  // 如果页面在后台时就不会执行回调，这时候会通过 setTimeout 来保证执行 callback
  // 两个回调中都可以互相 cancel 定时器
  // callback 指的是 animationTick
  rAFID = localRequestAnimationFrame(function(timestamp) {
    // cancel the setTimeout
    localClearTimeout(rAFTimeoutID);
    callback(timestamp);
  });
  rAFTimeoutID = localSetTimeout(function() {
    // cancel the requestAnimationFrame
    localCancelAnimationFrame(rAFID);
    callback(getCurrentTime());
  }, ANIMATION_FRAME_TIMEOUT);
};
```

### animationTick

1、有任务再进行递归请求下一帧，没任务的话可以结束了，退出递归。  
2、这里有几个比较重要的全局变量：  
frameDeadline 初始值为0，计算当前帧的截止时间  
activeFrameTime 初始值为33 ，一帧的渲染时间33ms，这里假设 1s 30帧  
var nextFrameTime = rafTime - frameDeadline + activeFrameTime;  
rafTime是传入这个函数的参数，也就是当前帧开始的时间戳。nextFrameTime就代表实际上一帧的渲染时间（第一次执行除外）。之后会根据这个值更新activeFrameTime  
。动态的根据不同的环境调每一帧的渲染时间，达到系统的刷新频率。  
3、在每一帧的回调函数最后，都会调用window.postMessage(messageKey, ‘_’);啥？这是个啥？不是应该调用flushWork来执行任务吗？还有我们上面提到的一个疑问，requestHostCallback里面如果任务过期，立马执行任务。他执行的是flushWork吗？我们去瞧一瞧：在之前的requestHostCallback函数中，瞪大眼睛一看：window.postMessage(messageKey, '_'); What???他执行的也是这个方法。

```
    var animationTick = function(rafTime) {
    if (scheduledHostCallback !== null) {
      // Eagerly schedule the next animation callback at the beginning of the
      // frame. If the scheduler queue is not empty at the end of the frame, it
      // will continue flushing inside that callback. If the queue *is* empty,
      // then it will exit immediately. Posting the callback at the start of the
      // frame ensures it's fired within the earliest possible frame. If we
      // waited until the end of the frame to post the callback, we risk the
      // browser skipping a frame and not firing the callback until the frame
      // after that.
      // scheduledHostCallback 不为空的话就继续递归
      // 但是注意这里的递归并不是同步的，下一帧的时候才会再执行 animationTick
      requestAnimationFrameWithTimeout(animationTick);
    } else {
      // No pending work. Exit.
      isAnimationFrameScheduled = false;
      return;
    }
    // rafTime 就是 performance.now()，无论是执行哪个定时器
    // 假如我们应用第一次执行 animationTick，那么 frameDeadline = 0 activeFrameTime = 33
    // 也就是说此时 nextFrameTime = performance.now() + 33
    // 便于后期计算，我们假设 nextFrameTime = 5000 + 33 = 5033
    // 然后 activeFrameTime 为什么是 33 呢？因为 React 这里假设你的刷新率是 30hz
    // 一秒对应 1000 毫秒，1000 / 30 ≈ 33
    // ------------------------------- 以下注释是第二次的
    // 第二次进来这里执行，因为 animationTick 回调肯定是下一帧执行的，假如我们屏幕是 60hz 的刷新率
    // 那么一帧的时间为 1000 / 60 ≈ 16
    // 此时 nextFrameTime = 5000 + 16 - 5033 + 33 = 16
    // ------------------------------- 以下注释是第三次的
    // nextFrameTime = 5000 + 16 * 2 - 5048 + 33 = 17
    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    // 这个 if 条件第一次肯定进不去
    // ------------------------------- 以下注释是第二次的
    // 此时 16 < 33 && 5033 < 33 = false，也就是说第二帧的时候这个 if 条件还是进不去
    // ------------------------------- 以下注释是第三次的
    // 此时 17 < 33 && 16 < 33 = true，进条件了，也就是说如果刷新率大于 30hz，那么得等两帧才会调整 activeFrameTime
    if (
      nextFrameTime < activeFrameTime &&
      previousFrameTime < activeFrameTime
    ) {
      // 这里小于 8 的判断，是因为不能处理大于 120 hz 刷新率以上的浏览器了
      if (nextFrameTime < 8) {
        // Defensive coding. We don't support higher frame rates than 120hz.
        // If the calculated frame time gets lower than 8, it is probably a bug.
        nextFrameTime = 8;
      }
      // If one frame goes long, then the next one can be short to catch up.
      // If two frames are short in a row, then that's an indication that we
      // actually have a higher frame rate than what we're currently optimizing.
      // We adjust our heuristic dynamically accordingly. For example, if we're
      // running on 120hz display or 90hz VR display.
      // Take the max of the two in case one of them was an anomaly due to
      // missed frame deadlines.
      // 第三帧进来以后，activeFrameTime = 16 < 17 ? 16 : 17 = 16
      // 然后下次就按照一帧 16 毫秒来算了
      activeFrameTime =
        nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
      // 第一次进来 5033
      // 第二次进来 16
      previousFrameTime = nextFrameTime;
    }
    //  第一次 frameDeadline = 5000 + 33 = 5033
    // ------------------------------- 以下注释是第二次的
    // frameDeadline = 5016 + 33 = 5048
    frameDeadline = rafTime + activeFrameTime;
    // 确保这一帧内不再 postMessage
    // postMessage 属于宏任务
    // const channel = new MessageChannel();
    // const port = channel.port2;
    // channel.port1.onmessage = function(event) {
    //   console.log(1)
    // }
    // requestAnimationFrame(function (timestamp) {
    //   setTimeout(function () {
    //     console.log('setTimeout')
    //   }, 0)
    //   port.postMessage(undefined)
    //   Promise.resolve(1).then(function (value) {
    //     console.log(value, 'Promise')
    //   })
    // })
    // 以上代码输出顺序为 Promise -> onmessage -> setTimeout
    // 由此可知微任务最先执行，然后是宏任务，并且在宏任务中也有顺序之分
    // onmessage 会优先于 setTimeout 回调执行
    // 对于浏览器来说，当我们执行 request​Animation​Frame 回调后
    // 会先让页面渲染，然后判断是否要执行微任务，最后执行宏任务，并且会先执行 onmessage
    // 当然其实比 onmessage 更快的宏任务是 set​Immediate，但是这个 API 只能在 IE 下使用
    if (!isMessageEventScheduled) {
      isMessageEventScheduled = true;
      window.postMessage(messageKey, '*');
    }
  };
```

### window.postMessage(messageKey, '\*')

1、其实我们想一个问题，我们想要的是在每一帧里面，先执行浏览器的渲染任务，如果把这一帧的渲染任务执行之后，还有空闲的时间，我们在执行我们的任务。  
2、但是如果这里直接开始执行任务的话，会在这一帧的一开始就执行，难道你想要霸占一帧的时间来执行你的任务吗？那岂不是我上面讲的白讲了……  
3、所以我们使用window.postMessage，他是macrotask，onmessage的回调函数的调用时机是在一帧的paint完成之后，react scheduler内部正是利用了这一点来在一帧渲染结束后的剩余时间来执行任务的。  
4、window.postMessage(messageKey, '\*')对应的window.addEventListener('message', idleTick, false)的监听，会触发idleTick函数的调用。  
4、所以接下来咋们瞧瞧idleTick，我们的任务肯定是在这个事件回调中执行的。

```
  var messageKey =
    '__reactIdleCallback$' +
    Math.random()
      .toString(36)
      .slice(2);
  var idleTick = function(event) {
    if (event.source !== window || event.data !== messageKey) {
      return;
    }
    // 一些变量的设置
    isMessageEventScheduled = false;

    var prevScheduledCallback = scheduledHostCallback;
    var prevTimeoutTime = timeoutTime;
    scheduledHostCallback = null;
    timeoutTime = -1;
    // 获取当前时间
    var currentTime = getCurrentTime();

    var didTimeout = false;
    // 判断之前计算的时间是否小于当前时间，时间超了说明浏览器渲染等任务执行时间超过一帧了，这一帧没有空闲时间了
    if (frameDeadline - currentTime <= 0) {
      // There's no time left in this idle period. Check if the callback has
      // a timeout and whether it's been exceeded.
      // 判断当前任务是否过期
      if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
        // Exceeded the timeout. Invoke the callback even though there's no
        // time left.
        didTimeout = true;
      } else {
        // No timeout.
        // 没过期的话再丢到下一帧去执行
        if (!isAnimationFrameScheduled) {
          // Schedule another animation callback so we retry later.
          isAnimationFrameScheduled = true;
          requestAnimationFrameWithTimeout(animationTick);
        }
        // Exit without invoking the callback.
        scheduledHostCallback = prevScheduledCallback;
        timeoutTime = prevTimeoutTime;
        return;
      }
    }

    // 最后执行 flushWork，这里涉及到的 callback 全是 flushWork
    if (prevScheduledCallback !== null) {
      isFlushingHostCallback = true;
      try {
        prevScheduledCallback(didTimeout);
      } finally {
        isFlushingHostCallback = false;
      }
    }
  };
```

### flushWork

大家可以想一想，这个flushWork会是一个简单的把任务链表从头到尾执行完吗？要是这样的话，我上面bb的一大堆岂不是又白讲了……都一口气执行完了，还谈何性能优化呢。一口气回到解放前。所以，不是我们想象的这么简单哦。  
1、flushWork根据didTimeout参数有两种处理逻辑，如果为true，就会把任务链表里的过期任务全都给执行一遍；如果为false则在当前帧到期之前尽可能多的去执行任务。  
2、最后，如果还有任务的话，再启动一轮新的任务执行调度，ensureHostCallbackIsScheduled()，来重置callback链表。重置所有的调度常量，老 callback 就不会被执行。  
3、这里的执行任务是调用flushFirstCallback，执行callback中优先级最高的任务

```
function flushWork(didTimeout) {
  // 一些变量的设置
  isExecutingCallback = true;
  deadlineObject.didTimeout = didTimeout;
  try {
    // 判断是否超时
    if (didTimeout) {
      // Flush all the expired callbacks without yielding.
      while (firstCallbackNode !== null) {
        // Read the current time. Flush all the callbacks that expire at or
        // earlier than that time. Then read the current time again and repeat.
        // This optimizes for as few performance.now calls as possible.
        // 超时的话，获取当前时间，判断任务是否过期，过期的话就执行任务
        // 并且判断下一个任务是否也已经过期
        var currentTime = getCurrentTime();
        if (firstCallbackNode.expirationTime <= currentTime) {
          do {
            flushFirstCallback();
          } while (
            firstCallbackNode !== null &&
            firstCallbackNode.expirationTime <= currentTime
          );
          continue;
        }
        break;
      }
    } else {
      // Keep flushing callbacks until we run out of time in the frame.
      // 没有超时说明还有时间可以执行任务，执行任务完成后继续判断
      if (firstCallbackNode !== null) {
        do {
          flushFirstCallback();
        } while (
          firstCallbackNode !== null &&
          getFrameDeadline() - getCurrentTime() > 0
        );
      }
    }
  } finally {
    isExecutingCallback = false;
    if (firstCallbackNode !== null) {
      // There's still work remaining. Request another callback.
      ensureHostCallbackIsScheduled();
    } else {
      isHostCallbackScheduled = false;
    }
    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}
```

### flushFirstCallback

这里就是链表操作，执行完firstCallback后把这个callback从链表中删除。

这里调用的是当前任务节点flushedNode.callback，那我们这个callback是啥呢？时间开始倒流，回到scheduleCallbackWithExpirationTime函数scheduleDeferredCallback(performAsyncWork, {timeout})相信大家对这个还有印象，它其实就是我们进入Scheduler.js的入口函数。如它传入performAsyncWork作为回调函数，也就是在此函数中调用的回调函数就是这个。

```
function flushFirstCallback() {
  var flushedNode = firstCallbackNode;

  // Remove the node from the list before calling the callback. That way the
  // list is in a consistent state even if the callback throws.
  // 链表操作
  var next = firstCallbackNode.next;
  if (firstCallbackNode === next) {
    // This is the last callback in the list.
    // 当前链表中只有一个节点
    firstCallbackNode = null;
    next = null;
  } else {
    // 有多个节点，重新赋值 firstCallbackNode，用于之前函数中下一次的 while 判断
    var lastCallbackNode = firstCallbackNode.previous;
    firstCallbackNode = lastCallbackNode.next = next;
    next.previous = lastCallbackNode;
  }

  // 清空指针
  flushedNode.next = flushedNode.previous = null;

  // Now it's safe to call the callback.
  // 这个 callback 是 performAsyncWork 函数
  var callback = flushedNode.callback;
  var expirationTime = flushedNode.expirationTime;
  var priorityLevel = flushedNode.priorityLevel;
  var previousPriorityLevel = currentPriorityLevel;
  var previousExpirationTime = currentExpirationTime;
  currentPriorityLevel = priorityLevel;
  currentExpirationTime = expirationTime;
  var continuationCallback;
  try {
    // 执行回调函数
    continuationCallback = callback(deadlineObject);
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentExpirationTime = previousExpirationTime;
  }
  // ......
}
```

这里有个地方要注意，在调用任务的callback的时候我们传入了一个对象：deadlineObject。  
timeRemaining：当前帧还有多少空闲时间  
didTimeout：任务是否过期

```
var deadlineObject = {
  timeRemaining,
  didTimeout: false,
};
```

这个deadlineObject是个全局对象，主要用于shouldYield函数  
函数中的deadline就是这个对象

```
function shouldYield() {
  if (deadlineDidExpire) {
    return true;
  }
  if (
    deadline === null ||
    deadline.timeRemaining() > timeHeuristicForUnitOfWork
  ) {
    // Disregard deadline.didTimeout. Only expired work should be flushed
    // during a timeout. This path is only hit for non-expired work.
    return false;
  }
  deadlineDidExpire = true;
  return true;
}
}
```

### performAsyncWork

1、这个函数得到一个参数dl，这个参数就是之前调用回调函数传入的deadlineObject。  
2、调用performWork(NoWork, dl);第一个参数为minExpirationTime这里传入NoWork=0，第二个参数Deadline=dl。

```
function performAsyncWork(dl) {
  // 判断任务是否过期
  if (dl.didTimeout) {
    // The callback timed out. That means at least one update has expired.
    // Iterate through the root schedule. If they contain expired work, set
    // the next render expiration time to the current time. This has the effect
    // of flushing all expired work in a single batch, instead of flushing each
    // level one at a time.
    if (firstScheduledRoot !== null) {
      recomputeCurrentRendererTime();
      let root: FiberRoot = firstScheduledRoot;
      do {
        didExpireAtExpirationTime(root, currentRendererTime);
        // The root schedule is circular, so this is never null.
        root = (root.nextScheduledRoot: any);
      } while (root !== firstScheduledRoot);
    }
  }
  performWork(NoWork, dl);
}
```

到这里需要插一句，还记得 requestWork 中如果是同步的情况吗？退到这个函数我们瞧瞧，如果是同步的情况，直接调用performSyncWork。performSyncWork和performAsyncWork长得如此相像，莫非是失散多年的亲兄弟？去到performSyncWork去看看，嗯…没错，他和performAsyncWork调用了同一个方法，只是参数传递的不一样，performWork(Sync, null);，他传入的第一个参数为Sync=1。第二个参数为null。

在requestWork函数中：

```
 if (expirationTime === Sync) {
    // 同步
    performSyncWork();
  } else {
    // 异步，开始调度
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
```

```
function performSyncWork() {
  performWork(Sync, null);
}
```

### performWork（执行任务）

1、如果是同步（deadline == null）,压根不考虑帧渲染是否有空余时间，同步任务也没有过期时间之说，遍历所有的root，并且把所有root中同步的任务全部执行掉。  
注：有可能存在多个root，即有可能多次调用了ReactDOM.render。  
2、如果是异步（deadline !== null）,遍历所有的root，执行完所有root中的过期任务，因为过期任务是必须要执行的。如果这一帧还有空闲时间，尽可能的执行更多任务。  
3、上面两种情况都执行了任务，看看他们调用了什么方法呢？performWorkOnRoot。

```
// currentRendererTime 计算从页面加载到现在为止的毫秒数
// currentSchedulerTime 也是加载到现在的时间，isRendering === true的时候用作固定值返回，不然每次requestCurrentTime都会重新计算新的时间
function performWork(minExpirationTime: ExpirationTime, dl: Deadline | null) {
  // 这里注意deadline指向了传进来的deadlineObject对象（dl）
  deadline = dl;

  // Keep working on roots until there's no more work, or until we reach
  // the deadline.
  // 找到优先级最高的下一个需要渲染的 root: nextFlushedRoot 和对应的 expirtaionTime: nextFlushedExpirationTime
  findHighestPriorityRoot();

  // 异步
  if (deadline !== null) {
    // 重新计算 currentRendererTime
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;

    // ......

    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime) &&
        // deadlineDidExpire 判断时间片是否过期， shouldYield 中判断
        // 当前渲染时间 currentRendererTime 比较 nextFlushedExpirationTime 判断任务是否已经超时
        // currentRendererTime >= nextFlushedExpirationTime 超时了
      (!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime >= nextFlushedExpirationTime,
      );
      findHighestPriorityRoot();
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
    }
  } else {
    // 同步
    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      // 普通情况 minExpirationTime 应该就等于nextFlushedExpirationTime 因为都来自同一个 root，nextFlushedExpirationTime 是在 findHighestPriorityRoot 阶段读取出来的 root.expirationTime
      (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true);
      findHighestPriorityRoot();
    }
  }

  // We're done flushing work. Either we ran out of time in this callback,
  // or there's no more work left with sufficient priority.

  // If we're inside a callback, set this to false since we just completed it.
  if (deadline !== null) {
    callbackExpirationTime = NoWork;
    callbackID = null;
  }
  // If there's work left over, schedule a new callback.
  if (nextFlushedExpirationTime !== NoWork) {
    scheduleCallbackWithExpirationTime(
      ((nextFlushedRoot: any): FiberRoot),
      nextFlushedExpirationTime,
    );
  }

  // Clean-up.
  deadline = null;
  deadlineDidExpire = false;

  finishRendering();
}
```

### performWorkOnRoot

1、首先说明执行任务的两个阶段：  
renderRoot 渲染阶段  
completeRoot 提交阶段  
2、如果是同步或者任务已经过期的情况下，先renderRoot（传入参数isYieldy=false，代表任务不可以中断），随后completeRoot  
3、如果是异步的话，先renderRoot（传入参数isYieldy=true，代表任务可以中断），完了之后看看这一帧是否还有空余时间，如果有的话completeRoot，没有时间了的话，只能等下一帧了。  
4、在2、3步调用renderRoot之前还会做一件事，判断 finishedWork !== null ，因为前一个时间片可能 renderRoot 结束了没时间 completeRoot，如果在这个时间片中有完成 renderRoot 的 finishedWork 就直接 completeRoot。

```
function performWorkOnRoot(
  root: FiberRoot,
  expirationTime: ExpirationTime,
  isExpired: boolean,
) {
  // ......

  isRendering = true;

  // Check if this is async work or sync/expired work.
  if (deadline === null || isExpired) {
    // 同步或者任务已经过期，不可打断任务
    // Flush work without yielding.
    // TODO: Non-yieldy work does not necessarily imply expired work. A renderer
    // may want to perform some work without yielding, but also without
    // requiring the root to complete (by triggering placeholders).

    // 判断是否存在已完成的 finishedWork，存在话就完成它
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      const isYieldy = false;
      // 否则就去渲染成 DOM
      renderRoot(root, isYieldy, isExpired);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        completeRoot(root, finishedWork, expirationTime);
      }
    }
  } else {
    // 异步任务未过期，可打断任务
    // Flush async work.
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      const isYieldy = true;
      renderRoot(root, isYieldy, isExpired);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Check the deadline one more time
        // before committing.
        if (!shouldYield()) {
          // Still time left. Commit the root.
          completeRoot(root, finishedWork, expirationTime);
        } else {
          // There's no time left. Mark this root as complete. We'll come
          // back and commit it later.
          root.finishedWork = finishedWork;
        }
      }
    }
  }

  isRendering = false;
}
```

### renderRoot & completeRoot

之后就进入了组件更新的这两个阶段，后续章节详细讲解。

文章如有不妥，欢迎指正~