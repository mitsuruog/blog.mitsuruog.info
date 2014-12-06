---
layout: post
title: "進化の早いフロントエンドの世界についていくために、スタイルガイドを有効活用しているという話"
date: 2014-12-06 23:00:41 +0900
comments: true
categories: 
 - javascript
 - styleguide
 - Angularjs
 - backbone
 - nodejs
---

フロントエンドの世界では、日々新しいフレームワークやライブラリが生まれています。
初めてそういった新しいものを習得する場合に、なるべくなら近道したいと思うのが人の気持ちだと思います。  
まず大変なのが、Hello Worldから実際のプロダクトやプロトタイプで利用する場合で、これは初めてで何もわからない土地を一人で散策するような感覚にも似ています。

今日、紹介するのは私が進化の早いフロントエンドの世界で、より早く未開の土地に慣れるために**スタイルガイド**を有効活用しているという話です。

<!-- more -->

ちなみにこの記事は[Frontrend Advent Calendar 2014 - Qiita](http://qiita.com/advent-calendar/2014/frontrend)の6日目の記事です。

* 5日目[はじめてのCSS設計 - Qiita(@moschann)](http://qiita.com/moschann/items/c7cbf62056d77cbc1d66)
* 7日目[あと]()

## 良いスタイルガイドとは

巷にはスタイルガイド(コーディング規約)と銘打ったものがあふれています。
そのため有効に活用できるスタイルガイドを自身で見極めなければなりません。  
頼りにするスタイルガイドが大雑把で必要なことが書いてなかったり、1000ページもあってすぐ必要な場所が探せないようでは使えません。

私がスタイルガイドを見たときに良さそうだなと思うのは次のような場合です。

* 目次をみて言語やフレームワークの機能を網羅しているか
* `Bad`と`Recommended`の両方のスタイルが提示されているか
* そのスタイルに至った理由や背景が書かれているか
* スタイルの提示だけではなく、具体的なユースケースが提示されているか

このようなことを頭の片隅に置きながら、自分にあったスタイルガイドを探すといいと思います。

## なぜスタイルガイド？

私がスタイルガイドを読む理由はいくつかあるので紹介しますね。

### 良いコードを書くために悩む時間を短縮

例えば、Javascriptでのオブジェクトや配列の定義の仕方については、通常`{}`と`[]`が使われると思いますが、Javascriptの言語自体あまり普段やらない人にとってはそれすらわからないと思います。  

```js
// bad
var item = new Object();

// good
var item = {};

// bad
var items = new Array();

// good
var items = [];
```
> [mitsuruog/Javacript-style-guide | オブジェクト](http://mitsuruog.github.io/javacript-style-guide/#objects)より

スタイルガイドを読むことで基本的な部分では悩まなくなります。基本的なことで悩まないということは、本当にやるべきところで悩むことに集中できると思います。  

様々な書き方存在する中で良いコードを書くために悩む時間を少なくしたいですね。  
(とはいえ、悩むのですが。。。) 

### 地雷源を早期に把握

良いスタイルガイドには、先人達がその言語やフレームワークにて発見した地雷源が記載されています。    

例えば、AngularJSでcontrollerなどを作成する際に、複数の書き方ができるのですが、スタイルガイドを読むことで悩むことなく自分が書くべきコードを見つけることができました。  

> 世の中のサンプルはavoidで実装されていることが多いです。それを疑わないままそのまま覚えてしまうことは危険です。

```js
/* avoid */
angular
    .module('app')
    .controller('Dashboard', 
        ['$location', '$routeParams', 'common', 'dataservice', 
            function Dashboard($location, $routeParams, common, dataservice) {}
        ]);  

/* recommended */
angular
    .module('app')
    .controller('Dashboard', Dashboard);

Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

function Dashboard($location, $routeParams, common, dataservice) {
}
```
> [johnpapa/angularjs-styleguide | Manually Identify Dependencies](https://github.com/johnpapa/angularjs-styleguide#style-y091)より


また、DIの部分を以下のように省略して書いてしまうとソースコードをMinifyしたときにエラーになるという地雷も発見することができました。

```
/* avoid - not minification-safe*/
angular
    .module('app')
    .controller('Dashboard', Dashboard);

function Dashboard(common, dataservice) {
}

/* recommended - minification-safe*/
angular
    .module('app')
    .controller('Dashboard', Dashboard);

Dashboard.$inject = ['common', 'dataservice'];

function Dashboard(common, dataservice) {
}
```
> [johnpapa/angularjs-styleguide | UnSafe from Minification](https://github.com/johnpapa/angularjs-styleguide#style-y090)より

これらの先人たちの地と涙を汗の結晶である**地雷源情報**を参考にしない手はありませんね。

### コードリーディング時間の短縮

チームで作業する場合に、同じスタイルガイドを参照することで統一感のあるコードを書くことができます。

これはOSSでも同じことで同じスタイルガイドに習うことで他人のコードも読みやすく、また自分のコードも読んでもらいやすくなります。

例えば、NodejsではAPI呼び出しの最後の引数にfunctionを渡すことで、API呼び出し後にcallbackを実行させることが慣例となっています。(引数が1つの場合はそれがcallbackになることが多いです。)

expressのサーバー作成のコードを例として提示します。

```js
// Setup server
var app = require('express')();
var server = require('http').createServer(app);

// Start server
// [MEMO]3番目のfunctionがcallback
server.listen(port, ip, function () {
  console.log('Express server listening on %d', port);
});
```
> どこかでこんな内容のガイド見たのですが、忘れてしまいました。知っているかたいましたら教えてください。

自分が作成したnode製モジュールのAPIで、最初の引数をcallbackにしてしまった場合はどうでしょうか。
他人が読む場合とてもストレスを感じると思います。

**Goに入ればGoに従えで**はないですが、そのコミュニテイ内でのルールは守ったほうがいいですよね。

## スタイルガイドの紹介

私がよく参照するスタイルガイドを紹介します。これからフロントエンド習得しようと思う方は参照してみてください。  
(よく利用しているフレームワークに偏りあるので、全ては網羅していませんが。。。)

### Javascript

airbnbのスタイルガイドを私が翻訳したものです。(本家はこちら[airbnb/javascript](https://github.com/airbnb/javascript))  
有名なスタイルガイドは他にもいくつかあるのですが、内容とボリュームがちょうどいいと思います。

* [mitsuruog/Javacript-style-guide](http://mitsuruog.github.io/javacript-style-guide/)

もうちょっと手が動く様になるとこちらも読むといいです。

* [JavaScript Garden](http://bonsaiden.github.io/JavaScript-Garden/ja/)

### Backbone

スタイルガイドというかパターン集ですね。最近のBackboneは[Marionette.js](http://marionettejs.com/)を併用することが多いので、これはもうあまり出番がないかも。。。

* [rstacruz/Backbone patterns](http://ricostacruz.com/backbone-patterns/)

### AngularJS

AngularJSはこれを読んでおけばいいです。

* [johnpapa/angularjs-styleguide](https://github.com/johnpapa/angularjs-styleguide)

### CSS

基本ですね。

* [idiomatic-css/translations/ja-JP](https://github.com/necolas/idiomatic-css/tree/master/translations/ja-JP)

本格的に勉強したい場合はまずこちらを読むといいです。

* [SMACSS E-book 日本語](http://shop.smacss.com/products/smacss-e-book)

## まとめ

進化の早いフロントエンドの世界ですが、私が進化に追いつくためにスタイルガイドを有効活用しているという話をしました。  
特に最近は特定のフレームワークや言語のスタイルガイドが付属するようなトレンドになってきたような気がしています。  
(ここで言うスタイルガイドは、従来のスタイルガイドとは違うジャンルの新しいタイプのものなのかもしれませんね。)

他の習得方法として、書籍を読む方法もいいと思いますが、スタイルガイドで特性などを把握してから本を読み進んだほうが、途中で挫折しないような気がしています。  
スタイルガイドは面倒な前置きなどないので、忙しいエンジニアは普段使いするには向いていると思いますし。
(書籍の内容はStackOverflowで参照できる内容もおおくありますし。。。)

良いスタイルガイドを知ることは、自分の組織やプロダクトでどのようなスタイルガイドを作成すればいいか、重要なヒントが隠されていると思います。