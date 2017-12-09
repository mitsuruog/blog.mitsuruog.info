---
layout: post
title: "Angular2でSharedServiceを作りたい"
date: 2016-02-29 00:35:00 +900
comments: true
tags:
  - angular
  - angular2
  - typescript
---

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/angular2.png %}

SPAを構築する場合、Componentをまたがったデータの共有をどのように実現するかが重要になってきます。  
Angular1の場合は、SharedServiceを利用するケースが多かったです。  
そこでAngular2でも試してみようとしたところ、少し勝手が違ったので自分用メモを残しておきます。

<!-- more -->

## 結論

- Angular2では基本的に`@Injectable()`のDIは新規のインスタンスを生成します。
- Singletonで扱いたい場合は、`bootstrap(.., [ServiceA,ServiceB])`でDIすること。

## サンプル

Angular2の公式ページでよく利用されるHeroListを例に説明します。

- 画面のcomponentは一覧(HeroListComponent)と詳細(HeroDetailComponent)の2つ。
- Hero一覧データはHeroServiceに格納され、各componentはHeroServiceを参照する。

簡単な図に示すとこのような構造をしていると仮定します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/IMG_20160229_001319.png %}

## 失敗パターン

すべてのサンプルはこちら  
[plnkr](http://plnkr.co/edit/R1q9vzDa1gHXHBUClu1s?p=preview)

失敗パターンでは、HeroDetailComponentにてHeroを削除しても消えません。  
これはHeroDetailComponentの`providers`でHeroServiceをDIした場合、新規でインスタンスを生成してしまうためです。
結果、HeroListComponentとHeroDetailComponentでは、別のHeroServiceのインスタンスを参照していることになっています。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/IMG_20160229_001409.png %}

HeroDetailComponentで`@Component`をDIしている箇所を抜粋します。

**hero-detail.component.ts**
```ts
import {Component,  Input}  from 'angular2/core';
import {Hero, HeroService}   from './hero.service';

@Component({
  selector: 'hero-detail',
  template: `
  <span class="badge">{{hero.id}}</span> {{hero.name}}
  <button (click)="remove()">remove</button>
  `,
  providers:  [HeroService]  // <- ここ
})
export class HeroDetailComponent implements OnInit  {
  @Input() hero: Hero;
  constructor(private service:HeroService){ }
  remove() {
    this.service.remove(this.hero);
  }
}
```

## 成功パターン

すべてのサンプルはこちら  
[plnkr](http://plnkr.co/edit/iYFMhuldCBqay72eWjay?p=preview)

こちらはSharedServiceとして動作しているパターンです。`bootstrap(.., [ServiceA,ServiceB])`でHeroServiceを指定することでSingletonとして扱うことができます。  
HeroDetailComponentでHeroを削除した場合、HeroListComponentの一覧も消えます。

**main.ts**
```ts
import {bootstrap}        from 'angular2/platform/browser';
import {Hero, HeroService}   from './heroes/hero.service';
import {AppComponent}     from './app.component';

bootstrap(AppComponent, [HeroService]);
```

## まとめ

Angular1っぽいSharedServiceの作り方でした。  
正直、Two-way-bindingとSharedServiceを利用した、手続き型っぽいやり方がAngular2で最良の方法がどうかはわかりません。  
Angular2でのベストプラクティスについてはまだ手探りな感じがします。

とはいえ、Angular1を慣れている方であれば、Angular2でもComponent間のデータ共有はSharedServiceでできることが分かりました。

refs [Angular2 "Services" how to @inject one service into another (singletons) - Stack Overflow](http://stackoverflow.com/questions/33575456/angular2-services-how-to-inject-one-service-into-another-singletons)
