# react源码吗分析
## ReactElement 函数
- 1简介
- ReactElement是一个函数，内部定义一个element对象，并且将element作为返回值返回。jSX语
- 法本质就是返回一个element，也就是vdom
- 2.ReactElement函数的参数有 type，key，ref，self，source，owner，props 
- type就是HTML标签类型，例如div，tag，li等等，key为标签中的key值属性，ref为
- 3、源码
```
    const ReactElement = function(type, key, ref, self, source, owner, props) {
          const element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,

            // Built-in properties that belong on the element
            /*
              字符串比如div，p代表原生DOM，称为HostComponent
              Class类型是我们继承自Component或者PureComponent的组件，称为ClassComponent
              方法就是functional Component
              原生提供的Fragment、AsyncMode等是Symbol，会被特殊处理
              TODO: 是否有其他的
            */
            type: type,
            key: key,
            ref: ref,
            props: props,

            // Record the component responsible for creating this element.
            _owner: owner,
          };

          if (__DEV__) {
            // The validation flag is currently mutative. We put it on
            // an external backing store so that we can freeze the whole object.
            // This can be replaced with a WeakMap once they are implemented in
            // commonly used development environments.
            element._store = {};

            // To make comparing ReactElements easier for testing purposes, we make
            // the validation flag non-enumerable (where possible, which should
            // include every environment we run tests in), so the test framework
            // ignores it.
            Object.defineProperty(element._store, 'validated', {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false,
            });
            // self and source are DEV only properties.
            Object.defineProperty(element, '_self', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self,
            });
            // Two elements created in two different places should be considered
            // equal for testing purposes and therefore we hide it from enumeration.
            Object.defineProperty(element, '_source', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source,
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }

      return element;
    };
```

## createElement 函数
- 简介
