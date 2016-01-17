---
layout: post
title: "Backbone.Eventsの機能テスト"
date: 2012-12-24 00:37:00 +0900
comments: true
tags:
 - backbone
 - jasmine
---

[Backbone.js Advent Calendar 2012](http://www.adventar.org/calendars/15)の22日目の記事です。

今見たら22日目の担当がいなかったので、慌てて書いています。ネタが無くなってきました（汗）。

本日はBackbone.EventsについてJasmineで機能テストを書いたので公開します。
Jasmine使ったBackboneのテストの書き方について、参考になれば幸いです。

<!-- more -->

コードはこちらにあります。
（1時間くらいで書きました。Jasmineだからできたと言っておきますww）

[https://github.com/mitsuruog/Learning_JS/tree/master/backbone/functional_test](https://github.com/mitsuruog/Learning_JS/tree/master/backbone/functional_test)

一式ダウンロードして「SpecRunner～」をブラウザで実行するとJasmineのテストが実行されます。
ちなみに「0.9.2」とかはBackboneのVersionです。
（0.9.9のみonceをテストしてます。）

で、きっかけは
[@ahomu](http://twitter.com/ahomu "http://twitter.com/ahomu")さんの「[renderとpresenterの分離パターン](http://havelog.ayumusato.com/develop/javascript/e541-backbone_patterns_tips.html)」を読んで、いいなと思ったのですが、その前にBackbone.Events自体あまり理解して無いと思ったので、自分の認識が合っているかテストをして確認してみた次第です。

テストしてみた結果、少し知っていると便利だなと思ったところを2つだけ紹介します。

1.  イベント名フラグ値のようなものを付けて、別のイベントのように発火できる。
2.  イベント名の間にスペースを入れて、複数のイベントを発火できる。

こちらが、コードのサンプルです。

{% gist 4363904 %}

Backboneの0.9.9ではEvents周辺でも機能の追加がありました。「once」以外については時間切れでテストできていません、時間があったらテスト追加しておきます。
