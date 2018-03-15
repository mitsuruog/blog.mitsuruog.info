---
layout: post
title: "TypeScriptのReactプロジェクトでreact-styleguidistを使う"
date: 2018-03-14 0:00:00 +900
comments: true
tags:
  - react
  - typescript
  - styleguide
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/react-styleguidist-logo.png
---
今回は、TypeScriptのReactプロジェクトと[react-styleguidist](https://react-styleguidist.js.org/)を一緒に使う方法についての紹介です。

紹介する内容は、こちらのGithubで見ることができます。

- [mitsuruog/react\-styleguidist\-typescript\-demo: A sample for using react\-styleguidist, React and Redux\.](https://github.com/mitsuruog/react-styleguidist-typescript-demo)

## はじめに

react-styleguidistとは、「**style guide**」と呼ばれるドキュメントツールの一種です。

最近は、小さなReactコンポーネントを積み重ねて巨大なアプリケーションを構築していくのですが、どんなコンポーネントがあるかを俯瞰的見るために、このようなツールを使います。

こちらで公式のサンプルを見ることができます。

- [React Styleguidist Example Basic Style Guide](https://react-styleguidist.js.org/examples/basic/)

> 個人的には、「**コンポーネントカタログ**」と言った方がバックエンドの人も理解してくれるので、こちらの呼び方をする方が多い。

## 基本セットアップ
まず、react-styleguidistをインストールします。

```sh
npm install --save-dev react-styleguidist
```

つぎに`package.json`の`scripts`の部分にタスクを追加していきます。

```json
{
  ...
  "scripts": {
    "styleguide": "styleguidist server",
    "styleguide:build": "styleguidist build"
  }
  ...
}
```

最後に`styleguide.config.js`を作成して、TypeScriptのプロジェクトで動かすための設定を追加します。

```js
module.exports = {
  components: "src/shared/components/**/*.{ts,tsx}",
  webpackConfig: Object.assign({}, require("./webpack.config"), {}),
  propsParser: require("react-docgen-typescript").parse,
};
```

細かい内容はこちらです。

- `components`: コンポーネントとして扱うファイルを[glob](https://github.com/isaacs/node-glob)形式で指定します。
- `webpackConfig`: react-styleguidistはTypeScriptのコンパイルができないので、Webpackの設定ファイルを指定します。
- `propsParser`: TypeScriptのinterfaceなどのProps情報をメタデータに変換するためのカスタムPaserです。

以上で、基本セットアップは完了しました。

コードのサンプルや使用例は、コンポーネントと同じディレクトリに`README.md`を作成します。

~~~typescript
// README.md

ここに説明

```
<Lovely />
```
~~~

そのあとに`npm run styleguide`をすると、スタイルガイドが見れるようになります。

## Reduxと一緒に使う
Reduxなどのサードパーティ製のライブラリと一緒に使う場合は、既存のスタイルガイドのrootコンポーネントを置き換える必要があります。
今回は割と需要がありそうな国際化ライブラリ[react\-intl\-redux](https://github.com/ratson/react-intl-redux)を使ってみました。

`Wrapper.tsx`という名前のコンポーネントを作成して、これで置き換えます。

```typescript
// src/styleguide/Wrapper.tsx

...

import { Provider } from "react-intl-redux";
import { addLocaleData } from "react-intl";
import * as jaLocale from "react-intl/locale-data/ja";

// add japanese localisation data
addLocaleData([...jaLocale]);

... (Redux storeの準備)

// デフォルトの言語設定
store.dispatch(langSwitchAction("ja"));

export default class Wrapper extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}
```

ReduxのStoreの準備は、プロジェクトのエントリポイントのファイル(通常は`entry.tsx`とか`index.tsx`)にあると思うので、そのまま使えると思います。
いろいろ割愛しているので、詳細はこちらのコードを見てください。

- https://github.com/mitsuruog/react-styleguidist-typescript-demo/blob/master/src/styleguide/Wrapper.tsx

作成したコンポーネントを`styleguide.config.js`に設定します。

```diff
module.exports = {
  ...
+  styleguideComponents: {
+    Wrapper: __dirname + "/src/styleguide/Wrapper.tsx",
+  },
  ...
};
```

これでサードパーティ製のライブラリと一緒に使うことができるようになりました。

## Connectコンポーネントを使うための工夫

> この工夫は必要ない人もいると思います。ただカスタマイズが必要になった場合に必要な知識なので、頭の片隅にでも覚えておくといいと思います。

プロダクトの構成次第ですが、自分の場合はコンポーネントに関連するファイル一式を同じフォルダに管理しています。

```txt
Lovely
  Lovely.tsx
  Lovely.connect.tsx
  Lovely.scss
  Lovely.spec.tsx
  README.md
```

このような構成をとった場合、(`styleguide.config.js`の`components`の設定次第ではありますが)`Lovely.tsx`と`Lovely.connect.tsx`の2つがスタイルガイド上に登場してしまいます。

そのため、`components`プロパティをもう少しカスタマイズする必要が出てきます。
`components`プロパティは基本的に[node-glob](https://github.com/isaacs/node-glob)で対象となったコンポーネントのリストがあればいいので、これに関数を渡してカスタマイズします。

```js
module.exports = {
  ...
  components: () => {
    return glob.sync("src/shared/components/**/*.{ts,tsx}").filter(file => {
      // Take only connect component if exists, ignore others.
      if (file.match(/connect.tsx$/)) {
        return true
      } else {
        const pathObject = path.parse(file);
        pathObject.ext = `.connect${pathObject.ext}`
        const { root, dir, ext, name } = pathObject;
        return !fs.existsSync(path.format({ root, dir, ext, name }));
      }
    });
  },
  ...
};
```

同じフォルダに`connect.tsx`があったら、これをスタイルガイドのコンポーネントとして使うだけのコードです。
ご自身の環境に合わせてさらにカスタマイズすることもできます。

最後に`README.md`で使うコンポーネントを調整する必要があります。

README.mdのExampleプロックの中では、`require`でモジュールをロードして使えるので、次のようにConnectコンポーネントを直接呼び出して利用します。

~~~typescript
// README.md

```
const FormattedMessage = require("react-intl").FormattedMessage;
const LangSwitch = require("./LangSwitch.connect").default;
<div>
  <LangSwitch />
  <p><FormattedMessage id={"greeting"} /></p>
</div>
```
~~~

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/react-styleguidist01.gif %}

他にもできることがあるので、詳しい説明は公式ドキュメントを見てください。

- [Documenting components — React Styleguidist](https://react-styleguidist.js.org/docs/documenting.html#writing-code-examples)

## まとめ
TypeScriptのReactプロジェクトと[react-styleguidist](https://react-styleguidist.js.org/)を一緒に使う方法についての紹介でした。

> (余談)
> すこし前までは、[create\-react\-app](https://github.com/facebook/create-react-app)で作成したアプリケーションは`webpack.config.js`を取り出す手段がなかったので、仕方なくejectしていまいたが、今は必要ないようです。素晴らしい。
> - [Configuring webpack — React Styleguidist](https://react-styleguidist.js.org/docs/webpack.html#create-react-app-typescript)
