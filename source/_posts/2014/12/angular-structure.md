---
layout: post
title: "いま一番気に入っているAngularJSのプロジェクト構成"
date: 2014-12-03 00:00:00 +0900
comments: true
tags: 
 - AngularJs
 - yeoman
 - fullstack
---

この記事は[AngularJS Advent Calendar 2014 - Adventar](http://www.adventar.org/calendars/350)の3日目の記事です。

* 2日目[AngularJS BootstrapUIを利用したFilterSelect(@takeyama)](http://qiita.com/takeyama/items/f6e0fbac4d3b4907193e)
* 4日目[初心者マークのAngular.js - Uemmra3のフルスタックエンジニア？日記(@Uemmra3)](http://d.hatena.ne.jp/Uemmra3/20141204/1417696122)

AngularJSでそれなりの規模のアプリケーションを書く場合、プロジェクトの構成って結構悩みます。  
いつも悩んでます。。。  
悩みすぎてちょくちょく構成変えるため、たまにアプリケーションが壊れてます。  
そんなとき心もポッキリ壊れそうになります。

そんな私が、最近いいなと思っているAngularJSのプロジェクト構成について紹介します。

<!-- more -->

## 参考資料(有名どころ)

AngularJSのプロジェクトの構成については、結構以前から議論されています。有名どころではこのあたりでしょうか…  
(正直、これで決まりといったものは無いような気がします。)

* [angular/angular-seed](https://github.com/angular/angular-seed)
* [johnpapa/angularjs-styleguide](https://github.com/johnpapa/angularjs-styleguide#application-structure)
* [Brian Ford/Building Huuuuuge Apps with AngularJS](http://briantford.com/blog/huuuuuge-angular-apps)
* [Angular Best Practice for App Structure (Public)](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

私の場合は[DaftMonk/generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack)を利用することが多いので、基本的にはgenerator-angular-fullstack構成に
johnpapa/angularjs-styleguideの内容を加味しながらやってます。

## アンチパターン(folders-by-type)

まず、それなりの規模開発をする場合のアンチパターンの紹介。johnpapa/angularjs-styleguideにも載っているのですが、俗に`folders-by-type`と呼ばれるものがアンチパターンとされています。  
AngularJSのモジュールのタイプに合わせてディレクトリを作成して、その中に各機能のjavascriptファイルを格納する方式です。

機能が増えるほど、ファイルが分散して大変そうなのが想像できるかと思います。

```
app/
    app.js
    controllers/
        hoge.controller.js             
    directives/       
        one.directive.js  
        one.directive.html  
        two.directive.js  
        two.directive.html  
    services/       
        hoge.service.js
        fuga.service.js  
    views/
        hoge.html     
        some.html       
```

## ベストプラクティス(Folders-by-Feature)

アンチパターン(folders-by-type)に対して、良いとされているのが`Folders-by-Feature`と呼ばれる機能単位にフォルダを分ける方法です。機能単位いうよりも**コンポーネント単位**と呼んだ方がしっくりくると思います。

generator-angular-fullstackを使った場合は、次のようなフォルダ構成になります。(`client以下`だけ抜粋)

```
app/
  main/             # 各機能単位のフォルダ
  assets/　　　      # 画像ファイルなどのリソース
    images/
  components/       # 再利用する想定のコンポーネント
  bower_components/ # bowerモジュール
```

`main/`の中身は以下のような構成になっていて、URLのPathが`/`の場合に表示する画面のコンポーネント一式が格納されています。

```
main/
  main.js                 # Router
  main.controller.js      # Controller
  main.controller.spec.js # Test spec
  main.html               # Template
  main.css                # Style
```

AngualrJSを使った開発をする場合、Javascriptファイルを細かく分割しながら開発することが多いので、このように機能単位で1つのフォルダにまとまっていると見通しがいいです。  
さらにこうすることで、**機能単位でgitのbranchを作成して開発することが可能**です。

これらのこともあって、それなりの規模感の場合は`Folders-by-Feature`方式を採用する方がいいと思います。

## 自分がカスタムしている部分

基本的にgenerator-angular-fullstackで作成されたプロジェクト構成をベースに使ってますが、自分なりにカスタムしている部分もあります。そのあたり紹介したいと思います。

### Coreモジュールフォルダ

バックエンドのデータアクセスや認証部品など、アプリケーション全体で利用するようなモジュールの置き場所として`app/core`以下を利用しています。

```
app/
  main/             # 各機能単位のフォルダ
  core/             # アプリケーション共有モジュール
    auth/
      auth.service.js
    someApicall/
      someApicall.service.js
  assets/　　　      # 画像ファイルなどのリソース
    images/
  components/       # 再利用する想定のコンポーネント
  bower_components/ # bowerモジュール
```

プロジェクトでの再利用観点で`components/`との使い分けなのですが、私の場合はUIが付属するものは`components/`に格納しするように使い分けしています。

### partialsテンプレートフォルダ

AngularJSではテンプレート(html)にディレクティブを書き込んでいくため、テンプレートが大きくなりやすいと感じています。

そこで良く利用するのが`ng-include`です。そのためgenerator-angular-fullstack:routeで作成したフォルダに`partials`フォルダを作成してinclideするテンプレートを格納するようにしています。

```
main/
  main.js                 # Router
  main.controller.js      # Controller
  main.controller.spec.js # Test spec
  main.html               # Template
  main.css                # Style
  partials/               # テンプレート部品
    megaButton.html
    hugeInputArea.html
```

あ、この画面だけで利用するfilterなんかも格納しています。

### filtersフォルダ

アプリケーション全体で使うfilterについては置き場所悩みました。現在は直下の`filters`に格納して様子を見ています。

```
app/
  main/             # 各機能単位のフォルダ
  assets/　　　      # 画像ファイルなどのリソース
    images/
  components/       # 再利用する想定のコンポーネント
  filters/          # 再利用する想定のfilter
    snsAvater/
      snsAvater.filter.js
      snsAvater.filter.spec.js
  bower_components/ # bowerモジュール
```

### configフォルダ

開発と本番でconfigを分けたいケースがあるので、`config/environment`以下に実行環境ごとのconfigを格納しています。

```
app/
  main/             # 各機能単位のフォルダ
  assets/　　　      # 画像ファイルなどのリソース
    images/
  components/       # 再利用する想定のコンポーネント
  config/          
    environment/
      development.js  # 開発環境用
      production.js   # 本番環境用
      test.js         # テスト環境用
  bower_components/ # bowerモジュール
```

開発/本番の切り替えはgenerator-angular-fullstackのGruntタスクを改造しています。テスト環境のconfigは`karma.conf.js`にてロードするconfigを指定しています。

## まとめ

私が普段使っているAngularJSのプロジェクト構成について紹介しました。たぶん半年くらい使ってみてちょくちょく変えると思います。

とはいえ、ぶっちゃけ好みの問題ですけどね・・・

そんな、試行錯誤の成果を[DaftMonk/generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack)をForkして[mitsuruog/generator-angular-mitsuruog](https://github.com/mitsuruog/generator-angular-mitsuruog)にまとめています。AngularJSできれいにアプリケーション作りたい人は、YeomanでオレオレAngularJSプロジェクトテンプレート作ってみるのもいいと思います。
