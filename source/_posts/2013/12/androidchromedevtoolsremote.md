---
layout: post
title: "Androidやってる人でChromeDevtoolsのRemote DebuggingとScreencasting知らない人は使ってみた方がいいよ！"
date: 2013-12-12 16:16:00 +0900
comments: true
tags: 
 - Android
 - Chrome Devtools
---

2013/10/30に「[Frontrend x Chrome Tech Talk Night E<span id="goog_1836471854"></span><span id="goog_1836471855"></span>xtended](http://frontrend.github.io/events/chrome/)」が開催され、Addy氏、Jake氏、Paul氏が来日して、最新のモバイル開発のための様々な手法を紹介してくれました。
そこで聞いた内容をもとに、エンタープライズで適用できそうなものを、中立な目線で評価・検証していたのですが、ChromeDevtoolsのが凄すぎて、終わってみたらChromeDevtoolsばっかり評価・検証していた（おいおい！）という話をします。

ちなみに、Android開発はほとんどやったことはありません。  
あうあう。

<!-- more -->

これの記事は[Frontrend Advent Calendar 2013](http://www.adventar.org/calendars/62)の12日目の記事です。  
前日の記事は[light Chenさん]・・・まだ書いてない＞＜;  
明日の記事は[[pocotan001さん]Gist Slides（仮）を作った。 - pocotumblr](http://pocotumblr.tumblr.com/post/69868810750/gist-slides)

## はじめに

（今日はAndroidとChrome限定の話です。）

最近、エンタープライス領域においても、本格的にモバイルへの対応が求められるようになってきました。

あちこちの勉強会などで聞く、Android開発の現場でのあるある光景として、開発者が背中を小さくして多くの実機でデバックやテストしている姿が挙げられます。それぞれのデバイス間で微妙に操作方法が異なったり、そもそもデバイス自体が操作しにくかったりと、開発者への負担が大きく、時間がかかる作業です。

また、開発以降のフェーズにて「コードを修正して実機にて確認」という一連のイテレーションサイクルを、どれだけ高速で安定した形で回せるかが、エンタープライズでの本格的なモバイル対応の際に、最も重要なポイントの一つだと感じています。

そんな悩みを一気に解決してくれる可能性を秘めているツールの一つが、フロントエンジニアが普段慣れ親しんでいるChromeDevtoolsだと思います。
今日はChromeDevtoolsで最近追加された、Android開発が楽になる機能を２つ紹介します。

詳しくは本家のサイトが一番詳しいので参照してください。
[https://developers.google.com/chrome-developer-tools/docs/remote-debugging](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)

## Remote Debugging

Remote Debuggingとは、デバイスをUSBで接続し、閲覧しているページをローカルPC上のChrome Devtoolsでデバックするできる機能です。Android4.0以上の端末で有効です。

### Remote Debuggingの設定

Remote Debuggingを行うためには、まずデバイス側でUSBデバックを受け入れる準備が整っていること、ローカルPC上にデバイスのUSBドライバがインストールされていることが前提条件です。
Googleで調べるといろいろ出てきますので、詳しくは紹介しません。
（windowsの場合は、USB接続時にドライバが自動でインストールされないようです。デバイス多い場合、結構泣くと思います。）

まず、デバイスをUSBで接続して、ローカルPC上のChromeのアドレスバーにて「chrome://inspect」と打ってください。下のような画面が表示されて、接続してあるデバイスが表示されれば準備はOKです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting1.png %}

### Remote Debugging使ってみる

実際にRemote Debuggingするためには、「inspect」リンクを押せばいいです。非常に簡単です。後は、ローカルPCのDevtoolsと同じ感覚で操作できます。
例えば、elementsタブでスタイルを変更した場合、即座にデバイス側へ反映されます。

さらに、ブラウザのバージョン番号が表示されている横のテキストボックスにURLを入力することで、デバイス側へ表示させてたいページを送ることができ、Remote Debuggingと組み合わせることで、ローカル上で開発中の画面をデバイス側でデバックすることができます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting2.png %}

### Port Forwarding

Port ForwardingとはローカルPC上のTCPポートをそのままデバイス側に転送する機能です。具体的にはローカルPC上で開発している「localhost:9000」など、今まさに開発中のWebページをデバイス側へ転送して表示させることができます。
（本家のサイトに記載されてますが、ネットワークなどの制限により動作しない場合があるようです。）

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting3.png %}

### Port Forwarding + Grunt + livereload

最近のフロント開発では、「Yeoman+Bower+Grunt」を組み合わせた高速開発手法がトレンドです。中でも[grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)の「livereload」を使ったコードの変更からブラウザのリフレッシュまでの一連の操作を自動化したものは、今のフロント高速開発を象徴しているものです。

このlivereloadとPort Forwardingを組み合わせると、ローカルPC上にUSB接続してあるすべてのデバイスをlivereloadさせることができます。
具体的には次のようにします。

話の都合上、ローカルにて開発中のWebページのURLが「localhost:9000」とし、livereload用のPort を「9002」とします。
次のように9000、9002ポートを転送するように、Port Forwarding設定をします。
（livereloadのデフォルトポートは35729なのですが、Devtools側が4桁ポートしか受け入れてくれないので、9002にしてます。Devtoolsチームの皆さんなんとかしてくださーい。）

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting4.png %}

設定が正しく行われると、転送されるポートが画面上で確認できます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting5.png %}

