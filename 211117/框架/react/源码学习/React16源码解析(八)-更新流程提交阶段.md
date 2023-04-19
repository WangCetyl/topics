#React16源码解析(八)-更新流程提交阶段
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

提交阶段相比于渲染阶段要简单很多，因为大部分更新的前期操作都在渲染阶段做好了。提交阶段的主要任务也就是把之前记录好的更新操作反映到真实的dom上，并且这个过程是不能中断的。

## commitRoot

1、检查 finishedWork 是否也有 effect ，如有插入 effect 链表中  
2、第一次遍历effect链，更新class组件实例上的state,props，执行getSnapshotBeforeUpdate生命周期  
3、第二次遍历effect链，不同的effectTag，执行不同的操作，比如重置文本节点，执行 插入、更新、删除等的 effect 操作，真正的对 dom 进行修改。  
4、第三次遍历effect链，这次遍历就是做一些收尾工作。执行componentDidMount、componentDidUpdate，更新的回调函数等。  
5、做一些 还原变量 等的收尾工作。

下面会着重讲解effect链表的三次遍历。

```
function commitRoot(root: FiberRoot, finishedWork: Fiber): void {
  isWorking = true;
  isCommitting = true;
  // ......

  // 检查 finishedWork 是否也有 effect ，如有插入 effect 链表中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if
    // it had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  prepareForCommit(root.containerInfo);

  // Invoke instances of getSnapshotBeforeUpdate before mutation.
  nextEffect = firstEffect;
  startCommitSnapshotEffectsTimer();
  // 第一次遍历
  while (nextEffect !== null) {
    let didError = false;
    let error;
    commitBeforeMutationLifecycles();
    // ......
  }
  // ......
  // Commit all the side-effects within a tree. We'll do this in two passes.
  // The first pass performs all the host insertions, updates, deletions and
  // ref unmounts.
  nextEffect = firstEffect;
  startCommitHostEffectsTimer();
  // 第二次遍历
  while (nextEffect !== null) {
    let didError = false;
    let error;
    // ......
    commitAllHostEffects();
    // ......
  }
  stopCommitHostEffectsTimer();

  resetAfterCommit(root.containerInfo);

  // The work-in-progress tree is now the current tree. This must come after
  // the first pass of the commit phase, so that the previous tree is still
  // current during componentWillUnmount, but before the second pass, so that
  // the finished work is current during componentDidMount/Update.
  root.current = finishedWork;

  // In the second pass we'll perform all life-cycles and ref callbacks.
  // Life-cycles happen as a separate pass so that all placements, updates,
  // and deletions in the entire tree have already been invoked.
  // This pass also triggers any renderer-specific initial effects.
  nextEffect = firstEffect;
  startCommitLifeCyclesTimer();
  // 第三次遍历
  while (nextEffect !== null) {
    commitAllLifeCycles(root, committedExpirationTime);
  }

  // 下面做一些 还原变量 等的收尾工作
  isCommitting = false;
  isWorking = false;
  stopCommitLifeCyclesTimer();
  stopCommitTimer();
  onCommitRoot(finishedWork.stateNode);

  const updateExpirationTimeAfterCommit = finishedWork.expirationTime;
  const childExpirationTimeAfterCommit = finishedWork.childExpirationTime;
  const earliestRemainingTimeAfterCommit =
    updateExpirationTimeAfterCommit === NoWork ||
    (childExpirationTimeAfterCommit !== NoWork &&
      childExpirationTimeAfterCommit < updateExpirationTimeAfterCommit)
      ? childExpirationTimeAfterCommit
      : updateExpirationTimeAfterCommit;
  if (earliestRemainingTimeAfterCommit === NoWork) {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }
  onCommit(root, earliestRemainingTimeAfterCommit);
  // ......
}
```

## 第一次遍历-commitBeforeMutationLifecycles

遍历effect链  
在这个循环中，组件的state已经更新，但是节点还没有更新。

```
function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;
    if (effectTag & Snapshot) {
      recordEffect();
      const current = nextEffect.alternate;
      // 这里调用的是下面的方法，名字一样
      commitBeforeMutationLifeCycles(current, nextEffect);
    }

    // Don't cleanup effects yet;
    // This will be done by commitAllLifeCycles()
    nextEffect = nextEffect.nextEffect;
  }
}
```

以下方法做的主要事情：  
1、在 class 组件中通过 prevProps, prevState 获取状态快照，用于 componentDidUpdate 生命周期  
2、状态快照的获取通过 getSnapshotBeforeUpdate 生命周期执行后的返回值  
commitBeforeMutationLifeCycles 中只有在更新任务是 classComponent 时才有工作

