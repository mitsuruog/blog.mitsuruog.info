---
layout: post
title: "react router v4のRedirectでURLパラメータを使う"
date: 2017-11-17 0:00:00 +900
comments: true
tags:
  - react
  - react-router
  - reacr-router-4
---
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/react-router-4.png %}

[react-router v4](https://github.com/ReactTraining/react-router)の小ネタ。

<!-- more -->

## やりたかったこと
> 昔は`<IndexRoute />`があったんだけどね。。。

例えば、`/users/1`というURLにアクセスがきた時に`/users/1/info`のページを表示させたい場合。

`<Redirect />`の中にこんな感じで書くと動くと思ったんですが。。。

```
<Redirect from="/users/:id" to="/users/:id/info" />
```

## 実際の挙動
実際にリダイレクトされたURLは`/users/:id/info`でした。

なんてこったい！

## 解決方法
一度`<Route />`で囲ってから`render`を使ってリダイレクトします。
こんな感じでできました。が、正直めんどくさい。

```
<Route
  path="/users/:id"
  exact={true}
  render={({ match }) => (
    <Redirect to={`/users/${match.params.id}/info`} />
  )}
/>
```

## まとめ
前のプロジェクトではv2系を使っていたのですが、v4は結構変わってて割と大変ですね。（白目

> 同じようなこと考えてPR送ってくれている人いるんですが、こりゃマージされないな。。。
> - https://github.com/ReactTraining/react-router/pull/5368
