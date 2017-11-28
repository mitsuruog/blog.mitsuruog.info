---
layout: post
title: "[SAPUI5/OpenUI5]URLでのルーティングの基本"
date: 2014-05-25 02:16:00 +0900
comments: true
tags:
 - javascript
 - OpenUI5
 - SAPUI5
---

Backbone.jsやAngularJSに代表されるJavascriptMV＊系で構築されたSPA（Single page application）は、Strutsなどで構築された従来のWebアプリケーションと異なり、1つのHTML5の中に複数画面（View）を持ち、画面遷移時にJavascriptにてViewを切り替えるため、通常はブラウザのリフレッシュを伴いません。

その際に問題となるのが、画面遷移時にリフレッシュを伴わないため、URLが変らないことです。

URLが変わらないということは、すべての画面のURLが同じになるということで、ブックマークから特定の画面を開くことができなくなります。

そこでSPAでは通常、URLの後ろに「ハッシュ」と呼ばれる開く対象となるURLを付け加え、Javascriptにてハッシュと一致するViewを表示するようにコントロールする「router」「routing」と呼ばれる手法を行うことが一般的です。

今回は、SAPUI5/OpenUI5でのroutingの基本的なことについて紹介します。

<!-- more -->

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/a1510_000018.jpg %}

1.  ルーティングテーブルの定義とルーターの初期化
2.  ルーティング
3.  ルーティングマッチとViewでのパラメータの取得
4.  最後に


## 1.　ルーティングテーブルの定義とルーターの初期化

ルーティングするためには、URLの「ハッシュ」とそれと対応して表示するViewを定義する必要があります。ここでは便宜上「ルーティングテーブル」と言います。

まず、「Conpoment.js」内の「metadata」にルーティングテーブルを定義します。

```coffee
#! Component.js

sap.ui.core.UIComponent.extend "com.mitsuruog.sapui5.Component",

  metadata:
    routing:
      config:
        viewType: "JS"
        viewPath: "view"
        targetControl: "navConteiner"
        targetAggregation: "pages"
        clearTarget: false
      routes: [{
        pattern: ""
        name: "First"
        view: "First"
        targetAggregation: "pages"
      }, {
        pattern: "second"
        name: "Second"
        view: "Second"
        targetAggregation: "pages"
      },

      # ...省略

```

ちなみに「config」はすべてのrouting共通の設定で、「routes」内には、それぞれのハッシュと対応するView定義、カスタムする振る舞いなどが定義出来ます。

細かい設定等はこちらです。簡単に紹介します。

