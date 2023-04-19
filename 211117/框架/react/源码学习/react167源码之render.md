#  ReactDOM定义

## ReactDOM,是一个对象，

- 包含:
- createPortal, react版插槽方法
-  findDOMNode,方法
- hydraft,开启服务端渲染情况下的渲染方法
- render，直接客户端渲染方法

```
​```
const ReactDOM: Object = {
  createPortal,

  findDOMNode(
    componentOrElement: Element | ?React$Component<any, any>,
  ): null | Element | Text {
    if (componentOrElement == null) {
      return null;
    }
    if ((componentOrElement: any).nodeType === ELEMENT_NODE) {
      return (componentOrElement: any);
    }
    if (__DEV__) {
      return DOMRenderer.findHostInstanceWithWarning(
        componentOrElement,
        'findDOMNode',
      );
    }
    return DOMRenderer.findHostInstance(componentOrElement);
  },
//ssr 情况下 使用hydrate ，一般情况使用render
  hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {
    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback,
    );
  },

  render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },

};
export default ReactDOM;
​```
```



