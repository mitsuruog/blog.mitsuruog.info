---
layout: post
title: "AngularJSの$resourceの意外なハマりポイント"
date: 2014-12-16 20:00:00 +0900
comments: true
tags: 
 - angularjs
 - webapi
---

AngularJSを利用するメリットの1つとして、AngularJSが内包している[$resource](https://docs.angularjs.org/api/ngResource/service/$resource)を利用することで、バックエンドが提供するREST APIとの対話部分が簡潔に記述できることが挙げられます。

ところが、$resourceの表面的な振る舞いを理解しただけでは、意外なところにハマりポイントがあるものです。今日はその辺りを少し紹介します。

<!-- more -->

[AngularJS Advent Calendar 2014 - Adventar](http://www.adventar.org/calendars/350)16日目の記事です。

* 15日目[AngularJS - Promiseを使おう - Qiita(@teyosh)](http://qiita.com/teyosh/items/d7d3c17f954318c88882)
* 17日目[AngularJS 1.3へのアップデート(@kon.yuichi)](https://note.mu/konpyu/n/n1eb6c13c69d6)

## $resourceの使い方

> $resourceの細かい内容については[本家ドキュメント](https://docs.angularjs.org/api/ngResource/service/$resource)か[Qiita](http://qiita.com/search?utf8=%E2%9C%93&sort=rel&q=angular+%24resource)でググるといいと思います。  

$resourceにURLを渡すだけで以下のような基本的なWebAPIが実行できるようになります。$resourceを使う場合、`service`か`factory`の中で利用することがほとんどですね。

```
{ 
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'}
};
```

また、`PUT`や異なるエンドポイント(URL)など、先ほどの基本的なAPIをカスタムしたい場合は、`actions($resourceに渡す3つめの引数)`で使うことで簡単にAPIを追加できるので、使いこなすことが出来るとバックエンドとのWebAPI連携の部分で非常に重宝します。

**user.service.js**
```js
function User($resource) {
  return $resource('/api/user/:id', {
    id: '@id'
  }, {
    //PUT /api/user/:id
    updata: {
      method: 'PUT'
    },
    //GET /api/user/me
    me: {
      url: '/api/user/me'
    }
  });
});

angular.module('app').factory('User', User);
```

## "$resourceの戻り値は実際の値ではない、参照である。"というハマりポイント

> し、しらなかったぜ・・・

結論から言うと、$resourceの戻り値は**参照**なので、そこから直接プリミティブ型の値を取り出して他で使う場合には、タイミングによって`undefined`になったりならなかったりするということです。  
(ほとんどの場合、Objectをデータバインドして参照経由で実際の値を見ているので、あんまり問題にならないと思います。)

このハマりポイント、あまり遭遇するケースはないかも知れませんし、原因がわからないままなんとなく回避している人もいるかと思います。私の場合、ui-routerの`resolve`を使ってcontrollerで必要な情報を取得することが多かったため、よく遭遇していました。

**app.route.js**
```js
function Router($stateProvider){

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm',
      // ここでUserリストを事前に取得
      resolve: {
        user: function(User) {
          return User.get({
            id: 1 // ✌(-‿-)✌
          });
        }
      }
    });
    
}

angular.module('app').config(Router);
```

**main.controller.js**
```js
function MainCtrl(user, socket) {
  var vm = this;
  vm.user = user;

  // WebSocketのチャットルームに参加
  // [TODO]タイミングによってuser.roomIdがundefined
  socket.emit('chatRoom:join', {
    id: user.roomId
  });
}

angular.module('app').controller('MainCtrl', MainCtrl);
```

こちらのStack Overflowを参考にしたのですが、改めて[公式ドキュメント](https://docs.angularjs.org/api/ngResource/service/$resource#usage_returns)読むと書いてありましたね。

> It is important to realize that invoking a $resource object method immediately returns an empty reference  
> ($resourceを実行するとね、すぐに空の参照を返すから、心して使え。このボケがぁ！・・・超約)

[json - AngularJS using $resource service. Promise is not resolved by GET request - Stack Overflow](http://stackoverflow.com/questions/20008244/angularjs-using-resource-service-promise-is-not-resolved-by-get-request/20008380?stw=2#20008380)

## $resourceとの正しい(安全な)付き合いかた

より安全なコードの書き方は、$resourceが返すpromiseを、次のように`$promise`から取り出して処理すると安全です。

**main.controller.js**
```js
function MainCtrl(user, socket) {
  var vm = this;
  
  user.$promise.then(function(user) {
    vm.user = user;
    // WebSocketのチャットルームに参加
    socket.emit('chatroom:join', {
      id: user.roomId
    });
  });
}

angular.module('app').controller('MainCtrl', MainCtrl);
```

各コントローラでpromiseを処理するのが面倒な場合は、15日目[AngularJS - Promiseを使おう - Qiita(@teyosh)](http://qiita.com/teyosh/items/d7d3c17f954318c88882)で紹介されているような、promiseを処理するためのfactoryを作ってラップするといいと思います。  
(たしか、[AngularJSアプリケーション開発ガイド](http://www.amazon.co.jp/gp/product/4873116678/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873116678&linkCode=as2&tag=mitsuruog-22)のサンプルもそうなってたはず。)

<iframe src="http://rcm-fe.amazon-adsystem.com/e/cm?t=mitsuruog-22&o=9&p=8&l=as1&asins=4873116678&ref=qf_sp_asin_til&fc1=000000&IS2=1&lt1=_blank&m=amazon&lc1=0000FF&bc1=000000&bg1=FFFFFF&f=ifr" style="width:120px;height:240px;" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe>

## まとめ

今日は$resourceを使うと便利ですが、ちょっとハマるよという話をしました。

AngularJSはフロントエンドの実装を大変楽にしてくれるフレームワークです。しかし同時に、その裏でフレームワークが隠蔽している技術の難しさを軽視することはできないと改めて思い知りました。

今回のようなケースは、Javascriptの実装についてある程度の経験がないとあたりがつけにくい問題だったと思います。(ドキュメント読めは置いといて・・・)  
AngularJSに限らず、JSフレームワークを利用する場合は、チームの中に本当のJavascripter(Hackerともいう)がいるかが、成功の秘訣のような気がします。