```
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
  switch (finishedWork.tag) {
    case ClassComponent: {
      if (finishedWork.effectTag & Snapshot) {
        if (current !== null) {
          // 不是初次加载
          // 组件初次加载执行 DidMount 生命周期函数不走 DidUpdate 不需要保存快照对象
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          startPhaseTimer(finishedWork, 'getSnapshotBeforeUpdate');
          // 得到当前class组件的实例
          const instance = finishedWork.stateNode;
          // 更新实例上的props和state
          instance.props = finishedWork.memoizedProps;
          instance.state = finishedWork.memoizedState;
          // 调用getSnapshotBeforeUpdate生命周期方法
          const snapshot = instance.getSnapshotBeforeUpdate(
            prevProps,
            prevState,
          );
          // 保存到instance.__reactInternalSnapshotBeforeUpdate 给 DidUpdate生命周期方法使用
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
          stopPhaseTimer();
        }
      }
      return;
    }
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
    default: {
      // ......
    }
  }
}
```

## 第二次遍历-commitAllHostEffects

1、遍历effect链  
2、不同的effectTag，执行不同的操作，比如重置文本节点，执行 插入、更新、删除等的 effect 操作，真正的对 dom 进行修改。

下面我开始讲解三种节点的操作：  
1、插入节点 - commitPlacement  
2、更新节点 - commitWork  
3、删除节点 - commitDeletion

