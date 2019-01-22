---
layout: post
title: "typesafe-actionsのActionTypeに動的な文字列を使ってはいけない"
date: 2019-01-22 0:00:00 +900
comments: true
tags:
  - react
  - typescript
  - redux
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typesafe-actions-logo.png
---

（完全に自分用のメモです。）

TypeScript+React+Reduxを使うときに気に入って使っている[typesafe-actions](https://github.com/piotrwitek/typesafe-actions)。
意外なところでハマりポイントがありました。

## ReducerでActionの型情報が見れない

よくあるReducer。

```typescript
export const weatherReducer = (state: WeatherState = initialState, action: Action): WeatherState => {

  switch (action.type) {

    case getType(actions.weatherSetAction):
      return Object.assign({}, state, { weather: new Weather(action.payload) });

    case getType(actions.weatherErrorAction):
      console.error(action.payload.message);
      return state;

    default:
      return state;
  }
};
```

ところが`action.payload`の型情報が正しく取れていません。なぜだろう。。。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/typesafe-actions1.png 550 %}

エラーの内容はこちら。

```txt
TS2339: 
Property 'payload' does not exist on type 
'{ type: string; payload: { lat: number; lng: number; }; } | 
 { type: string; payload: Response; } | 
 { type: "@@weather/ERROR"; payload: Error; } | 
 { type: "@@map/READY"; }'. 
  Property 'payload' does not exist on type '{ type: "@@map/READY"; }'.
```

Actionの型定義は一見良さそうなので、最初は何が原因かわかりませんでした。

## ActionTypeに動的な文字列を使ってはいけない

原因はこれでした。ActionTypeを`PREFIX`を使ったテンプレート文字列で定義している部分。

```typescript
// constants.ts
const PREFIX = "@MyApp"
export const MAP_READY   = `${PREFIX}/READY`;
export const WEATHER_GET = `${PREFIX}/GET`;
export const WEATHER_SET = `${PREFIX}/SET`;
export const WEATHER_ERROR = `${PREFIX}/ERROR`;
```

公式ドキュメントにも書いてありました。

- [typesafe-actions: The Actions](https://github.com/piotrwitek/typesafe-actions#--the-actions)

> PRO-TIP: string constants limitation in TypeScript
> ...

TypeScriptには文字列の定義に関する制限事項があってだね。テンプレート文字列などで動的に文字列を組み立てた場合、型情報が全部`string`になってしまって、reducerのcaseの中の型情報が壊れるよ。（超訳）

```typescript
// Example file: './constants.ts'

// WARNING: Incorrect usage
export const ADD = prefix + 'ADD'; // => string
export const ADD = `${prefix}/ADD`; // => string
export default {
   ADD: '@prefix/ADD', // => string
}

// Correct usage
export const ADD = '@prefix/ADD'; // => '@prefix/ADD'
export const TOGGLE = '@prefix/TOGGLE'; // => '@prefix/TOGGLE'
```
（公式ドキュメントから抜粋）

という訳で、正しいやり方は普通に文字列だけでActionType定義すればいいだけでした。

```typescript
// constants.ts
export const MAP_READY   = "@MyApp/READY";
export const WEATHER_GET = "@MyApp/GET";
export const WEATHER_SET = "@MyApp/SET";
export const WEATHER_ERROR = "@MyApp/ERROR";
```

なるほど、TypeScriptの制限。
勉強になりました。