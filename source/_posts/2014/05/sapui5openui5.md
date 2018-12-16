---
layout: post
title: "[SAPUI5/OpenUI5]イベントハンドラにパラメータを渡す"
date: 2014-05-25 23:28:00 +0900
comments: true
tags:
- javascript
- OpenUI5
- SAPUI5
---

小ネタです。

SAPUI5/OpenUI5ではUIコントロールのイベント（press、tap、selectなど）が発火した場合、Controllerにあるイベントハンドラを実行するような処理をよく書きます。  
この時にイベントハンドラに、自分がセットしたパラメータを渡したいケースがたびたびあるのですが、やっと方法が分かったのでメモしておきます。

<!-- more -->

1.  イベントインターフェースについて
2.  イベントハンドラにパラメータを渡す
3.  最後に

## 1.　イベントインターフェースについて

まず、SAPUI5でのイベントインターフェースについて説明します。  
SAPUI5ではViewの中にボタンなどのUIコントロールを配置していくのですが、この時にUIコントロールから発生するどのイベントを処理するか定義することが出来ます。

公式ドキュメントを参照すると、必ず次の3パターンのI/Fがあるはずです。

1.  fnListenerFunction
2.  [fnListenerFunction, oListenerObject]
3.  [oData, fnListenerFunction, oListenerObject]

1のパターンはViewなどにてイベントとイベントハンドラを同時に書く方法です。2はイベントハンドラをControllerへ移譲する場合、3が今回やりたいイベントハンドラにパラメータを渡す方法です。「oData」となっている部分にパラメータオブジェクトを設定してください。

I/Fのパラメータの詳細については次の通りです。


*   fnListenerFunction
    *   イベントハンドラで実行されるfunctionです。イベントによって若干差異があるかもしれませんが、イベントハンドラのI/Fは次のようになっていることが多いです。
*   oListenerObject
    *   イベントハンドラ実行時のコンテキストを指定します。イベントハンドラ内のthisが指し示すオブジェクトを指定します。
*   oData
    *   イベントハンドラに渡すパラメータです。オブジェクトを設定してください。

## 2.　イベントハンドラにパラメータを渡す


では実際にサンプルを動かしてみます。  
「Action」ボタンを押した場合に表示されるメッセージダイアログに「Hello :)」というメッセージを渡すようにしています。

サンプルはこちらです。

<a class="jsbin-embed" href="https://jsbin.com/cihoxu/1/embed?output">SAPUI5/OpenUI5 Sample</a><script src="https://static.jsbin.com/js/embed.js"></script>

Buttonのpressイベント発火時の第1引数にオブジェクトを渡しています。分かると簡単です。この例ではpressイベントの中にイベントハンドラを記述していますが、Controllerに処理を委譲する場合は次のようにしてください。

```js
press: [ message: "Hello :)", oController.doPress, oController]
```

```coffee
button = new sap.m.Button
  text: "Action!!"
  press: [message: "Hello :)", (evt, param) ->
    jQuery.sap.require "sap.m.MessageToast"
    sap.m.MessageToast.show param.message
  ]

button.placeAt "content"
```

```html
<!DOCTYPE HTML>
<html>
  <head>
  <meta name="description" content="[add your bin description]" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta charset="UTF-8">
  <title>SAPUI5/OpenUI5 Sample</title>
  <script id="sap-ui-bootstrap"
    src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
    data-sap-ui-libs="sap.m"
    data-sap-ui-theme="sap_bluecrystal"
  >
  </script>
  </head>
  <body class="sapUiBody" id="content" />
</html>
```

## 3.　最後に

基本的なことなのですが、探すのにとても時間が掛かりました。公式ドキュメントの量が非常に多いので、欲しい情報を探すのに毎度苦労します。:(

ちなみに、この内容はこちらのやり取りを参考にしています。

[SAPUI5: How do I pass values to an eventhandler | SCN](https://archive.sap.com/discussions/thread/3442827)
