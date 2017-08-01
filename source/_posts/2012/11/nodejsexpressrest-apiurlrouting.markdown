---
layout: post
title: "nodejsとexpressでREST APIっぽいURLでroutingする方法"
date: 2012-11-07 22:52:00 +0900
comments: true
tags:
 - nodejs
 - express
---

nodejsでexpressを使ってroutingする際に、少し知ってるとREST APIっぽいURL設計でroutingできるので紹介します。

<!-- more -->

まず、基本編。

```js
var express = require("express"),
    http = require("http");

var app = express();
app.get('/content/*', function(req, res) {
    console.log(req.params);
    res.send(req.params);
});

http.createServer(app).listen(3000);
console.log('Express server listening on port 3000');
```

URLとそれを呼び出したときのreq.paramsの内容です。

```
http://localhost:3000/content/
http://localhost:3000/content/aaaa
http://localhost:3000/content/aaaa/bbbb

[ '' ]
[ 'aaaa' ]
[ 'aaaa/bbbb' ]
```

次にREST APIっぽく。

```js
var express = require("express"),
    http = require("http");

var app = express();
app.get('/products/:id/:operation?', function(req, res) {
    console.log(req.params);
    res.send(req.params);
});

http.createServer(app).listen(3000);
console.log('Express server listening on port 3000');
```

URLとそれを呼び出したときのreq.paramsの内容です。

```
http://localhost:3000/products/
http://localhost:3000/products/12
http://localhost:3000/products/12/edit
http://localhost:3000/products/12/delete
http://localhost:3000/products/delete

Cannot GET /products/
[ id: '12', operation: undefined ]
[ id: '12', operation: 'edit' ]
[ id: '12', operation: 'delete' ]
[ id: 'delete', operation: undefined ]
```

「:id」にreq.params[0]が「:operation」にreq.params[1]がセットされています。
実際には指定しているURLリテラルは、次で出てくるような正規表現に内部でコンパイルされるようです。

最後はURLに正規表現リテラルを指定する場合。

```js
var express = require("express"),
    http = require("http");

var app = express();
app.get(/^\/node?(?:\/(\d+)(?:\.\.(\d+))?)?/, function(req, res){
    console.log(req.params);
    res.send(req.params);
});

http.createServer(app).listen(3000);
console.log('Express server listening on port 3000');
```

URLとそれを呼び出したときのreq.paramsの内容です。

```
http://localhost:3000/node/
http://localhost:3000/node/10
http://localhost:3000/node/10..100

[ undefined, undefined ]
[ '10', undefined ]
[ '10', '100' ]
```

こんな感じで正規表現を使うと、ページ指定っぽいこともできます。

URLがばっちり決まるとAPI作ってるサーバサイドエンジニアもモチベーション上がりますね。（あくまで個人的感想です。）
