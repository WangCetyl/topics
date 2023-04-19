# React16源码解析(七)-更新流程渲染阶段3
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

还记得我们在performUnitOfWork中调用了beginWork，beginWork会沿着子树一直更新，每次都会返回当前节点的child。就算有多个child也只会返回第一个。那么沿着树的结构到达叶子节点的时候，已经没有child了，所以beginWork返回null。如果返回null的话，就会调用completeUnitOfWork。  
再瞧一眼代码：

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

  // 当前fiber树已经到达叶子节点了
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(workInProgress);
  }

  ReactCurrentOwner.current = null;

  return next;
}
```

## completeUnitOfWork

这个completeUnitOfWork干了什么呢？主要有以下三点：  
1、根据是否中断调用不同的处理方法  
2、判断是否有兄弟节点来执行不同的操作  
3、完成节点之后赋值effect链

```
function completeUnitOfWork(workInProgress: Fiber): Fiber | null {
  // Attempt to complete the current unit of work, then move to the
  // next sibling. If there are no more siblings, return to the
  // parent fiber.
  while (true) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
    const current = workInProgress.alternate;

    const returnFiber = workInProgress.return;
    const siblingFiber = workInProgress.sibling;

    // 没有错误捕获，正常的渲染逻辑
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      // This fiber completed.
      // 完成节点的更新
      nextUnitOfWork = completeWork(
        current,
        workInProgress,
        nextRenderExpirationTime,
      );
      // 重置 childExpirationTime
      resetChildExpirationTime(workInProgress, nextRenderExpirationTime);

      // 构建 effect 链，供 commitRoot 提交阶段使用
      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        // 把自己身上的effect链粘在父节点的effect后面
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber. .nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if
        // needed, by doing multiple passes over the effect list. We don't want
        // to schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        const effectTag = workInProgress.effectTag;
        // Skip both NoWork and PerformedWork tags when creating the effect list.
        // PerformedWork effect is read by React DevTools but shouldn't be committed.
        // 发现自己本身也有effect ， 那么要把自己也加入父节点的effect链上
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }

      // 有兄弟节点返回兄弟节点，继续走beinWork
      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber;
      } else if (returnFiber !== null) {
        // 没有兄弟节点找父节点
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber;
        continue;
      } else {
        // We've reached the root.
        // 一直向上或者向右找兄弟节点，找到null到达root顶点结束，更新阶段完成准备进入commitRoot提交阶段
        return null;
      }
    } else {
        // ......
        return null;
    }
  }

  // Without this explicit null return Flow complains of invalid return type
  // TODO Remove the above while(true) loop
  // eslint-disable-next-line no-unreachable
  return null;
}
```

## completeWork

通过下面函数我们可以看到，函数根据workInProgress.tag对不同的类型节点做不同的处理，对大部分 tag 不进行操作或者只是 pop context，只有 HostComponent, HostText, SuspenseComponent 有稍微复杂点的操作。接下来我主要分析HostComponent和HostText。SuspenseComponent后续再进行讲解。

```
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      break;
    case LazyComponent:
      break;
    case SimpleMemoComponent:
    case FunctionComponent:
      break;
    case ClassComponent: {
      const Component = workInProgress.type;
      if (isLegacyContextProvider(Component)) {
        popLegacyContext(workInProgress);
      }
      break;
    }
    case HostRoot: {
      popHostContainer(workInProgress);
      popTopLevelLegacyContextObject(workInProgress);
      const fiberRoot = (workInProgress.stateNode: FiberRoot);
      if (fiberRoot.pendingContext) {
        fiberRoot.context = fiberRoot.pendingContext;
        fiberRoot.pendingContext = null;
      }
      if (current === null || current.child === null) {
        // If we hydrated, pop so that we can delete any remaining children
        // that weren't hydrated.
        popHydrationState(workInProgress);
        // This resets the hacky state to fix isMounted before committing.
        // TODO: Delete this when we delete isMounted and findDOMNode.
        workInProgress.effectTag &= ~Placement;
      }
      updateHostContainer(workInProgress);
      break;
    }
    case HostComponent: {
      // 这里稍微复杂，稍后讲解
      break;
    }
    case HostText: {
      // 稍后讲解
      break;
    }
    case ForwardRef:
      break;
    case SuspenseComponent: {
      const nextState = workInProgress.memoizedState;
      const prevState = current !== null ? current.memoizedState : null;
      const nextDidTimeout = nextState !== null && nextState.didTimeout;
      const prevDidTimeout = prevState !== null && prevState.didTimeout;
      if (nextDidTimeout !== prevDidTimeout) {
        // If this render commits, and it switches between the normal state
        // and the timed-out state, schedule an effect.
        workInProgress.effectTag |= Update;
      }
      break;
    }
    case Fragment:
      break;
    case Mode:
      break;
    case Profiler:
      break;
    case HostPortal:
      popHostContainer(workInProgress);
      updateHostContainer(workInProgress);
      break;
    case ContextProvider:
      // Pop provider fiber
      popProvider(workInProgress);
      break;
    case ContextConsumer:
      break;
    case MemoComponent:
      break;
    case IncompleteClassComponent: {
      // Same as class component case. I put it down here so that the tags are
      // sequential to ensure this switch is compiled to a jump table.
      const Component = workInProgress.type;
      if (isLegacyContextProvider(Component)) {
        popLegacyContext(workInProgress);
      }
      break;
    }
    default:
      invariant(
        false,
        'Unknown unit of work tag. This error is likely caused by a bug in ' +
          'React. Please file an issue.',
      );
  }

  return null;
}
```

## HostComponent

之前我们已经讲过，tag 为 HostComponent 表示普通 dom 节点，如: div。

简单概括：  
1、createInstance： 创建dom  
2、appendAllChildren： 将children的host Component添加到刚创建的dom上 组成dom树。  
3、finalizeInitialChildren： 给dom设置属性。

```
case HostComponent: {
      popHostContext(workInProgress);
      const rootContainerInstance = getRootHostContainer();
      const type = workInProgress.type;
      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance,
        );

        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        // 首次渲染
        // ......
        // 创建instance ， 就是创建dom节点对象 ， 这个对象包含了fiber，和 props 信息
        let instance = createInstance(
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
        workInProgress,
        );

        // 构建dom树，因为我们是从下往上的，所以我们只需把我下面第一层子节点append到自己下面就好了
        appendAllChildren(instance, workInProgress, false, false);

        // Certain renderers require commit-time effects for initial mount.
        // (eg DOM renderer supports auto-focus for certain elements).
        // Make sure such renderers get scheduled for later work.
        if (
        // 设置属性，初始化事件监听
        finalizeInitialChildren(
            instance,
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
        )
        ) {
        // 如果需要 auto focus
        // 标记effect为UPDATE
        markUpdate(workInProgress);
        }
        // stateNode指向创建好的dom节点
        workInProgress.stateNode = instance;
        // ......
      }
      break;
    }
