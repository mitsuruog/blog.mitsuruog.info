---
layout: post
title: "react-native-elementsで動的にThemeを変更する"
date: 2019-02-14 0:00:00 +900
comments: true
tags:
  - react-native
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-elements-logo.png
---

react-nativeプロダクトでベースとなるUIコンポーネントライブラリを探していたら、ちょうどいいタイミングで
[react-native-elements](https://github.com/react-native-training/react-native-elements)がv1になったので使ってみることにしました。

v1の目玉機能の一つにThemeがあります。
基本的な使い方は、自身でカスタムThemeを作成してから`ThemeProvider`にそのThemeを渡すだけで動くのですが、一度設定したThemeをプログラムにて変更する場合に一癖あったので、その辺りを紹介します。

Themeについての公式のドキュメントはこちらです。

- [Customization · React Native Elements](https://react-native-training.github.io/react-native-elements/docs/customization.html)

## Themeの基本的な使い方

まずカスタムThemeを作成します。Themeのオブジェクトフォーマットについては[こちら](https://react-native-training.github.io/react-native-elements/docs/customization.html#the-theme-object)を参照してください。

```js
const theme = {
  colors: {
    primary: 'green'
  }
};
```

これをApp.jsなどの上位のコンポーネントに`ThemeProvider`を置いてThemeを設定して読み込ませれば大丈夫です。

```js
// App.js

  ...

  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppRoute /> // react-native-router-fluxなどのRoute設定コンポーネント
      </ThemeProvider>
    );
  }

```

## Themeを動的に変更する

さて、Themeを動的に変更してみましょう。`ThemeProvider`は`theme`をpropsに持っているので、これを変更すればThemeも変更できそうですが、実際には変更できません。

- [Question: Is it possible to toggle active Theme at runtime? · Issue \#1714 · react\-native\-training/react\-native\-elements](https://github.com/react-native-training/react-native-elements/issues/1714)

propsでのThemeの変更をゆるしてしまった場合、全てのコンポーネントツリーのコンポーネントが再描画されてしまうため、これを避けるために`withTheme` HOC(High Order Component)か`ThemeConsumer`を使って`updateTheme`を呼び出す必要があるようです。

今回は`withTheme`を使ってみました。

## withThemeを使ったThemeの変更

まずThemeの変更をトリガーするコンポーネントを`withTheme`でラップします。ラップされたコンポーネントにはpropsに`updatetheme`と`theme`が渡されてくるので、`updateTheme`に変更後のThemeを設定します。

```js
// Child.js
const Child = (props) => {
  return (
    <View>
      <Button
        title="Change theme"
        onPress={() => props.updateTheme({ colors: { primary: 'blue' }})}
      />
    </View>
  );
} 

export default withTheme(Child);
```

実際の画面はこんな感じで切り替わります。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/react-native-elements1.gif 250 %}
