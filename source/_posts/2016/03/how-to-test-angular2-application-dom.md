---
layout: post
title: "Angular2 Unit Testing - DOMのテスト"
date: 2016-03-17 1:59:00 +900
comments: true
tags:
  - angular
  - angular2
  - karma
  - jasmine
  - unit test
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2016/angular2-testing-logo.png %}

Angular2の実装の方法は記事をよく目にする機会が増えたので、テストについての自分が困らないように調べてみたシリーズ。

今回はDOMが関連するテスト。

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

## DOMのテスト

DOMのテストについて紹介します。

DOMのような状態が不安定なものをテストする場合、テスト対象の状態を一定に固定するため、`fixture`と呼ばれる土台(仮のDOM)を利用してきました。
Angular2のDOMのテストでも、これまでと同様にfixtureを利用します。

## fixtureを準備する(TestComponentBuilder)

まず、テストで利用するfixtureを準備します。

Angular2にはテスト用fixtureを作成するためのAPI`TestComponentBuilder`が準備されています。
`TestComponentBuilder`は、fixture用のComponentを作成して外側から操作・検証するAPIを提供します。

DOMのテストのおおまかな流れは次のような形です。

```ts
import {
  it,
  describe,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
import {Component} from 'angular2/core';

describe('DOMのテスト', () => {

  beforeEachProviders(() => [
    TestComponentBuilder
  ]);

  it('なにかのテスト', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    // ここに実際のテストコードを書く
  }));
  
});

// fixture用Component
@Component({ selector: 'container' })
class TestComponent { }
```

`TestComponentBuilder`は`@Injectable`指定されているため、他のProviderと同様に`beforeEachProviders`で呼び出した後に、`injectAsync`でテストコード中にDIして利用する必要があります。

続いて、テストで利用する使い捨てComponentを作成します。これをテスト用fixtureとして利用します。

- [TestComponentBuilder - js](https://angular.io/docs/js/latest/api/testing/TestComponentBuilder-class.html)

## fixtureを作成する(overrideTemplate, createAsync)

続いて実際にfixtureを作成します。

テスト用fixtureが準備できたので、このComponentをテンプレートを上書きしてDOMを作成します。

```ts
// itの部分だけ抜粋
it('なにかのテスト', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
  let template = '<div>Hello Angular2 :)</div>';
  return tcb.overrideTemplate(TestComponent, template)
    .createAsync(TestComponent)
    .then((fixture) => {
      // ここに検証コードを書く
    });
}));
```

`overrideTemplate`にComponentと上書きするテンプレートを渡して、`createAsync`を呼び出すと、実際にテストするfixtureが作成されます。

実際には、テンプレートにComponentやDirectiveを含めることが多いかと思います。
Angular1での`$compile(template)($rootScope)`とほぼ同じものだと考えて大丈夫です。
 
`TestComponentBuilder`で作成されたfixtureは`ComponentFixture`クラスなり、次のようなテストで利用するAPIが準備されています。

- debugElement
  - テスト用のHelperクラス
- componentInstance
  - TestComponentのインスタンス
- nativeElement
  - テスト用fixtureのHTMLElementを表す
- detectChanges()
  - テスト中にComponentを変更するために、Componentの変更検知サイクルを発火します。

よく利用するものについて紹介します。

- [ComponentFixture - js](https://angular.io/docs/js/latest/api/testing/ComponentFixture-class.html)

## fixtureを検証するAPI(nativeElement)

`nativeElement`はテスト用fixtureの`HTMLElement`を返すAPIです。
`HTMLElement`はHTML標準のAPIであるため、これを利用してテスト用fixtureを検証・操作します。

[HTMLElement - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)

```ts
// itの部分だけ抜粋
it('なにかのテスト', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
  let template = '<div>Hello Angular2 :)</div>';
  return tcb.overrideTemplate(TestComponent, template)
    .createAsync(TestComponent)
    .then((fixture) => {
      let div = fixture.nativeElement.querySelector('div');
      // HTMLElementを検証する
      expect(div).toHaveText('Hello Angular2 :)'); 
    });
}));
```

## fixtureを変更する(detectChanges)

`detectChanges()`は、Angular1の`scope.$digest()`に似ており、強制的にAngularへ変更を検知させる仕組みです。

Angular2内部ではAngular1の`dirty checking`に代わる独自の変更検知サイクルを持っています。
テストでClickイベントなどの非同期を利用する場合、この変更検知サイクルを発火してAngular2に変更を検知させる必要があります。

Angular2の変更検知サイクルについてはこの記事が詳しいです。

- [Change Detection in Angular 2 | Victor Savkin](http://victorsavkin.com/post/110170125256/change-detection-in-angular-2)

次のテストコードは、マウスが当たると文字色がredに変わるComponentのテストだと仮定します。

```ts
// ... describeの部分だけ抜粋
describe('DOMのテスト', () => {

  let mouseenter;

  beforeEachProviders(() => [TestComponentBuilder]);

  beforeEach(() => {
    // mouseenterイベントを定義します
    mouseenter = new MouseEvent('mouseenter', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
  });

  it('mouseenterするとredに変わること', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    let template = '<div>Hello Angular2 :)</div>';
    return tcb.overrideTemplate(TestComponent, template)
      .createAsync(TestComponent)
      .then((fixture) => {
        let div = fixture.nativeElement.querySelector('div');
        
        // mouseenterイベントを強制的に起こします
　　　　　div.dispatchEvent(mouseenter);

        // detectChangesしないと変更が検知されない
        expect(div.style.backgroundColor).toEqual('red'); // => NG
        fixture.detectChanges();
        expect(div.style.backgroundColor).toEqual('red'); // => OK
      });
  }));

});
```

## まとめ

DOMについてのテストは以上です。

DOMが関連するテストはやはり面倒ですね。メンバーの習熟度や学習コストを鑑みて、自動テストをしないという選択肢もありだと思います。
テストコードの全体像は、こちらで雰囲気をつかめると思います。

[_angular2-attribute-directive/highlight.directive.spec.ts at master · mitsuruog/_angular2-attribute-directive](https://github.com/mitsuruog/_angular2-attribute-directive/blob/master/app%2Fcomponents%2Fhighlight.directive.spec.ts)

今回の例では、検証にfixtureの`nativeElement`を利用していましたが、`debugElement`についてはまだ利用用途があまりはっきりとわかっていません。
機会があれば、もう少し掘り下げようかと思います。

- [DebugElement - js](https://angular.io/docs/js/latest/api/core/DebugElement-class.html)

### PR

こちらに初学者のためのMinimum starter kitを作成しましたので、ぜひ利用してください。

mitsuruog/angular2-minimum-starter: Minimum starter kit for angular2 https://github.com/mitsuruog/angular2-minimum-starter
