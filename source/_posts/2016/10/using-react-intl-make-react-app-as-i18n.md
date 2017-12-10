---
layout: post
title: "react-intlを使ってReactアプリを国際化する"
date: 2016-10-19 23:58:00 +900
comments: true
tags:
  - react
  - react-intl
  - i18n
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/localization.png
---
[react-intl](https://github.com/yahoo/react-intl)を使ってReactアプリを国際化してみたところ、結構良かったので紹介します。

<!-- more -->

## tl;dr

- react-intlを使ったReactアプリの国際化方法
- react-intlをcomponentだけではなく、utility functionとして使う方法

## react-intlとは

[react-intl](https://github.com/yahoo/react-intl)は、Reactアプリの国際化を支援するためのComponentと幾つかのAPIを提供する、Yahoo製のライブラリです。
メッセージだけではなく数値(通貨も含む)、日付など幅広く対応しています。

今回は、メッセージの部分に特化して紹介します。

## 基本的な使いかた

基本的な使い方は、次の3ステップです。

- 国際化するcontextを設定する
- 言語設定ファイルを設定する(もし必要であれば)
- react-intlが提供するComponent(`FormattedMessage`)を使ってメッセージを国際化する

### 国際化するcontextを設定する

まず、`IntlProvider`を使って国際化するためのcontextを設定します。
react-intlは、この指定したcontext配下で動作するため、アプリケーションのエントリーポイントに近い部分で行ったほうがいいです。
私の場合は、routingを設定する部分と一緒にしています。

```js
import React from "react";
import { IntlProvider } from "react-intl";
import AppRoute from "./AppRoute";

class App extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      locale: "ja",
      message: // 実際のメッセージファイル
    }
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.locale}
        messages={this.state.messages}
      >
        <AppRoute />
      </IntlProvider>
    );
  }

}
```

メッセージファイルについては後で説明します。

### 言語設定ファイルを設定する

複数言語対応する場合は、追加で言語設定ファイルを設定する必要があります。

```js
import { IntlProvider, addLocaleData } from "react-intl";
import ja from "react-intl/locale-data/ja";

addLocaleData([...ja]);

// もっとたくさんの言語が必要な場合
addLocaleData([...ja, ...fr, ...es]);
```

### Componentを使ってメッセージを国際化する

メッセージを国際化するためには、`FormattedMessage`を使います。

```js
import { FormattedMessage } from "react-intl";

const MyComponent = () => {
  return (
    <div>
      <FormattedMessage id="happy.birthday.to.you" />
      {/* en: Happy birthday to you */}
      {/* ja: お誕生日おめでとう */}
    </div>
  );
};
```

`FormattedMessage`の`id`はメッセージファイルのキーと一致している必要があります。
`id`は`.`で区切っていますが、これはJSONのobjectではなく純粋な文字列キーです。
そのため、上の`id`を指定した場合、メッセージファイルは次のようにする必要があります。

```json
{
  "happy.birthday.to.you": "Happy birthday to you"
}
```

## utility functionとして使う

react-intlのComponentを利用した国際化機能は非常に強力なのですが、国際化の機能自体をpureなfunctionとして使いたいケースは結構あると思います。
例えば、次のようにComponentのpropsと一緒に利用するケースなどです。

```js
import ChildComponent from "./ChildComponent";

const MyComponent = () => {
  return (
    <div>
      {/* titleを国際化したい!! */}
      <ChildComponent title="" />
    </div>
  );
};
```

そんな場合は、`IntlProvider`を直接使います。

```js
import { IntlProvider } from "react-intl";
import ChildComponent from "./ChildComponent";

const intlProvider = new IntlProvider({ locale, messages }, {});
const { intl } = intlProvider.getChildContext();

const MyComponent = () => {
  return (
    <div>
      {/* titleを国際化したい!! */}
      <ChildComponent title={intl.formatMessage({ id: "happy.birthday.to.you" })} />
      {/* en: Happy birthday to you */}
      {/* ja: お誕生日おめでとう */}
    </div>
  );
};
```

> `IntlProvider`の第2引数はcontextを渡すので、特に必要なければ`{}`でよろしいかと。

最終的にはいろいろなComponentで利用したいので、SingletonなClassにしておくと、後で使い勝手がいいと思います。

## まとめ

[react-intl](https://github.com/yahoo/react-intl)を使うと国際化が非常に楽です。

一工夫することで、pureなutility functionとしても使うことができるので、非常に利用用途が広い優秀なライブラリだと思います。
