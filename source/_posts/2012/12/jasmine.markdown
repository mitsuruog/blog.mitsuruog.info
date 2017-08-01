---
layout: post
title: "Jasmineを和訳しました"
date: 2012-12-13 00:31:00 +0900
comments: true
tags: 
 - jasmine
 - 翻訳
---

最近、私の中でBackbone.jsと共に注目のJasmineのドキュメントを和訳しました。  
[本家のドキュメント](http://pivotal.github.com/jasmine/)はこちらです。

和訳したものはこちらです。  
（もし、訳で怪しいところがあればご指摘ください。）

[http://mitsuruog.github.com/jasmine/](http://mitsuruog.github.com/jasmine/)

<!-- more -->

ちなみにJasmineはJavascriptのテスティングフレームワークの1つです。  
他のフレームワークを満足に扱ったことがないので、あまり偉そうなことは言えませんが、特徴として次のようなことを挙げておきます。

* standalone版（JSファイル）があり、ブラウザのみでテスト実行と結果の確認ができる。
* テストケースのネストが可能、（Javaで言うことの）setUp、tearDown機能がある。
* 豊富なmatcher。
* Mock（Spy）が割と簡単に作れる。
* [jasmine-jquery](https://github.com/velesin/jasmine-jquery)プラグインが素晴らしい。

[jasmine-jquery](https://github.com/velesin/jasmine-jquery)  については、後日機会があれば触れたいと思いますが、とにかくDOMやイベント周辺のテストがさらにやりやすくなり、もっと便利になります。

ちなみにGoogleで「Jasmine」で検索すると、まだ4番目ですね。もっと上位になるように頑張って情報発信していきたいです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2012/jasmine.png %}
