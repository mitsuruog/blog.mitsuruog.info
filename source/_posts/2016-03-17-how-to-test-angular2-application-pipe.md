---
layout: post
title: "Angular2 Unit Testing - Pipeのテスト"
date: 2016-03-17 1:29:00 +900
comments: true
tags:
  - angular
  - angular2
  - karma
  - jasmine
  - unit test
---

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2016/angular2-testing-logo.png %}

Angular2の実装の方法は記事をよく目にする機会が増えたので、テストについての自分が困らないように調べてみたシリーズ。

今回はPipeのテスト。

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

## Pipeのテスト

Pipeのテストについて紹介します。

Angular2のPipeはAngular1のfilterに相当するものです。
Linuxコマンドの`|(パイプ)`と同義で、入力内容をPipe内で(transform, replaceなど)処理し、結果を出力する単純なものです。

## Pipeのテストは至ってシンプル

文の区切りの最初の文字を大文字にするPipeをテストします。

```
例）
abc     => Abc
abc def => Abc Def
```

Pipeのコードはこちらです。

**init-caps.pipe.ts**
```ts
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'initCaps'
})
export class InitCapsPipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/(?:^|\s)[a-z]/g, (m) => m.toUpperCase());
  }
}
```

Pipeは単純なclassであるため、テストクラス内でインスタンスを生成してテストします。
至ってシンプルです。  

下の例では、`beforeEach`でテスト対象のPipeを読み込んでテストしています。

**init-caps.pipe.spec.ts**
```ts
import {
  describe,
  it,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {InitCapsPipe} from './init-caps.pipe';

describe('Test: InitCapsPipe', () => {

  let testee;

  beforeEach(() => {
    testee = new InitCapsPipe();
  });

  it('"abc"が”Abc”に変換されること', () => {
    expect(testee.transform('abc')).toEqual('Abc');
  });

  it('"abc def"が”Abc Def”に変換されること', () => {
    expect(testee.transform('abc def')).toEqual('Abc Def');
  });

  it('"Abc Def"は変換されないこと', () => {
    expect(testee.transform('Abc Def')).toEqual('Abc Def');
  });

});
```

ただし、Pipe内部でDIしているproviderがある場合は、`beforeEachProviders`で読み込んだ後に`inject`でDIする必要があるでしょう。

## まとめ

Pipeのテストは以上です。

Pipeは構造がシンプルなためテストも簡単です。テストの最初にトライするものとしては最適だと思います。
サンプルコードはこちらを参照してください。

[mitsuruog/_angular2_pipe](https://github.com/mitsuruog/_angular2_pipe)

### PR

こちらに初学者のためのMinimum starter kitを作成しましたので、ぜひ利用してください。
(もちろんテストもできます！！)

mitsuruog/angular2-minimum-starter: Minimum starter kit for angular2 https://github.com/mitsuruog/angular2-minimum-starter