---
layout: post
title: "[SAPUI5/OpenUI5]GoogleMapと組み合わせる"
date: 2014-05-31 22:42:00 +0900
comments: true
tags: 
 - GoogleMap
 - javascript
 - OpenUI5
 - SAPUI5
---

SAPUI5/OpenUI5を使った場合、SAPのバックエンドのデータと、様々なオープンデータやWebサービスを組み合わせてクライアントマッシュアップさせたくなります。  
（今回はOpenUI5を使いました。）

まず定番はGoogleMapでしょうか・・・  
普通にPageにMapを表示するサンプルは探せばあるのですが、ダイアログでMapを表示するサンプルが無かったので作ってみました。

<!-- more -->

サンプルはこちらです。

「Open Map」ボタンを押すと東京駅を中心としたマップが表示されます。

<a class="jsbin-embed" href="http://jsbin.com/rowib/1/embed?output&height=400px">SAPUI5/OpenUI5 Google map Sample</a><script src="http://static.jsbin.com/js/embed.js"></script>

1.  説明
2.  最後に


## 1.　説明



基本的には、OpenUI5のindex.htmlにGoogleMapのAPIを利用するためにJavascriptを読み込むだけで準備はOKです。


<script src="https://gist.github.com/mitsuruog/e60851c1ae03c053b3b8.js?file=jsbin.rowib.html"></script>

次に、ダイアログを作成します。

<script src="https://gist.github.com/mitsuruog/e60851c1ae03c053b3b8.js?file=jsbin.rowib.coffee"></script>

以下、ダイアログを作成する際に初期設定でなにを行っているかの説明です。

*   content
    *   GoogleMapを表示させるコンテナを作成します。ここでは`sap.ui.core.HTML`を使って直接`<div>`タグを出力しています。
*   beginButton
    *   閉じるボタンの処理です。
*   afterOpen
    *   ダイアログが表示された後にMapを初期化して、座標をプロットしています。

Map初期化のタイミングですが、MapコンテナのDOMが生成される前に初期化するとエラーになるので注意が必要です。
ちょっとしたら、MapコンテナのafterRenderingイベントでも初期化できるかもしれません（未検証）。そっちの方が作りとしては奇麗な気がします。

## 2.　最後に



今後、企業の社員にタブレットなどのモバイル端末を配布して、外での業務活動に活かすケースはますます増えると思います。  
GoogleMapとの連携はよくありそうなシーンなのですが、他のWebサービスや既存の社内システムの情報などをマッシュアップすることで、変化の激しい時代に適応した、モバイルを有効活用したまったく新しい企業システムが誕生するのかと思うと、少しわくわくします。



以下、参考情報です。

### OpenUI5API

* [JsDoc Report - SAP UI development Toolkit for HTML5 - API Reference - sap.m.Dialog](https://sapui5.netweaver.ondemand.com/sdk/docs/api/symbols/sap.m.Dialog.htm)
* [JsDoc Report - SAP UI development Toolkit for HTML5 - API Reference - sap.ui.core.HTML](https://sapui5.hana.ondemand.com/sdk/docs/api/symbols/sap.ui.core.HTML.html)

### GoogleMap関連


GoogleMapの使い方についてはこちらが丁寧です。  
（AjaxTowerさん、毎度ありがとうございます！）

* [Google Maps入門(Google Maps JavaScript API V3)](http://www.ajaxtower.jp/googlemaps/)


GoogleMapのAPIのスタートガイド（公式）

* [スタート ガイド - Google Maps JavaScript API v3 — Google Developers](https://developers.google.com/maps/documentation/javascript/tutorial?hl=ja)



### SAPUI5/OpenUI5とGoogleMapのサンプル

* [【第1回】SAPUI5とSAP NetWeaver Gatewayによるマッシュアップ開発入門（序章） - SAP技術ブログ | SAPソリューションのREALTECH Japan（リアルテックジャパン）](http://solution.realtech.jp/blog/2013/10/sapui5sap-netweaver-gateway.html)
* [SAPUI5 Gateway and Google Maps | Experiences with SAP Gateway](http://mysapgw.wordpress.com/2012/05/19/sapui5-gateway-and-google-maps/)  
（コードは中のリンク「google code」に入ってます。）
* [SAPUI5 with Google Maps | SCN](http://scn.sap.com/people/konstantin.anikeev/blog/2013/02/11/sapui5-with-google-maps)


