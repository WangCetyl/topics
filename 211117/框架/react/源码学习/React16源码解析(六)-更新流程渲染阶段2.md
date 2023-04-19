# React16源码解析(六)-更新流程渲染阶段2
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

接着上篇文章，在beginWork中，通过workInProgress.tag判断当前是什么类型的节点而调用不同的更新函数。这篇文章讲解各种类型的组件的更新过程。

## updateFunctionComponent

在beginWork中：

```
case FunctionComponent: {
    const Component = workInProgress.type;
    const unresolvedProps = workInProgress.pendingProps;
    const resolvedProps =
    workInProgress.elementType === Component
        ? unresolvedProps
        : resolveDefaultProps(Component, unresolvedProps);
    return updateFunctionComponent(
    current,
    workInProgress,
    Component,
    resolvedProps,
    renderExpirationTime,
    );
}
```

1、调用函数，即业务中写好的函数组件。得到一个ReactElement，即nextChildren  
2、调用reconcileChildren，第一个参数current=当前fiber节点。第二个参数workInProgress=需要更新的fiber节点。第三个参数nextChildren，上面函数的返回值。  
3、上面调用的reconcileChildren方法，其实是改变了workInProgress.child。  
4、返回workInProgress.child。

```
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderExpirationTime,
) {
  // ......
  let nextChildren;
  // Component 组件方法，这里就是我们声明组件的方式 function(props, context) {}
  nextChildren = Component(nextProps, context);

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork;
  // 把 nextChildren 这些 ReactElement 变成 Fiber 对象, 在 workInProgress.child 挂载 fiber 
  reconcileChildren(
    current,
    workInProgress,
    nextChildren,
    renderExpirationTime,
  );
  return workInProgress.child;
}
```

### reconcileChildren

1、判断当前节点是否为null，如果是第一次渲染，current=null，则调用mountChildFibers，函数返回值赋值给workInProgress.child。  
2、current!==null，说明是更新节点。调用reconcileChildFibers(workInProgress,current.child,nextChildren)，函数返回值赋值给workInProgress.child。

```
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderExpirationTime: ExpirationTime,
) {
  if (current === null) {
    // 第一次渲染组件
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    // 更新组件
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime,
    );
  }
}
```

我们查找代码发现，reconcileChildFibers和mountChildFibers其实是同一个方法（ChildReconciler），初始化时传入了不同的参数。前者传入true，后者传入flase

```
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
```

### ChildReconciler

1、你会发现，这个一个无敌长的巨型方法。  
2、看到这个方法的最后return reconcileChildFibers;  
3、往上面找到这个方法reconcileChildFibers，就在return 的上面

```
function ChildReconciler(shouldTrackSideEffects) {
    
    function reconcileChildFibers(......){
        // ......
    }
    return reconcileChildFibers;
}
```

### reconcileChildFibers

1、这个方法第三个参数newChild即为我们调用函数组件返回的新的child。  
2、判断newChild是什么类型的节点，不同类型对应不同的操作。比如newChild.$$typeof=REACT\_ELEMENT\_TYPE，则return placeSingleChild(reconcileSingleElement())。如果是数组，调用reconcileChildrenArray()进行调和，还有可能是REACT\_PORTAL\_TYPE、string、number、Iterator等。  
3、如果这个newChild上面的都不符合，但又是个对象但又不是null，那么就是一个非法的定义了。就throwOnInvalidObjectType抛出错误。  
4、最后，调用deleteRemainingChildren删除掉所有子节点。因为到了最后，只有可能newChild === null，说明新的更新清空掉了所有子节点。

注：deleteRemainingChildren 这个函数里面调用deleteChild逐个删除，但删除子节点并不是真的删除这个对象，而是通过 firstEffect、lastEffect、nextEffect 属性来维护一个 EffectList（链表结构），通过 effectTag 标记当前删除操作，这些信息都会在 commit 阶段使用到

