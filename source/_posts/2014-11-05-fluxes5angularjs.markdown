---
layout: post
title: "話題のFluxアーキテクチャをES5のAngularJSで書いてみた"
date: 2014-11-05 22:34:47 +0900
comments: true
categories:
 - Angular
 - Flux
 - SPA
---

先日、HTML5jエンタープライズ部のメンバーと最近気になっていたFluxアーキテクチャについて味見してみました。
巷のAngularJSのサンプルはES6で書かれたもの多いので、実務でも使えるES5で書きなおしてみました。

* デモはこちら [Angular Flux ES5](http://mitsuruog.github.io/angular-flux-es5/)
* コードはこちら [mitsuruog/angular-flux-es5](https://github.com/mitsuruog/angular-flux-es5)

<!-- more -->

Fluxの概要については[@albatrosary](https://twitter.com/albatrosary)さんのブログを参照してください。

[What’s Flux? - albatrosary's blog](http://albatrosary.hateblo.jp/entry/2014/10/22/131302)

## 雑感

フレームワークの書き方が一通りわかると、次はもっと効率的に書くにはどうするかとか考え出します。
Backboneの時もそうだったのですが、SPAでフロント側を作った場合、modelの変更を複数あるview側にどう伝えるのがいいか、悩んで手が止まります。
(Backboneの時はグローバルのMediatorを通してmodelの変更を通知してました。当時の残骸はこちら[mitsuruog/SPA-with-Backbone](https://github.com/mitsuruog/SPA-with-Backbone))

AngularJSの場合は`shared services`を使うか、`$rootScope.$broadcast`を使うことが王道かなと思います。
個人的には`shared services`の方が小さくて好みです。

[AngularJS - Angular JS で複数のコントローラ間でモデル（状態や値）を共有する方法 3 種類 - Qiita](http://qiita.com/sunny4381/items/aeae1e154346b5cf6009)

Fluxアーキテクチャを使った場合は、Angular wayにならないので、これはこれでありかなと思いました。
ただ、Observerの制御を間違えるとメッセージパッシングが無限ループしだして死にます。(参加メンバーはもれなく無限ループを体験していましたw)

## まとめ

Angularの場合は、無理してFlux使うより`shared services`の方がコードは読みやすくなると思います。
そろそろSPAのアーキテクチャについても、かなり出尽くした感がしますね。

```js

var same = '';

```

{% gist 0d78e15894940547077d 1.coffee %}
