---
layout: post
title: "スタイルガイドから考えるES6でより良いコードを書きたい人向けのES6入門"
date: 2015-12-07 01:08:10 +0900
comments: true
tags:
 - styleguide
 - javascript
 - es6
---

仕事が忙しくアドベントカレンダーシーズンに乗り遅れてしまいました。数年ぶりに平穏な12月を過ごしております。

> と思ったら[JavaScript その2 Advent Calendar 2015 - Qiita](http://qiita.com/advent-calendar/2015/javascript2)の7日目が開いていたので急遽参加w

ところで、[Javascriptのスタイルガイドでは割と有名なAirbnb](https://github.com/airbnb/javascript)の日本語訳をしているのですが、最近本家のスタイルガイドがES6対応していたので、日本語訳の方もアップデートしました。

[Javascript\-style\-guide](http://mitsuruog.github.io/javascript-style-guide/)

スタイルガイドをES6にアップデートする過程で、私なりにES6でより良いコードを書くために気づいた点、注意する点などピックアップして紹介したいと思います。  
この記事は、ES6でより良いコードを書きたい人向けのES6入門です。

<!-- more -->

## ES6での良いコードとは？

ES6については大きな変更があるアップデートであるため、仕様についての日本語の記事を目にする機会が多いかと思います。

私がES6で最初につまづいたポイントは、**「今までES5で書いていたコードを、ES6に置き換えた場合にどう書けば、より良いコードとなるのか？」** という素朴な疑問でした。  
今までES5で書いていた人の中で、ES6で実際に書くコードについて、具体的なイメージできてない人も多いのではないか？という思いがこの記事を書こうと思ったきっかけです。

結論としては、Airbnbのスタイルガイドを読めばヒントが隠されているかもしれないということですが、今回はスタイルガイドをES6にアップデートする過程で、私なりにES6でより良いコードを書くために気づいた点、注意する点などピックアップして紹介したいと思います。  
（知ってて同然かなと思う部分は割愛してたりしています。）

## スタイルガイドから見たES6良いコードを書くために知っておくべきこと

### 変数宣言はconstが基本

ES6からは変数宣言には`const`と`let`が利用できます。これからは`var`をやめ、基本的にはすべて`const`を使っていきます。

途中で一度定義した変数の中身を変更したい場合は、`let`を使いますが、これはあくまで例外的な扱いにしておいた方が、メンテナンスしやすいコードになります。

`const`と`let`を使うもう一つのメリットとして、Javascript特有の変数の巻き上げというトリッキーな問題が緩和されます。

ES5以前は変数宣言はブロックスコープの先頭に巻き上げられるため、宣言する前でその変数を利用した場合、エラーにならず`undefined`となっていましたが、`const`と`let`を使うことで`ReferenceError`が発生するようになりました。

```js
// ES5)
console.log(hoge); // => undefined
var hoge = 'hoge';

// ES6)
console.log(hoge); // => throws a ReferenceError
const hoge = 'hoge';
```

### アロー関数(Arrow Functions)と注意点

ES6のアロー関数は記述の簡潔さと、実行時のコンテキスト(いわゆる`this`)を束縛してくれるため、Promiseなどの非同期処理を書く場合は、積極的に利用するべきです。

```js
// ES5)
function Person() {
  var self = this;
  self.age = 0;
  setInterval(function growUp() {
    console.log(self.age++); // => 1
  }, 1000);
}
var p = new Person();

// ES6)
function Person() {
  this.age = 0;
  setInterval(() => {
    console.log(this.age++); // => 1
  }, 1000);
}
var p = new Person();
```

ところが、アロー関数を利用するべきではないケースが存在します。ライブラリなどを利用している場合で、途中`this`を書き換えているケースです。  
このような場合、アロー関数が`this`を束縛してしまうため、コードが動作しなくなります。

このように利用する際のハマりポイントを知っておく必要がありますが、`var that = this;`や`.bind()`を書く機会がぐっと減りそうです。

### ES6時代のデフォルトパラメータの書き方

ES5時代のデフォルトパラメータは`||`演算子を利用したものでした。  
この記法は、時に判別しにくいバグを生み出す要因でしたので、ES6ではデフォルトパラメータを利用しましょう。

```js
// ES5)
function say(name) {
  // nameが「false, 0」の場合、`mitsurog`となって本当にいいのか！？
  name = name || 'mitsurog';
  // say Hello
}

// ES6)
function say(name = 'mitsurog') {
  // say Hello
}
```

### コードを簡潔に書くために構造化代入(Destructuring)を効果的に使おう

ES6からはオブジェクトと配列に構造化代入が導入されました。

普段のコードの中で、オブジェクトの詰め替えを行っているケースは意外に多く、中間参照変数が多い場合、名前付けに悩むケース(`tmp~`にするかうーんみたいな)が多々あります。

私自身あまり注目していなかった仕様の1つだったのですが、中間参照変数を減らすという意味で、今後は考えを改めで積極的に使って行きたいと思う仕様です。

```js
// ES5)
function getFullName(user) {
  var firstName = user.firstName;
  var lastName = user.lastName;
  return firstName + ' ' + lastName;
}

// ES6)
function getFullName({firstName, lastName}) {
  return `${firstName} ${lastName}`;
}

// 呼び出し側
console.log(getFullName({
  firstName: 'taro',
  lastName: 'yamada',
})); // => taro yamada
```

## 番外編

その他、ES6で書く場合に考えていることなど。

### Template stringsには愛しか感じないので使おう

ES6でTemplate stringsが導入されました。文字列補完機能・複数行文字列対応と至れり尽せりでもう愛しか感じません。さようなら`underscore.js`。

```js
const name = 'mitsuruog';
console.log(`Hello ${name}`); // => Hello mitsuruog

// [注意]複数行の場合、先頭の空白もそのまま出力されます。
console.log(`
  Hello
  ${name}
`);
// =>
//   Hello
//   mitsuruog
```

### 末尾の余計なカンマは付ける？付けない？

最後に「末尾の余計なカンマ(Additional trailing comma)」は付けるか付けないかという話題です。  
以前はレガシーブラウザで問題があるとの理由で避けられて来ましたが、ES6版ではむしろ付ける方を推奨していました。

理由は、gitのdiffが綺麗になるからと、どうせBabelなどでトランスパイル処理されるので、末尾の余計なカンマはトランスパイラでよしなに処理されるでしょwということです。  
トランスパイラ導入が前提の話でちょっと驚いています。時代の流れですね。

```js
// ES5)
var name = {
  firstName: 'taro',
  lastName: 'yamada'
}

// ES6)
const name = {
  firstName: 'taro',
  lastName: 'yamada',
}
```

### クラスとシングルトンとモジュールの見分け方についての問題提起

ES6で導入されたClass構文ですが、やはりシングルトンとして利用したいという議論があるのは歴史の流れでしょうか。。。

[javascript - Converting Singleton JS objects to use ES6 classes - Stack Overflow](http://stackoverflow.com/questions/26205565/converting-singleton-js-objects-to-use-es6-classes)

singletonパターンを使おうとか、そもそもclassにする必要はないとか、なかなか興味深いです。

とはいえ、利用者側としては提供されたモジュールがシングルトンでの利用を期待しているなど、コードを見ないと分からないわけで、スタイルガイド的に何かルールかあるかと思いきや。。。  
スタイルガイドでは、クラスもシングルトンもパスカルケースなので見分けがつきませんね。  
このあたり皆さんどうしているのでしょうか？

## 最後に

つらつらとES6でより良く書くための話をしました。コードスタイルの話なので、あくまで参考にしてください的な話です。

とはいえ、最近のJavascriptはBabelなどトランスパイラ前提なので、ますます敷居た高くなってきましたね。