```
  // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.
  /*
    reconcileChildFibers函数中主要是根据newChild类型，调用不同的Diff算法：
    1、单个元素，调用reconcileSingleElement
    2、单个Portal元素，调用reconcileSinglePortal
    3、string或者number，调用reconcileSingleTextNode
    4、array（React 16 新特性），调用reconcileChildrenArray
    前三种情况，在新子节点上添加 effectTag：Placement，标记为更新操作，而这些操作的标记，将用于commit阶段。下面以单个元素为例，讲讲具体的Diff算法
   */
  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    // 判断是否为 fragment，是的话取 fragment 的 children
    // fragment标签没有意义 只渲染children
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

    // Handle object types
    // 接下来开始判断类型
    const isObject = typeof newChild === 'object' && newChild !== null;

    // ReactElment 或者 ReactPortal
    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
      }
    }

    // 文本
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          '' + newChild,
          expirationTime,
        ),
      );
    }

    // 数组
    if (isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime,
      );
    }

    // iterator类型
    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime,
      );
    }

    // 抛错
    if (isObject) {
      throwOnInvalidObjectType(returnFiber, newChild);
    }

    // 错误处理
    if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
      // ......
    }

    // Remaining cases are all treated as empty.
    // 到这里说明返回值为 null，删除所有的 children
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
更新渲染时 placeSingleChild 会把新创建的 fiber 节点标记为 Placement, 待到提交阶段处理,其中 ReactElement, Portal, TextNode 三种类型的节点需要进行处理

  function placeSingleChild(newFiber: Fiber): Fiber {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }
    return newFiber;
  }
```

更新渲染时 placeSingleChild 会把新创建的 fiber 节点标记为 Placement, 待到提交阶段处理,其中 ReactElement, Portal, TextNode 三种类型的节点需要进行处理

```
  function placeSingleChild(newFiber: Fiber): Fiber {
    
    
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }
    return newFiber;
  }
```

### reconcileSingleElement

调和单个子节点。  
1、通过key判断是否节点是否可以复用  
2、根据节点的不同创建不同的fiber对象，如果是REACT\_FRAGMENT\_TYPE类型通过createFiberFromFragment创建fiber对象，其他类型通过createFiberFromElement创建fiber对象。  
3、createFiberFromElement -> createFiberFromTypeAndProps -> createFiber

注：这里调和单个子节点, 如果 key 不存在为 null 我们也认为他是相等的，判断 type 和 elementType 来看他们是否一是个组件函数

```
  function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement,
    expirationTime: ExpirationTime,
  ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      // 判断key是否相等
      if (child.key === key) {
        if (
          child.tag === Fragment
            ? element.type === REACT_FRAGMENT_TYPE
            : child.elementType === element.type
        ) {
          // key相等且type相等，删除旧子节点的兄弟节点，复用旧节点并返回
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(
            child,
            element.type === REACT_FRAGMENT_TYPE
              ? element.props.children
              : element.props,
            expirationTime,
          );
          existing.ref = coerceRef(returnFiber, child, element);
          existing.return = returnFiber;
          if (__DEV__) {
            existing._debugSource = element._source;
            existing._debugOwner = element._owner;
          }
          return existing;
        } else {
          // key相等但type不相等，删除旧子节点及兄弟节点，跳出循环
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        // key不相等，删除此旧子节点，继续循环
        deleteChild(returnFiber, child);
      }
      // 继续遍历此旧子节点的兄弟节点,找寻复用节点
      child = child.sibling;
    }
    // 不能复用，则直接新建Fiber实例，并返回
    if (element.type === REACT_FRAGMENT_TYPE) {
      const created = createFiberFromFragment(
        element.props.children,
        returnFiber.mode,
        expirationTime,
        element.key,
      );
      created.return = returnFiber;
      return created;
    } else {
      const created = createFiberFromElement(
        element,
        returnFiber.mode,
        expirationTime,
      );
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      created.return = returnFiber;
      return created;
    }
  }
```

