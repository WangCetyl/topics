各个元素都是相关DOM Api(interface)的实例，或者子类。通过prototype继承各种方法属性。以div标签为例来显示层级.div target的创建 需要使用let div =  document.CreatElement('div')来实现，而不能从new HTMLDivElement()

Object => EventTarget => Node => Element => HTMLElement => HTMLDivElement => div