```
function commitAllHostEffects() {
  // 遍历effect链
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 重置文本节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every
    // possible bitmap value, we remove the secondary effects from the
    // effect tag and switch on that value.
    let primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement: {
        // 插入节点
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted
        // does and isMounted is deprecated anyway so we should be able
        // to kill this.
        // 删除effectTag
        nextEffect.effectTag &= ~Placement;
        break;
      }
      case PlacementAndUpdate: {
        // 插入并且更新
        // 插入节点
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement;

        //  更新节点
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      case Deletion: {
        // 删除节点
        commitDeletion(nextEffect);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

### commitPlacement

1、找到 finishedWork 的父节点 parentFiber。寻找的是原生的dom节点对应的fiber。如果父级不是原生dom，则继续往上寻找。  
2、得到parentFiber对应的原生dom节点parent  
3、找到插入节点的后一个节点，因为我要插在它前面  
4、用insertBefore或者appendChild进行子节点插入操作

注：第4步插入操作需要分情况，比如如果是原生dom节点是直接插入，如果是Class子节点是需要深度优先遍历子节点进行插入的。

```
function commitPlacement(finishedWork: Fiber): void {
  if (!supportsMutation) {
    return;
  }

  // Recursively insert all host nodes into the parent.
  // 找到 finishedWork 的父节点 parentFiber。寻找的是原生的dom节点对应的fiber。如果父级不是原生dom，则继续往上寻找
  // 所以parentFiber只有三种类型的节点：HostComponent、HostRoot、HostPortal
  const parentFiber = getHostParentFiber(finishedWork);

  // Note: these two variables *must* always be updated together.
  let parent;
  let isContainer;

  // 得到原生dom节点 : parent
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentFiber.stateNode;
      isContainer = false;
      break;
    case HostRoot:
      parent = parentFiber.stateNode.containerInfo;
      isContainer = true;
      break;
    case HostPortal:
      parent = parentFiber.stateNode.containerInfo;
      isContainer = true;
      break;
    default:
      // ......
  }
  if (parentFiber.effectTag & ContentReset) {
    // Reset the text content of the parent before doing any insertions
    resetTextContent(parent);
    // Clear ContentReset from the effect tag
    parentFiber.effectTag &= ~ContentReset;
  }

  // 这里操作 dom 使用的是 insertBefore 原生api
  // 所以需要得到插入节点的后一个节点，因为我要插在它前面
  const before = getHostSibling(finishedWork);
  // We only have the top Fiber that was inserted but we need recurse down its
  // children to find all the terminal nodes.
  let node: Fiber = finishedWork;
  while (true) {
    // 如果当前节点是原始dom节点就直接进行插入
    if (node.tag === HostComponent || node.tag === HostText) {
      if (before) {
        // 有before就用insertBefore
        if (isContainer) {
          insertInContainerBefore(parent, node.stateNode, before);
        } else {
          insertBefore(parent, node.stateNode, before);
        }
      } else {
        // 没有before就用appendChild
        if (isContainer) {
          appendChildToContainer(parent, node.stateNode);
        } else {
          appendChild(parent, node.stateNode);
        }
      }
    } else if (node.tag === HostPortal) {
      // 是HostPortal直接跳过，因为不是插在这里的
      // If the insertion itself is a portal, then we don't want to traverse
      // down its children. Instead, we'll get insertions from each child in
      // the portal directly.
    } else if (node.child !== null) {
      // 上面条件不满足其实就是class组件
      // 查看子节点是否存在，存在的话把子节点进行插入 continue
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === finishedWork) {
      // 对finishedWork已经结束
      return;
    }
    // 其实这是一个深度优先遍历
    // 深度优先遍历class组件的子节点，把class组件的原生dom节点全部进行插入操作
    // 下面是深度优先遍历的退回过程，如果没有兄弟节点，就往上退回
    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
```

getHostSibling：  
这个函数其实是找我要插入的节点（finishedWork）的下一个dom节点，因为我要插在这个节点前面嘛。所以这个函数做的事情就是：剔除掉所有的非原始dom节点，找到我想要的dom节点。  
注：HostPortal也是要被剔除的，因为它不是挂载在这个地方的嘛。

```
function getHostSibling(fiber: Fiber): ?Instance {
  // We're going to search forward into the tree until we find a sibling host
  // node. Unfortunately, if multiple insertions are done in a row we have to
  // search past them. This leads to exponential search for the next sibling.
  // TODO: Find a more efficient way to do this.
  let node: Fiber = fiber;
  // 外层while循环
  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    // 如果没有兄弟节点，向上查找父节点，但是这个父节点不能是原生dom节点
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // 如果到了根节点root了 或者 是原生dom节点  返回 null 说明在真实的dom中 插入的这个节点没有兄弟节点
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null;
      }
      node = node.return;
    }
    // 下面是有兄弟节点的情况
    node.sibling.return = node.return;
    node = node.sibling;
    // 兄弟节点不是HostComponent也不是HostText
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      // 兄弟节点也是将要插入的节点，跳过这个节点查找下一个兄弟节点
      if (node.effectTag & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings;
      }
      // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.
      // 如果没有子节点或者是HostPortal也跳过这个节点查找下一个兄弟节点
      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        // 否则返回兄弟节点的子节点
        node.child.return = node;
        node = node.child;
      }
    }
    // Check if this host node is stable or about to be placed.
    // 如果兄弟节点也是新增节点，寻找下一个兄弟节点
    // 否则，就找到了！
    if (!(node.effectTag & Placement)) {
      // Found it!
      return node.stateNode;
    }
  }
}
```

### commitWork

1、commitWork 只会更新 HostComponent(dom 节点) 和 HostText(文本节点)  
2、HostComponent调用commitUpdate更新  
3、HostText调用commitTextUpdate更新

```
function commitWork(current: Fiber | null, finishedWork: Fiber): void {
  // ......

  switch (finishedWork.tag) {
    case ClassComponent: {
      return;
    }
    case HostComponent: {
      // 更新dom标签节点
      const instance: Instance = finishedWork.stateNode;
      if (instance != null) {
        // Commit the work prepared earlier.
        // 提取新的props
        const newProps = finishedWork.memoizedProps;
        // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.
        // 提取老的props
        const oldProps = current !== null ? current.memoizedProps : newProps;
        const type = finishedWork.type;
        // TODO: Type the updateQueue to be specific to host components.
        // 取出updateQueue
        const updatePayload: null | UpdatePayload = (finishedWork.updateQueue: any);
        // 清空updateQueue
        finishedWork.updateQueue = null;
        if (updatePayload !== null) {
          // 进行更新
          commitUpdate(
            instance,
            updatePayload,
            type,
            oldProps,
            newProps,
            finishedWork,
          );
        }
      }
      return;
    }
    case HostText: {
      // 更新文本节点
      const textInstance: TextInstance = finishedWork.stateNode;
      // 提取新老文本内容
      const newText: string = finishedWork.memoizedProps;
      // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.
      const oldText: string =
        current !== null ? current.memoizedProps : newText;
      commitTextUpdate(textInstance, oldText, newText);
      return;
    }
    case HostRoot: {
      return;
    }
    case Profiler: {
      return;
    }
    case SuspenseComponent: {
      return;
    }
    case IncompleteClassComponent: {
      return;
    }
    default: {
      // ......
    }
  }
}
```

commitUpdate：

```
export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
): void {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  // 这里只是： domElement[__reactEventHandlers$] = newProps
  updateFiberProps(domElement, newProps);

  // Apply the diff to the DOM node.
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}
```

updateProperties：  
1、针对特殊的标签有特殊的处理，比如表单  
2、调用updateDOMProperties把之前的diff结果应用的真实dom上面

```

