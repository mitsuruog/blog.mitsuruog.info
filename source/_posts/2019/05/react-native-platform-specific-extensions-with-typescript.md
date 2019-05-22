---
layout: post
title: "TypeScriptでreact-nativeのPlatform-specific extensionsを型安心にする"
date: 2019-05-22 0:00:00 +900
comments: true
tags:
  - typescript
  - react-native
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typescript-platform-extensions-logo.png
---

TypeScriptの小ネタです。

react-nativeには[Platform-specific extensions](https://facebook.github.io/react-native/docs/platform-specific-code.html#platform-specific-extensions)という仕組みがあります。

これはファイルを拡張子を使って各プラットフォーム(Android/iOS)向けにモジュール参照先を切り替える仕組みです。

例えば次のように各プラットフォームごとにカスタマイズされたモジュールを作成したとします。

```ts
BigButton.android.ts
BigButton.ios.ts
```

これを利用するときは次のように呼び出すことができます。

```ts
import BigButton from './BigButton';
```

ところが、これをTypeScriptでやろうとした場合、モジュール参照先にファイルが存在しないためエラーとなります。

```ts
// TS2307: Cannot find module './BigButton'.
import BigButton from './BigButton';
```

今日はこれを解消する方法の紹介です。

## .d.tsを作成して回避する

回避方法としては、次のような`BigButton`の型定義ファイルを作成するだけです。

```ts
// BigButton.d.ts

import * as ios from "./BigButton.ios"; 
import * as android from "./BigButton.ios"; 

declare var _test: typeof ios;
declare var _test: typeof android;

// ここでモジュールの型情報を提供する
export * from "./BigButton.ios"; 
```

これでコンパイルエラーは消えました。

この仕組みで興味深いことは、`_test`のTypeを再割り当てすることで、各プラットフォームのコードの差異を検知することができることです。

試しにモジュールの中身を違うものに変えてみたところ、次のように差異があることを検知することができました。

> TS2403: Subsequent variable declarations must have the same type. Variable '_test' must be of type 'typeof import("BigButton.ios")', but here has type 'typeof import("BigButton.android")'.

## まとめ

TypeScriptのコンパイラの方でサポートして欲しいという要望があったようですがクローズされてしまったようです。
当分の間は上で紹介した方法で回避するしかなさそうです。
 
- [Allow passing additional SupportedExtensions to support React Native \.android and \.ios module loading · Issue \#8328 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/8328)

今回のトリックも上のIssueからいただきました。最初に思いついた人すごいですね。