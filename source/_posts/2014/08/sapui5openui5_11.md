---
layout: post
title: "[SAPUI5/OpenUI5]スマートに国際化する方法"
date: 2014-08-11 00:46:00 +0900
comments: true
tags:
 - HTML5
 - javascript
 - OpenUI5
 - SAPUI5
---

> How to internationalize the smart in OpenUI5/SAPUI5

エンタープライズ利用を想定した「[OpenUI5](http://sap.github.io/openui5/)」には、企業システムで有用な多くのUIコンポーネントを持っています。   
しかし、OpenUI5の価値は豊富なUIだけではありません。OpenUI5の本当の価値は、エンタープライズ利用を想定したHTML5ベースのアプリケーションを作成するために、必要な機能を含んだオールインワンかつハイスペックなUIフレームワークということです。  
今回は、その中でもOpenUI5が持つ強力な国際化機能について説明します。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/a1180_010361.jpg %}

1.  OpenUI5での国際化(Internationalization in OpenUI5)
2.  ロケール判定の優先度(Priority of the locale judgment)
3.  まとめ(Conclusion)

本記事で利用するデモはこちらで参照出来ます。   
Demo here :).  
[http://mitsuruog.github.io/sapui5-showroom/app/#/locale](http://mitsuruog.github.io/sapui5-showroom/app/#/locale)

## 1. OpenUI5での国際化

OpenUI5にて国際化するための手順は「リソースモデルファイルの作成」「リソースモデルをロード」「コントロールへデータバインド」の3つです。
順に説明していきます。

### リソースモデルファイルの作成


まず、国際化用の「**リソースモデル(ResourceModel)**」を作成し、その中に国際化したいメッセージを定義していきます。ファイルはこちらを参考にしてください。

```
title = ロケール
text = 吾輩は猫である。名前はまだ無い。
changeLocale = ロケール変更:
button = これはボタンのテキスト
```

このリソースモデルはJavaの「java.util.Properties」クラスと同等のもので、中に「key/value」ペアで値を設定していきます。ファイルの拡張子は「*.properties」です。
（マルチバイトの場合であってもファイルがUTF-8で作成されていれば、Unicodeエスケープする必要はないようです。）

Webルート直下に「i18n」フォルダを作成して、ファイルを配置するのが慣例のようです。まず、最低限ロケールなしの場合に利用される「**messageBundle.properties**」を作成します。各ロケールごとのファイル名の例は以下の通りです。

*   messageBundle_en.properties
*   messageBundle_ja.properties
*   messageBundle_zh_CN.properties
*   messageBundle_zh-Hans-CN.properties

ロケールの言語コードについての詳細はこちらを参照してください。

[Identifying the Language Code / Locale](https://openui5.hana.ondemand.com/#docs/guide/91f21f176f4d1014b6dd926db0e91070.html)

[言語の対応付け - Windows app development](http://msdn.microsoft.com/ja-jp/library/windows/apps/jj673578.aspx)

### リソースモデルをロード

次に、リソースモデルをアプリケーションにロードしていきます。こちらのコードを参考にしてください。

Locale.controller.coffee
```coffee

sap.ui.controller "com.mitsuruog.sapui5.showroom.view.Locale",

  onInit: ->
    i18nModel = new sap.ui.model.resource.ResourceModel
      bundleUrl : "i18n/messageBundle.properties"

    @getView().setModel i18nModel, "i18n"
```

ロードする場所は、「Component.js」の`init()`か、国際化対象ViewのControllerの`init()`がいいと思います。`i18n`という名前付きModelとしてロードして、後のコントロールへのデータバインドの際に利用します。

### コントロールへデータバインド

最後にコントロールの国際化したプロパティへメッセージをデータバインドしていきます。こちらのコードを参照してください。

Locale.view.coffee
```coffee
sap.ui.jsview "com.mitsuruog.sapui5.showroom.view.Locale",

  getControllerName: -> "com.mitsuruog.sapui5.showroom.view.Locale"

  createContent: (oController) ->
    @page = new sap.m.Page
      title: "{i18n>title}"
      subHeader:
        new sap.m.Bar
          contentRight: [
            new sap.m.Text
              text: "{i18n>changeLocale}"
          ]
      content: [
        new sap.m.Text
          text: "{i18n>text}"
      ]
      footer:
        new sap.m.Bar
          contentRight: [
            new sap.m.Button
              type: "Accept"
              text: "{i18n>button}"
          ]

    @page
```

こちらが国際化した結果画面の例です。日本語と英語で画面の項目名などが変化していることが分かると思います。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/Hello_SAPUI52_Fotor_Collage.png 650 487 %}

より詳細な内容は公式ページを参照してください。

[Step 4: Internationalization](https://openui5.hana.ondemand.com/#docs/guide/b6d1a9511f994b3a86e2f34a32e40a34.html)

[Translating SAPUI5 Applications](https://openui5.hana.ondemand.com/#docs/guide/91f217c46f4d1014b6dd926db0e91070.html)

## 2. ロケール判定の優先度

次に、OpenUI5へのロケール指定の方法とロケール判定に優先度について説明します。こちらが一覧です。上から優先度が高い設定です。

*   プログラムからの直接設定
*   URLパラメータからの指定
*   アプリケーションConfigでの指定
*   window.navigator.userAgentでの指定(Androidのみ)
*   window.navigator.languageでの指定
*   window.navigator.userLanguageでの指定(IEのみ)
*   window.navigator.browserLanguageでの指定(IEのみ)
*   デフォルトのロケールは「**en**」

かなり細かい指定ですが、大きく分けると以下の5つになるかと思います。

*   プログラムからの直接設定
*   URLパラメータからの指定
*   アプリケーションConfigでの指定
*   端末固有設定(window.navigator.languageなど)
*   デフォルト「**en**」

この中で、プログラマブルに設定する可能性がある「プログラムからの直接設定」「URLパラメータからの指定」「アプリケーションConfigでの指定」について順に説明します。


### プログラムからの直接設定

プログラム上でOpenUI5のロケール情報を参照する場合は、`sap.ui.getCore().getConfiguration().getLanguage()`を利用します。
ロケールの変更を行う場合は、`sap.ui.getCore().getConfiguration().setLanguage(local)`を利用します。引数の`local`にはロケールを文字列で設定してください。`null`を設定することはできません。

### URLパラメータからの指定

URLパラメータに`sap-language`を設定することでアプリケーション呼び出し時に特定のロケールを指定することができます。
こちらがその例です。

[http://mitsuruog.github.io/sapui5-showroom/app/?sap-language=en](http://mitsuruog.github.io/sapui5-showroom/app/?sap-language=en)

URLハッシュが付く場合はこちらです。

[http://mitsuruog.github.io/sapui5-showroom/app/?sap-language=de#/locale](http://mitsuruog.github.io/sapui5-showroom/app/?sap-language=de#/locale)


### アプリケーションConfigでの指定

アプリケーションConfigでロケールを設定することも出来ます。こちらは`sap.ui.core.Configuration`を利用するもので、詳細については割愛します。後日機会があれば別途取り上げたいと思います。

興味がある方はこちらの公式ドキュメントを参照してください。

[JsDoc Report - SAP UI development Toolkit for HTML5 - API Reference - sap.ui.core.Configuration](https://openui5.hana.ondemand.com/docs/api/symbols/sap.ui.core.Configuration.html)

## 3. まとめ

OpenUI5での国際化の方法について説明しました。OpenUI5はグローバルでの利用を想定した強力な国際化の機能を持っています。

このような国際化の仕組みは、OpenUI5がエンタープライズ利用を想定したものであり、それを提供するSAP社がグローバルカンパニーであるであるからこと出来たと考えています。  
簡単に国際化することができることも、OpenUI5の魅力の一つですね。