// Apply the diff.
export function updateProperties(
  domElement: Element,
  updatePayload: Array<any>,
  tag: string,
  lastRawProps: Object,
  nextRawProps: Object,
): void {
  // Update checked *before* name.
  // In the middle of an update, it is possible to have multiple checked.
  // When a checked radio tries to change name, browser makes another radio's checked false.
  // 针对表单的特殊标签
  if (
    tag === 'input' &&
    nextRawProps.type === 'radio' &&
    nextRawProps.name != null
  ) {
    ReactDOMInput.updateChecked(domElement, nextRawProps);
  }

  // 判断是否是自定义标签 即标签名中有 ‘-’
  const wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
  const isCustomComponentTag = isCustomComponent(tag, nextRawProps);
  // Apply the diff.
  // 把之前的diff结果应用的真实dom上面
  updateDOMProperties(
    domElement,
    updatePayload,
    wasCustomComponentTag,
    isCustomComponentTag,
  );

  // TODO: Ensure that an update gets scheduled if any of the special props
  // changed.
  // 针对表单做一些特殊的处理
  switch (tag) {
    case 'input':
      // Update the wrapper around inputs *after* updating props. This has to
      // happen after `updateDOMProperties`. Otherwise HTML5 input validations
      // raise warnings and prevent the new value from being assigned.
      ReactDOMInput.updateWrapper(domElement, nextRawProps);
      break;
    case 'textarea':
      ReactDOMTextarea.updateWrapper(domElement, nextRawProps);
      break;
    case 'select':
      // <select> value update needs to occur after <option> children
      // reconciliation
      ReactDOMSelect.postUpdateWrapper(domElement, nextRawProps);
      break;
  }
}
```

updateDOMProperties：  
1、把我们之前渲染阶段生成的updatePayload: \[k1,null,k2,v2,k3,v3\]应用到真实的dom上。  
2、对一些dom节点上特殊的属性做特殊的处理，比如style、dangerouslySetInnerHTML等

```
function updateDOMProperties(
  domElement: Element,
  updatePayload: Array<any>,
  wasCustomComponentTag: boolean,
  isCustomComponentTag: boolean,
): void {
  // TODO: Handle wasCustomComponentTag
  // 遍历updatePayload
  for (let i = 0; i < updatePayload.length; i += 2) {
    // 取出key 和 value
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      // 如果是样式更新
      CSSPropertyOperations.setValueForStyles(domElement, propValue);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      // 如果是dangerouslySetInnerHTML
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      // 如果是文本
      setTextContent(domElement, propValue);
    } else {
      // 否则正常的更新节点的属性
      DOMPropertyOperations.setValueForProperty(
        domElement,
        propKey,
        propValue,
        isCustomComponentTag,
      );
    }
  }
}
```

commitTextUpdate：  
文本节点的更新就非常简单了

```
export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string,
): void {
  textInstance.nodeValue = newText;
}
```

### commitDeletion

在我们删除一个节点时候，你可能简单的想一下，就把一个节点删除就好了呀。其实没这么简单哦。  
删除一个节点时候，是需要去遍历整颗子树的。第一，如果dom节点下面还有class组件，那么我们是要调用它的生命周期方法的（componentWillUnmount），第二，如果有HostPortal，那么还要去删除HostPortal中的节点，所以我们必须要遍历子树的。这里的遍历采用树的深度优先遍历。

react用了三个函数用循环+递归深度优先遍历了整颗子树。

```
function commitDeletion(current: Fiber): void {
  // Recursively delete all host nodes from the parent.
  // Detach refs and call componentWillUnmount() on the whole subtree.
  unmountHostComponents(current);
  // ......
  detachFiber(current);
}
```

unmountHostComponents：

```
function unmountHostComponents(current): void {
  // We only have the top Fiber that was deleted but we need recurse down its
  // children to find all the terminal nodes.
  let node: Fiber = current;

  // Each iteration, currentParent is populated with node's host parent if not
  // currentParentIsValid.
  let currentParentIsValid = false;

  // Note: these two variables *must* always be updated together.
  let currentParent;
  let currentParentIsContainer;

  while (true) {
    // 找的父节点，这个父节点一定是个dom节点
    if (!currentParentIsValid) {
      let parent = node.return;
      findParent: while (true) {
        invariant(
          parent !== null,
          'Expected to find a host parent. This error is likely caused by ' +
            'a bug in React. Please file an issue.',
        );
        switch (parent.tag) {
          case HostComponent:
            currentParent = parent.stateNode;
            currentParentIsContainer = false;
            break findParent;
          case HostRoot:
            currentParent = parent.stateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;
          case HostPortal:
            currentParent = parent.stateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;
        }
        parent = parent.return;
      }
      currentParentIsValid = true;
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      // 如果是原生dom节点
      commitNestedUnmounts(node);
      // After all the children have unmounted, it is now safe to remove the
      // node from the tree.
      if (currentParentIsContainer) {
        removeChildFromContainer((currentParent: any), node.stateNode);
      } else {
        removeChild((currentParent: any), node.stateNode);
      }
      // Don't visit children because we already visited them.
    } else if (node.tag === HostPortal) {
      // 如果是HostPortal不会做什么操作，直接向下遍历子节点  因为它没有ref，也没有生命周期
      // When we go into a portal, it becomes the parent to remove from.
      // We will reassign it back when we pop the portal on the way up.
      currentParent = node.stateNode.containerInfo;
      currentParentIsContainer = true;
      // Visit children because portals might contain host components.
      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    } else {
      // 到这里的话，其实就是react组件节点了，调用commitUnmount，这个方法里会有生命周期的调用，ref的卸载
      commitUnmount(node);
      // Visit children because we may find more host components below.
      // 继续遍历子节点
      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }
    // 整棵树遍历完成
    if (node === current) {
      return;
    }
    // 如果没有兄弟节点，深度优先遍历可以向父节点返回了
    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return;
      }
      node = node.return;
      if (node.tag === HostPortal) {
        // When we go out of the portal, we need to restore the parent.
        // Since we don't keep a stack of them, we will search for it.
        currentParentIsValid = false;
      }
    }
    // 到这里代表已经没有子节点了，就向兄弟节点方向遍历
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
```

commitNestedUnmounts：  
这个方法使用深度优先遍历整颗dom节点为父节点的树。子节点还有可能是react组件或者HostPortal。  
这里对每个节点都要调用commitUnmount。如果遇到了HostPortal就会停止对它下面的子树进行遍历，因为在commitUnmount中会对HostPortal类型有个特殊的处理。下面再看。

```
function commitNestedUnmounts(root: Fiber): void {
  // While we're inside a removed host node we don't want to call
  // removeChild on the inner nodes because they're removed by the top
  // call anyway. We also want to call componentWillUnmount on all
  // composites before this host node is removed from the tree. Therefore
  // we do an inner loop while we're still inside the host node.
  let node: Fiber = root;
  while (true) {
    commitUnmount(node);
    // Visit children because they may contain more composite or host nodes.
    // Skip portals because commitUnmount() currently visits them recursively.
    if (
      node.child !== null &&
      // If we use mutation we drill down into portals using commitUnmount above.
      // If we don't use mutation we drill down into portals here instead.
      (!supportsMutation || node.tag !== HostPortal)
    ) {
      // 如果是HostPortal就直接跳过子树的遍历，所以下面不执行
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === root) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
```

commitUnmount：  
这个方法会对不同的节点做不同的处理，对ClassComponent会执行它的生命周期以及卸载ref，对HostComponent卸载ref，对HostPortal重新调用unmountHostComponents，这里我们就明白了为什么上一个方法遇到HostPortal就停止了对它的子树的遍历，因为它会重新递归调用unmountHostComponents遍历子树。

```
function commitUnmount(current: Fiber): void {
  onCommitUnmount(current);

  switch (current.tag) {
    case ClassComponent: {
      // 卸载ref
      safelyDetachRef(current);
      const instance = current.stateNode;
      // 执行WillUnmount方法，这个时候真实dom还没有卸载，即将卸载
      if (typeof instance.componentWillUnmount === 'function') {
        safelyCallComponentWillUnmount(current, instance);
      }
      return;
    }
    case HostComponent: {
      // 卸载ref
      safelyDetachRef(current);
      return;
    }
    case HostPortal: {
      // TODO: this is recursive.
      // We are also not using this parent because
      // the portal will get pushed immediately.
      // 递归调用，遍历子树
      unmountHostComponents(current);
      // ......
      return;
    }
  }
}
```

## 第三次遍历-commitAllLifeCycles

这次遍历就是做一些收尾工作。

1、首次渲染执行componentDidMount  
2、更新渲染执行 componentDidUpdate  
3、执行 setState 的 callback 回调函数  
4、清空commitUpdateQueue

```
function commitAllLifeCycles(
  finishedRoot: FiberRoot,
  committedExpirationTime: ExpirationTime,
) {
  // 循环effect链
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 有更新或者有回调函数
    if (effectTag & (Update | Callback)) {
      recordEffect();
      const current = nextEffect.alternate;
      commitLifeCycles(
        finishedRoot,
        current,
        nextEffect,
        committedExpirationTime,
      );
    }

    if (effectTag & Ref) {
      recordEffect();
      commitAttachRef(nextEffect);
    }

    const next = nextEffect.nextEffect;
    // Ensure that we clean these up so that we don't accidentally keep them.
    // I'm not actually sure this matters because we can't reset firstEffect
    // and lastEffect since they're on every node, not just the effectful
    // ones. So we have to clean everything as we reuse nodes anyway.
    nextEffect.nextEffect = null;
    // Ensure that we reset the effectTag here so that we can rely on effect
    // tags to reason about the current life-cycle.
    nextEffect = next;
  }
}

```

commitLifeCycles：  
这个方法会执行componentDidMount或者componentDidUpdate生命周期方法，最后调用commitUpdateQueue。

```
function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedExpirationTime: ExpirationTime,
): void {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const instance = finishedWork.stateNode;
      if (finishedWork.effectTag & Update) {
        if (current === null) {
          // 首次渲染
          startPhaseTimer(finishedWork, 'componentDidMount');
          instance.props = finishedWork.memoizedProps;
          instance.state = finishedWork.memoizedState;
          instance.componentDidMount();
          stopPhaseTimer();
        } else {
          // 组件更新
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          startPhaseTimer(finishedWork, 'componentDidUpdate');
          instance.props = finishedWork.memoizedProps;
          instance.state = finishedWork.memoizedState;
          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate,
          );
          stopPhaseTimer();
        }
      }
      const updateQueue = finishedWork.updateQueue;
      if (updateQueue !== null) {
        instance.props = finishedWork.memoizedProps;
        instance.state = finishedWork.memoizedState;
        commitUpdateQueue(
          finishedWork,
          updateQueue,
          instance,
          committedExpirationTime,
        );
      }
      return;
    }
    case HostRoot: {
      const updateQueue = finishedWork.updateQueue;
      if (updateQueue !== null) {
        let instance = null;
        if (finishedWork.child !== null) {
          switch (finishedWork.child.tag) {
            case HostComponent:
              instance = getPublicInstance(finishedWork.child.stateNode);
              break;
            case ClassComponent:
              instance = finishedWork.child.stateNode;
              break;
          }
        }
        // 因为ReactDOM.render也有回调函数  所以也要调用commitUpdateQueue
        commitUpdateQueue(
          finishedWork,
          updateQueue,
          instance,
          committedExpirationTime,
        );
      }
      return;
    }
    case HostComponent: {
      const instance: Instance = finishedWork.stateNode;

      // Renderers may schedule work to be done after host components are mounted
      // (eg DOM renderer may schedule auto-focus for inputs and form controls).
      // These effects should only be committed when components are first mounted,
      // aka when there is no current/alternate.
      if (current === null && finishedWork.effectTag & Update) {
        const type = finishedWork.type;
        const props = finishedWork.memoizedProps;
        // 这个函数只是对input标签有 auto-focus 的情况进行处理
        commitMount(instance, type, props, finishedWork);
      }

      return;
    }
    case HostText: ......
    case HostPortal: ......
    case Profiler: ......
    case SuspenseComponent: ......
    case IncompleteClassComponent:......
    default: {
      // ......
    }
  }
}
```

commitUpdateQueue:  
1、调用commitUpdateEffects  
2、清空commitUpdateQueue

```
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  // ......
  // Commit the effects
  commitUpdateEffects(finishedQueue.firstEffect, instance);
  // 清空commitUpdateQueue
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;
  // ......
}
```

commitUpdateEffects:  
调用effect上的回调函数。

```
function commitUpdateEffects<State>(
  effect: Update<State> | null,
  instance: any,
): void {
  while (effect !== null) {
    const callback = effect.callback;
    if (callback !== null) {
      // 调用回调函数，也就是setState的回调函数
      effect.callback = null;
      callCallback(callback, instance);
    }
    effect = effect.nextEffect;
  }
}
```

文章如有不妥，欢迎指正~