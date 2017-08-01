---
layout: post
title: "AngularJSでinput[type=date]にデータバインドしようとしてError: [ngModel:datefmt]で怒られて困っている人向けの小ネタ"
date: 2015-02-14 23:18:38 +0900
comments: true
tags:
 - AngularJs
 - webapi
---

タイトルの通りです。割と遭遇している人いるんじゃないかなと勝手に想像しているんですが、あまり情報ないので書いてみます。

ユースケース的には、WebAPIアクセスで日付をJSONシリアライズしたものを受け取って、input[type=date]のng−modelに直接データバインドするような想定です。

<!-- more -->

## サンプルコード

(適当に書いているので動かなかったらすみません。雰囲気だけでも。)

WebAPI側からJSONデータ
```json
{
  "id":1,
  "name": "ググレカス",
  "createdAt":"2015-02-05T00:00:00.000Z"
}
```

AngularJSのDataService的コード(今回はfactory)

```js
angular.module('app').factory('ggrks', function($resource) {
  return $resource('/api/ggrks');
});
```

AngularJSのController
```js
angular.module('app').controller('ggrksController', function($scope, ggrks) {
  // 初回データアクセス
  ggrks.query(function(data) {
    $scope.ggrks = data;
  });
});
```

AngularJSのテンプレート
```html
<input type="date" ng-model="ggrks.createdAt"/>
```

このまま実行すると、このようなエラーが発生します。しょぼーん。

```sh
Error: [ngModel:datefmt] Expected `2015-02-05T00:00:00.000Z` to be a date
 ....
```

## input[type=date]にセットするmodelはDate型でなければならない

公式ドキュメントをよく見ると書いてました。有効なISO-8601フォーマット(yyyy-MM-dd)と書いてますが、Javascript的にはDate型にParseしてセットしなければならないようです。

[AngularJS: API: input[date]](https://docs.angularjs.org/api/ng/input/input%5Bdate%5D)

WebAPIから受け取る日付はJSONシリアライズされているので、いちいちDate型にPerseしなければならないのか。。。本当に面倒くさい。

## 現在のベターな回答

いちいちControllerにてParseするのはナンセンスなので、DataService(factory)でParseすることにしました。

ビルトインの`$resource`サービスには、受け取ったレスポンスを変形させて後続処理に渡す`transformResponse`があるので、今回はこちらを使ってみました。  
(Backbone.ModelやCollectionの`parse`相当です。)

変更後のDataService的コード
```js
angular.module('app').factory('ggrks', function($resource) {
  return $resource('/api/ggrks', {
    query: {
      transformResponse: transformResponse
    }
  });

  // 受け取ったJSONをObjectにParseする
  function transformResponse(data) {
    data = angular.fromJson(data);
    data.createdAt = new Date(data.createdAt);
    return data;
  }
});
```

無理やり感がはんぱないですが、、、これで無事、input[type=date]に対して日付型をデータバインドさせることができました。  
[W3Cの仕様](http://www.w3.org/TR/html5/forms.html#date-state-(type=date)でも、日付として有効な文字列は自動的にParseされるようですし、できればフレームワーク側で判断してPerseして欲しいところですが。。。

これより良いやり方ご存知の方いらっしゃいましたら、ぜひ教えてください。

### 参考文献

* [javascript - How to set right date format for editable-date - Stack Overflow](http://stackoverflow.com/questions/26825433/how-to-set-right-date-format-for-editable-date)
* [javascript - Why is my date input field in AngularJS throwing type error? - Stack Overflow](http://stackoverflow.com/questions/26853173/why-is-my-date-input-field-in-angularjs-throwing-type-error)
* [Why is my date input field in AngularJS throwing type error? | Arianna](http://hiteshtwo.org/arianna/2015/01/20/why-is-my-date-input-field-in-angularjs-throwing-type-error/)

少し古いですがこちらに書かれている、dateInput用のカスタムdirectiveを作成する方法が良さそうな気がします。(未検証)

[javascript - Angular.js and HTML5 date input value -- how to get Firefox to show a readable date value in a date input? - Stack Overflow](http://stackoverflow.com/questions/18061757/angular-js-and-html5-date-input-value-how-to-get-firefox-to-show-a-readable-d)