[Configuration Parameters for Navigation](https://sapui5.hana.ondemand.com/sdk/#docs/guide/902313063d6f45aeaa3388cc4c13c34e.html)

* pattern
    * パターンマッチするハッシュを文字列で指定します。ルーティングテーブルの中で最も大事な設定です
* name（必須）
    * ルーテリングテーブルの中で一意な名前を設定します
* view
    * patternにマッチした場合に表示するView名です
* viewType
    * Viewのタイプです。HTML、JS、JSON、XMLがあります
* viewPath
    * Viewのリソースがあるところまでのパスです。例えば、「view/someView」の場所にViewが存在する場合は、「view」を指定します
* targetParent
    * 後述するtargetControlの親要素をIDで指定します
* targetControl
    * viewを表示するコンテナをIDで指定します
* targetAggregation
    * targetControlで指定したコンテナのどのプロパティにViewを設定するか指定します。次のように指定することが多いです
* subroutes
    * ネストしたルーティングを実現する場合にroutesと同じように設定します。（まだ詳しく検証してないです。
* clearTarget
    * Viewを追加する前にViewをクリアする必要がある場合、trueを設定します。
* callback
    * patternにマッチした場合に実行されるCallbackを指定します。

どのルーティング定義にもマッチしないものに対してNotFoundページを表示する場合は、patternに「`:all*:`」を設定してください。

ルーティングテーブルを定義した後に、同じ「Conpoment.js」にてrouterのライフサイクルを定義します。「init」で初期化して、「destory」時に破棄します。

この辺りのコードはお作法だと思ってコピペしましょう。

```coffee
#! Component.js

  # ...省略

  init: ->
    jQuery.sap.require "sap.ui.core.routing.History"
    jQuery.sap.require "sap.m.routing.RouteMatchedHandler"

    sap.ui.core.UIComponent.prototype.init.apply @

    router = @getRouter()
    this.routerHandler = new sap.m.routing.RouteMatchedHandler router
    router.initialize()

  destory: ->
    if @routerHandler
      @routerHandler.destroy()
    sap.ui.core.UIComponent.prototype.destory.apply @

  # ...省略
```

## 2.　ルーティング

それでは実際にルーティングしてみましょう。

サンプルの例では、次のように呼び出すURLにハッシュを追加することで、望みの画面を表示させることが可能です。

* [http://mitsuruog.github.io/sapui5-showroom/app/routing/#/second](http://mitsuruog.github.io/sapui5-showroom/app/routing/#/second)
* [http://mitsuruog.github.io/sapui5-showroom/app/routing/#/third/1/tab2](http://mitsuruog.github.io/sapui5-showroom/app/routing/#/third/1/tab2)

では、プログラムからViewを切り替え時にハッシュも変更するためにはどうすればよいでしょうか？

プログラムからViewを切り替え時にハッシュも変更するためには、先ほど定義したrouterを取得してハッシュを切り替える命令を出す必要があります。ハッシュパラメータを渡す場合は、第2引数にkey-value形式でハッシュパラメータのオブジェクトを渡します。

```coffee
#! ButtonのPress処理などController.jsにて書いている想定。

nextPage: ->

  router = sap.ui.core.UIComponent.getRouterFor @

  #パラメータを伴わない場合
  router.navTo "Second"

  #パラメータを伴う場合
  router.navTo "Second",
    someParam: "hoge"
```

## 3.　ルーティングマッチとViewでのパラメータ取得

URLのハッシュ値を変えることでViewを切り替えることができましたが、ハッシュに含まれるパラメータをそれぞれのViewにて取得するためにはどうすれば良いでしょうか。

Viewにてハッシュに設定されたパラメータを取得するためには、ルーティングマッチした際に発火するイベントにフックする必要があります。

```js
#! routing先のController.jsにて書いている想定。

sap.ui.controller "view.Third",

  onInit: ->
    @router = sap.ui.core.UIComponent.getRouterFor @
    @router.attachRoutePatternMatched @_handleRouteMatched, @

  _handleRouteMatched: (oEvt) ->

    #viewNameが一致しないものはFilterする
    unless "Third" is oEvt.getParameter "name"
      return

    #Hashパラメータを取得
    #以下のようなURLを想定
    #/some/{id}
    #/some/:id:
    hashParams = oEvt.getParameter "arguments"
    id = hashParams.id

```

ルーティング時に渡したパラメータはgetParameterにて取得します。すべてのパタメータをオブジェクトとして取得する場合は、getParametersを使います。

（getParameterの引数にargumentsが使われている辺り、中の実装がどうなっているか予想できますw）


## 4.　最後に

SAPUI5/OpenUI5でのルーティングについて基本的なことを書きました。

ちなみにSAPUI5/OpenUI5では、最近まではEventBusを使ったNavigationを使うことが一般的でした。（たぶん、1.20になってから変わったと思います。）

EventBusでは、ブックマークからの特定画面を起動することが難しかったので、個人的には待ちに待った機能でした。

1.20になってから他にも大きな変更点があるSAPUI5/OpenUI5ですので、機会があればまた紹介していきます。


## デモやソースコードはこちらです。

### デモ

SAPUI5/OpenUI5 routing Sample

[http://mitsuruog.github.io/sapui5-showroom/app/routing/](http://mitsuruog.github.io/sapui5-showroom/app/routing/)

### ソースコード

sapui5-showroom/app/routing at master · mitsuruog/sapui5-showroom

[https://github.com/mitsuruog/sapui5-showroom/tree/master/app/routing](https://github.com/mitsuruog/sapui5-showroom/tree/master/app/routing)

### 参考リンク

* [(SAP/Open) UI5 with Routing Tutorial - YouTube](https://www.youtube.com/watch?v=YZqtx2KJ2To)
* [(SAP/Open) UI5 with dynamic Routing Tutorial - YouTube](https://www.youtube.com/watch?v=hMEkV1ECf2c)
* [Navigation](https://sapui5.hana.ondemand.com/sdk/#docs/guide/3d18f20bd2294228acb6910d8e8a5fb5.html)
* [Step 3: Navigation and Routing](https://sapui5.hana.ondemand.com/sdk/#docs/guide/688f36bd758e4ce2b4e682eef4dc794e.html)
