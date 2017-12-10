---
layout: post
title: "Angular2を最速でHerokuにDeployするMinimum Starter Kitを作成してみた"
date: 2016-02-21 23:43:00 +900
comments: true
tags:
  - angular2
  - heroku
  - vscode
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/angular2.png
---
Angular2学習のため、大量に素振りする必要がでてきたので、素振り用のStarterKitを作成してみました。

これから学習する方は、公式の[5 Min Quickstart](https://angular.io/docs/ts/latest/quickstart.html)を最初にやる場合が多いと思うので、ベースは5 Min Quickstartを利用しています。
その上で、気軽にHerokuへDeployして公開できるよう工夫しました。

mitsuruog/angular2-minimum-starter: Minimum starter kit for angular2 https://github.com/mitsuruog/angular2-minimum-starter

<!-- more -->

## 5 Min QuickstartからHeroku Delpoyへの道

公式の[5 Min Quickstart](https://angular.io/docs/ts/latest/quickstart.html)は、学習するための環境としては十分なのですが、
HerokuへDeployするために少し工夫が必要でしたので手順を紹介します。

### Heroku上でのdevDependenciesのインストール

HerokuはDeployする前、`package.json`に書かれている`dependencies`の内容をインストールしますが、通常は`devDependencies`をインストールしません。

そのため、Heroku上の`NPM_CONFIG_PRODUCTION`設定を無効にする必要があります。

```
heroku config:set NPM_CONFIG_PRODUCTION=false
```

この設定はHerokuのGUI上のSettingsのタブからでも設定できます。

### Heroku上でのHTTP Serverの導入

5 Min Quickstartには[johnpapa/lite-server](https://github.com/johnpapa/lite-server)という、
[Browsersync](https://www.browsersync.io/)をベースとした開発用のHTTPサーバーが含まれています。

しかし、lite-server上で`Lightweight development only node server`と謳われているため、別途HTTPサーバーを導入します。
今回は[indexzero/http-server](https://github.com/indexzero/http-server)を利用しました。

まず、`package.json`の`devDependencies`に追加します。

```
npm install http-server -D
```

次に、Heroku上でアプリを開始する際に実行するコマンドを`package.json`に追加しておきます。

**package.json**
```diff
-    "start": "concurrent \"npm run tsc:w\" \"npm run lite\" "
+    "start": "concurrent \"npm run tsc:w\" \"npm run lite\" ",
+    "start-heroku": "concurrent \"npm run tsc\" \"npm run http-server\" "
```

最後に、Herokuがアプリを開始する際のコマンドを変更するため`Procfile`を作成し、先ほどのコマンドを設定します。  
(Node.jsアプリの場合、Herokuはデフォルトで`npm run start`を実行するようになっています。)

**Procfile**
```
web: npm run start-heroku
```

こちらで、Angular2のアプリをHeroku上にDeployできるはずです。

## まとめ

`gulp`や`grunt`などを利用するとローカルでbuildプロセスを実行することも可能ですが、素振り程度で依存するもどうかと思い簡単なものを作成してみました。

Angular2学習のため、大量に素振りする必要がある人にはちょうどいいと思います。
