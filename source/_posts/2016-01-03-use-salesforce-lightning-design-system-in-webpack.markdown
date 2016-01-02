---
layout: post
title: "webpackでSalesforce Lightning Design Systemを使う"
date: 2016-01-03 00:00:21 +0900
comments: true
categories:
  - webpack
  - Salesforce Lightning Design System
  - Salesforce
---

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

## まとめ

あくまで最小構成です。  
React.jsを触っているとwebpackを使うことが多いのですが、ちょっとしたサンプルであれば`bower`か`CDN`の方が楽ですね。