deleteChild标记删除：  
这里不是真正的删除，把childToDelete加入到Effect链表，记录effectTag为Deletion

```
function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    // 找到父组件中需要更新的最后一个子组件
    const last = returnFiber.lastEffect;
    // 判断链表是否存在
    // 这个链表的目的就是把该父节点上的所有需要更新的子节点通过链表链接起来
    // 然后下次真正需要更新的时候只需要遍历链表即可
    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.effectTag = Deletion;
  }
```

deleteRemainingChildren删除兄弟节点：  
一个个找到兄弟节点deleteChild。

```
function deleteRemainingChildren(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
  ): null {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    }

    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }
```

### reconcileChildrenArray

1、用一个循环相同位置进行比较，找到第一个不可复用的节点为止，其中updateSlot函数用来判断新老节点是否可以复用  
2、新节点已经遍历完毕，直接把剩下的老节点删除了就行了  
3、老节点已经遍历完毕，根据剩余新的节点直接创建 Fiber   
4、移动的情况下进行节点复用：  
把所有老数组元素按 key 或者是 index 放 Map 里  
遍历剩下的 newChildren，找到 Map 里面可以复用的节点，如果找不到就创建

```
function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<*>,
    expirationTime: ExpirationTime,
  ): Fiber | null {
    // ......
    let resultingFirstChild: Fiber | null = null;
    let previousNewFiber: Fiber | null = null;

    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    /**
    1、用一个循环相同位置进行比较，找到第一个不可复用的节点为止，其中updateSlot函数用来判断新老节点是否可以复用
     */
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      // 用于判断是否能复用 根据 newChild 的类型和 oldChild.key 进行判断操作
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime,
      );
      // 不能复用
      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        // 跳出遍历
        break;
      }
      // 接下来都是可以复用 fiber 的逻辑
      // shouldTrackSideEffects 代表更新组件
      // 如果需要追踪副作用并且是重新创建了一个 fiber 的情况
      // 那么会把 oldFiber 删掉
      if (shouldTrackSideEffects) { 
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        // 是第一个节点
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        // 链表连接新的 fiber 节点
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    // 2、新节点已经遍历完毕，直接把剩下的老节点删除了就行了
    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    // 3、老节点已经遍历完毕，根据剩余新的节点直接创建 Fiber 
    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime,
        );
        if (!newFiber) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    // 把所有老数组元素按 key 或者是 index 放 Map 里
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // Keep scanning and use the map to restore deleted items as moves.
    
```

## updateClassComponent

在beginWork中：

```
case ClassComponent: {
    const Component = workInProgress.type;
    const unresolvedProps = workInProgress.pendingProps;
    const resolvedProps =
    workInProgress.elementType === Component
        ? unresolvedProps
        : resolveDefaultProps(Component, unresolvedProps);
    return updateClassComponent(
    current,
    workInProgress,
    Component,
    resolvedProps,
    renderExpirationTime,
    );
}
```

这个函数的作用是对未初始化的类组件进行初始化，对已经初始化的组件更新重用。

1、如果还没创建实例，初始化，说明是第一次渲染（instance === null）  
调用constructClassInstance，执行构造函数，生成实例instance  
然后在调用mountClassInstance，挂载实例，主要工作是更新instance.state，并且执行一些生命周期  
2、渲染被中断 instance !== null, current === null  
调用resumeMountClassInstance 复用实例但还是调用首次渲染的生命周期，这个函数如果反复false则组件无需更新  
3、更新渲染 instance !== null, current !== null  
调用updateClassInstance，调用 didUpdate 和 componentWillReceiveProp 生命周期，这个函数如果反复false则组件无需更新  
4、最终执行 finishClassComponent, 进行错误判断的处理和判断是否可以跳过更新的过程，重新调和子节点 reconcileChildren

