---
layout: post
title: "react-native-router-fluxのonRightをカスタマイズする"
date: 2019-03-15 0:00:00 +900
comments: true
tags:
  - react-native
  - react-native-router-flux
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/rnrf-logo.png
---

[react-native-router-flux](https://github.com/aksonov/react-native-router-flux)の小ネタです。

react-native-router-fluxで毎日頭を悩ませています。
うーん、なんだろう。。。初見は使いやすそうなんですが、いざ本番となるといろいろ制約があって悩ましいライブラリですね。

今回はアプリのNavBarの右側にあるボタンをクリックした時に、次の画面にpropsを渡したいようなユースケースを想定しています。例えば参照画面から編集画面に移動するときなどです。
ボタンは次のイメージのような感じです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/rnrf1.png 350 %}

この時react-native-router-fluxは`onRight`を発火するのですが、これに動的に値を渡すために少し工夫が必要でした。

## 通常のonRightの定義方法

「プロフィール」と「プロフィール編集」ページを想像してみましょう。「プロフィール」ページの編集ボタンをクリックすると「プロフィール編集」ページに移動します。この時、react-native-router-fluxの`Actions`に**プロフィールIDを渡して次の画面で利用できるようにしたい**です。

次のコードは通常の`Router`設定です。
`onRight`は`Scene`と一緒に定義してあり、期待通り「プロフィール編集」しますが、プロフィールIDを値を渡すことはできません。

```ts
// AppRoute.tsx
  ...
  <Scene 
    key="page_profile" 
    component={Profile} 
    title="プロフィール"
    onRight={() => Actions.page_profile_edit()} 
    rightTitle="Edit"
  />
  <Scene 
    key="page_profile_edit" 
    component={ProfileEdit} 
    title="プロフィール編集"
  />
  ...
```

## onRightをComponentの中で定義する

`onRight`にプロフィールIDを渡すためには、「プロフィール」ページの中で`onRight`ハンドラを**上書き**して、IDを渡せるようにしなければなりません。
`onRight`はpropsで渡されてくる`navigation.setParams()`にて置き換えできるので、`componentWillMount`でコンポーネントがMountされた時に上書きしましょう。

```ts
// Profile.tsx
export Profile extends React.Component<ProfileProps, {}> {
  componentWillMount() {
    this.props.navigation.setParams({
      'onRight': this.onRight,
    });
  }
  private onRight = () => {
    console.log('Press onRight!!');
    // ここでActionsにプロフィールIDを渡す
    Actions.page_profile_edit({ profileId: 1 });
  }}
  ...
}
```

Routerの方の`onRight`は動かないようにしておきます。

```diff
// AppRoute.tsx
  ...
  <Scene 
    key="page_profile" 
    component={Profile} 
    title="プロフィール"
-    onRight={() => Actions.page_profile_edit()} 
+    onRight={() => undefined} 
    rightTitle="Edit"
  />
  ...
```

TypeScriptで型付けする場合は`@types/react-navigation`の`NavigationScreenProp`を使います。

```ts
// Profile.tsx
import { NavigationScreenProp } from 'react-navigation';

interface ProfileProps {
  navigation: NavigationScreenProp<any, any>;
}

export Profile extends React.Component<ProfileProps, {}> {
  componentWillMount() {
    this.props.navigation.setParams({
      'onRight': this.onRight,
    });
  }
  ...
}
```

これで`onRight`をカスタマイズすることができました。

。。。大変。

以上