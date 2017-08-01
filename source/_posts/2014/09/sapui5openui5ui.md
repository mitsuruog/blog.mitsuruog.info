---
layout: post
title: "[SAPUI5/OpenUI5]カスタムUIコントロールを作成する方法(前編)"
date: 2014-09-28 23:01:00 +0900
comments: true
tags:
 - SAPUI5
 - OpenUI5
---

> How to create new own controls in OpenUI5(Part 1)

OpenUI5はUIフレームワークという名前の通り、多くの優れたUIコントロールを持っていますが、場合によっては少しカスタムして使いたいという要望は時々あります。

さて、OpenUI5にてカスタムUIコントロールを作成する方法は「新規で作成する」「既存のUIを拡張する」の2つありますが、少し長くなるので、2部構成で説明していきます。
前編は新規で作成する方を説明します。

今回のデモはこちらで参照できます。

[http://mitsuruog.github.io/sapui5-showroom/#/controls](http://mitsuruog.github.io/sapui5-showroom/#/controls)

<!-- more -->

### 目次

1. 新しいUIコントロールの定義
2. UIコントロールメタデータの定義
3. レンダラの実装
4. 配布、利用
5. まとめ

1. Definition of UI controls
2. Definition ofUI controls metadate
3. Implementation of the renderer
4. How to use
5. Summary

こちらの公式ページの内容をもとに書いています。

[Developing UI5 Controls in JavaScript](https://openui5.hana.ondemand.com/#docs/guide/91f1703b6f4d1014b6dd926db0e91070.html)

## 1. 新しいUIコントロールの定義(Definition of UI controls)

新しいUIコントロールを作成するためには、まず`sap.ui.core.Control`を継承する必要があります。以下のコードは新規で`mitsuruog.SayHello`という名前のUIコントロールを定義しています。

```coffee
sap.ui.core.Control.extend "mitsuruog.SayHello",
  metadata: {}
  renderer: {}
```

## 2. UIコントロールメタデータの定義

新しく定義したUIコントロールが持つ特徴をメタデータ(定義情報)として定義していきます。定義できるメタデータの属性は`Properties`、`Events`、`Aggregations(Associations)`の3つです。順に説明していきます。

### Properties

Propertiesとは、その名の通りUIコントロールに外部からアクセスできるプロパティ定義です。例えば、`name`というPropertiesを定義した場合、UIコントロールを初期化(new)する際に、`name`プロパティにパラメータを渡すことができます。以下の属性を定義します。

* __type__: プロパティのデータタイプを指定します。これを指定する事でOpenUI5が提供するvalidationが機能します。デフォルトは`string`です。
* __defaultValue__: デフォルトを指定します。何も指定しない場合は`undefined`です。
Propertiesにはアクセスレベルが指定できるようです(未検証)。[Object Metadata and Implementation](https://openui5.hana.ondemand.com/docs/guide/91f29fea6f4d1014b6dd926db0e91070.html)

### Events

UIコントロールから発火するカスタムイベント名を定義します。

### Aggregations(Associations)

UIコントロールに外部からリストを渡したい場合に定義します。`sap.m.List`の`items`や`sap.m.Page`の`content`に相当します。以下の属性を定義します。

* __type__: Aggregationsに設定するクラスを定義します。`sap.m.List`の`items`場合は`sap.m.ListItemBase`です。デフォルトは`sap.ui.core.control`です。
* __multiple__: `0..n`の場合は`true`、`0..1`の場合は`false`にします。何も設定しない場合の挙動が面倒なので、必ず設定しましょう。
* __singularName__: 単数の場合の名前を定義します。通常は複数系の`「s」`を取り除いた形を指定します。`items`の場合は`item`です。この辺り、正直OpenUI5に慣れてないとピンとこないと思いますので、詳細は割愛します。

実装例)
```coffee

sap.ui.core.Control.extend "mitsuruog.BlueContainer",

  metadata:
    properties:
      boxColor:
        type: "string"
        defaultValue: "#CBE6F3"
    events:
      hover: {}
    aggregations:
      items:
        type: "sap.ui.core.Control"
        multiple: true
        singularName: "item"

    renderer: {}

    onmouseover: (evt) ->
      @fireHover()
```

詳細は公式ベージを確認してください。

* メタデータについての詳細
[Defining the Control Metadata](https://openui5.hana.ondemand.com/#docs/guide/7b52540d9d8c4e00b9723151622bbb64.html)
* メタデータを定義した場合、使用しない方がいいメソッド名についての注意事項など
[Adding Method Implementations](https://openui5.hana.ondemand.com/#docs/guide/91f0a8dc6f4d1014b6dd926db0e91070.html)
* Propertiesの指定方法の詳細
[Defining Control Properties](https://openui5.hana.ondemand.com/#docs/guide/ac56d92162ed47ff858fdf1ce26c18c4.html)

## 3. レンダラの実装

レンダラとは実際にUIコントロールのHTMLを出力する部分です。HTMLを書き出す際は、内部的に`sap.ui.core.RenderManager`の各メソッドを呼び出します。良く使いそうなものはこちらです。

* __write__: HTMLを出力します
* __writeEscaped__: エスケープしてHTMLを出力します
* __writeControlData__: OpenUI5上が内部でUIコントロールを管理するためのIDを出力します。これが無い場合、内部のイベントがハンドルできません。結構重要です。
* __addStyle__, __writeStyles__: インラインスタイルを出力します
* __addClass__, __writeClasses__: CSSクラスを出力します
* __renderControl__: 与えられたUIコントロールのレンダラを実行します。Aggregations(Associations)あたりで使うようです。

実装例）
```coffee
sap.ui.core.Control.extend "mitsuruog.BlueContainer",

  metadata:
    # 省略

  renderer: (rm, control) ->

    rm.write "<div"
    rm.writeControlData control
    rm.addClass "blue"
    rm.writeClasses()
    rm.write ">"

    # Aggregations(Associations)のデータはこうやって受け取る
    items = control.getContent()

    for item in items
      rm.write "<div"
      rm.addStyle "display", "inline-block"
      rm.addStyle "border", "1px solid #{control.getBoxColor()}"
      rm.addStyle "margin", "7px"
      rm.addStyle "padding", "7px"
      rm.writeStyles()      
      rm.write ">"

      rm.renderControl item
      rm.write "</div>"

    rm.write "</div>"
```

ある程度書き慣れてくると、レンダラについてはお決まりのパターンが見えてくるでしょう。また、似たようなOpenUI5のソースを読むのもいいと思います。
詳細は公式ページを参照してください。

[JsDoc Report - SAP UI development Toolkit for HTML5 - API Reference - sap.ui.core.RenderManager](https://openui5.hana.ondemand.com/docs/api/symbols/sap.ui.core.RenderManager.html)

## 4. 配布、利用

配布方法はUIコントロールを1つのJavascriptファイルにまとめて`index.html`で読み込めばいいと思います。
OpenUI5には`RequireJS`のようなモジュールシステムがあるので、以下のようにモジュール化して呼び出し先でロードします。

```coffee
#
# カスタムUIコントロール側
#
jQuery.sap.declare "com.mitsuruog.sapui5.showroom.controls.BlueContainer"

sap.ui.core.Control.extend "mitsuruog.BlueContainer",

  # 以下、省略


#
# 呼び出し側
#
jQuery.sap.require "com.mitsuruog.sapui5.showroom.controls.BlueContainer"

sap.ui.jsview "someView",

  createContent: (oController) ->

    # new でUIコントロールを初期化します。
    blueContainer = new mitsuruog.BlueContainer

    # 以下、省略

```

## 5. まとめ

今回は新しいUIコンポーネントを作成する方法について説明しました。
実装の細かい部分はGithub上のサンプルを参照してください。

* UIコンポーネント側
  * [https://github.com/mitsuruog/sapui5-showroom/tree/master/coffee/controls](https://github.com/mitsuruog/sapui5-showroom/tree/master/coffee/controls)
* UIコンポーネント利用側
  * [https://github.com/mitsuruog/sapui5-showroom/blob/master/coffee/view/Controls.view.coffee](https://github.com/mitsuruog/sapui5-showroom/blob/master/coffee/view/Controls.view.coffee)
  * [https://github.com/mitsuruog/sapui5-showroom/blob/master/coffee/view/Controls.controller.coffee](https://github.com/mitsuruog/sapui5-showroom/blob/master/coffee/view/Controls.controller.coffee)

私が普段利用しているOpenUI5のモバイル用ライブラリ(sap.m〜)ではv1.22の時点で73のUIコントロールを持っています。OpenUI5自体のUIが優れているため、新規でUIコントロールを作成するケースはあまりないように思えます。  
また、レンダラを実装しているとJavaのtaglibを思い出して、軽いめまいを覚えますね。(まぁそこは置いといて。)

経験的にも良くあるケースとしては、既存のUIを少しカスタムしたいケースだと思います。   
その辺りは[後編](/2014/10/sapui5openui5ui/)にて取り上げたいと思います。
