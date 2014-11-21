---
layout: post
title: "nodejsでTCPサーバ"
date: 2012-10-19 21:36:00 +0900
comments: true
categories: 
 - nodejs
---

nodeｊｓはhttpのWebサーバだけではなく、TCPやUDPサーバも少ない行数で作ることができます。
今回はコマンドプロンプトを使った対話型のTCPサーバを作ってみました。

<!-- more -->

普通にhttpサーバいつも書いている人であれば、そんなに難しいところはないと思います。
3000ポートでlistenさせてます。

サーバ側

{% gist 3910559 tcp_server.js %}

クライアント側

{% gist 3910559 tcp_client.js %}

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