```
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime,
) {
  // ......

  const instance = workInProgress.stateNode;
  let shouldUpdate;
  if (instance === null) {
    if (current !== null) {
      // An class component without an instance only mounts if it suspended
      // inside a non- concurrent tree, in an inconsistent state. We want to
      // tree it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current.alternate = null;
      workInProgress.alternate = null;
      // Since this is conceptually a new fiber, schedule a Placement effect
      workInProgress.effectTag |= Placement;
    }
    // In the initial pass we might need to construct the instance.
    // 如果还没创建实例，初始化
    // 执行构造函数，得到实例instance
    // workInProgress.stateNode = instance
    constructClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
    // 挂载
    // 主要工作是更新instance.state，并且执行一些生命周期
    mountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
    shouldUpdate = true;
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    //  渲染中断
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  } else {
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  }
  // 完成 class 组件更新
  return finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime,
  );
}
```

### constructClassInstance

1、创建一个class组件实例（instance），即业务中写好的class component。  
2、将实例赋值给stateNode属性：workInProgress.stateNode = instance

```
function constructClassInstance(
  workInProgress: Fiber,
  ctor: any,
  props: any,
  renderExpirationTime: ExpirationTime,
): any {
  // ......

  //  创建实例，这里生成 class 组件实例
  const instance = new ctor(props, context);
  // memoizedState 为实例的 state, 没有就为 null
  const state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined
      ? instance.state
      : null);
  adoptClassInstance(workInProgress, instance);
  // ......
  // Cache unmasked context so we can avoid recreating masked context unless necessary.
  // ReactFiberContext usually updates this cache but can't for newly-created instances.
  if (isLegacyContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context);
  }
  return instance;
}
```

adoptClassInstance：

```
function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  // 为 instance.updater 赋值 classComponentUpdater, 用于组件通过 ReactDOM.render 或 setState 进行更新
  // 给 class 组件实例的 updater 设置
  instance.updater = classComponentUpdater;
  //  将实例赋值给stateNode属性
  workInProgress.stateNode = instance;
  // The instance needs access to the fiber so that it can schedule updates
  // 给 instance._reactInternalFiber 赋值当前的 fiber 对象
  ReactInstanceMap.set(instance, workInProgress);
  // ......
}
```

### mountClassInstance

这里有我们熟悉的componentWillMount生命周期出现啦，不过新版React已经移除了，额，我不说了句废话么…… 哈哈并不是，我只是让大家更加了解这个更新过程。

1、从updateQueue里面获取到所有的要更新的state，调用processUpdateQueue函数遍历updateQueue，遍历的过程会判断每个update的优先级，决定是否要跳过这个更新。  
2、如果这个update需要更新，调用getStateFromUpdate获取到新的state。  
3、更新成最新的state：instance.state = workInProgress.memoizedState;  
4、调用React新的生命周期函数：getDerivedStateFromProps并且执行，这个生命周期可能改变State，所以再次需要instance.state = workInProgress.memoizedState  
5、如果没有使用getDerivedStateFromProps而使用componentWillMount，这里为了兼容旧版。执行componentWillMount，这个生命周期可能改变State。  
6、最后标记 componentDidMount 生命周期，待到提交阶段更新完 dom 后执行

```
// Invokes the mount life-cycles on a previously never rendered instance.
function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime,
): void {
  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  // ......

  // 计算更新 state 得到新的state
  let updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime,
    );
    // 更新成最新的state
    instance.state = workInProgress.memoizedState;
  }

  // 判断是否有getDerivedStateFromProps生命周期并且执行，这个生命周期可能改变State
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    // 更新成最新的state
    instance.state = workInProgress.memoizedState;
  }

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  // 判断是否有componentWillMount生命周期并且执行，这个生命周期也可能改变State
  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
    callComponentWillMount(workInProgress, instance);
    // If we had additional state updates during this life-cycle, let's
    // process them now.
    updateQueue = workInProgress.updateQueue;
    // 如果改变了state，就有新的update加入updateQueue了
    if (updateQueue !== null) {
      processUpdateQueue(
        workInProgress,
        updateQueue,
        newProps,
        instance,
        renderExpirationTime,
      );
      // 更新成最新的state
      instance.state = workInProgress.memoizedState;
    }
  }

  // 最后标记 componentDidMount 生命周期，待到提交阶段更新完 dom 后执行
  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update;
  }
}
```

