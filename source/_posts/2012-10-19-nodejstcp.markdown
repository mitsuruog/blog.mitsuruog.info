---
layout: post
title: "nodejsでTCPサーバ"
date: 2012-10-19 21:36:00 +0900
comments: true
tags:
 - nodejs
---

nodeｊｓはhttpのWebサーバだけではなく、TCPやUDPサーバも少ない行数で作ることができます。
今回はコマンドプロンプトを使った対話型のTCPサーバを作ってみました。

<!-- more -->

普通にhttpサーバいつも書いている人であれば、そんなに難しいところはないと思います。
3000ポートでlistenさせてます。

サーバ側

```js
var net = require('net');

var server = net.createServer(function(conn){
  console.log('server-> tcp server created');

  conn.on('data', function(data){
    console.log('server-> ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
    conn.write('server -> Repeating: ' + data);
  });
  conn.on('close', function(){
    console.log('server-> client closed connection');
  });
}).listen(3000);

console.log('listening on port 3000');
```

クライアント側

```js
var net = require('net');

var client = new net.Socket();
client.setEncoding('utf8');

client.connect('3000', 'localhost', function(){
  console.log('client-> connected to server');
  client.write('Who needs a browser to communicate?');
});

process.stdin.resume();

process.stdin.on('data', function(data){
  client.write(data);
});

client.on('data', function(data){
  console.log('client-> ' + data);
});

client.on('close', function(){
  console.log('client-> connection is closed');
});
```

実行すると次のようにコマンドプロンプトに表示されます。

```
At Server
------------------------------------------------------
listening on port 3000
server-> tcp server created
server-> Who needs a browser to communicate? from 127.0.0.1:51196
server-> hoehoe
 from 127.0.0.1:51196
server-> Hello!
 from 127.0.0.1:51196

server-> client closed connection（←クライアントからの切断）



At Client
------------------------------------------------------
client-> connected to server
client-> server -> Repeating: Who needs a browser to communicate?
hoehoe（←コマンドプロンプトからの入力）
client-> server -> Repeating: hoehoe

Hello!（←コマンドプロンプトからの入力）
client-> server -> Repeating: Hello!

client-> connection is closed（←サーバからの切断）
```

nodejsで作ると簡単ですね。
