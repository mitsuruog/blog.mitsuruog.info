---
layout: post
title: "RICOH THETAで撮影した360°画像をthree.jsで全天球処理したついでにFileAPIのDrag&Drop対応してみた"
date: 2013-12-27 03:25:00 +0900
comments: true
tags: 
 - HTML5
 - three.js
 - File API
 - RICOH THETA
---

職場の同僚が[RICOH THETA](https://theta360.com/ja/)なる360°写真が撮影できるカメラを買って、何やら面白そうなことをやりたがってたので、three.jsを使って全天球処理するところを手伝いました。  
全天球処理はさほど難しくなかったのですが、欲を出して行ったDrag&Drop処理が結構ハマったので、その辺りを話ます。

下のDEMOサイトにTHETAで撮影した画像をDrag&Dropすると、いい感じに全天球にしてくれます。ソースコードもすべてGithubに公開してますので参考にしてください。

* DEMO：[http://mitsuruog.github.io/richo-theta-with-threejs](http://mitsuruog.github.io/richo-theta-with-threejs)
* リポジトリ：[https://github.com/mitsuruog/richo-theta-with-threejs](https://github.com/mitsuruog/richo-theta-with-threejs)

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2013/RICOH_THETA.png %}

### 目次

1.  RECOH THETAとは
2.  three.jsでの全天球処理
3.  HTML5 File APIによるDrag&Drop処理
4.  Cross Origin image load HACK
5.  まとめ

## 1. RECOH THETAとは

[RICOH THETA](https://theta360.com/ja/)とはRICOH社が製造する360°写真が撮影できるカメラです。

外見がシャレてます。でも結構お高いです。（¥44,800 執筆時）


しかも、公式サイトもおしゃれで流行の縦スクロール型のレスポンシブデザインですが、中身はHTML5ではなくXHTMLでした。残念w。

スクロールで動く部分はjQueryPluginsではなく、手組っぽいです。


## 2. three.jsでの全天球処理

three.jsでの全天球処理はこちらのWebGLサンプルを参考にしました。  
（とは言ってもほとんどコピペですが・・・）

[http://threejs.org/examples/webgl_panorama_equirectangular.html](http://threejs.org/examples/webgl_panorama_equirectangular.html)

全天球処理がさくっと終わったので、欲を出してimageファイルをDrag&Dropしてthree.jsのテクスチャを変えようとおもったのですが、これがハマりました。

## 3. HTML5 File APIによるDrag&Drop処理

HTML5にはFIleAPIという、ブラウザからローカルファイルのやり取りができる標準APIがあります。今回はFlieAPIを使ってimageファイルのDrag&Drop処理を実現していきます。

処理の大枠は次のようなコードになります。

{% gist 8136503 dragdrop.js %}
実装時の注意点としては、ファイルドロップ時にイベントの伝搬をキャンセルしないと、ブラウザでimageファイルを開いてしまいます。

## 4. Cross Origin image load HACK

実際にドラックされたimageファイルは`dataURI形式`に変換して、three.jsのテクスチャに設定すればうまく行くと思ったのですが、dataURIを読み込む際に同一生成元ポリシー（same origin policy）に抵触していまいエラーとなってしまいました。




dataURIは、通常のWebのリソース命名方式（httpとか）ではなく、独自の命名方式（data）で命名されてしまうため、ドラッグしたimageファイルをJavascriptで再利用しようとすると必ず同一生成元ポリシー違反となってしまいます。  
（[RFC6454 — The Web Origin Conceptの仕様書](http://tools.ietf.org/html/rfc6454#section-5)に書いてありました。）


そのため一度、ダミーのimgタグに紐づけてから再利用するようなHACKを行う必要があります。

{% gist 8136503 hack.js %}
これで、[RICOH THETA](https://theta360.com/ja/)で撮影した画像をDrag&Dropすると、three.jsでいい感じに全球体処理してくれます。three.jsすごい！




## 5. まとめ

three.jsはやってて面白いですね。

HTML5のfileAPIを使うことで、ブラウザ上でローカルファイルを扱うことが簡単になってきましたが、それをjavascriptで再利用する際は、いろいろ問題があることも分かりました。

いつになったら、Webはこういうハックとかバッドノウハウが無い世界になるのでしょうか・・・まだまだ苦難の時代は続きそうです。

### X. 参考資料

* Reading files in JavaScript using the File APIs
[http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-selecting-files-dnd](http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-selecting-files-dnd)
* How to develop a HTML5 Image Uploader
<span id="goog_1930387588"></span>[https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/](https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/)
* three.js change texture on material
[http://stackoverflow.com/questions/13583103/three-js-change-texture-on-material](http://stackoverflow.com/questions/13583103/three-js-change-texture-on-material)
* Three.js Update Texture image
[http://stackoverflow.com/questions/18436431/three-js-update-texture-image](http://stackoverflow.com/questions/18436431/three-js-update-texture-image)

**p.s**

同僚が[RICOH THETA](https://theta360.com/ja/)の競合製品を見つけて悶絶していましたw
こちらはウェアラブルです。しかもサイトはしっかりHTML5でした。もっと頑張れRICOH

[http://bublcam.com/](http://bublcam.com/)