### resumeMountClassInstance

1、执行getDerivedStateFromProps  
2、像上面的方法一样，调用processUpdateQueue得到更新后的State。  
3、由组件的 shouldComponentUpdate 判断是否要更新（shouldUpdate ），pureComponent 会自动比较 props。  
4、函数返回shouldUpdate

```
function resumeMountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime,
): boolean {
  const instance = workInProgress.stateNode;
  const oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;

  // ......

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles =
    typeof getDerivedStateFromProps === 'function' ||
    typeof instance.getSnapshotBeforeUpdate === 'function';

  // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
      typeof instance.componentWillReceiveProps === 'function')
  ) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      // 执行getDerivedStateFromProps生命周期
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext,
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();

  // 调用processUpdateQueue得到更新后的State
  const oldState = workInProgress.memoizedState;
  let newState = (instance.state = oldState);
  let updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime,
    );
    newState = workInProgress.memoizedState;
  }
  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.effectTag |= Update;
    }
    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    newState = workInProgress.memoizedState;
  }

  // 由组件的 shouldComponentUpdate 判断是否要更新（shouldUpdate ），pureComponent 会自动比较 props。
  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext,
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    // 判断执行那些生命周期
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillMount === 'function' ||
        typeof instance.componentWillMount === 'function')
    ) {
      startPhaseTimer(workInProgress, 'componentWillMount');
      if (typeof instance.componentWillMount === 'function') {
        instance.componentWillMount();
      }
      if (typeof instance.UNSAFE_componentWillMount === 'function') {
        instance.UNSAFE_componentWillMount();
      }
      stopPhaseTimer();
    }
    // 标记componentDidMount，中断的组件仍然按照首次挂载执行
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.effectTag |= Update;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.effectTag |= Update;
    }

    // If shouldComponentUpdate returned false, we should still update the
    // memoized state to indicate that this work can be reused.
    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  // 更新props和props即使shouldComponentUpdate returns false
  instance.props = newProps;
  instance.props = newState;
  instance.context = nextContext;

  return shouldUpdate;
}
```

### updateClassInstance

过程与 resumeMountClassInstance 相似, 不过执行的是 willUpdate, 标记 didUpdate, getSnapshotBeforeUpdate

```
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime,
): boolean {
  const instance = workInProgress.stateNode;

  const oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;

  // ......

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles =
    typeof getDerivedStateFromProps === 'function' ||
    typeof instance.getSnapshotBeforeUpdate === 'function';

  // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
      typeof instance.componentWillReceiveProps === 'function')
  ) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext,
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();

  const oldState = workInProgress.memoizedState;
  let newState = (instance.state = oldState);
  let updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime,
    );
    newState = workInProgress.memoizedState;
  }

  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Snapshot;
      }
    }
    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext,
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === 'function' ||
        typeof instance.componentWillUpdate === 'function')
    ) {
      startPhaseTimer(workInProgress, 'componentWillUpdate');
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }
      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
      stopPhaseTimer();
    }
    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.effectTag |= Update;
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.effectTag |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Snapshot;
      }
    }

    // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.
    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;

  return shouldUpdate;
}
```

### finishClassComponent

