---
layout: post
title: "HTML5funで「エンタープライズでのHTML5」について最近思うことを話してきた"
date: 2014-05-22 23:51:00 +0900
comments: true
tags: 
 - HTML5
---

2014/5/19に[HTML5fun](http://html5fun.jp/)の立ち上げイベントで話す機会をいただきまして、「エンタープライズでのHTML5」について最近思うことを、割と自由に話してきました。イベント開催レポートはこちらです。

[HTML5fun -全国にHTML5の楽しさを-](http://html5fun.jp/event/event_001.html)

また、2014/5/22に行った[Java Day Tokyo 2014](https://oj-events.jp/public/application/add/170)での内容も絡めて、少し補足したいと思います。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/html5fun.png %}

1.  エンタープライズでHTML5は必要なのか？
2.  IoTとバリューチェーン
3.  最後に

発表したスライドはこちらです。よかったら「Like」してください。

<iframe src="//www.slideshare.net/slideshow/embed_code/34860465" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/mitsuruogawa33/html5-34860465" title="エンタープライズとHTML5〜エンタープライズでHTML5って本当に必要なのか？〜" target="_blank">エンタープライズとHTML5〜エンタープライズでHTML5って本当に必要なのか？〜</a> </strong> from <strong><a href="//www.slideshare.net/mitsuruogawa33" target="_blank">Mitsuru Ogawa</a></strong> </div> 

## エンタープライズでHTML5は必要なのか？

答えは「Yes」です。

ただしモバイルの活用の方法の１つとして「HTML5」があるという位置づけになると思います。また、企業でのモバイル活用は今もっともホットなキーワードの一つです。

最近の企業システムの入力系は業務に特化されたのも少なくなく、バーコードリーダーなどの外部機器接続、センサー、認識系（画像、音声）など、ネイティブという選択肢も捨てられないです。そこで最近注目しているのが、PhoneGapやCordovaに代表されるHTML5とネイティブを組み合わせた「ハイブリッド」アプローチです。
ただ、モバイル用途として、参照や簡単な入力がメインであれば、HTML5だけで割とライトな形で作って問題ないと思います。

## IoTとバリューチェーン

昨年辺りから、IoT（Internet of Things）やIoE（Internet of Everything）というキーワードを耳にする機会が多くなったように思えます。

国内でもモバイルを持つ人口が増えていることは周知の事実ですが、スマートメーター、スマート家電、スマートTVなど「スマート〜」が流行ってきており、様々なセンサーが使われてこれまた、Webに繋がるようになって、将来的に企業システムはIoTに対応して行く事になるでしょう。

その一方で、IoT時代の企業システムが生み出すバリューチェーンについても改めて考える必要があると感じています。
その象徴的なものが、Java One Tokyo 2014の基調講演にてNandini Ramani氏が語ったこのスライドでしょう。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/IMG_20140522_104924.jpg 681 510 %}

両側に「データセンター」「デバイス」があって、その間を「繋ぐ」３層レイアーになっています。

デバイスで発生したデータをクラウドへ転送して、最終的に価値にしていく構図です。

HTML5の中でも特別扱いされている感がある「Websocket」も、このバリューチェーンをイメージすると理由が分かり易いと思います。

「データセンター」と「デバイス」の2つのレイアーを接続するために、現状、もっとも適しているのがインターネット（Web）のHTTPであり、それをさらに効率良く行うための方法が「Websocket」です。

（Java One Tokyo 2014でもWebsocketについて多く語られていました。）

つい我々フロントエンドをやっている人たちは、デバイスレイアーに注目してしまいがちなのですが、このバリューチェーンを意識するかどうかで、モバイル導入の目的や効果が明確になっていいと思います。

## さいごに 

企業システムのフロントエンドエンジニアなりたいという人が少しでも増えるといいなと思っています。これからも微力ながら活動していきたいです。

[HTML5fun](http://html5fun.jp/)のスタッフの皆さん本当にありがとうございました。  
全国にHTML5の楽しさを伝えるような活動を今後も行ってください。