```

接下来我们先将首次渲染的情况

### createInstance

1、创建 dom 节点  
2、在 dom 节点对象上记录此次创建的 fiber 和 props 信息

```
export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object, // 传入的当前节点的workInProgress
): Instance {
  let parentNamespace: string;
  // ......
  parentNamespace = ((hostContext: any): HostContextProd);
  // 创建dom节点
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );
  // 给domElement[__reactInternalInstance$] = internalInstanceHandle。
  // 也就是指向了对应的fiber节点
  precacheFiberNode(internalInstanceHandle, domElement);
  // domElement[__reactEventHandlers$] = props
  updateFiberProps(domElement, props);
  return domElement;
}
```

### appendAllChildren

因为我们是从下往上的，所以我们只需把我下面第一层子节点append到自己下面就好了。  
1、对node 的 sibling兄弟节点进行遍历  
2、如果是dom原生节点或者是文本，直接appendChild  
3、如果是其他节点但是有子节点，那么转而去遍历它的子节点，直到找到dom原生节点或者是文本

```
   appendAllChildren = function(
    parent: Instance,
    workInProgress: Fiber,
    needsVisibilityToggle: boolean,
    isHidden: boolean,
  ) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    let node = workInProgress.child;
    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        // 如果是dom原生节点或者是文本，直接appendChild
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal) {
        // If we have a portal child, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.child !== null) {
        // 如果是其他节点但是有子节点，那么转而去遍历它的子节点，直到找到dom原生节点或者是文本
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === workInProgress) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }
        node = node.return;
      }
      // 对node 的 sibling兄弟节点进行遍历
      node.sibling.return = node.return;
      node = node.sibling;
    }
  };
