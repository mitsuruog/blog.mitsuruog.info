---
layout: post
title: "react-native-dropdownalertをreact-native-router-fluxと一緒に使う"
date: 2019-02-15 0:00:00 +900
comments: true
tags:
  - react-native
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-dropdownalert-logo.png
---

react-nativeでエラーメッセージなどを表示したいので、何かライブラリなどを選定していたら、[react-native-dropdownalert](https://github.com/testshallpass/react-native-dropdownalert)が割と良さそうなので、[react-native-router-flux](https://github.com/aksonov/react-native-router-flux)と一緒に使ってみました。

コードはGitHubに置いてあります。Snack Expoで実機でもすぐ試せます。

- [mitsuruog/react-native-dropdownalert-router-sample](https://github.com/mitsuruog/react-native-dropdownalert-router-sample)
- [Snack Expo](https://snack.expo.io/@mitsuruog/cmVhY3)

## react-native-dropdownalertの基本的な使い方

基本的な使い方はDropDownAlertを表示したViewの一番下に`DropdownAlert`を配置して、この`ref`を使ってメッセージを表示させる感じです。
初見、ちょっと癖があって導入に一手間必要そうだなと思いました。

```js
// ...
import DropdownAlert from 'react-native-dropdownalert';

export const One = () => (
  <View style={styles.container}>
    <Text>One</Text>
    <Button
      title="Press to show the Alert"
      onPress={() => this.dropdown.alertWithType('error', 'Error', 'Alert shows inside ;(')}
    />
    // コンポーネントツリーの一番最後に置くこと！
    <DropdownAlert ref={ref => this.dropdown = ref} />
  </View>
);

// ...
```

結果は。。。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-dropdownalert-demo1.gif 350 %}

NavBarの内側に表示されてしまいました。
どうやらRoute設定しているコンポーネントの外側に置く必要があるみたいです。

## DropdownAlertをNavBarの上に出す

DropdownAlertをRoute設定の外側に置くことは簡単ですが、どうやって他のコンポーネントから操作しようかと頭を悩ませていたところ、こんなIssueがあって助かりました。

- [Stack Navigator · Issue \#73 · testshallpass/react\-native\-dropdownalert](https://github.com/testshallpass/react-native-dropdownalert/issues/73)

`DropDownHolder`というDropdownAlertの`ref`の参照を保存するクラスを作成して、これを他のコンポーネントから使う方式です。

シンプル。まさに目から鱗ですね。実際のコードでは`AlertHelper`としました。

```js
// AlertHelper.js
export class AlertHelper {
  static dropDown;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  static show(type, title, message) {
    if (this.dropDown) {
      this.dropDown.alertWithType(type, title, message);
    }
  }
}
```

`App.js`などのRoute設定の外側にDropdownAlertを置いて、`AlertHelper`の`setDropDown`でrefを保存しておきます。

```js
// App.js

// ...

import { AlertHelper } from './pages/AlertHelper';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppRoute />
        <DropdownAlert
          ref={ref => AlertHelper.setDropDown(ref)}
        />
      </View>
    );
  }
}
```

他のコンポーネントでは`AlertHelper`の`show`を呼び出すことでメッセージを表示することができます。

```js
// Three.js

// ...

import { AlertHelper } from './AlertHelper';

export const Three = () => (
  <View style={styles.container}>
    <Text>Three</Text>
    <Button
      title="Press to show the Info"
      onPress={() => AlertHelper.show('info', 'Info', 'Looks good!!')}
    />
  </View>
);
```

結果は正しく出ましたね。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-dropdownalert-demo2.gif 350 %}

## AndroidのStatusBarと重なる場合の対処方法

正しく出たと思ったのですが、Androidの実機で試したところ、メッセージがStatusBarと重なってしまっていました。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-dropdownalert-demo4.gif 350 %}

あー、やだやだ。クロスプラットフォーム。react-nativeの闇を垣間見た気がします。

色々やり方調べていたらDropdownAlertの`style`にStatusBarのheightを追加して回避する方法が良さそうなので試してみました。

```diff
// App.js

// ...

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppRoute />
        <DropdownAlert
+         defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row' }}
          ref={ref => AlertHelper.setDropDown(ref)}
        />
      </View>
    );
  }
}
```

- [Android statusbar showing on top of alert · Issue \#127 · testshallpass/react\-native\-dropdownalert](https://github.com/testshallpass/react-native-dropdownalert/issues/127)

これで実機でも正しく表示することができました。

### おまけ

GitHubにはDropdownAlertを閉じた時に`onClose`のコールバックを受け取るコードも書かれています。興味あれば覗いてみてください。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-dropdownalert-demo3.gif 350 %}

> 最近、react-nativeを「`RN`」に省略したい人の気持ちがわかってきた気がします。
> 自分は頑張って「react-native」と書き続けたいと思います。