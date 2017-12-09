---
layout: post
title: "なぜAngularJSを薦めるのか ー 個人的な思い"
date: 2014-11-19 23:17:50 +0900
comments: true
tags: 
 - AngularJs
 - その他
---

だいぶ前のことですが、9/22に行われた[AngularJSリファレンス」出版記念会](http://html5experts.jp/albatrosary/10855/)にてSIerでのAngularJSの取り組みについて話させていただきました。


先日、その資料を見て興味を持ってくれた他のSIerにてAngularJSについて講演させていただく機会をいただいたこともあり、なぜAngularJSをいいと感じているのかや、AngularJSに期待することなど、個人的な思いを書いてみたいと思います。(あくまでSIer目線です。)

<!-- more -->

詳細は資料を参照してくださいね。

こちらが9/22のAngularJSリファレンス出版記念会の資料です。

<iframe src="//www.slideshare.net/slideshow/embed_code/39280942" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/mitsuruogawa33/webangularjs" title="今後のWeb開発の未来を考えてangularJSにしました" target="_blank">今後のWeb開発の未来を考えてangularJSにしました</a> </strong> from <strong><a href="//www.slideshare.net/mitsuruogawa33" target="_blank">Mitsuru Ogawa</a></strong> </div>

他社にて 講演したときの資料です。

<iframe src="//www.slideshare.net/slideshow/embed_code/41489044" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/mitsuruogawa33/webangular-js" title="今後のWeb開発の未来を考えてangular jsにしました(拡大版)" target="_blank">今後のWeb開発の未来を考えてangular jsにしました(拡大版)</a> </strong> from <strong><a href="//www.slideshare.net/mitsuruogawa33" target="_blank">Mitsuru Ogawa</a></strong> </div>

## マルチプラットフォームとしてのHTML5

まず、AngularJSを選定する際に外せないのが、「HTML5」の存在です。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/why_angular1.png 520 370 %}

ブラウザだけではなくモバイルアプリなど利用範囲が広いため、今後のWebアプリケーションのマルチプラットフォーム実行環境としては主役だなと思います。

## AngularJSの注目ポイント

AngularJSで注目しているポイントとしては次のような部分です。

1.  各モジュールのちょうど良いサイズ感
2.  生産性(4.の要件の範囲内であれば...)
3.  スキルチェンジ(JSPからAngularJS)
4.  Web開発要件にマッチ

いくつかJSフレームワークを触っていきた経験的に、AngularJSの各モジュール分割(controllerやfilterなど)の考え方は割とBetterかなと思います。強いて言えば、規模が大きくなってくると細かなServiceがたくさんできてDIが多くなるのが辛いといったとこでしょうか。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/why_angular2.png 520 370 %}

スキルチェンジに関しては、JSPとAngularJSはテンプレート部分にロジックを記述していくため、Javascriptで全てテンプレートを生成するものより、理解しやすいと思います。またDIの概念や、各モジュールについての役割についてもJavaでのWeb開発を例に説明できると思います。

## 開発支援ツールとしてのYeoman

私がYeomanの存在を知ったのは2013年の10月くらいだったかと思います。

従来のJavaでのWeb開発と比較して、Yeomanが提供するGruntタスク(特にフロント側リソースの本番ビルド)はかなりオーバースペックに見えたこともあり、ここ1年、少し慎重に評価していました。

AngularJS開発にあたってYeomanが必須な訳ではありませんので、Yeomanを使わずに自分の組織にあったGruntタスクを0から作成して利用してもいいと思います。
(Yeomanは必須ではなくても、GruntタスクはAngularJS開発では必要だと思います。)

私の場合、当初はYeomanを利用しない方向で考えていましたが、AngularJSを開発するにあたりいろいろとタスクを追加した結果、Yeomanでのタスクの劣化版を作っていることに気づきました。  
いまでは既存のYeomanジェネレーターを自組織に合うようにカスタムして利用しています。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/why_angular3.png 520 370 %}

> 本来は、なぜフロント開発がこんなにも複雑になってしまったのかを嘆くべきなのでしょうが。。。

## まとめ

個人的なAngularJSについての思いを書いてみました。  
SIerの中にいると、最近のWeb開発手法の進化と現場での意識のギャップに戸惑うことが非常に多いです。

AngularJSもそろそろ実用レベルのものに達してきたと思いますので、このあたりで少し実戦で使っておかないと、10年後にはWeb開発がまともにできないような組織になるのではと危惧しています。

SIerじゃなければReact.jsかvue.jsを使いたいですw
