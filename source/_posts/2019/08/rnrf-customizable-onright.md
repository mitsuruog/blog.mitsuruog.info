---
layout: post
title: "react-native-router-fluxのonRightをカスタマイズする(part2)"
date: 2019-08-27 0:00:00 +900
comments: true
tags:
  - react-native
  - react-native-router-flux
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/rnrf-logo.png
---

[react-native-router-flux](https://github.com/aksonov/react-native-router-flux)の小ネタです。

前回の話はこちら。

- [react\-native\-router\-fluxのonRightをカスタマイズする \| I am mitsuruog](https://blog.mitsuruog.info/2019/03/rnrf-customizable-onright)

前回はアプリのNavBarの右側にあるボタン(以下、RightButton)をクリックした時に、次の画面にpropsを渡したいようなユースケースを想定していましたが、今回はRightButtonをpropsの条件で出し分けしたいと思います。

次のような手順で実現できそうです。

1. PageComponent内部でRightButtonを出す
2. RightButtonをタップした時に、Component内部のタップハンドラ(private function)を実行する
3. 外部からのpropsの値でRightButtonを出し分けする

コードは全てTypeScriptです。

## PageComponent内部でRightButtonを出す

RightButtonの追加方法は**いくつかある**のですが、今回はPageComponentにstaticな`navigationOptions`プロパティを追加して、この中でRightButton用のComponentを定義します。

> この方法というものがいくつかあって、それぞれ期待する動きをしないので辛いです。

```ts
// ...
import { NavigationScreenProps } from 'react-navigation';

class Page extends React.Component<State, Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      // ここにRightButtonのComponentを渡す
      headerRight: <Button title="+1" />
    };
  }

  render() {
    // ...
  }
}
```

`navigationOptions`で渡されている関数の`navigation`は`react-navigation`の`NavigationScreenProps`の型を使います。これは、`react-native-router-flux`が`react-navigation`をベースとして拡張しているためです。

## RightButtonをタップした時に、Component内部のハンドラを実行する

RightButtonをタップした時に、Component内部のハンドラを実行するには`Button`Componentの`onPress`を使えば可能です。しかし、`static`プロパティ内部からPageComponent内のprivate functionを呼び出すにはひと工夫必要でした。

`static`プロパティ内部からPageComponentのfunctionを実行するには、propsの`navigation`を通じてfunctionの参照を渡すことで可能となります。
`componentDidMount`の中でpropsの`navigation.setParam`を使うことで参照を渡すことができます。

```ts
// ...

import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

class Page extends React.Component<State, Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      headerRight: <Button title="+1" />
    };
  }
  
  componentDidMount() {
    // ここでハンドラの参照をセットする
    this.props.navigation.setParams({ onRight: this.onRight });
  }

  // ...
}
```

渡されたハンドラの参照を次のように`navigationOptions`で使うことができます。

```diff
// ...

class Page extends React.Component<State, Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
-      headerRight: <Button title="+1" />
+      headerRight: <Button title="+1" onPress={navigation.getParam('onRight')} />
    };
  }

// ...
```

これでRightButtonをタップした時に`onRight`が呼び出されるようになります。

## 外部からのpropsの値でRightButtonを出し分けする

外部からのpropsも上の方法と同様に`navigation.setParam`と`getParam`を使って実現します。

今回はpropsで`hasButton`が渡されるとします。`componentDidMount`の中で再び`navigation.setParam`を使います。

```diff
// ...

  componentDidMount() {
    // ここでハンドラの参照をセットする
    this.props.navigation.setParams({ onRight: this.onRight });
+   this.props.navigation.setParams({ hasButton: this.props.hasButton });
  }

// ...
```

この値を`navigationOptions`の中で使います。

```diff
// ...

class Page extends React.Component<State, Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
-     headerRight: <Button title="+1" onPress={navigation.getParam('onRight')} />
+     headerRight: navigation.getParam('hasButton') ? 
+       <Button title="+1" onPress={navigation.getParam('onRight')} /> :
+       undefined
    };
  }

// ...
```

これでprops経由でRightButtonを出し分けすることができるようになりました。

。。。大変。

以上