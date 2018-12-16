---
layout: post
title: "業務系アプリケーションに特化したSAP社製「SAPUI5」を触ってみた"
date: 2014-02-19 05:13:00 +0900
comments: true
tags:
 - SAPUI5
 - OpenUI5
---

SAP社では2013年12月に[SAP Mobile Platform \- Wikipedia](https://en.wikipedia.org/wiki/SAP_Mobile_Platform)を公開しており、本格的にHTML5に力を入れてきました。  
今回はその流れの中で、SAPのモバイル戦略を下支えするHTML5ベースのUIフレームワーク「SAPUI5」を少し触ってみます。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/Shopping_Cart.png %}

## SAPUI5とは

SAPUI5とは「SAP UI Development Toolkit for HTML5」の略称で、業務系アプリケーションに特化した機能豊富なUIコンポーネントを含んだUIフレームワークです。  
2013年12月にSAPUI5をオープンソース化した[OpenUI5](https://openui5.org/)が発表されています。

特徴は、Publickeyさんの方で語られていますので、こちらを参照してください。

[SAP、業務アプリ用のJavaScript製UIライブラリ「OpenUI5」を公開。レスポンシブ対応でモバイルデバイスにも － Publickey](https://www.publickey1.jp/blog/13/sapjavascriptuiopenui5.html)

## SAPUI5とOpenUI5の違い

では、SAPUI5とOpenUI5の何が違うのかと言ったところですが、簡単に両者の違いを話ます。

SAPUI5はもともと「SAP NetWeaver Gateway」のUIアドオンの1つとして提供されていました。基本的には「SAP NetWeaver Gateway」を購入したユーザーでないと使えませんでした。

「OpenUI5」はSAPUI5をオープンソース化したもので、開発者からすると嬉しい限りですが、利用する際はいくつか注意点があります。（今のところ）

### 1. SAPUI5とはリリースサイクルが異なる

> (2014/02/20 追記)　2014/02/20にOpenUI5も最新版の1.18.8にアップデートされました。とはいえ使う時はバージョンちょっと注意してくださいね。（ブログ見てくれたのかなw）

OpenUI5の中身は基本的にSAPUI5と同じものですが、SAPUI5より若干古いバージョンが提供されているようです。それに伴っていくつかのUIコンポーネントが使えません。

2014/2/17現在で以下のようになっています。

* OpenUI5
  * 1.16.7
* SAPUI5
  * 1.18.6

これに伴い、開発者用のドキュメントも分かれています。ご注意ください。

* SAPUI5 SDK - Demo Kit
[https://sapui5.hana.ondemand.com/sdk/#content/Overview.html](https://sapui5.hana.ondemand.com/sdk/#content/Overview.html)
* OpenUI5 SDK - Demo Kit
[https://openui5.hana.ondemand.com/#content/Overview.html](https://openui5.hana.ondemand.com/#content/Overview.html)

### 2. Theme Designerがない

それからSAPUI5では「Theme Designer」というGUIでデザインを変更できるツールがあるのですが、OpenUI5には（いまのところ）付属してないようです。

OpenUI5のダウンロードしたファイルの中を見ると、lessを書き換えるとテーマの変更ができると思いますが、かなりHackeyです。

### 3. Experimental featuresを実戦投入しない(2014/02/20 追記)

APIの中には、`Experimental features`（実験的機能）が含まれています。予告なく変更・削除される恐れがありますので、実戦投入しないようにしてくださいね。

ドキュメントを見ると「`Experimental features`」って書いてあります。

## 実際に試してみる

実は、SAPにてSAPUI5のCDNが提供されており、お試し程度であればこれで十分です。  
こちらのURLにていつでも最新バージョンのライブラリを利用することができます。

[https://sapui5.hana.ondemand.com/resources/sap-ui-core.js](https://sapui5.hana.ondemand.com/resources/sap-ui-core.js)

では、実際にSAPUI5を試してみましょう。  
SAPUI5ではデスクトップ用途の「`sap.ui.commons`」とモバイル用途の「`sap.m`」の2系統のUIコンポーネントが提供されています。今回はモバイル用のUIコンポーネントを使用します。

HTMLファイルを準備して以下のように記述してください。（ライブラリは2014/2/17現在の最新版1.18.6を使っています。）

コードはこちらです。
 
```js
//3.0.3以降
$myModal = $('#myModal').modal({}, {
  person: 'mitsuruog'
});

$myModal.on('show.bs.modal', function(e) {
  var name = e.relatedTarget.person;
}
```

実際に動くアプリケーションはこちらです。

<a class="jsbin-embed" href="https://jsbin.com/gur/3/embed?output">Hello SAPUI5</a><script src="https://static.jsbin.com/js/embed.js"></script>

## まとめ

SAP社では2013年12月に[SAP Mobile Platform \- Wikipedia](https://en.wikipedia.org/wiki/SAP_Mobile_Platform)を公開しており、本格的にHTML5に力を入れてきました。

Platform 3.0では「Sybase Unwired Platform」をはじめ、「SAP NetWeaver Gateway」、GUIで画面開発ができる「App Builder」などいくつかのモバイル向けソリューションの統合が行われています。  
HTML5ベースのUIフレームワーク「SAPUI5」は、そのようなSAPのモバイル戦略を下支えするものです。

SAPUI5を使うことで、他のWebサービスとのマッシュアップ開発など柔軟に行えるようになり、まったく新しいSAPユーザ体験を提供できる可能性を秘めているのではないかと思います。