1、没更新也没错误捕获直接跳过，不会进行重新渲染  
2、有错误捕获，class 组件没有 getDerivedStateFromError， nextChildren = null  
3、有错误捕获，class 组件有 getDerivedStateFromError ，直接执行 instance.render() 获得最新的 nextChildren, getDerivedStateFromError 在函数外 catch 到错误并且执行立即更新为正确的 state, 所以可以执行 instance.render()  
4、没捕获错误 执行nextChildren = instance.render();  
5、有错误强行计算child进行调和，调用forceUnmountCurrentAndReconcile  
6、正常情况直接调和子节点，调用reconcileChildren

```
function finishClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  shouldUpdate: boolean,
  hasContext: boolean,
  renderExpirationTime: ExpirationTime,
) {
  // ......

  // 没更新也没错误捕获直接跳过
  if (!shouldUpdate && !didCaptureError) {
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, false);
    }

    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderExpirationTime,
    );
  }

  const instance = workInProgress.stateNode;

  // Rerender
  ReactCurrentOwner.current = workInProgress;
  let nextChildren;
  // 有错误捕获
  if (
    didCaptureError &&
    typeof Component.getDerivedStateFromError !== 'function'
  ) {
    // If we captured an error, but getDerivedStateFrom catch is not defined,
    // unmount all the children. componentDidCatch will schedule an update to
    // re-render a fallback. This is temporary until we migrate everyone to
    // the new API.
    // TODO: Warn in a future release.
    // class 组件没有 getDerivedStateFromError， nextChildren = null
    nextChildren = null;

    if (enableProfilerTimer) {
      stopProfilerTimerIfRunning(workInProgress);
    }
  } else {
      // ......
      //class 组件有 getDerivedStateFromError ，直接执行 instance.render() 获得最新的 nextChildren, getDerivedStateFromError 在函数外 catch 到错误并且执行立即更新为正确的 state, 所以可以执行 instance.render()
      //没捕获错误 执行 instance.render()
      nextChildren = instance.render();
  }

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork;
  if (current !== null && didCaptureError) {
    // If we're recovering from an error, reconcile without reusing any of
    // the existing children. Conceptually, the normal children and the children
    // that are shown on error are two different sets, so we shouldn't reuse
    // normal children even if their identities match.
    // 有错误强行计算child进行调和，调用forceUnmountCurrentAndReconcile
    forceUnmountCurrentAndReconcile(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    // 正常情况直接调和子节点，调用reconcileChildren
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
  }

  // Memoize state using the values we just used to render.
  // TODO: Restructure so we never read values from the instance.
  workInProgress.memoizedState = instance.state;

  // The context might have changed so we need to recalculate it.
  if (hasContext) {
    invalidateContextProvider(workInProgress, Component, true);
  }

  return workInProgress.child;
}
```

## mountIndeterminateComponent

1、我们可以回到createFiberFromTypeAndProps函数查看，fiber 刚创建的时候 fiberTag 都为 IndeterminateComponent 类型，只有当 class 组件有 construct 才为 class 组件类型  
2、所以这个函数中做以下判断：  
符合 class 组件条件按 class 组件更新  
否则就按函数组件类型更新

注：只存在于首次更新的时候，只有首次更新的时候不确定 fiberTag 类型

```
function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderExpirationTime,
) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to tree it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null;
    // Since this is conceptually a new fiber, schedule a Placement effect
    workInProgress.effectTag |= Placement;
  }

  const props = workInProgress.pendingProps;
  const unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
  const context = getMaskedContext(workInProgress, unmaskedContext);

  prepareToReadContext(workInProgress, renderExpirationTime);

  let value;
  
  // ......
  value = Component(props, context);

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork;

  if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.render === 'function' &&
    value.$$typeof === undefined
  ) {
    // 按 class 组件更新
    // Proceed under the assumption that this is a class instance
    workInProgress.tag = ClassComponent;

    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    let hasContext = false;
    if (isLegacyContextProvider(Component)) {
      hasContext = true;
      pushLegacyContextProvider(workInProgress);
    } else {
      hasContext = false;
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null;

    const getDerivedStateFromProps = Component.getDerivedStateFromProps;
    if (typeof getDerivedStateFromProps === 'function') {
      applyDerivedStateFromProps(
        workInProgress,
        Component,
        getDerivedStateFromProps,
        props,
      );
    }

    adoptClassInstance(workInProgress, value);
    mountClassInstance(workInProgress, Component, props, renderExpirationTime);
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderExpirationTime,
    );
  } else {
    // 按 函数 组件更新
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;
    // ......
    reconcileChildren(null, workInProgress, value, renderExpirationTime);
    return workInProgress.child;
  }
}
```

