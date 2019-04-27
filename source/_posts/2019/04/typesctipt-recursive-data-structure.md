---
layout: post
title: "TypeScriptで再帰的なデータ構造を型安心にする"
date: 2019-04-26 0:00:00 +900
comments: true
tags:
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typesctipt-recursive-data-structure-logo.png
---

TypeScriptの小ネタ。

TypeScriptで再帰的なデータ構造のデータに対して型を適用する方法です。
例えば、クローリングしてきたWebサイトの情報など。JSONのkeyがあって、値が`string | number | boolean | Array | Object`になる可能性がある面倒なやつです。

普通に考えると、`[key: string]`のIndex signatureとUnion Typeを持つ型を使えばいいかと思うのですが、肝心のUnionの型定義が再帰構造なので表現できません。

```ts
interface WebSiteData {
  // Unionの部分が再帰的なので表現できない！！
  [key: string]: string | number | boolean | Array<
    string | number | boolean | Array<
      string| number | boolean | Array<  
        ...え、ちょっと待って 
      >
    >
  > 
}
```

まずこの問題を解決するには、JSONの値が取る型定義を最初にイメージします。名前を`JSONValueType`として、後で定義するArrayやObjectはこの型構造を使うことにします。

`JSONValueType`は値が`string | number | boolean | Array | Object`になる可能性があるので、型定義はだいたい次のようなものになると考えます。

```ts
// Array<JSONValueType> | Object<JSONValueType>はあとで置き換えます。
type JSONValueType = 
  | string 
  | number 
  | boolean 
  | Array<JSONValueType> 
  | Object<JSONValueType>;
```

次に`Array<JSONValueType>`の型定義をします。名前は`JSONValueTypeArray`にしましょう。

定義するには`JSONValueType`型のArrayを継承したinterfaceを作成します(ちょっとトリッキーです)。定義した後は、`JSONValueType`の型定義も置き換えます。

```ts
type JSONValueType = 
  | string 
  | number 
  | boolean 
  | JSONValueTypeArray
  | Object<JSONValueType>;

interface JSONValueTypeArray extends Array<JSONValueType> {}
```

次に`Object<JSONValueType>`の型定義をします。名前は`JSONValueTypeObject`にしましょう。

こちらも定義するには`[key: string]`のIndex signatureを持って`JSONValueType`の値を持つinterfaceを定義します。
定義した後は、`JSONValueType`の型定義も置き換えます。

```ts
type JSONValueType = 
  | string 
  | number 
  | boolean 
  | JSONValueTypeArray
  | JSONValueTypeObject;

...

interface JSONValueTypeObject {
  [key: string] : JSONValueType;
}
```

これで不定形のJSONデータ構造を`JSONValueTypeObject`を使って型安全に定義することができました。

```ts
const data: JSONValueTypeObject = {
  name: 'mitsuruog',
  age: 20,
  alive: true,
  profile: [{
    profileName: 'aaa',
    profileNumber: 1,
    profileBool: true,
    profileArray: [],
    profileObject: {},
  }],
  address: {
    addressString: 'aaa',
    addressNumber: 1,
    addressBool: true,
    addressArray: [],
    addressObject: {}
  }
}
```

参考リンク

- [recursive type definitions · Issue \#3496 · Microsoft/TypeScript](https://github.com/Microsoft/TypeScript/issues/3496)

> もう少し簡単に定義できるようにしたかったみたいですが、実現されなかったみたいですね。。。
