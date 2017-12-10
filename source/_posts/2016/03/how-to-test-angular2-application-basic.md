---
layout: post
title: "Angular2 Unit Testing - 基本編"
date: 2016-03-15 23:29:00 +900
comments: true
tags:
  - angular
  - angular2
  - karma
  - jasmine
  - unit test
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/angular2-testing-logo.png
---
Angular2の実装の方法は記事をよく目にする機会が増えたので、テストについての自分が困らないように調べてみたシリーズ。

今回は基本編。

<!-- more -->

> （注意）Angular 2.0.0-beta.9 をベースに話しています。
E2Eテストはprotractorがそのまま利用できると思うので、ここでのテストはユニットテストの話です。

## Angular2 Unit Testing

1. [準備](/2016/03/how-to-test-angular2-application-1.html)
1. [基本](/2016/03/how-to-test-angular2-application-basic.html)
1. Mock, Spyの基本(TBD)
1. [DOMのテスト](/2016/03/how-to-test-angular2-application-dom.html)
1. [XHRのテスト](/2016/03/how-to-test-angular2-application-xhr.html)
1. Componentのテスト(TBD)
1. Serviceのテスト(TBD)
1. [Pipeのテスト](/2016/03/how-to-test-angular2-application-pipe.html)
1. Directiveのテスト(TBD)
1. [カバレッジ](/2016/03/how-to-test-angular2-application-coverage.html)

## 基本編

Angular1は他のJavaScriptフレームワークと比較して、テスタビリティ(テストのしやすさを)重視したフレームワークでした。

Angular2もテスタビリティを重視したフレームワークとなっており、本体のAPIの中に`angular2/testing`, `angular2/http/testing`, `angular2/router/testing`などテスト専用のものが組み込まれていることからも伺い知ることができます。

## テストフレームワークはJasmineが基本

テストフレームワークは[Jasmine](http://jasmine.github.io/2.4/introduction.html)を利用します。
これは、`angular2/testing`の中でJasmineのAPIをoverwrapしているためです。
いまのところ、Angular2のテストはJasmineを利用したほうが幸せになれると思います。

## テストクラスの構成

簡単なテストクラス(.tsファイル)の構成についてです。
ファイル名は慣例としてテスト対象のファイルに`.spec.ts`を付けることが多いです。

```
例）
hero.service.ts
-> hero.service.spec.ts
```

`angular2/testing`の中でJasmineのAPIをoverwrapしているため、基本的にはJasmineの書き方と同じです。  
テストクラスに含まれる要素は大きく3つです。

1. import
1. describe
1. it
1. expect

### テストで利用するモジュールを読み込む(import)

import部分では、テストで利用するモジュールを読み込みます。  
最低限`angular2/testing`とテストするモジュールを読み込む必要があります。

```ts
import {
  describe,
  it,
  inject,
  injectAsync,
  expect,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {HeroService} from './hero.service';

...つづく
```

### テストケースをグルーピングする(describe)

複数のテストケースをまとめてグルーピングします。
`describe`はネストできるため、複数のテストケースをグルーピングして見通しを良くすることができます。

```ts
describe('Test: なにかのServiceのテスト', () => {

  describe('Test: 正常系', () => {

  });

  describe('Test: 異常系', () => {

  });

});
```

### テストケースを記述する(it)

`it`には実際のテストケースを記述していきます。`it`の中にはテストを検証するためにいくつかの`expect`が含まれます。

```ts
describe('Test: 正常系', () => {

  it('ステータスコードが200であること', () => {

  });

});
```

### テストを検証する(expect)

`expect`はテストを検証するfunctionです。`matchar`とも呼ばれます。

`expect`は用途に応じていくつか種類があり、`angular2/testing`の`expect`はJasmineのmatcharをoverwrapしているため、JasmineのAPIはそのまま利用できます。
他にもAngular2独自で拡張しているmatchar(NgMatchers)もあります。詳細については割愛します。

[NgMatchers - ts](https://angular.io/docs/ts/latest/api/testing/NgMatchers-interface.html)

```ts
expect(testee).not.toBe(undefined);
```

全体像はこちらで雰囲気を掴んでください。

[app.component.spec.ts](https://github.com/mitsuruog/angular2-minimum-starter/blob/master/app%2Fapp.component.spec.ts)

つづいてAngular2ならではの機能について紹介します。

## beforeEachProviders

`beforeEachProviders`はテストで利用するモジュールをoverrideする仕組みです。
Angular1の`$provide`を利用したモジュールの上書きや、[angular.mock.inject](https://docs.angularjs.org/api/ngMock/function/angular.mock.inject)(`_moduleName_`の気持ち悪いやつ)と同等です。

```js
// Angular1($window.locationを上書きする例)
beforeEach(function() {
  module(function($provide) {
    $window = {
      location: { href: null }
    };
    $provide.value('$window', $window)
  });
});
```

```ts
// Angular2(MyServiceをMyServiceMockで上書きする例)
describe('', () => {
  beforeEachProviders(() => [
    provide(MyService, {
      useClass: MyServiceMock
    })
  ]);
});
```

beforeEachProvidersではProviderと呼ばれる`Injector`インタフェース(`@Injectable`指定したもの)を持つものや、`@Component`を設定します。(要確認)

[beforeEachProviders - ts](https://angular.io/docs/ts/latest/api/testing/beforeEachProviders-function.html)

## inject, injectAsync

`inject`, `injectAsync`はbeforeEachProvidersで読み込んだProviderを`it`や`describe`の中にDIします。
Angular1でのinjectと同等のものです。

Angular2でも`@Injectable`を利用した強力なDI機能を持っており、異なる`it`のコンテキストの中で利用するProviderを柔軟に選択することができます。

```js
// Angular1
it('should provide a version', inject(function(mode, version) {
  expect(version).toEqual('v1.0.1');
  expect(mode).toEqual('app');
}));
```

```ts
// Angular2
it('should provide a version', inject([mode, version], (mode: string, version: string) => {
  expect(version).toEqual('v1.0.1');
  expect(mode).toEqual('app');
});
```

`injectAsync`は`it`や`describe`の中が非同期の結果を返す場合に利用します。

```ts
it('...', injectAsync([AClass], (object) => {
  return object.doSomething().then(() => {
    expect(...);
  });
})
```

## まとめ

基本編は以上です。

Angular1と同じ系譜を辿っていることがわかると思いますが、モジュールのoverrideの部分が少し洗練されてきたかなと感じます。

### PR

こちらに初学者のためのMinimum starter kitを作成しましたので、ぜひ利用してください。
(もちろんテストもできます！！)

mitsuruog/angular2-minimum-starter: Minimum starter kit for angular2 https://github.com/mitsuruog/angular2-minimum-starter
