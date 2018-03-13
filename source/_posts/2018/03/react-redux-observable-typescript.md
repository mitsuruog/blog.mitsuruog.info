---
layout: post
title: "React + Redux + redux-observable + TypeScriptの実践的サンプル"
date: 2018-03-13 0:00:00 +900
comments: true
tags:
  - react
  - redux
  - redux-observable
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-observable-logo.png
---
新規プロダクトで「React + Redux + redux-observable + TypeScript」を使ってみました。
割と良く仕上がったので、全体アーキテクトを単純にしたサンプルを作ってまとめてみました。同じような構成を考えている人は参考にしてみてください。

対象者は、ReactとTypeScript(もしくはFlux)経験者です。初歩的な部分は割と割愛して説明しています。

## デモ
作ったものはこちらのGithubでみれます。

- [mitsuruog/react\-redux\-observable\-typescript\-sample: A sample application for React \+ redux\-observable \+ TypeScript](https://github.com/mitsuruog/react-redux-observable-typescript-sample)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-observable01.png 500 %}

GoogleMapと[OpenWeatherMap](https://openweathermap.org/)のAPIを連動させて、マップをクリックした地点の天気を表示する単純なサンプルです。

## はじめに
まずこの構成で始めようと思った方は、最初にこれに目を通すべきです。

- [piotrwitek/react\-redux\-typescript\-guide: A comprehensive guide to static typing in "React & Redux" apps using TypeScript](https://github.com/piotrwitek/react-redux-typescript-guide)

最初はよくわからないと思います。ある程度理解すると内容がわかってくると思うので、常にそばにおいて参照してください。

ちなみに「**Redux**」とは**Fluxの良くある実装パターンに名前をつけたもの**です。
Fluxを経験した身として、Reduxの主な特徴は次の2点だと感じました。

- 中央管理的なState管理(Store)
- Store前にあるReducer(減速機)

> **Reducer(減速機)**とは、Storeの手前にあるレイアーで、Storeの値を直接変更する役割をしています。
> ActionからActionを呼び出して、(加速しながら？)何周かぐるぐる回ることもあるので、(安全のため？)減速機を通してからStoreを変更するためこのような名前になったのではと想像しています。

Fluxの説明としては下の図が有名ですね。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/redux-observable02.png 500 %}

> https://github.com/facebook/flux/tree/master/examples/flux-concepts より

通常は登場人物は以上なのですが、今回はReduxで副作用を処理部分にedux-observableを使っているため、もう一人「**Epic**」が登場します。

それでは順にキーポイントとなる部分を紹介していきます。

## ActionとConstants
まずActionを作ります。
ActionはこれからStoreを変更するための起点となる部分です。基本的には`type`となんらかのデータ構造(今回は`params`と`payload`)をとります。

```typescript
// actions/index.ts
export interface Action {
  type: string;
  payload?: {};
  params?: {};
}
```

typeは他のReducerやEpicでも使うので、定数化して`Constants`の中に定義しておきます。

```typescript
// constants/index.ts
export const WEATHER_GET = "@@weather/GET";
...
```

基本的には`@@XXX/SET`をReducer用、それ以外(例えば`@@XXX/GET`)をEpicで使うようにしています。(そこまで厳密じゃないです。)

Action名は重複すると見つけにくい不具合の原因になるため、[typesafe-actions](https://github.com/piotrwitek/typesafe-actions)を使って定義していきます。

```typescript
export const weatherGetAction = createAction(WEATHER_GET, (params = {}) => ({
  type: WEATHER_GET,
  params,
}));
```

## Reducer
次にReducerを作ります。
Reducerは直前のStateとActionで渡されたものを引数に、新しいStateを返す役割をしています。

```txt
(previousState: State, action: Action) => newState: State
```

まず、Stateと初期Stateを定義します。

```typescript
// reducers/WeatherReducer.ts
export interface WeatherState {
  loading: boolean;
  weather?: Weather;
}

const initialState = {
  loading: false,
};
```

次にReducerを定義していきます。

```typescript
export const weatherReducer = (state: WeatherState = initialState, action: Action): WeatherState => {

  switch (action.type) {
    case WEATHER_SET:
      return Object.assign({}, state, { weather: new Weather(action.payload) });

    default:
      return state;
  }
};
```
Reducerの定義の部分で初期State(`initialState`)を設定しているのが見てわかると思います。

また、Object.assignは`Object.assign(state, newState)`としないでください。こうすると元のStateを上書きしてしまうので、ReduxがStateの変更を検知できません。

ここで正しくStateが変更されて初めて、Reduxはその変更を検知してReactなどに対して再描画の指示を出すことができます。

## Epic
次にEpicを作ります。
Epicはredux-observableのコアコンセプトの1つで、**Actionから呼び出されて、Actionを返します。**
そのためEpicの作成は「**任意**」です。Actionから何か別のAction(例、APIアクセス、並列処理など)を呼び出す必要がある場合のみ利用します。

```txt
(action$: Observable<Action>, store: Store) => Observable<Action>
```

もっとも簡単なEpic例は、Actionを受け取って、別のActionを返すものです。

```typescript
const deadSimpleEpic: Epic<Action, RootState> = (action$, state) =>
  action$.ofType(LOVELY_TYPE)
    .map((action: Action) => nextAction(action.payload));
```

次にAPIアクセスする例です。

> 実際のプロダクトでは、`Rx.Observable.ajax`を使ってみたのですが、個人的に好みではなかったので`fetch`を使った例にしています。

`fetch`はPromiseを返すので、これをObservableに変換する共通クラスを作成しています。

```typescript
// shared/services/Api.ts
const getWeather = (lat: number, lng: number) => {
  const request = fetch(`some_lovely_URL_will_be_here!!`)
    .then(response => response.json());
  return Observable.from(request);
};
```

これをEpicの`mergeMap`で受け取って、別のActionに繋ぎます。`weatherSetAction`はStoreを更新するActionです。

```typescript
// epics/WeatherEpic.ts
const weatherGetEpic: Epic<Action, RootState> = (action$, state) =>
  action$.ofType(WEATHER_GET)
    .mergeMap((action: WeatherAction) =>
      getWeather(action.params.lat, action.params.lng)
        .map(payload => weatherSetAction(payload))
    );
```

最終的には、複数のEpicをまとめて1つにします。

```typescript
// epics/index.ts
const epics = combineEpics(
  ...weatherEpic,
);
```

redux-observableのEpicを使った場合にはじめに混乱するポイントとしては、**ActionからReducerに直接繋がるケースは少なく、別のActionを経由してからReducerに繋がる点**です。

```txt
// Epicを使わない場合
Action => Reducer => Store => Re-render

// Epicを使った場合
Action(@@XXX/GET) => API call => Action(@@XXX/SET) => Reducer => Store => Re-render
```

## Connect
次に、Connectを作ります。
ConnectはReactとFluxの実装パターン(たぶん、コンテナパターン)の一種で、[react-redux](https://github.com/reactjs/react-redux)が採用しているものです。

Reactコンポーネントを「**Connect**」というコンテナでラップして、ReduxのStoreとの橋渡しをします。
実際には次の2つの橋渡しです。

- Storeからコンポーネント(慣例で`mapStateToProps`とする)
- コンポーネントからStore(慣例で`mapDispatchToProps`とする)

まず、このConnectコンポーネントが外側に見せるProps(`OwnProps`)を定義して、Storeとの橋渡し部分を定義します。

```typescript
// components/Weather.connect.tsx
interface OwnProps {
}

const mapStateToProps = (state: RootState) => ({
  weather: state.weather.weather,
});

const mapDispatchToProps = (dispatch: Function, props: OwnProps) => ({
  // 今回は実際にないけど、あったらこんな感じで書く
  someEventHander: (payload: {}) => dispatch(someLovelyAction(payload)),
});
```

connectのインターフェースは一見難しいのですが、Higher order component(HOC)だと思うとわかりやすいかと思います。
まず、Storeとの橋渡しの定義を設定したHOCを作成してから、オリジナルのコンポーネントを渡して、Connectでラップされたコンポーネントを取り出します。

```txt
connect(mapStateToProps, mapDispatchToProps)(OriginalComponent) => ConnectComponent
```

これで、**外側から見ると`OwnProps`のコンポーネントで、中はしっかりReduxのStoreを繋がっているコンポーネント**の出来上がりです。

```typescript
// components/Weather.connect.tsx
export default connect<{}, {}, WeatherProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Weather) as React.ComponentClass<OwnProps>
```

## Store
最後はStoreの設定です。Storeをアプリケーションで有効にして、Connectが正しく機能するようにしましょう。

上で作成したConnectを有効にするためには、これらの外側を`Provider`というコンポーネントで囲う必要があります。
Storeの作成は通常のReduxと同様に`createStore`を使って行います。

```typescript
const store = createStore(reducers, preloadedState, enhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

以上で紹介終わり。

## まとめ
ちょっと詳細割愛してしまった部分もありますが、細かな部分は実際の[Githubリポジトリ](https://github.com/mitsuruog/react-redux-observable-typescript-sample)を見てもらえれば雰囲気わかるかと思います。

正直「Redux + redux-observable」は学習コスト高めです。使う人を選びます。
自分は習得できたし、他の人に教えることもできると思うので次のプロダクトでも機会があれば使うと思います。しかし、他の人にはあまり気持ちよく勧められない部分もあるのも事実です。とはいえ、やりごたえはあると思うので、興味がある方はトライしてみては如何でしょうか。

その他、個人的に目を通しておいた方がいいと思うもの。

- [Reduxユーザーが最もハマるstateの不正変更とその検出方法 \| I am mitsuruog](https://blog.mitsuruog.info/2018/02/why-is-immutability-required-by-redux)
- [Immutable Update Patterns \- Redux](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns)
- [Ecosystem \- Redux](https://redux.js.org/introduction/ecosystem)