## updateHostRoot

这种情况只会出现在ReactDOM.render渲染的时候  
1、调用processUpdateQueue得到新的state  
2、nextChildren = nextState.element  
3、第一次渲染mountChildFibers  
4、后续渲染reconcileChildren

```
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  pushHostRootContext(workInProgress);
  const updateQueue = workInProgress.updateQueue;
  invariant(
    updateQueue !== null,
    'If the root does not have an updateQueue, we should have already ' +
      'bailed out. This error is likely caused by a bug in React. Please ' +
      'file an issue.',
  );
  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState !== null ? prevState.element : null;
  processUpdateQueue(
    workInProgress,
    updateQueue,
    nextProps,
    null,
    renderExpirationTime,
  );
  const nextState = workInProgress.memoizedState;
  // Caution: React DevTools currently depends on this property
  // being called "element".
  const nextChildren = nextState.element;
  if (nextChildren === prevChildren) {
    // If the state is the same as before, that's a bailout because we had
    // no work that expires at this time.
    resetHydrationState();
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderExpirationTime,
    );
  }
  const root: FiberRoot = workInProgress.stateNode;
  if (
    (current === null || current.child === null) &&
    root.hydrate &&
    enterHydrationState(workInProgress)
  ) {
    // If we don't have any current children this might be the first pass.
    // We always try to hydrate. If this isn't a hydration pass there won't
    // be any children to hydrate which is effectively the same thing as
    // not hydrating.

    // This is a bit of a hack. We track the host root as a placement to
    // know that we're currently in a mounting state. That way isMounted
    // works as expected. We must reset this before committing.
    // TODO: Delete this when we delete isMounted and findDOMNode.
    workInProgress.effectTag |= Placement;

    // Ensure that children mount into this root without tracking
    // side-effects. This ensures that we don't store Placement effects on
    // nodes that will be hydrated.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
    resetHydrationState();
  }
  return workInProgress.child;
}
```

## updateHostComponent

1、dom 标签内是纯文本 nextChildren 为 null，直接渲染文本内容  
2、判断 concurrentMode 异步组件是否有 hidden 属性，异步组件 hidden 永不更新  
3、最后进行 reconcileChildren

```
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also have access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    //dom 标签内是纯文本 nextChildren 为 null，直接渲染文本内容
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.effectTag |= ContentReset;
  }

  markRef(current, workInProgress);

  // Check the host config to see if the children are offscreen/hidden.
  if (
    renderExpirationTime !== Never &&
    workInProgress.mode & ConcurrentMode &&
    shouldDeprioritizeSubtree(type, nextProps)
  ) {
    // Schedule this fiber to re-render at offscreen priority. Then bailout.
    //判断 concurrentMode 异步组件是否有 hidden 属性，异步组件 hidden 永不更新
    workInProgress.expirationTime = Never;
    return null;
  }

  // 最后进行 reconcileChildren
  reconcileChildren(
    current,
    workInProgress,
    nextChildren,
    renderExpirationTime,
  );
  return workInProgress.child;
}
```

## updateHostText

文本内容不需要构建 fiber 结构，直接在提交阶段更新就行了，所以直接return null

```
function updateHostText(current, workInProgress) {
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }
  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  // 文本内容不需要构建 fiber 结构，直接在提交阶段更新就行了，所以直接return null
  return null;
}
```

文章如有不妥，欢迎指正~