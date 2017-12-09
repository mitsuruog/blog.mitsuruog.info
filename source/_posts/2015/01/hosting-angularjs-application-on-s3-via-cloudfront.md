---
layout: post
title: "AngularJSで作ったSPAをAWS上の「S3＋CloudFront」でお手軽ホスティングして、クラウドサービスってやっぱ素晴らしいなと思った話"
date: 2015-01-15 21:47:55 +0900
comments: true
tags: 
 - AngularJs
 - aws
 - s3
 - cloudfront
 - SPA
---

最近は、WebAPIやAWSのようなクラウドサービスが普及してきて、バックエンドのサーバーがなくても、Webサービスが公開できるようになってきました。

今回はAWSの**S3にあるStatic Website Hosting機能**を使ってAngularJSで作成したSPA(Single page application)をホスティングさせてみました。

割とS3でのサイト公開は簡単なので楽勝かと思いきや・・・  
いろいろまじめに考えると手こずるものですね。

<!-- more -->

## S3でのSPA公開

S3でのサイト公開は非常に簡単です。次の3ステップで即公開できます。  
(「S3 サイト公開」などで検索するといくつか記事がヒットすると思いますので参考にしてください。)

* S3上にBucketを作成する。
* AngularJSで作成したSPAをアップロードする。
* BucketのStatic Website HostingをONにする。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-1.png %}

Static Website HostingをONにすることでアクセス可能なURLが取得できます。  
アクセスした際に「`AccessDenied`」エラーになる場合は、アップロードしたファイルの`Permissions`が**Everyoneアクセス可能**になっていないことが多いです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-2.png 500 %}

しかし、この**Everyoneアクセス可能**状態はあまりいい状態ではありませんので、CloudFrontを利用します。  
(後で紹介しますが、S3はCloudFront経由のアクセスのみ有効にする設定を推奨します。)

> S3のEveryoneアクセス可能はApacheの設定漏れで、ファイル一覧が見えてしまっている感覚に似ていて落ち着きませんw

他にも、S3で公開した場合に問題になりそうな部分について紹介します。

## S3でのSPA公開で問題になりそうなところ

S3のStatic Website Hosting機能はお手軽で非常に魅力を感じるのですが、Webアプリケーションを想定した場合、次のような問題がありそうです。

* アクセスを`HTTPS`に限定できない。
* URLに「`/`」を指定した場合、S3上のフォルダを参照してしまいエラーとなる。(結果「`/index.html`」まで含める形に・・・)
* 「`/`」以外のURL(「/hoge」とか)でアクセスした場合に`403(access denied)`エラー(2015/01/20 追記)
* 他にもあった気がするが、忘れた。
 
という訳でS3のみのお手軽ホスティングは、コーポレートサイトのような静的コンテンツ向きな気がします。

## CloudFrontの利用

そこで利用するのがCloudFrontです。いろいろ探していたら、こちらの記事が参考になりました。ありがとうございます！

[[CloudFront + S3]特定バケットに特定ディストリビューションのみからアクセスできるよう設定する ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/cloudfront-s3-origin-access-identity/)

手順としては次のような形です。

* CloudFront上にDistributionsを作成
* Origin Domain NameにS3のBucketを指定
* Restrict Bucket Accessで「Yes」を設定してS3へのアクセスを制限

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-3.png 500 %}

これでCloudFront経由でS3へアクセスすることができますが、SPAをホスティングするに当たって追加で以下の設定をしました。

### General > Default Root Object

`Default Root Object`に「index.html」を設定します。これで「`/`」でアクセスした際に、エラーにならず「`index.html`」を呼び出すことができます。

しかも、デフォルトの(*.cloudfront.net)ドメインであればSSL証明書までついてきます。  
まじで至れり尽くせりです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-5.png 500 %}

### Behaviors > Viewer Protocol Policy

新しいBehaviorを作成して`Viewer Protocol Policy`にて`Redirect HTTP to HTTPS`を選択します。これでHTTPでアクセスされた場合に、HTTPSにリダイレクトすることが可能です。  
(あまりこだわりなければ`Path Pattern`は`Default (*)`1つで事足りるはず。)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-4.png 500 %}

## CloudFront利用上の注意点

CloudFrontを利用すると幸せになれるのですが、1点注意点があります。それは**キャッシュ**です。

CloudFrontの本質はCDNなので、コンテンツをキャッシュします。しかもデフォルトでは**24hキャッシュを保持**するので、S3上にアップロードしたファイルは最大24h変更されません。  

### Invalidationsを利用してCacheをクリア

CloudFrontにはInvalidationsというキャッシュクリアをする仕組みがあるので、これを使ってCloudFrontに対してキャッシュのクリアを指示します。  
(ただ、5〜10分くらいかかります。リアルタイムではないです。)

CloudFrontでDistributionsを選択すると「`Invalidations`」というタブがあるので、ここで「`Create Invalidation`」ボタンをクリックします。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/angular-s3-cloudfront-6.png 500 %}

クリアするファイルを指定する必要があるので、例えば「`/index.html`」とか入力します。  
私の場合、フロントのリソースは結合＆minify＆バージョニングして最適化してしまうので、普段は`index.html`だけで十分です。

あとはキャッシュがクリアされるまで気長に待ちましょう。

## まとめ
「S3＋CloudFront」を使うことでお手軽にAngularJSで作成したWebアプリケーションをホスティングすることができました。しかも勝手にスケールするし、クラウドサービス偉大過ぎます。

### しかし、上には上がいる！

今回の「S3＋CloudFront」はまだ**大関**構成なようですね。個人的には頑張ったと思うのですが。。。orz  
こちらの記事を読むと、この上の「S3＋CloudFront＋Route53」**横綱**構成があるようです。

[AWSにおける静的コンテンツ配信パターンカタログ（アンチパターン含む） ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/static-contents-delivery-patterns/)

もっと稽古します。

> (2015/01/20 追記)  
> `/`以外のURLでアクセスした場合に`403(access denied)`エラーになるのですが、CloudFront DistributionsのError Pages設定で、403エラーの場合のエラーページを`/index.html`にすることで回避することができましたー。  
> うぇーーーーい！！って無理矢理感が半端ないw