```

### finalizeInitialChildren

主要是设置dom元素的一些初始值。在设置初始值的时候对应不同的dom元素有特殊的处理。这些处理都在setInitialProperties函数中。

export function finalizeInitialChildren(  
domElement: Instance,  
type: string,  
props: Props,  
rootContainerInstance: Container,  
hostContext: HostContext,  
): boolean {  
// 把props对应的应该在dom节点上展现的attributes，如何在挂载到Dom，还有一些事件监听相关。  
setInitialProperties(domElement, type, props, rootContainerInstance);  
// 是否需要 auto focus  
return shouldAutoFocusHostComponent(type, props);  
}

### updateHostComponent

1、调用prepareUpdate得到新老props比较后的结果  
2、把结果放到workInProgress.updateQueue  
3、标记当前节点的effect 为 UPDATE

注：比较后形成的结果是这样的：updatePayload: \[k1,null,k2,v2,k3,v3\]

```
updateHostComponent = function(
    current: Fiber,
    workInProgress: Fiber,
    type: Type,
    newProps: Props,
    rootContainerInstance: Container,
  ) {
    // If we have an alternate, that means this is an update and we need to
    // schedule a side-effect to do the updates.
    // 之前的oldProps
    const oldProps = current.memoizedProps;
    if (oldProps === newProps) {
      // In mutation mode, this is sufficient for a bailout because
      // we won't touch this node even if children changed.
      return;
    }

    // If we get updated because one of our children updated, we don't
    // have newProps so we'll have to reuse them.
    // TODO: Split the update API as separate for the props vs. children.
    // Even better would be if children weren't special cased at all tho.
    // 当前节点的dom对象
    const instance: Instance = workInProgress.stateNode;
    const currentHostContext = getHostContext();
    // TODO: Experiencing an error where oldProps is null. Suggests a host
    // component is hitting the resume path. Figure out why. Possibly
    // related to `hidden`.
    // 得到新老props比较后的结果
    const updatePayload = prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      currentHostContext,
    );
    // TODO: Type this specific to this type of component.
    // 把结果放到workInProgress.updateQueue
    workInProgress.updateQueue = (updatePayload: any);
    // If the update payload indicates that there is a change or if there
    // is a new ref we mark this as an update. All the work is done in commitWork.
    if (updatePayload) {
      // 标记当前节点的effect 为 UPDATE
      markUpdate(workInProgress);
    }
  };
```

prepareUpdate：  
这个函数只是调用了diffProperties并且返回

```
export function prepareUpdate(
  domElement: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): null | Array<mixed> {
  
  return diffProperties(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
  );
}
```

### diffProperties

1、根据不同标签节点提取新老 props 准备比较  
2、第一次遍历老 props 把要删除的属性都设置为 null  
3、第二次遍历新 props , 把新的props push 到updatePayload  
4、最后生成updatePayload: \[k1,null,k2,v2,k3,v3\]

注：这里不同的属性会有不同的特殊处理，比如STYLE的话，就需要展开处理等等。

```

