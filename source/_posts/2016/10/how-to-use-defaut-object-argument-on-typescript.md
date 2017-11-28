---
layout: post
title: "Typescript+ReactでDefault parametersにObjectを正しく設定する方法"
date: 2016-10-05 23:58:00 +900
comments: true
tags:
  - react
  - typescript
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2016/defaut-parameter-in-typescript.png %}

最近、React＋Typescriptしか書いてないので、久々に小ネタを投下しようかなっと。。。

<!-- more -->

## tl;dr

- JavaScriptでよくやる引数の `object = object || {}` を、Typescriptでコンパイルエラーを回避しながらどうやるか。
 
## ユースケース

例えば、Reactでこのようなstateless function components(以下、`Book`)を作ったとします。
`Book`はインタフェースとして、`book`を受け取って`name`を表示する非常に単純なcomponentです。

```ts
interface IBook {
  name: string;
}

interface IBookProps {
  book: IBook;
}

export defaut function Book({ book }: IBookProps) {
  return <div>{book.name}</div>
};
```

ところが、 `book`はAPIから取得する必要があり、`Book`を初期化されるタイミングでは`undefined`となっています。

おそらく、`book`を`undefined`のまま、`Book`に渡した場合は、次のようなエラーが発生するでしょう。

```
Uncaught TypeError: Cannot read property 'name' of undefined
```

## ES6 Default parameters を使ってみる

早速、`book = book || {}`と行きたいのですが、ES6の[Default parameters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Default_parameters)を使ってみます。

```ts
export defaut function Book({ book = {} }: IBookProps) {
  return <div>{book.name}</div>
};
```

しかし今度は、 `IBook`型と一致しないというコンパイルエラーが出力されます。

```
error TS2322: Type '{}' is not assignable to type 'IBook'. Property 'name' is missing in type '{}'.
```

まぁ、当然ですね。

## 正しいDefault parametersの使い方

`{}`には型を設定することができるので、Default parametersを設定するときに正しく型を指定してみます。  
これで、コンパイルエラーを無事回避することができました。さらにIDEの補完も効きます。

```ts
export defaut function Book({ book = {} as IBook }: IBookProps) {
  return <div>{book.name}</div>
};
```

## まとめ

最初は、`IBook`を実装した、クラスを定義してダミーの値を設定しないと無理かと思っていましたが、型を設定することであっさり出来ました。

Typescriptのintarfaceは定義するの少し面倒ですが、こういう場合に重宝するので、定義した方がいいですよー。
