---
layout: post
title: "Angular2のPipeを使う上で開発者が知るべきたった1つのこと"
date: 2016-07-19 23:58:00 +900
comments: true
tags:
  - angular2
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/No_more.png
---
先日、学生向けにTodoワークショップを開催した時の話です。
Angular1のように`ngFor`とPipeを組み合わせて、リストのソート機能をつくろうとしたところ、初め上手く動かせませんでした。
StackOverFlowで解決策を見つけてなんとか動かすことはできたのですが、腑に落ちず後日改めて調べたところ、Pipeを使う上で知っておくべき事を知らなかったことに気づきました。

今回はPipeを使う上で、これだけは最低限知っておくべき内容について紹介します。

<!-- more -->

## tl;dr

- 開発者が知るべきたった1つのことは、**「Angular2のPipeには`pure`と`impure`の2種類がある」**ということ。
- `pure`Pipeが想定通りのタイミングで動作しない時は、`impure`を使ってみるのも手。
- ただし、Pipeでフィルタやソートを行うことはパフォーマンス上の懸念があるので、Componentにて行うことを推奨します。

英語が読める人は本家のドキュメントを読んでください。

- [Angular | Pipes - ts](https://angular.io/docs/ts/latest/guide/pipes.html)

## `pure`と`impure`の違い

まず、Pipeには`pure`と`impure`の2つあるのですが、デフォルトは`pure`です。2つの違いについて一言で表すとそれは**「Pipeが評価されるタイミング(反応するchange detection)」**の違いです。下にその違いについて示します。

 - pure
   - プリミティブ型(String, Number, Boolean, Symbol)の値が変わった時
   - オブジェクト型(Date, Array, Function, Object)の参照が変わった時
 - impure
   - 常に評価

ここで大事なのは`pure`では、オブジェクトや配列内部の変更は無視してしまうということです。(このことを本家では`pure change`と表現しています。)
これは常にDeep checkをすることを避け、パフォーマンスを向上させるために必要なことですが、うっかりこの事を知らないとPipeが想定通りの動きをしない事態が容易に起こりえます。

## `impure`Pipeの作り方

`impure`Pipeを作るためには、`@Pipe`宣言の部分でプロパティに`pure: false`を指定することでできます。

``` ts
@Pipe({
  name: 'impurePipe',
  pure: false
})
export class MyImpurePipe {}
```

非常に簡単なのですが、このとき「`pure`って何？」となるわけです。

### まとめ

では`impure`Pipeをガンガン使っていいのでしょうか？

本家のドキュメントに次の一文がありました。

> No FilterPipe or OrderByPipe

Pipeでフィルタやソートは行わないでくれと行っています。本家ではこれらの機能をComponent側に移動することを推奨しています。
理由の1つとしてフィルタやソートをPipeで行うために、必ず処理対象のオブジェクトの参照が必要となり、非常にコストが高い処理となり易いことが挙げられます。

Angular1の時代から`ng-repeat`とFilterを組み合わせてた場合、うっかり `n×n`の計算量となってしまい、パフォーマンス上の問題を出すことが多々ありました。
Angular2でも同様に、`ngFor`と`impure`Pipeをうっかり組み合わせることは避けた方がいいと言えます。

## おまけ

- Todoのワークショップ資料
  - [mitsuruog/angular2-todo-tutorial: TodoApp for Anguar2](https://github.com/mitsuruog/angular2-todo-tutorial)
- (とりあえず)参考にしたStackOverFlowの記事
  - [angular2 - How to apply filters to *ngFor - Stack Overflow](http://stackoverflow.com/questions/34164413/how-to-apply-filters-to-ngfor)
  - NgFor doesn't update data with Pipe in Angular2 - Stack Overflow http://stackoverflow.com/questions/34456430/ngfor-doesnt-update-data-with-pipe-in-angular2
