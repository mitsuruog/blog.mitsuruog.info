---
layout: post
title: "webpackでSalesforce Lightning Design Systemを使う"
date: 2016-01-03 00:00:21 +0900
comments: true
tags:
  - webpack
  - Salesforce Lightning Design System
  - Salesforce
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2016/webpack-slds.png 620 %}

一手間必要だったのでメモ。  
長いのでSalesforce Lightning Design System(以下、SLDS)とします。

<!-- more -->

## 元ネタ

こちらの内容とほぼ一緒です。

Webpack config example · Issue #127 · salesforce-ux/design-system  
https://github.com/salesforce-ux/design-system/issues/127

## 手順

webpackをあまり触り慣れてない人向けのメモ。

### SLDSをnpm installする

```
npm install --save @salesforce-ux/design-system
```

### index.scssの追加

SLDSはsassで作られているので、`index.scss`でSLDSの本体を`@import`するようにします。  
これをwebpackで処理して、`style.css`として出力していきます。

```scss
@import "~@salesforce-ux/design-system/scss/index.scss";
```

### webpack.config.jsの設定

webpackでcssを扱うためにいくつかloaderが必要です。まだの場合はインストールしておいてください。

```sh
# 各種ローダー
npm install --save-dev file-loader style-loader css-loader sass-loader
# 途中sassをコンパイルするために
npm install --save-dev node-sass
# webpackで処理したcssをファイル出力するために
npm install --save-dev extract-text-webpack-plugin
```

`webpack.config.js`にて`scss`を処理するようにします。  

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
	         { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
       ]
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
};
```

これで、SLDSが`style.css`に含まれるようになります。

### アプリケーションへの組み込み

アプリケーションへの組み込みはwebpackのエントリポイント(この例だと`entry.js`)で、`index.scss`を呼び出すとOKです。

```js
// entry.js
require('./index.scss');
console.log('Hello Salesforce Lightning Design System!!');
```

最後に`index.html`でwebpackで出力された`style.css`を利用すればOK。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <script src="./bundle.js"></script>
</body>
</html>

```

### fontファイルのロード(追記:2015/01/03)

上の方法ではSLDSのfontが正しくロードできず、fontファイルのリクエストがすべて404エラーになっていました。

まず、`webpack.config.js`の`module.loaders`にfile-loaderを追加して、fontファイルをコピーするようにします。

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
	         { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
           { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader : 'file-loader?&name=/assets/fonts/[name].[ext]'}
       ]
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
};
```

これで、`/assets/font`以下にfontファイルがコピーされるようになりましたが、  
SLDS内部のfont指定が絶対パス指定されているため、このままではfontがwebpackで処理されません。

`index.scss`にてSLDS内部のSass変数を書き換えて、webpackで処理できるようにします。

```scss
// SLDS内部で使われているfontのpath設定
$static-font-path: "~@salesforce-ux/design-system/assets/fonts/webfonts";

@import "~@salesforce-ux/design-system/scss/index.scss";
```

fontの絶対パスの件は本家に似たようなIssueがありますので、Sass変数の置き換え作法は、今後のためにも知っておいた方がよろしいかと思います。

Compiling index-ltng.scss results in CSS that does not load salesforce fonts · Issue #71 · salesforce-ux/design-system   https://github.com/salesforce-ux/design-system/issues/71

これでfontも読み込むことができました。  
めでたし、めでたし。

## まとめ

あくまで最小構成です。  
React.jsを触っているとwebpackを使うことが多いのですが、ちょっとしたサンプルであれば`bower`か`CDN`の方が楽ですね。
