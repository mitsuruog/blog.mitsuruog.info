---
layout: post
title: "Backbone.Modelから見るBackbone.Collectionとの関連性"
date: 2012-12-05 22:57:00 +0900
comments: true
tags: 
 - backbone
 - localstorage
 - Jasmine
---

このエントリは[Backbone.js Advent Calendar 2012](http://www.adventar.org/calendars/15)の5日目の記事です。

[前回](2012/12/backbonelocalstoragejsbackbonesync)のBackbone.Syncとbackbone.localstorage.jsの話の続きで、Backbone.Modelから見るBackbone.Collectionとの関連性についてお話します。

<!-- more -->

### このエントリでお伝えしたいこと。

1.  何をするとBackbone.ModelとBackbone.Collectionの結びつくか。

## はじめに

前回のテストコードですが、[Backbone.localstorage.js本家](http://goo.gl/v1gFX)のテストコードを見たところ、どうやらBackbone.Collectionのcreate()を使うのが正しい使い方ようなので、次のように書き直しました。  
（ちなみにユニットテストは[Jasmine](http://goo.gl/IUtf)を使ってます。）

{% gist 4148127 test.collection.js%} 

なんだCollectionのcreate()を使えば良いのか。一件落着！  
と思いたいのですが。。。

確か、model.localStorageかmodel.collection.localStorageが存在しない場合、デフォルトのAjaxが動くのは前回確認済みです。上のテストコードのどこを見てもそのようなことはしていませんね。
なにやら黒魔術的な臭いがします。

## Backbone.ModelとCollectionの近しい関係

黒魔術的な臭いがする場合は、ソースコードを読むのが一番です。まず、Collectionの`create()`を読みました。

{% gist 4148127 Backbone-0.9.2-766.js%} 

上はBackbone.jsの766行目辺り。ざっと目を通してすぐ分かりました。

> model = this._prepareModel(model, options);

怪しすぎるww。  
なので、`_prepareModel()`を読みました。

{% gist 4148127 Backbone-0.9.2-809.js%} 

上はBackbone.jsの809行目辺り。ありました。見たかったのはこれです。

> model.collection = this;

なるほど、こんなところでModelにCollectionがセットされていましたね。
これで、上のテストコードがパスできる理由も分かりました。これですっきりです。

他にもCollectionの中で`_prepareModel()`呼んでいる場所を調べたところ、`create()`も含めて4箇所ありました。

* [add](http://backbonejs.org/#Collection-add)
* [push](http://backbonejs.org/#Collection-push)
* [unshift](http://backbonejs.org/#Collection-unshift)
* [create](http://backbonejs.org/#Collection-create)

まだBackboneの全体を見通せてないので、作ってて所々（？）となることがあります。ソースコード印刷して電車で読むことにしました。

**Backbone.js Advent Calendar 2012**

*  ← 前日　[Backbone.jsのMVCについて](http://goo.gl/J28KM)（@tomof）
*  → 後日　[Backbone.js 日本語リファレンス](http://ando19721226.github.com/Backbone/)[](http://www.blogger.com/blogger.g?blogID=5596737312884238083)（@ando）



