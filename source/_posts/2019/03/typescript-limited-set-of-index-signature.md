---
layout: post
title: "TypeScriptのIndex Signature\"{[key:string]:string}\"で特定の文字だけのIndexを扱う"
date: 2019-03-05 0:00:00 +900
comments: true
tags:
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typescript-index-signature-logo.png
---

TypeScriptの小ネタです。

TypeScriptでStringをキーにしてオブジェクトにアクセスする場合、次のようなTypeを定義します。

```ts
const user: { [key:string] : string } = { name: "mitsuruog" };

console.log(user["name"]); // => mitsuruog
```

ただ、このStringでアクセスする部分をもう少し型安心にしたいですね。

StringのキーのセットでTypeを作成して、Index Signatureに適用できると型安心にできそうです。
試しにUnionTypeを使ってみます。

```ts
type Index = "name" | "address";

// Error: index signature parameter type cannot be a union type. Consider using a mapped object type instead.
const user: { [key:Index] : string } = { name: "mitsuruog" };
```

このままでは使えないようなので、Mapped Typesを使ってみます。

```ts
type Index = "name" | "address";

// Error: Property 'address' is missing in type '{ name: string; }' but required in type '{ name: string; address: string; }'.
const user: { [key in Index] : string } = { name: "mitsuruog" };
```

今度は、オブジェクト初期化の時に全てのキーが必要になってしまったようです。なのでIndexをOptionalにします。

```ts
type Index = "name" | "address";

const user: { [key in Index]? : string } = { name: "mitsuruog" };

console.log(object2.name);

// Error: Property 'password' does not exist on type '{ name?: string; address?: string; }'.
console.log(object2.password);
```

存在しないキーでアクセスしようとした時にコンパイラが検知するようになりました。

これで型安心になりました。

### 参考

- [Quick fix for 'unions can't be used in index signatures, use a mapped object type instead' · Issue \#24220 · Microsoft/TypeScript](https://github.com/Microsoft/TypeScript/issues/24220)
- [Index Signatures · TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html)