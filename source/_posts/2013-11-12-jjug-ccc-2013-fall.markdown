---
layout: post
title: "JJUG CCC 2013 Fall で話してきた"
date: 2013-11-12 00:45:00 +0900
comments: true
tags: 
 - その他
 - Java
 - JAX-RS
 - JSF
---

2013/11/09に行われた[JJUG CCC 2013 Fall | 日本Javaユーザーグループ](http://www.java-users.jp/?page_id=695)で話してきました。Javaの講演者が多い中でHTML5系の話ということなのか、立ち見が出るほどの大勢の方に聞いていただきました。本当にありがとうございました。  
講演の内容を少し補足しながら、ほかにも言いたいことがあったので書きたいと思います。

<!-- more -->

### このエントリでお伝えしたいこと。

1.  JJUG CCC 2013 Fall にて話してきました
2.  発表内容についてのちょっとした補足

早速ですが、発表資料はこちらです。

<iframe src="//www.slideshare.net/slideshow/embed_code/28086112" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/mitsuruogawa33/webjava" title="メンテナンス性の良いWebシステムを構築するためにjavaとフロントエンドでやるべきこと" target="_blank">メンテナンス性の良いWebシステムを構築するためにjavaとフロントエンドでやるべきこと</a> </strong> from <strong><a href="//www.slideshare.net/mitsuruogawa33" target="_blank">Mitsuru Ogawa</a></strong> </div>

発表内容については、JavaのJSFかJAX-RSを使って開発を一通り経験した場合、普通の感覚のエンジニアであれば気づくようなポイントをフロントエンジニアの目線からまとめてガイドライン化したものです。  
これからJSFやJAX-RSを使ってみようと考えている方には、少しは有益な情報になったのではないかと思っています。

概要は以下の通りです。

* フロント側とサーバ側の役割分担を明確にすること。特にJSFは注意。

* JAX-RS
    * フロント側はJavascriptMV*系フレームワークで構造化する前提で、RESTで作る。
    * どれだけのフロントエンジニアの調達
    * 教育ができるかが成否を分ける。

* JSF
    * フロント側はほどんど何もしない。フロント側はJSFが提供する機能のみで作る。
    * フロントエンジニア不在でもある程度リッチなWebシステムが構築可能だが、限界はある。

## その他言いたかったことをつらつら・・・

フロントエンジニアとしては、JSX−RSを使って行きたいのですが、Struts+JSP主体の業務系エンジニアが、すぐフロントエンジニアにスキルチェンジできる訳ではないので、今後の業務系システムではJSFが主に使われていくのかなと考えています。  
とはいえ、Struts＋JSPからJSFストレートに移行できるというような単純なものではなく、JSF独自のライフサイクルやお作法があるため、扱えるようになるための教育コストは掛かると思っておいた方がいいでしょう。

また、JSFでもっとリッチなUIを実現したい場合、Richfaces、Primefacesといった、サードパーティ製のライブラリという選択肢があります。ただし、JSFというブラックボックスの上にさらに大きなブラックボックスを抱えるようなイメージ構図になります。何かあったときにJavascript側のデバックを行うのは相当な困難が伴うでしょう、ご利用は計画的にといったことでしょうか。

## 最後に

業務系システムにおいては今後JSFが使われて行くだろうと先ほど言いましたが、本当はフロント側とサーバ側はJSONなどのデータを挟んで粗結合に構築するべきだと思います。そのためこれからのJavaのWeb開発の本命はJAX-RSだと思ってます。

今回のJJUG CCCでの講演の件、貴重な体験をさせていただきました。JJUGスタッフの皆さん感謝しています。ありがとうございました。
