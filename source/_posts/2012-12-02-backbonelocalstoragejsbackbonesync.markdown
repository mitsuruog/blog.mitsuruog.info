---
layout: post
title: "backbone.localstorage.jsとBackbone.Syncのお話"
date: 2012-12-02 21:44:00 +0900
comments: true
categories: 
 - backbone
 - localstorage
 - Jasmine
---

このエントリは[Backbone.js Advent Calendar 2012](http://www.adventar.org/calendars/15)の2日目の記事です。

Backbone.jsには[Backbone.Sync](http://goo.gl/xIbI9)というModelとサーバ側のリソースを常に同期させる仕組みがあり、これをOverrideすることで同期させる仕組みを自体を柔軟に変えることができます。  
今回は[backbone.localstorage.js](http://goo.gl/qBk6P)のユニットテストを通じて、Backbone.SyncをOverrideする仕組みについて少しお話したいと思います。

<!-- more -->

### このエントリでお伝えしたいこと。

1.  backbone.localstorage.jsはどのようにBackbone.SyncとOverrideしているか。
2.  backbone.localstorage.jsはBackbone.SyncをOverrideするコードの良いお手本だと思う。。

## はじめに

まず、きっかけですが、backbone.localstorage.jsを使ってlocalstorageにBackbone.Modelを保存する簡単なサンプルを作ってユニットテストしたところ、思わぬところでfailしてしまったことです。  
Backbone.js側のコードとユニットテストのコードは次のとおりです。
（ちなみにユニットテストは[Jasmine](http://goo.gl/IUtf)を使ってます。）

{% gist 4148127 app.js %}
{% gist 4148127 test.model.before.js %}

ユニットテストを実行した結果は、次のようなエラーが発生しました。
> Error: A "Url" property or function must be specified

初めはlocalstorageに保存しているのに、なぜURLが必要なのかわかりませんでした。

## localstorageに保存するはずなのになぜURLが必要??

その前に、Backbone.Modelの`save()`と`Backbone.Sync`の関係、`Backbone.Sync`のデフォルトの挙動について抑えておく必要があります。

まず、Backbone.Modelの`save()`とBackbone.Syncの関係についてですが、Backbone.Modelの`save()`を呼び出した際に、内部で`sync`イベントが発生して、Backbone.Syncに定義されているfunctionが実行されるようになっています。  
その際に、Backbone.Syncはデフォルトでサーバサイド側のREST API
(GET/PUT/POST/DELETE)とAjax（jQueryかZepto依存）で通信をするようになっています。

これらの事により、先のエラーはAjax通信をしているため発生していることが容易に予想できるのですが、そもそもbackbone.localstorage.jsはBackbone.SyncをOverrideしているので、なぜAjaxのコードが生きているのか分かりませんでした。

## なぜAjaxが動いているのか?

この問題を理解するためにbackbone.localstorage.jsのソースを読みました。  
（以下、核心部分だけ抜粋します。）

{% gist 4148127 Backbone.localStorage-Oct-17-2012-134.js %}

上はbackbone.localstorage.jsの`134行目`辺り。
Backbone.SyncをOverrideしているところです。中で`Backbone.getSyncMethod()`をreturnしています。
自分でカスタムする場合は、ここに直接Overrideするコードを書いても良さそうです。

{% gist 4148127 Backbone.localStorage-Oct-17-2012-123.js %}

上はbackbone.localstorage.jsの`123行目`辺り。本問題の核心部分です。  
読めば一目瞭然なのですが、デフォルトのBackbone.Syncを`Backbone.ajaxSync`という別名で保存してました。

しかも、`Backbone.getSyncMethod`では

*   model.localStorage
*   model.collection.localStorage

いずれかのプロパティが存在しない場合、Backbone.ajaxSyncがreturnされます。

これですべての謎が解けました。

## 最初のテストコードはどうあるべきだったのか?

先に結論ですが、次のコードでテストが通りました。

{% gist 4148127 test.model.after.js %}

ただ、なんとなく違和感が残ります。

Modelだけをテストする目的であればこれも有りだと思いますが、テストを通すためにコードを足したようでなんとなく気持ち悪いですし、何か使い方が間違っている気がします。  
（[次回](/2012/12/backbonemodelbackbonecollection/)はこの違和感を取り除いて行く過程を書きます。）

ちなみに、backbone.localstorage.jsはコードが140行足らずなので読むのは非常に楽でした。
実際にBackbone.SyncをOverrideするコードを書く場合は、ぜひ参考にしたいと考えています。

**Backbone.js Advent Calendar 2012**

*   ← 前日　[Backbone.jsで今つくっている構成について](http://goo.gl/s9JLG)
*   → 後日　[Backbone.jsが自動でやってくれるところについて](http://goo.gl/WxdVo)