// Calculate the diff between the two objects.
export function diffProperties(
  domElement: Element,
  tag: string,
  lastRawProps: Object,
  nextRawProps: Object,
  rootContainerElement: Element | Document,
): null | Array<mixed> {

  let updatePayload: null | Array<any> = null;

  let lastProps: Object;
  let nextProps: Object;
  // 1、根据不同标签节点提取新老 props 准备比较
  switch (tag) {
    case 'input':
      lastProps = ReactDOMInput.getHostProps(domElement, lastRawProps);
      nextProps = ReactDOMInput.getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'option':
      lastProps = ReactDOMOption.getHostProps(domElement, lastRawProps);
      nextProps = ReactDOMOption.getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'select':
      lastProps = ReactDOMSelect.getHostProps(domElement, lastRawProps);
      nextProps = ReactDOMSelect.getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'textarea':
      lastProps = ReactDOMTextarea.getHostProps(domElement, lastRawProps);
      nextProps = ReactDOMTextarea.getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    default:
      lastProps = lastRawProps;
      nextProps = nextRawProps;
      if (
        typeof lastProps.onClick !== 'function' &&
        typeof nextProps.onClick === 'function'
      ) {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(((domElement: any): HTMLElement));
      }
      break;
  }

  assertValidProps(tag, nextProps);
  // 2、第一次遍历老 props 把要删除的属性都设置为 null
  let propKey;
  let styleName;
  let styleUpdates = null;
  for (propKey in lastProps) {
    if (
      nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
      lastProps[propKey] == null
    ) {
      continue;
    }
    if (propKey === STYLE) {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = '';
        }
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
      // Noop. This is handled by the clear text mechanism.
    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
      // Noop. It doesn't work on updates anyway.
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      // This is a special case. If any listener updates we need to ensure
      // that the "current" fiber pointer gets updated so we need a commit
      // to update this element.
      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  // 3、第二次遍历新 props , 把新的props push 到updatePayload
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (
      !nextProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue;
    }
    if (propKey === STYLE) {
      if (lastProp) {
        // Unset styles on `lastProp` but not on `nextProp`.
        for (styleName in lastProp) {
          if (
            lastProp.hasOwnProperty(styleName) &&
            (!nextProp || !nextProp.hasOwnProperty(styleName))
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = '';
          }
        }
        // Update styles that changed since `lastProp`.
        for (styleName in nextProp) {
          if (
            nextProp.hasOwnProperty(styleName) &&
            lastProp[styleName] !== nextProp[styleName]
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        // Relies on `updateStylesByID` not mutating `styleUpdates`.
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }
          updatePayload.push(propKey, styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      const nextHtml = nextProp ? nextProp[HTML] : undefined;
      const lastHtml = lastProp ? lastProp[HTML] : undefined;
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
        }
      } else {
        // TODO: It might be too late to clear this if we have children
        // inserted already.
      }
    } else if (propKey === CHILDREN) {
      if (
        lastProp !== nextProp &&
        (typeof nextProp === 'string' || typeof nextProp === 'number')
      ) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
      }
    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {
      // Noop
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
  
```

## HostText

1、更新的话，调用updateHostText  
2、首次渲染的话，调用createTextInstance

```
case HostText: {
      let newText = newProps;
      if (current && workInProgress.stateNode != null) {
        // 更新
        const oldText = current.memoizedProps;
        // If we have an alternate, that means this is an update and we need
        // to schedule a side-effect to do the updates.
        updateHostText(current, workInProgress, oldText, newText);
      } else {
          // ......
          // 首次渲染
          workInProgress.stateNode = createTextInstance(
            newText,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
      }
      break;
    }
```

### updateHostText

这是一个巨简单的方法，直接比较文本是否相同。

```
updateHostText = function(
    current: Fiber,
    workInProgress: Fiber,
    oldText: string,
    newText: string,
  ) {
    // If the text differs, mark it as an update. All the work in done in commitWork.
    if (oldText !== newText) {
      markUpdate(workInProgress);
    }
  };
```

### createTextInstance

这个方法也很简单，就是创建了一个TextNode文本节点。  
以及给textElement\[\_\_reactInternalInstance$\] = internalInstanceHandle = 当前的fiber节点。

```
export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): TextInstance {
  const textNode: TextInstance = createTextNode(text, rootContainerInstance);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}
```

文章如有不妥，欢迎指正~