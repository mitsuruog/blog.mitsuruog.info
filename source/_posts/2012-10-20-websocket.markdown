---
layout: post
title: "websocketを使う際の意外な落とし穴"
date: 2012-10-20 20:00:00 +0900
comments: true
tags:
 - nodejs
 - websocket
---

本ブログは[東京Node学園祭2012 アドベントカレンダー](http://atnd.org/events/33022)の6日目の記事です。

今回は[nodejitsu](http://nodejitsu.com/)を使ってsockect.ioを使ったアプリをホスティングしたところ、websocket（以下、ws）まわりで思わぬハマりポイントがあったというお話しをします。  
（同じようなトラブルで悩む方に少しでもヒントをあげられたらと考えています。）

<!-- more -->

### このエントリでお伝えしたいこと。

1. ws通信は443ポート（wss）で行った方が良い。
2. wsのみがブロックされた場合にsocket.ioが怪しい挙動をする…（Help me!）
3. nodejitsuなかなか好いよ。


## ws通信は443ポート（wss）で行った方が良い。

既に周知の事実かもしれませんが、通常のHTTP（80ポート）を使ってws通信を行った場合、
サーバから送信されたwsの通信データが、クライアントのブラウザに到達する前に（セキュリティソフト、firewall、proxy…などなど）ブロックされることがあります。  
（詳しく知りたい方は[こちらのエントリ](https://github.com/LearnBoost/socket.io/wiki/Socket.IO-and-firewall-software)を読んでみてください。）

サーバを正しく実装したにも関わらずwsが届かないようなときは、そもそもクライアントがws受信できる状態なのか、次の2つのサイトにて確認してみてください。

* [http://websocketstest.com/](http://websocketstest.com/)（wsとCometの疎通確認ができるサイトです。）
* [http://wsping.jit.su/](http://wsping.jit.su/)（nodejitsuのwebsoketPingサイトです。）

例えばですが、80ポートのwsがブロックされている場合は次のような結果となります。

[{% img https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494866571/2012/comp.png 340 500 %}](https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494866571/2012/comp.png)

で、厄介なのが、セキュリティソフトにてブロックされている場合で、
wsの疎通確認自体はOKなのですが、wsがなぜか届かない状態となってしまったので、原因を特定するのに少し時間がかかりました。

_（私の場合はウイルスバスタークラウド2012がブロックしていました。**こちらについてはTrend Microのサポートとやりとりしているので、**何か進展あっておもしろそうだったら書くかもしれません。）_

## wsのみがブロックされた場合にsocket.ioが怪しい挙動をする…

さて、nodejsでws使う際はsocket.ioを使うのがデファクトとなっているのは皆さんご存知だと思います。
socket.ioではクライアントがws使えない場合、通信手段をwsからXmlHttpRequestなどに自動でダウングレードしてくれる便利機能があるのですが、今回のようにwsのみがブロックされるような場合、そのダウングレード機能がうまく働きませんでした。

wsの正しい挙動としては、まずhttpでハンドシェイクを行い、ハンドシェイクができた後にwsにプロトコルを変更して通信する流れなのですが、どうやらハンドシェイクを確立した後にwsのみがブロックされている場合、socket.ioにて通信手段の変更ができないようです。

（念のため、Chromeで取ったヘッダーとか載せときますね。）

[{% img https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494866571/2012/block.png %}](https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494866571/2012/block.png)

```
Request URL:ws://wsping.jit.su/socket.io/1/websocket/dL7NXuBCnWhqnZMPAYkU
Request Method:GET
Status Code:101 Switching Protocols
Request Headersview source
Connection:Upgrade
Host:wsping.jit.su
Origin:http://wsping.jit.su
Sec-WebSocket-Extensions:x-webkit-deflate-frame
Sec-WebSocket-Key:4EjkGu1WajTwi0MOvQjOyw==
Sec-WebSocket-Version:13
Upgrade:websocket
(Key3):00:00:00:00:00:00:00:00
Response Headersview source
Connection:Upgrade
Sec-WebSocket-Accept:lbl4DxvLmfnTm2okzQxld/Yb/sE=
Upgrade:websocket
(Challenge Response):00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00
```

正直、この挙動が仕様なのかバグなのか、それとも私の実装が悪いのか判断できず、一度詳しい方の見解を聞いてみたいです。（Help me!）

今回の件で、改めて新しいプロトコル導入期のライアント周辺環境（N/Wとかセキュリティとか）の課題が大きいなと感じました。（SPDYもそうなんですが･･･）
現状、より多くのユーザの元にsocket.ioを使った通信を届けるためには、wsの通信をwssとするか、通信手段をXmlHttpRequestなどにダウングレードするのが無難なのかもしれません。

（ちなみに先に紹介したnodejitsuのwebsocketPingサイトですが、wsが届いていない人もURLをhttpsに変えてアクセスすると届いたりします。）
（ちなみに、私はwindowsユーザなので、ならではの話題だったりして･･･）

## nodejitsuなかなか好いよ。

最後に2か月くらい[nodejitsu](http://nodejitsu.com/)使って遊んでますが。良かった点を書き連ねてみます。（CEOの[
Charlie Robbins氏](https://twitter.com/indexzero)も来ることですし。）

* websocketが使える。
* 無料期間は1ヵ月。Microプランで月$3。（円高最高！）
* jitsuを使ったクラウド上へのデプロイがシンプルで簡単（ただし、package.jsonにモジュールの依存関係を正しく書くこと）。
* サーバ側の実装を変えずにhttps対応（wsもwssとなる）できる。

実はnodejitsu、初めの頃は結構不安定（落ちてたり、デプロイできなかったり。。。）で「なんだかな～」と思った時期もあったのですが、9月のアップデート以降は安定してます。

それから、まだ周辺ツール（ログの監視とか）がまだ充実してない印象があるので、これからの進化に期待といったとこでしょうか？
とにかく、これからnodejs始める方は使ってみてはいかがでしょうか？

> **修正（2012/10/21)**  
> Jxckさんの指摘反映  
> websocketのセキュアなプロトコルはhttpsではなくwss。
