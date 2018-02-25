---
layout: post
title: "Reduxユーザーが最もハマるstateの不正変更とその検出方法"
date: 2018-02-26 0:00:00 +900
comments: true
tags:
  - react
  - redux
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-logo.png
---
今日はReduxユーザーが最もハマるポイントだと個人的に思っている、stateの不正変更とその検出方法について紹介します。
ちなみにReactでの話ですが、他のフレームワークでも同じ事なんではと、勝手に想像しています。

## Reduxのstate変更検知の仕組み
まず最初にReduxのstate変更検知の仕組みについておさらいします。概要だけ紹介するため、詳細は公式ドキュメントも合わせて参照してください。

- Immutable Data - Redux https://redux.js.org/faq/immutable-data

Reduxのstateの変更検知には「**shallow equality checking**」という仕組みを使っています。
shallow equalityとは、あるネストしたオブジェクトがあった場合、**全ての値をチェックしているのではなく、このオブジェクトが格納されている参照(マシンメモリの番地)が正しいことをチェックする**ことです。そのため「reference equality」とも言われているようです。

Reduxのstateは内部的にstateをいくつかの部分に分割した状態で保持していますが、1つ1つは比較的大きい構造となる場合が想定されるため、このように参照のみをチェックすることでパフォーマンスを担保しています。

通常Reduxのstateを変更する時は、stateの変更を検知できるように変更することが望ましいのですが、残念ながら検知できない変更方法が存在します。
これを便宜上「**stateの不正変更**」と呼ぶ事にします。

## stateを不正変更できてしまうメカニズム
これはJavaScriptの言語仕様に深く関係しています。

例えば`const`は再代入を許さない変数宣言ですが、再代入のチェックに**参照を利用している**ため、オブジェクト内部のプロパティは変更することが可能です。

```javascript
const state = { name: "foo" };

// これはエラーにならない
state.name = "bar"

// これは再代入に当たるためエラーになる
const state = { name: "foo" };
```

JavaScriptの場合、オブジェクト内部の**プロパティを変更したとしても参照は同じものとなる**ため、参照を使ったチェックではオブジェクトの内部の変更を検知することはできません。

## Reduxのstateを不正変更するとどんな問題が起きるのか？

さて、stateを不正変更するとどんな問題が起こるかというと、React上で再描画(re-render)が発生しなくなります。

これはReactが持つメカニズムのためで、Propsの変更を検知して、これが利用されているReactコンポーネントのツリーのみを効率良く再描画させるためです。
これが起こるとstateは変更されているが、**画面の表示内容がまったく変化しない**というかなり面倒な事が発生します。

よくある事例として、Reactのcomponent内にある`componentWillReceiveProps`が予期せず発火しなくなります。

```javascript
componentWillReceiveProps(nextProps) {
  if (nextProps !=== this.props) {
    // なにかの処理
  }
}
```

この状態をredux-dev-toolで見ると次のようになります。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-01.png 500 %}

> stateを変更しているはずだが、redux-dev-toolのdiffには何も現れてこない。

これに起因する問題は見つけにくく、個人的にはReduxユーザーがReduxで最もハマりやすいポイントだと思います。

## stateの不正変更に対する正しいアプローチ

公式に「Immutable Update Patterns」というドキュメントがあるので、これに習ってstateを変更します。(これくらいstateの更新には細心の注意が必要です)

- Immutable Update Patterns · Redux https://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html

Immutable Update Patternsを見るとわかるのですが、かなり面倒です。
そのため通常は、なんからのユーティリティライブラリの力を借りている方も多いかと思います。

- kolodny/immutability-helper: mutate a copy of data without changing the original source
 https://github.com/kolodny/immutability-helper
- debitoor/dot-prop-immutable: Immutable version of dot-prop with some extensions
https://github.com/debitoor/dot-prop-immutable

しかし、上で話した通りJavaScriptの言語仕様もあり、うっかり事故が絶えません。
そのため個人的には、なんからの**検知の仕組みをプロジェクトに導入するのが上策**だと考えました。

## stateの不正変更を検知する

Reduxのmiddlewareにstateの不正変更を検知するものがあったので、これを使います。

- leoasis/redux-immutable-state-invariant: Redux middleware that detects mutations between and outside redux dispatches. For development use only.
https://github.com/leoasis/redux-immutable-state-invariant

### redux-immutable-state-invariantを導入する

導入はドキュメントにある通り、reduxを初期化している部分でmiddlewareに設定します。
ドキュメントには`redux-thunk`を使った例しかないので、`redux-observable`を使ったものにしてみます。

```javascript
const { applyMiddleware, combineReducers, createStore } = require('redux');
const createEpicMiddleware = require('redux-observable');
const epics = require('./epics/index');
const reducers = require('./reducers/index');

// Be sure to ONLY add this middleware in development!
const middleware = process.env.NODE_ENV !== 'production' ?
  [require('redux-immutable-state-invariant').default(), createEpicMiddleware(epics)] :
  [createEpicMiddleware(epics)];

// Note passing middleware as the last argument to createStore requires redux@>=3.1.0
const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);
```

middlewareを導入した状態で、stateを不正変更すると次のようなエラーが発生します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-02.png %}

**警告ではなくエラー**なので注意が必要です。既にstateを不正変更コードがある場合、最悪アプリケーションが動作しなくなります。

> これくらい清々しくクラッシュしてくれた方が、修正のモチベーションになっていいと思います。

これでうっかりstateを不正変更した場合でも検知することができます。

## まとめ
今日はReduxユーザーが最もハマるポイントだと個人的に思っている、stateの不正変更とその検出方法について紹介でした。

人は間違い起こすものなので、このような検知の仕組みを導入すると安心ですね。
