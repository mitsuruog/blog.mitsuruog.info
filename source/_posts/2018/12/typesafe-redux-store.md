---
layout: post
title: "typesafe-actionsを使って型安心なRedux Storeを実装する"
date: 2018-12-08 0:00:00 +900
comments: true
tags:
  - react
  - redux
  - redux-observable
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/type-safe-redux-store.png
---

この記事は[React.js その2 Advent Calendar 2018](https://qiita.com/advent-calendar/2018/react2) 8日目の記事です。

半年くらい前に、[React \+ Redux \+ redux\-observable \+ TypeScriptの実践的サンプル](https://blog.mitsuruog.info/2018/03/react-redux-observable-typescript)という記事を書いたのですが、Reduxのactionとreducerの部分の型があまりうまく定義できてなかったので、個人的に課題だと感じていました。

今回はその部分を[typesafe-actions](https://github.com/piotrwitek/typesafe-actions)を使って型安心に実装する方法の紹介です。

プロジェクト全体のコードはこちらを参照してください。

- [mitsuruog/react\-redux\-observable\-typescript\-sample: A sample application for React \+ redux\-observable \+ TypeScript](https://github.com/mitsuruog/react-redux-observable-typescript-sample)

## 以前のコード
以前のコードはActionにinterfaceを定義して、型が必要なReducerなどの部分でこのinterfaceを使ってAny型をキャストする方法を取っていました。


```typescript
// Actionでinterfaceを定義して
interface CoolAction {
  isSuperCool: boolean;
  payload: {};
}
```

```typescript
// Reducerの中でキャストする
switch (action.type) {

  case COOL_ACTION:
    return Object.assign({}, state, { 
      cool: new CoolModel((action as CoolAction).payload)
    });

  default:
    return state;
}
```

この場合、どうしてもActionとReducerの間でAny型となってしまい、型安心とは言えない状態でした。
最近になって[react\-redux\-typescript\-guide](https://github.com/piotrwitek/react-redux-typescript-guide#redux)を読んでいたら、Redux Store周りを型安心にする方法が載っていたので試してみました。

## typesafe-actionsを使って型安心なRedux Storeを実装する


### Actionの定義

まずActionを定義します。以前を同じように`createAction`をつかって型を定義していきます。
`resolve`の中にActionのpayloadを渡します。これが後にReducerなどで利用されます。

```typescript
import { createAction } from "typesafe-actions";

import { WEATHER_GET } from "../constants";

export const weatherGetAction = createAction(
  WEATHER_GET, 
  resolve => (lat: number, lng: number) => resolve({ lat, lng }),
);
// これと同じ
// { 
//   type: WEATHER_GET, 
//   payload: { lat: number, lng: number }, 
// }
```

> typesafe-actionsには`action`というもう少し簡単にActionを定義できる関数がありますが、
> この場合、`getType`や`isActionOf`などのHelper関数と一緒に使えないActionとなります。
> 個人的には、Helper関数を使わない理由があまりないので、面倒でも`createAction`を使うことをおすすめします。

### ReducerでActionの型を使う

次にReducerでActionの型の使い型です。
`ActionType`のジェネリックにActionの定義を渡すと、Actionの実行結果の型が返ってきます。これをActionの型として利用します。

```typescript
import { ActionType, getType } from 'typesafe-actions';

import * as actions from "../actions";

type Action = ActionType<typeof actions>;
// 実際のActionには複数のActionのUnion typeが設定されている
// {  type: WEATHER_GET, payload: { lat: number, lng: number } } | 
// {  type: WEATHER_GET, payload: { weather: Response } }
```

`ActionType`の中身については非常に難しい部分ですが、簡単に説明するとTypeScriptの`ReturnType<T>`を使って型情報を取得しています。

`ReturnType<T>`は`T`に渡された関数を実行してその戻り値の型情報を取得するものです。

例えば、上のactionsの中に`weatherGetAction`と`weatherSetAction`があった場合、
`ActionType<typeof actions>`の結果は`weatherGetAction | weatherSetAction`のようなUnion typeになります。(実際には`weatherGetAction`関数の戻り値の型です。)

次にActionの型情報を取得できたので、これをReducerのActionの型定義として使います。
Typeの判定は`getType`を使うことで型安心に判定することができます。


```typescript
export const weatherReducer = (state: WeatherState = initialState, action: Action): WeatherState => {

  switch (action.type) {

    case getType(actions.weatherSetAction):
      // このActionの型は { type: WEATHER_GET, payload: { lat: number, lng: number} }
      return Object.assign({}, state, { weather: new Weather(action.payload) });

    ...
   
    default:
      return state;
  }
};
```

以上が基本的な流れです。

## おまけ、redux-observableと一緒に使う

[typesafe-actionsにredux-observableについての記載](https://github.com/piotrwitek/typesafe-actions#--the-async-flow)があるのですが、これだけだとうまく行かなかったので、うまく行かなかったポイントを紹介します。

### Epicの実装

まず、Reducerと同じ方法でActionの型情報を取得しておきます。
Epicの実装は上のtypesafe-actionsのガイドの通りに実装すれば大丈夫です。`isOfType`と`getType`を使って型安全に実装していきます。

```typescript
// ActionはReducerと同じように取得したActionの型情報
export const weatherGetEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    filter(isOfType(getType(actions.weatherGetAction))),
    switchMap(action =>
      ...
    )
  );
```

### Storeの実装
Storeの実装の部分は少し変更が必要です。
次のように実装した場合、コンパイル時にエラーがでます。

```typescript
const epicMiddleware = createEpicMiddleware();
// ちょー長いActionの型定義 is not assignable to parameter of type 'Epic<Action<any>, Action<any>, void, any>'.
```

ActionとStateの型情報がうまく渡っていないようなので、ジェネリックで型情報を渡すようにするとコンパイルできるようになります。

> もしかすると自分のEpicの型定義がどこか間違っているだけかもしれないが。。。

```typescript
const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
```

これでredux-observableと一緒に使っても型安心になりました。

## まとめ
説明割愛してしまった部分もありますが、実際に動作しているコードは[GitHub](https://github.com/mitsuruog/react-redux-observable-typescript-sample)を見てください。

> typesafe-actionsで意外なハマりポイントがあったので、こちらにも目を通しておくといいです。
> - [typesafe\-actionsのActionTypeに動的な文字列を使ってはいけない \| I am mitsuruog](https://blog.mitsuruog.info/2019/01/dont-use-dynamic-string-for-typesafe-actions)
