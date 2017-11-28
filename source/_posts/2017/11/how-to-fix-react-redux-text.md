---
layout: post
title: 'react-reduxのconnectを使ったコンポーネントをテストする時にInvariant Violationが発生して困っている人のためのヒント'
date: 2017-11-21 0:00:00 +900
comments: true
tags:
  - react
  - unit test
  - redux
  - jest
---
{% img https://blog-mitsuruog.s3.amazonaws.com/images/2017/invariant-violation.png %}

ニッチ過ぎて誰得なのか全くわからないのですが、同じようなことで苦しめられるであろう**未来の誰かのため**に、ここに手がかりを残しておきます。

<!-- more -->

> 正直このあたりのライブラリの変化が早過ぎるので、この情報がいつ風化するかわからないのだけれど。。。

## はじめに

詰まるところ[create-react-app](https://github.com/facebookincubator/create-react-app)をベースにReactアプリを作っているのですが、Reduxの`connect`を使っているコンポーネントをテストする際に、次のようなエラーが出ました。

これの解決方法を残しておきます。

```
Invariant Violation: You must pass a component to the function returned by connect. Instead received undefined
```

> https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#connected-components

> これを読むと書いてあるんですが、redux storeと一緒テストをする場合は、`<Provider>`でラップする必要があります。

今回は、redux storeと切り離して純粋なコンポーネントとしてテストする場合の解決方法です。

## サンプルコード
例えば、こんなコードです。(ラフに書いたので、このままだと動かないかも)

Component.jsx
```
import React from 'react';
import { connect } from 'react-redux';

class Component extends React.Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

const mapStateToProps = (state) => {
  name: state.name,
};

const wrappedComponent = connect(mapStateToProps)(Component);

export default wrappedComponent;
```

Component.spec.jsx
```
import * as React from 'react';
import { shallow } from 'enzyme';
import Component from './Component';

describe('Test Component', () => {
  it('何かのテスト', () => {
    ...
  });
});
```

## 解決方法
上のやり方では、`Component.jsx`のdefault exportがconnectでラップされたコンポーネントなので、上のエラーが発生していました。

コンポーネント自体をconnectなしでテストするためには、connectでラップされたものの他に、コンポーネント自体もexportする必要があります。

このコンポーネントをテストで利用します。これでエラーも発生しません。

Component.jsx
```diff
- class Component extends React.Component {
+ export class Component extends React.Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}
```

Component.spec.jsx
```diff
import * as React from 'react';
import { shallow } from 'enzyme';
+ import { Component } from './Component';
- import Component from './Component';

describe('Test Component', () => {
  it('何かのテスト', () => {
    ...
  });
});
```

## まとめ
まず、公式ドキュメントに目を通せ！ということでした。

- https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#connected-components

でも、実際に一度困ってみないと、言っている意味がわからないものですねー。
