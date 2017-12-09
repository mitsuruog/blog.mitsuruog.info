---
layout: post
title: "ng-sake #1 でAngular2のテストについて話てきた"
date: 2016-03-31 22:29:00 +900
comments: true
tags:
  - angular
  - angular2
  - karma
  - jasmine
  - unit test
---

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/ng-sake.jpg %}

3/31に酒を飲みながらAngularについて話す素敵な催し[ng-sake](http://connpass.com/event/27707/)が開催されたので、Angular2のユニットテストについて話て来ました。

<!-- more -->

当日のレポートは主催の[らこ](https://twitter.com/laco0416)さんが書いたものを参照ください。

- [ng-sake を開催しました | Angular2 Info](http://ng2-info.github.io/2016/03/31/ng-sake-1-report/)

## 当日の模様

Angularを使い込んでいる人が多かったので、濃い内容の話ばかりでした。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">やばい、参加者がニッチすぎて面白い <a href="https://twitter.com/hashtag/ng_sake?src=hash">#ng_sake</a> <a href="https://twitter.com/hashtag/ng_jp?src=hash">#ng_jp</a></p>&mdash; mitsuruog (@mitsuruog) <a href="https://twitter.com/mitsuruog/status/715153394558705664">2016年3月30日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">わいわい、がやがや。こういう形式もありだよね。angularに関わる人の熱意を感じる <a href="https://twitter.com/hashtag/ng_sake?src=hash">#ng_sake</a> <a href="https://twitter.com/hashtag/ng_jp?src=hash">#ng_jp</a></p>&mdash; mitsuruog (@mitsuruog) <a href="https://twitter.com/mitsuruog/status/715160894632828930">2016年3月30日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">ディレクトリ構成が盛り上がってて楽しいｗ <a href="https://twitter.com/hashtag/ng_sake?src=hash">#ng_sake</a> <a href="https://twitter.com/hashtag/ng_jp?src=hash">#ng_jp</a></p>&mdash; mitsuruog (@mitsuruog) <a href="https://twitter.com/mitsuruog/status/715149679609192448">2016年3月30日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## 発表内容

私の資料はこちらです。

<iframe src="//www.slideshare.net/slideshow/embed_code/key/5eDmVzNYiE0Jl6" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

Angular2は別物になっているので、テスト周りの状況も心配していたのですが、結論としてはAngular1とあまり大差なかったです。

こちらに比較表作ってみました。

[Angular 1 to 2 Quick Reference In unit testing](https://gist.github.com/mitsuruog/9e3e5c2c5d17a15a4c2a)

当日紹介したテストのサンプルコードはこちらです。

https://github.com/mitsuruog/_angular2-unit-test-sample

[Angular2 Unit Testing - カバレッジ編 | I am mitsuruog](http://blog.mitsuruog.info/2016/03/how-to-test-angular2-application-coverage.html)で紹介したカバレッジが出る仕組みが入っています。
カバレッジフェチの方は動かして楽しめると思います。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/ng-sake-coverage.png %}

## まとめ

Angular2のテストについては公式のドキュメントが足りていない、かつアップデートが激しいです。
最新の情報をチェックしたい場合、生のコードを読みつつ、本家のリポジトリのテストコードを見るのが一番確実です。

最後に、主催の[らこ](https://twitter.com/laco0416)さん、[83](https://twitter.com/armorik83)さん、本当にありがとうございました。
今後も続くといいなー。
