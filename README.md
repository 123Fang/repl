# @123fang/repl 是用来干嘛的？它解决了什么问题？
- 分享给别人看，通过网页URL的形式明显比传输代码包更方便。
- 写了一个库或组件，需要有个预览地址或者内嵌一个iframe预览链接放在自己的文档里做展示。
- 我想在最简环境下复现一个bug，但是我又觉得重新开一个项目太麻烦，希望有一个网页，打开就能直接写代码，最好常用的依赖都内置在上面。
- 可以把在线编辑的代码下载下来在本地运行

#### 其实上面这些场景Vue的Playground都比较好的解决了，但是也存在一些问题。
- Vue的Playground用的是 @vue/repl这个官方包， 但是@vue/repl的class只预置了vue,，假设我想预置更多的模块，比如我想让他天然支持lodash，支持组件库， 支持各种工具函数，应该怎么做呢？

##### @123fang/repl 在@vue/repl的基础上做了一些处理，可以支持任何模块。比如自己写的组件库 fx-ui-vue。