これで、9002ポートを経由してlivereloadができるようになりました。
コード修正のたびに、デバイスのブラウザをリフレッシュするという手間がなくなりましたね。

## Screencasting

Screencastingとは、デバイスで表示されている画面をローカルPCで閲覧できる機能です。イメージとしてはRemote DebuggingのPort Forwardingの逆ですね。
これはChromeのバージョン31から追加された機能です。

### Screencastingの設定

（まだ実験的な機能です、将来的には普通に使えるようになると思います。）

Screencastingを使うためには、ローカルPC上のChromeのアドレスバーにて「chrome://flags」と打って、実験的な機能が使えるように設定する必要があります。
表示された画面にて、次の２つの機能を有効にしてください。

「デベロッパー ツールのテストを有効にする（#enable-devtools-experiments）」
「USB でリモート デバッグを有効にする。（#remote-debugging-raw-usb）」

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting6.png %}

変更したら、下の方にChromeを再起動するためのボタンが表示されますので、再起動してください。
そしてDevtoolsの設定画面を開いてみると、見慣れない「Experiments」メニューが表示されるはずです。
そこで「Enable screencast」にチェックをすると準備はOKです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting7.png %}

### Screencastingを使ってみる

とりあえず、先ほどのRemote Debuggingと同じ要領で、デバイスをUSBでつないでRemote Debuggingしてみてください。今度は、Devtoolsの下の方に見慣れない「□」が表示されているはずです。（ちょっと分かりにくいですがw）
これを押すとデバイスで表示されてるページがローカルPC上に転送されてきます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting8.png %}

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/Screencasting9.png %}

ちなみに、Screencastingされた画面では次のことができます。  
素晴らしい！！

* キーボード入力の転送
* クリック
* タップの転送
* スクロールの転送
* ズームやリサイズの転送
* Devtools上での操作を転送

## まとめ

ChromeのDevtoolsに追加された2つの機能。
Remote DebuggingとScreencasting。非常に強力でしたね。これらを組み合わせることでデバイスを操作することなく「コード修正から確認」まで行うことができ、開発時のイテレーションを速くまわすことができそうです。

個人的には、Screencastingでのlivareloadを試してみましたが、他にもスクリーンショットやスクロールの同期など、デバイス間のリアルタイム連動がDevtools上でできるともっと開発が楽になると思いました。

また、世の中にはAndroid開発をサポートするOSSやWebサービスが多数ありますが、Devtools上に同じ機能が取り込まれてしまうと、差別化が難しいですね。
エンタープライズで導入を検討する際は、少し頭の片隅に入れておいたほうが良さそうです。

さくっとlivereload体験してみたい方は、こちらにサンプルが動かせるリポジトリ準備しましたので、ローカルにcloneして動かしてみてください。

[https://github.com/mitsuruog/awesome-chrome-devtools](https://github.com/mitsuruog/awesome-chrome-devtools)

### 謝辞

最後に、この内容は2013/10/30にサイバーエージェントで開催された「[Frontrend x Chrome Tech Talk Night Extended](http://frontrend.github.io/events/chrome/)」で聞いた内容を元にしています。

本当にサイバーエージェントのFrontrendの方々、最高です！！
ありがとう！！
