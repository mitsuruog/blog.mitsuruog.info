---
layout: post
title: "Angular1.X系をES6で書いてみたらちょっと残念だった話〜AngularJS ES6リファクタソンを終えて〜"
date: 2015-03-11 01:36:47 +0900
comments: true
tags:
 - AngularJs
 - es6
 - babel
 - jspm
---

2015/3/7に[MSakamaki](https://github.com/MSakamaki)氏に声を掛けられれて一緒にAngularJS ES6リファクタソンを開催しました。

内容は参加者が2〜3人のチームに分かれてES5で書かれたAngular1.3ベースのWebアプリを、ES6でリファクタするという企画です。
ES5のコードの中にクソコードを仕込んでおいて、ついでにリファクタしてくれるかなーなんて思いながら主催側ですが、一緒にリファクタして結構楽しかったです。

Angular1.3をES6でリファクタするポイントや、書き換えてみての所感とかまとめようと思います。  
(注 今回のコードは実験的な試みです。プロダクションコードに適用するかは自己責任でお願いします。)

[AngularJS ES6リファクタソン - AngularJs Japan User Group | Doorkeeper](https://angularjs-jp.doorkeeper.jp/events/21008)

<!-- more -->

{% img https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494866571/2015/angular-refactor.png %}

## Angular1.X系はES6と相性が悪い？？

始めにやってみた感じの所感を先に紹介すると、**ES6の新機能は非常に魅力的だけど、Angular1.X系のDIとの組み合わせ(特にModules)が、非常に相性が悪い** と思いました。
残念な部分も含めてES6へのリファクタのポイント紹介します。

## 環境周り

ES6にはまだブラウザ上で動作しない仕様もあるため、Babelを使ってES6で書いたコードをES5へコンパイルしました。また、最近Babelとセットで使われることが多いjspmを利用ました。

- [Babel · The transpiler for writing next generation JavaScript](https://babeljs.io/)
- [jspm.io - Frictionless Browser Package Management](http://jspm.io/)

リファクタソンの課題はこちらです。

- [MSakamaki/AngularEs6Son](https://github.com/MSakamaki/AngularEs6Son)

こちらがリファクタソンの内容を持ち帰って、私が書き直してみたコードです。今回紹介するコードはこちらのリポジトリにあります。全体を見たい場合はこちらを見てください。

- [mitsuruog/angular-es6](https://github.com/mitsuruog/angular-es6)

## controller

contorllerはES6のclassを使って置き換えます。

(client/app/list/list.controller.js)
```js
export default class ListController {

  constructor(BeanService, RegionsService) {
    this.beans = [];
    this.regions = [];
    this.beanService = BeanService;
    this.regionsService = RegionsService;
    // APIアクセス部分
    // Arrow Functionはthisを固定してくれるので、
    // promiseの中がthisと書けて非常に嬉しい
    this.beanService.query().$promise.then((data) => this.beans = data);
    this.regionsService.query().$promise.then((data) => this.regions = data);

  }
  // template側で利用する機能
  delete(id) {
    this.beanService.delete({
        id: id
      }).$promise
      .then(() => {
        this.beanService.query().$promise.then((data) => this.beans = data)
      });
  }

}
// Strict DI
ListController.$inject = ['BeanService', 'RegionsService'];
```

class内で再利用するObjectは一旦`this`に格納します。
`this`の利用頻度が多いですが、普段`controllerAs`でcontorllerを利用している人にとっては、あまり違和感なのではないでしょうか。
moduleへの登録は次のように行います。

(client/app/app.js)
```js
import ListController from './list/list.controller';

export var app = angular.module('Es6App', ['ui.router']);

// controllers
app.controller(ListController.name, ListController);
```
このあたりまではES6のArrow Functions・Classes・Modulesなどの新機能を使ってAngular1.X系でもいけるんじゃないかと思います。わたしにもそんなこと思っていた時期がありました。

ES6のClassとArrow Functionsは本当にいいですね。

## factory

factoryもcontollerと同様にclassを使って置き換えます。

(client/dataservices/beans/beans.service.js)
```js
export default class BeanService {

  constructor($resource) {
    return $resource('http://localhost:8000/api/beans/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

}
// Strict DI
BeanService.activate.$inject = ['$resource'];
```
moduleへの登録は次のように行います。

(client/dataservices/index.js)
```js
import BeanService from './beans/beans.service';

export var app = angular.module('Es6AppDataServices', ['ngResource']);

app.factory('BeanService', ($resource) => new BeanService($resource));
```
module登録の際にfactory Classをインスタンス化する必要があります。さらにDIの注入がある場合は、依存関係のモジュールを渡さなければなりせん。
Angular1.X系のDIの仕組みは、ES6のModulesとは相性が悪いようです。そこで、Classのインスタンスを返すstaticなfunctionを追加して次のように改善してみました。

(client/dataservices/beans/beans.service.js)
```js
export default class BeanService {

  constructor($resource) {
    ...
  }

  static activate($resource){
    BeanService.instance = new BeanService($resource);
    return BeanService.instance;
  }

}
// Strict DI
BeanService.activate.$inject = ['$resource'];
```
これでmoduleへの登録は少しスッキリします。

(client/dataservices/index.js)
```js
...

app.factory('BeanService', BeanService.activate);
```

## filter
filterも同様にclassで置き換えます。

(client/filters/regionName/regionName.filter.js)
```js
export default class regionName {

  constructor() {
    return (input, regions) => {
      let regionName = '';
      angular.forEach(regions, function(region) {
        if (region.id === input) regionName = region.name;
      });
      return regionName;
    }
  }

  static activate(){
    regionName.instance = new regionName();
    return regionName.instance;
  }

}
```
moduleの登録はfactoryと一緒なので省略します。

## directive
directiveも同じです。

(client/components/amountLabel/amountLabel.directive.js)
```js
export default class amountLabel {

  constructor() {
    // directiveの設定系
    this.templateUrl = 'components/amountLabel/amountLabel.html';
    this.restrict = 'EA';
    this.scope = {
      amount: '='
    };
  }

  link(scope, element, attrs) {
    if (scope.amount > 1000) {
      scope.styleClass = 'text-info';
    } else if (scope.amount <= 1000 && scope.amount > 500) {
      scope.styleClass = 'text-success';
    } else if (scope.amount <= 500) {
      scope.styleClass = 'text-danger';
    }
  }

  static activate() {
    amountLabel.instance = new amountLabel();
    return amountLabel.instance;
  }

}
```
moduleの登録はfactoryと一緒なので省略します。

## config
ConfigやrouterもES6のClassで置き換えてみます。

(client/app/app.config.js)
```js
export default class AppConfig {

  constructor($locationProvider) {
    // アプリ共通の設定系
    $locationProvider.html5Mode(true);
  }

  static activate($locationProvider) {
    AppConfig.instance = new AppConfig($locationProvider);
    return AppConfig.instance;
  }

}
// Strict DI
AppConfig.$inject = ['$locationProvider'];
```

(client/app/app.route.js)
```js
export default class AppRouter {

  constructor($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/list');
    $stateProvider.state('app', {
      abstract: true,
      url: '/#',
      template: `<div ui-view="header"></div>
        <div ui-view="contents" class="main"></div>
        <div ui-view="footer"></div>`
    })

	...

  }

  static activate($stateProvider, $urlRouterProvider) {
    AppRouter.instance = new AppRouter($stateProvider, $urlRouterProvider);
    return AppRouter.instance;
  }

}
// Strict DI
AppRouter.$inject = ['$stateProvider', '$urlRouterProvider'];
```
アプリのトップレベルのmoduleへの最終的な登録はつぎのとおりです。

(client/app/app.js)
```js
import angular from 'angular';
import 'angular-ui-router';

import AppConfig from './app.config';
import AppRouter from './app.route';

import ListController from './list/list.controller';

import '../filters/index';
import '../dataservices/index';
import '../components/index';

export var app = angular.module('Es6App', [
  'ui.router',
  'Es6AppFilters',
  'Es6AppDataServices',
  'Es6AppComponents'
]);
// 設定系
app.config(AppConfig.activate);
app.config(AppRouter.activate);
// controllers
app.controller(ListController.name, ListController);
```

## 課題

とりあえずES6に置き換えることはできそうですが、テスト周りについての変更点については、まだ検証できてません。
個人的にはテストのspecがES6で書けるだけでも嬉しいです！！

* Angular1.X系で良かった、テスタビリティがどれくらい犠牲にされているか。
	* ngMock
	* カバレッジ測定
	* E2E(protoractor)
* そもそもこの書き方でいいのか・・・

## さいごに

今や最も優れている(？)Angular1.X系。
2年後くらいにES6が主流になったとき、今のBackboneを見る時に感じるものと同じ感覚を覚えるのではないかと思いました。
また、来年にはAngular2が来ると言われているのですが、1.X系とは全く別物なんですよねー(白目)。

にしても、いつになったらフロントエンド開発のデファクトが定まるのか、まだまだJSフレームワークの長い旅は続きそうです。

### 参考

* [Using ES6 with Angular today](http://blog.thoughtram.io/angularjs/es6/2015/01/23/exploring-angular-1.3-using-es6.html)
* [Exploring ES6 Classes In AngularJS 1.x](http://www.michaelbromley.co.uk/blog/350/exploring-es6-classes-in-angularjs-1-x)
* [Writing AngularJS Apps Using ES6](http://www.sitepoint.com/writing-angularjs-apps-using-es6/)
* [Using ES6 Modules with AngularJS 1.3 — GoCardless Blog](https://gocardless.com/blog/es6-angular/)
* [gocardless/es6-angularjs](https://github.com/gocardless/es6-angularjs)
* [lukehoban/es6features](https://github.com/lukehoban/es6features)
* [yoheiMune/es6features(上の日本語訳)](https://github.com/yoheiMune/es6features)
