---
layout: post
title: "[SAPUI5/OpenUI5]大きくなりがちなViewのコードをFragmentsでパーツ化して賢くViewを構築する"
date: 2014-05-06 23:52:39 +0900
comments: true
tags:
 - OpenUI5
 - SAPUI5
---

先日、SAPUI5のバージョンが1.20になりました。

SAPUI5にてUI部品が多いViewを構築する場合、すぐに1000行を超えるような巨大Javascriptファイルになってしまうのですが、Fragmentsと呼ばれるUIをパーツ化して再利用するための機能があります。

今回は、このFragmentsについて実際の利用シーンをイメージしながら紹介します。

<!-- more -->

1.  Fragmentsとは
2.  基本的な使い方
3.  実際の利用シーン
    1.  1画面内での入力UIと参照UIの切り替え
    2.  ダイアログUIの再利用
4.  まとめ

## はじめに

最近、SAPUI5を生のJavascriptで書くと「}」とか「)}」とかしんどいのでcoffeeScriptで書いて楽しています。また、すべてのソースコードをのせると非常に冗長なため、抜粋したソースコードを載せています。実際に動作するサンプルとソースコードはGIthub上にありますので、そちらを参照してください。

サンプル
<http://mitsuruog.github.io/sapui5-showroom/#/fragment>

ソースコード

