---
layout: post
title: "TypeScriptのString Enumsを少し便利にするTips"
date: 2019-04-05 0:00:00 +900
comments: true
tags:
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typescript-string-enums-logo.png
---

TypeScriptの小ネタです。

TypeScriptでは次のようにstringをEnumとして定義することができるのですが、stringをEnumに代入するときにエラーとなってしまうため、今まで少し使いにくいと思っていました。

今日はその認識を改めます。

```ts
enum Direction {
  North = 'North',
  South = 'South',
  East = 'East',
  West = 'West',
} 

let direction: Direction;

direction = Direction.North;
direction = 'North'; // Error Type '"North"' is not assignable to type 'Direction'.
direction = 'AnythingElse'; // Error
```

[TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html)を読んでいたら、String EnumsでEnumとstringの両方に対応できる方法が載ってきたので紹介します。

- [Literal Types · TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html)

まずstring[]からEnumを生成するユーティリティ関数を作成します。

```ts
function stringToEnum<T extends string>(o: T[]): {[K in T]: K} {
  return o.reduce((accumulator, currentValue) => {
    accumulator[currentValue] = currentValue;
    return accumulator;
  }, Object.create(null));
}
```

この関数は、`T`タイプの配列を受け取って、`T`の中にある要素(`K`)をキーと値にセットしたObjectを返します。

> reduceの初期値に`Object.create(null)`を利用しているのは、プレーンなObjectをベースにEnumを生成するためです。こちらの記事がよくまとまっています。
> - [JavaScriptでなぜ Object\.create\(null\) を使うのか？ \- Qiita](https://qiita.com/tady/items/1215a801e178c98deb35)

> ちなみに`{}`を初期値として使った場合は、次のようなエラーが発生します。TypeScript賢い！
> > Type '{}' is not assignable to type '{ [K in T]: K; }

次に生成したEnum(オブジェクト)からTypeを生成します。

```ts
const Direction = stringToEnum([
  'North', 'South', 'East', 'West'
]);

// keyofでDirectionのキーを抽出して
// typeofでUnion Typeを生成する
type Direction = keyof typeof Direction;
```

これを使うことでEnumでもstringでも代入することができます。

```ts
let direction: Direction;

direction = Direction.North;
direction = 'North'; // Works!!
direction = 'AnythingElse'; // Error
```

正確にはEnumではなく、stringのMapオブジェクトをEnumっぽく使っている感じですね。

