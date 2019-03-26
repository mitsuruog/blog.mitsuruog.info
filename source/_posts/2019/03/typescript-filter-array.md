---
layout: post
title: "TypeScriptのArray.filterで'Object is possibly undefined'を消したい"
date: 2019-03-26 0:00:00 +900
comments: true
tags:
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typescript-array-filter-logo.png
---

TypeScriptの小ネタです。

次のような基本的なArrayのmap処理を考えてみましょう。
TypeScriptのコンパイラオプションには`strictNullChecks`を入れています。

```ts
interface User {
  id: number;
  name?: string;
}

const users: User[] = [
  { id: 1, name: 'aaa' },
  { id: 2  },
  { id: 3, name: 'bbb' },
];

users
  .filter(user => Boolean(user.name))
  // Object is possibly 'undefined'... why?
  .map(user => console.log(user.name.length));
```

`User`クラスのnameはOptionalなので、一度`filter`関数を通過させてundefinedのものを除外しています。
しかし、TypeScriptのコンパイラはしつこく**`Object is possibly 'undefined'`**と言ってきます。

今回は、これをどうにかしたいです。

## User-Defined Type Guardsを使う

このエラーを解消するためには[Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)を使って、コンパイラに型情報を追加で教える必要があります。

1つめのやり方は、nameがOptionalではない新しいTypeを作る方法です。

```ts
...

// Userを継承した新しいTypeを作る
interface ConfirmedUser extends User {
  name: string;
}

users
  .filter((user: User): user is ConfirmedUser => Boolean(user.name))
  .map(user => console.log(user.name.length));
```

もう1つのやり方は、TypeScriptにビルトインされているmapped-typeの`Required<T>`を使います。

```ts
...

users
  .filter((user: User): user is Required<User> => Boolean(user.name))
  .map(user => console.log(user.name.length));
```

`Required<T>`を使う場合は全てのプロパティがrequiredになるので、部分的にOptionalが残る場合は、最初の`extends`で新しいTypeを作るほうがいいと思います。

疑問に思ったので、ここで聞いてみた内容でした。

- [Why TypeScript compiler doesn't handle correctly nested object filtering? \- Stack Overflow](https://stackoverflow.com/questions/55337969/why-typescript-compiler-doesnt-handle-correctly-nested-object-filtering)
