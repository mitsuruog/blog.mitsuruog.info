---
layout: post
title: "Reactのuncontrolled input warningで困った時に確認するべきたった1つのこと"
date: 2017-09-11 0:00:00 +900
comments: true
tags:
  - React
---

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/react-uncontrolled-input.png %}

たまに見る`uncontrolled input`関連の警告についての小ネタです。
知っていると原因がすぐわかるのですが、知らないと結構デバックに時間が掛かる面倒な警告です。

<!-- more -->

まず、ReactのForm関連コンポーネントの考え方には`controlled`と`uncontrolled`の2つがあります。

簡単に両者の違いを説明すると、値がReactのstateで管理されているかどうかです。

`controlled`の方は、値がReactのstateで管理されていて、`setState`しないと変更できません。
それに対して`uncontrolled`は、値がReactのstateで管理されていないので、従来の方法で値を変更できるのですが、lifecycleイベントなどのReactの様々な恩恵を受けにくくなります。

## で、本題ですが。

Reactでフォームがある画面を開発していると、ちょくちょくお目に掛かるのが次の警告です。
特にフォーム部品を`controlled`にしているにも関わらず、**何か**のタイミングでこの警告が発生するケースがあります。

```
Warning: App is changing a controlled input of type checkbox to be uncontrolled.
Input elements should not switch from controlled to uncontrolled (or vice versa).
Decide between using a controlled or uncontrolled input element for the lifetime of the component.
More info: https://fb.me/react-controlled-components
```

内容としては、フォーム部品の状態が**何か**の原因で`controlled`から`uncontrolled`になったことを警告している内容です。

しかし、この「**何か**」が結構わからなかったりします。

## どこをチェックすればいいのか？

これはReactのフォームコンポーネントに割り当てられているStateの値が、`null`か`undefined`になってしまうタイミングがあるためです。

フォームコンポーネントはStateの値が`null`か`undefined`になった場合、uncontrolledになります。

この警告が発生する状況は大きく2つです。
もしこの警告が出た場合は、これらをチェックしてみるのが解決の近道です。

### Stateの初期値
まず1つ目はフォーム部品のStateの初期値に`null`か`undefined`が設定されてる場合です。

```
this.state = {
  value: undefined
};
```

もちろんプロパティ自体が宣言されていない場合も同様に`undefined`となるので注意が必要です。

```
// this.state.valueはundefined
this.state = {};
```

### setState
もう1つは`setState`で値が`null`か`undefined`になるケースです。

```
this.setState({
  value: undefined
});
```

オブジェクトをそのまま設定する場合など、うっかりして起きやすいと思います。

## まとめ
Reactのフォームコンポーネントは、割り当てられているStateの値が`null`か`undefined`になると、`uncontrolled`になってしまうので注意するべしという話でした。

- react: ^@15.0.0
- サンプル: https://codepen.io/mitsuruog/pen/VMZLVj