* CoffeeScript
    * [https://github.com/mitsuruog/sapui5-showroom/tree/master/coffee](https://github.com/mitsuruog/sapui5-showroom/tree/master/coffee)
* Javascript
    * [https://github.com/mitsuruog/sapui5-showroom/tree/master/app](https://github.com/mitsuruog/sapui5-showroom/tree/master/app/view)

## 1.　Fragmentsとは

「Fragments」とは「断片、破片」という意味で、文字通りUIをパーツとして分割する機能です。公式ドキュメントはこちらです。

[https://sapui5.hana.ondemand.com/sdk/#docs/guide/36a5b130076e4b4aac2c27eebf324909.html](https://sapui5.hana.ondemand.com/sdk/#docs/guide/36a5b130076e4b4aac2c27eebf324909.html)

SAPUI5でのFragmentsとはViewと同じようなものですが、Controllerを作成する必要がありません。従って、基本的にUI部分をパーツ化して再利用するために利用するものです。ロジックまで再利用したい場合は、素直にViewにしてしまった方がいいでしょう。

## 2.　基本的な使い方

Fragmentsを使うためには、まず「sap.ui.jsfragment」を継承してオリジナルのFragmentsを定義していき、FragmentsをView（以下、ownerView）にて呼び出して初期化し、Viewのコンテンツとして追加します。

まず、Fragmentsを定義していきます。

Edit.fragments.coffee
```coffee
sap.ui.jsfragment "util.Edit",

  createContent: (oController) ->

    # ここに普通のJSViewのcreateContentと同様にUIコントロールを追加して
    # 最後にreturnします。

```

次に、ownerView側でFragmentsを呼び出します。

Fragments1.view.coffee
```coffee
sap.ui.jsview "view.Fragment",

  getControllerName: ->
    "view.Fragment"

  createContent: (oController) ->

    @page = new sap.m.Page
      title: "Fragment Sample"

    # Fragmentsを呼び出します
    fragment = sap.ui.jsfragment "util.Edit", oController
    @page.addContent fragment

    @page

```

Fragmentsを初期化する際の第2引数のoControllerは、Fragmentにて参照するControllerを渡してください（詳細は後述）。参照が無い場合は、当然nullとなります。（渡した方が後のこととか考えると無難です。）
また、この例の場合、SAPUI5が呼び出す際のエイリアス名が「util.Edit」となるため、物理ファイル名と配置場所は「util/Edit.fragment.js」となります。〜fragments.jsが接頭語だと思ってください。物理ファイルの配置場所とファイル名には特に注意が必要です。

基本的は使い方は以上です。

## 3.　実際の利用シーン

では、実際のアプリケーションでの使いどころとしてはどのようなシーンがあるでしょうか。少し触って見た感じだと、以下の2つで使えそうです。

### 3.1　1画面内での入力UIと参照UIの切り替え

このケースでは、1画面で入力UIと参照UIの切り替え。用途としては、登録（変更）処理後に参照画面に切り替わるような、業務システムでよくあるシーンです。
SAPUI5にてアプリケーションを構築した場合、MVCコンセプトに基づきView部分と実際の表示データであるModelは完全に分離され管理されています。
入力用と参照用のUIにて同じModelを参照している場合、1つのView側でUIを切り替えた方がスマートだと最近考えています。

まず、参照用のFragmentsを定義していきます。登録用のFragmentsは先ほどの「Edit.fragments.coffee」を使います。

Detail.fragments.coffee
```coffee
sap.ui.jsfragment "util.Detail",

  createContent: (oController) ->

    # ここに普通のJSViewのcreateContentと同様にUIコントロールを追加して
    # 最後にreturnします。

```

最後に、controllerにてFragments呼び出し処理を行います。

Fragments2.controller.coffee
```coffee
sap.ui.jsview "view.Fragment",

  getControllerName: ->
    "view.Fragment"

  createContent: (oController) ->

    @page = new sap.m.Page
      title: "Fragment Sample"

    # Fragmentsを呼び出します
    # -> controllerで呼び出すようにします
    #fragment = sap.ui.jsfragment "util.Edit", oController
    #@page.addContent fragment

    @page

```

次に、ownerView側のボタンでUIの切り替えを行うため、ownerViewで行っていたFragments呼び出し処理を、controllerで行うようにします。

Fragments2.view.coffee
```coffee
jQuery.sap.require "sap.m.MessageToast"

sap.ui.controller "view.Fragment",

  _fragments: {}
  _mode: "Detail"

  _getFragments: (name) ->
    #fragmentsを取得してキャッシュ
    unless @_fragments[name]
      @_fragments[name] = sap.ui.jsfragment "util.#{name}", @
    @_fragments[name]

  _toggleFragment: (name) ->
    fragment = @_getFragments name
    container = sap.ui.getCore().getElementById "fragContainer"
    #コンテナの0番目にfragmentsで取得したFormを追加します
    #[MEMO]ここではViewの中のContentはfragmentsのみの想定で書いています
    #[MEMO]Contentが複数ある場合は、removeContentとinsertContentのindexを変更してください
    container.removeContent 0
    container.insertContent fragment, 0
    @_mode = name

  onInit: ->
    @_toggleFragment "Detail"

  #入力用と参照用のFormを切り替る処理
  pressedToggle: (oEvt) ->
    if @_mode is "Detail"
      @_toggleFragment "Edit"
    else
      @_toggleFragment "Detail"
```

ここでのremoveContentとinsertContentはViewの中でContentとなるUIパーツがFragments1つのみの前提で書いています。
また、Fragmentsを切り替えるコンテナを作成して、固有のIDを振ってJavascript側からいつでもフックできるようにするといいでしょう。

### 3.2　ダイアログUIの再利用

このケースでは、選択用などのダイアログUIを再利用します。単純なものではなく少しUIパーツが多いダイアログを再利用するとさらに効果的です。
先ほどと同様にダイアログ用のFragmentsを定義していきます。

Dialog.fragments.coffee
```coffee
sap.ui.jsfragment "util.Dialog",

  createContent: (oController) ->

    dialog = new sap.m.Dialog
      title: "Dialog"
      content: [

        #入力用のFragmentsを再利用します

        sap.ui.jsfragment "util.Edit", oController
      ]
      beginButton: new sap.m.Button
        type: "Accept"
        text: "OK"
        press: [oController.pressedOk, oController]
      endButton: new sap.m.Button
        text: "NG"
        press: [oControl

```

ダイアログの中身のコンテンツは先ほど定義したEdit.fragments.jsを再利用しています。こんなところでもFragmentsいい仕事しています。

Fragments側からControllerのfunctionを呼び出していると思います。
これは、Fragmentsを初期化する際にControllerの参照を渡す事で、Fragments側からOwnerViewのControllerのfunctionを呼び出すことが出来ます。

> この場合、OwnerView側でFragmentsが使うfunctionを知っていて実装する必要があります。Javaでいうインターフェースと同じような感覚なのですが、いかんせん動的型付け言語なのでチェックが緩いです。Controllerにfunctionが存在しない場合は当然、実行時に落ちます。
次にownerViewのcontrollerにてFragmentsを呼び出します。ownerViewにてダイアログを開くボタンを押した際にダイアログをopenします。

> Fragments3.controller.coffee
```coffee
jQuery.sap.require "sap.m.MessageToast"

sap.ui.controller "view.Fragment",

  _fragments: {}

  _getFragments: (name) ->
    #fragmentsを取得してキャッシュ
    unless @_fragments[name]
      @_fragments[name] = sap.ui.jsfragment "util.#{name}", @
    @_fragments[name]

  onInit: ->

  #ダイアログを表示します
  openDialog: (oEvt) ->
    dialog = @_getFragments "Dialog"
    dialog.open()

  #ダイアログでOKをPressした時の処理
  pressedOk: (oEvt) ->
    oEvt.getSource().getParent().close()
    sap.m.MessageToast.show "pressed OK"

  #ダイアログでNGをPressした時の処理
  pressedNg: (oEvt) ->
    oEvt.getSource().getParent().close()
    sap.m.MessageToast.show "pressed NG"
```

FragmentsにてOK/NGボタンを押した場合の処理は、Controllerに記述して処理させています。

## 4.　まとめ

Fragmentsとは以前からSAPUI5にあった機能ですが、「Experimental（実験的）」な機能に分類されていました。1.20からはめでたくExperimentalでなくなったので、やっと実戦で投入できるようになりました。

SAPUI5にてUI部品が多いViewを構築する場合、すぐに1000行を超えるようなJSファイルになってしまうのですが、このようにFragmentsを使うことでUI部品をパーツで切り離して利用できるようになります。  
（行数が多いのはSAPUI5に限ったことではありません、JavascriptでViewを作成するUIフレームワークはそうなりやすいです。）

また、UIを部品化することでアプリケーション内での再利用が進み、開発効率と品質面で一定のアドバンテージがあると思います。
巨大化しやすいViewをいかにパーツ化して再利用しながらアプリケーションを構築していくのが、SAPUI5に限らずUIフレームワークでアプリケーションを構築する際のポイントだと最近感じています。
