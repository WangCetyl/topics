#React16源码解析(五)-更新流程渲染阶段1
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

上篇文章讲解到renderRoot & completeRoot。  
React把组件的更新过程分为了两个阶段：渲染阶段（renderRoot）和提交阶段（completeRoot）。  
本文讨论渲染阶段。

从上篇文章末尾的renderRoot讲起：

## renderRoot

1、nextUnitOfWork = createWorkInProgress() 拷贝一份 fiber 节点，在 nextUnitOfWork 中修改，防止改变当前 fiberTree。nextUnitOfWork 是下一个要更新的节点。  
2、进入workLoop。

```
// 开始渲染整颗树，这个函数在异步模式下可能会被多次执行，因为在异步模式下
// 可以打断任务。打断也就意味着每次都得回到 root 再开始从上往下循环
function renderRoot(
  root: FiberRoot,
  isYieldy: boolean,
  isExpired: boolean,
): void {
  isWorking = true;
  ReactCurrentOwner.currentDispatcher = Dispatcher;

  const expirationTime = root.nextExpirationTimeToWorkOn;

  // Check if we're starting from a fresh stack, or if we're resuming from
  // previously yielded work.
  if (
    expirationTime !== nextRenderExpirationTime ||
    root !== nextRoot ||
    nextUnitOfWork === null
  ) {
    // Reset the stack and start working from the root.
    resetStack();
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    // 获取下一个需要工作的单元
    nextUnitOfWork = createWorkInProgress(
      // FiberRoot 对应的 Rootfiber
      nextRoot.current,
      null,
      nextRenderExpirationTime,
    );
    root.pendingCommitExpirationTime = NoWork;
    // ......
  }
  // ......
  do {
    try {
      // 循环更新节点
      workLoop(isYieldy);
    } catch (thrownValue) {
      // 遇到某种错误
    break;
  } while (true);

  // 这里有一大堆的错误处理
  
  // Ready to commit.
  onComplete(root, rootWorkInProgress, expirationTime);
}
```

## workLoop

循环单元更新，对整颗 fiberTree 都遍历一遍。

还记得之前传入进来的isYieldy的么，如果为false，不可中断，不断的更新下一个节点任务（performUnitOfWork(nextUnitOfWork)），知道整棵树更新完毕。如果可以中断，通过shouldYield()判断当前帧是否还有时间更新，有时间就更新，没有时间了就不更了。

注：在workLoop 跟新后会有各种错误处理。

```
function workLoop(isYieldy) {
  // 对 nextUnitOfWork 循环进行判断，直到没有 nextUnitOfWork
  if (!isYieldy) {
    // 不可中断
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      // 一开始进来 nextUnitOfWork 是 root，每次执行 performUnitOfWork 后
      // 都会生成下一个工作单元
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // 可中断
    // Flush asynchronous work until the deadline runs out of time.
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}
```

## performUnitOfWork

1、调用beginWork()更新当前任务节点  
2、如果当前fiber树已经更新到叶子节点了，则调用completeUnitOfWork更新。

```
// 开始组件更新
function performUnitOfWork(workInProgress: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate.
  // Ideally nothing should rely on this, but relying on it here
  // means that we don't need an additional field on the work in
  // progress.
  // 获得 fiber 的替身，调和这一阶段都是在替身上完成的
  // 然后直接看 beginWork
  const current = workInProgress.alternate;

  // ......
  let next;

  // .....
  // 开始工作
  next = beginWork(current, workInProgress, nextRenderExpirationTime);
  workInProgress.memoizedProps = workInProgress.pendingProps;

  // ......

  // 当前fiber树已经更新到叶子节点了
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(workInProgress);
  }

  ReactCurrentOwner.current = null;

  return next;
}
```

## beginWork

通过workInProgress.tag判断当前是什么类型的节点。  
workInProgress.tag的所有类型定义在ReactWorkTags.js里面

```
export const FunctionComponent = 0; //函数式组件
export const ClassComponent = 1; //class类组件
export const IndeterminateComponent = 2; // 并不确定是函数组件还是类组件
export const HostRoot = 3; // 组件树根组件，可以嵌套
export const HostPortal = 4; // 子树. Could be an entry point to a different renderer.
export const HostComponent = 5;// 标准组件，如地div， span等
export const HostText = 6;// 文本
export const Fragment = 7;// 片段
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
```

接下来我会依次讲解下面这些组件的更新：

1、FunctionComponent（函数组件），return updateFunctionComponent(…)。  
2、ClassComponent（class类组件） return updateClassComponent(…)  
3、IndeterminateComponent（不确定是函数组件还是类组件），return mountIndeterminateComponent(…)  
4、HostRoot（组件树根组件），return updateHostRoot(…);  
5、HostComponent（标准dom节点）,return updateHostComponent(…);  
6、HostText（文本），updateHostText(…);  
7、HostPortal，updatePortalComponent(…)  
8、ForwardRef,updateForwardRef(…)  
9、Mode，updateMode(…)  
10、MemoComponent,updateMemoComponent(….)

```
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    // 判断 props 和 context 是否改变
    // 判断当前 fiber 的优先级是否小于本次渲染的优先级，小于的话可以跳过
    if (
      oldProps === newProps &&
      !hasLegacyContextChanged() &&
      (updateExpirationTime === NoWork ||
        updateExpirationTime > renderExpirationTime)
    ) {
      // ......
      }
      // bailoutOnAlreadyFinishedWork 会判断这个 fiber 的子树是否需要更新，如果有需要更新会 clone 一份到 workInProgress.child 返回到 workLoop 的 nextUnitOfWork, 否则为 null
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime,
      );
    }
  }

  // Before entering the begin phase, clear the expiration time.
  // 进行更新先把当前 fiber 的 expirationTime 设置为 NoWork
  workInProgress.expirationTime = NoWork;
  // 根据 fiber 的 tag 类型进行更新
  switch (workInProgress.tag) {
    case IndeterminateComponent: ......
    case LazyComponent: ......
    case FunctionComponent: ......
    case ClassComponent: ......
    case HostRoot:......
    case HostComponent:......
    case HostText:......
    case SuspenseComponent:......
    case HostPortal:......
    case ForwardRef: ......
    case Fragment:......
    case Mode:......
    case Profiler:......
    case ContextProvider:......
    case ContextConsumer:......
    case MemoComponent: ......
    case SimpleMemoComponent: ......
    case IncompleteClassComponent:......
    default:
      invariant(
        false,
        'Unknown unit of work tag. This error is likely caused by a bug in ' +
          'React. Please file an issue.',
      );
  }
}
```

下篇文章继续讲解这些组件的更新。

文章如有不妥，欢迎指正~