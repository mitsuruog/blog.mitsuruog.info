---
layout: post
title: "Jestでaliasを使ったモジュール参照を扱う"
date: 2019-06-07 0:00:00 +900
comments: true
tags:
  - jest
  - unit test
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/jest-alias-logo.png
---

JavaScriptのテストフレームワーク[Jest](https://jestjs.io/en/)の小ネタです。

最近reactやreact-nativeのプロジェクトでモジュールの参照にaliasを使うことが多いのですが、Jestでこれを扱う方法について紹介です。

## aliasを使ったモジュール参照

aliasを使ったモジュール参照とは、プロジェクト内の特定のディレクトに別名(alias)をつけることで、`import`文の記述を簡単にすることです。

例えば、次のような相対パスでモジュールをimportしている箇所にaliasを使ってみましょう。

```ts
// greet.ts は src/shared/services にあるとする
import { greet } from '../../../greet.ts'
```

aliasを使う場合は、まず`src/shared`に`Shared`というaliasをつけます。そうすると次のように相対パスを除いて書くことができます。

```ts
// Shared は src/shared を参照している
import { greet } from 'Shared/services/greet.ts'
```

aliasを使うメリットとしては、`import`文の記述を簡略化することもあるますが、相対パスを使った場合よりリファクタなどの変更に強いことが挙げられます。

## moduleNameMapperを使ってaliasを扱う

Jestでaliasを扱うためには`moduleNameMapper`を使ってaliasと実際のパスをマッピングします。

- https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string

上の例の場合は次のようになります。

```js
module.exports = {
  moduleNameMapper: {
    '^Shared(.*)$': '<rootDir>/src/shared/$1'
  }
};
```

これでJestでも、aliasを使ったモジュール参照があるプロジェクトをテストすることができました。