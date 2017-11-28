---
layout: post
title: "Angular2で「Use \"...\" on the parent's route path.」が起こる場合の対処法"
date: 2016-02-17 01:46:00 +900
comments: true
tags:
  - angular2
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2016/angular2.png %}

Angular2のComponentRouterを使った場合に発生する`Use "..." on the parent's route path.`エラーの対処法です。  
完全に小ネタ。

<!-- more -->

NestしたRoutingの場合、親の`@RouteConfig`のpathに`...`を付ける必要がある。

```js
// parent
@RouteConfig([
  {path: '/', component: HomeComponent, as: 'Home'},
  {path: '/list/...', component: ListComponent, as: 'List'}
])

// child
@RouteConfig([
  { path: '/:id', component: ListItem, as: 'ListItem' }
])
```

参考）

angular2 - Use RouterLink from a nested component - Stack Overflow   
http://stackoverflow.com/questions/34363176/use-routerlink-from-a-nested-component
