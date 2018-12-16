---
layout: post
title: "MQTTクライアントをブラウザ上で動かす"
date: 2015-02-05 23:41:35 +0900
comments: true
tags: 
 - mqtt
 - mows
 - Iot
 - wot
---

最近MQTTが気になっているので、実際にクライアントを作ってブラウザ上で動かしてみました。  
作ったデモは<http://mitsuruog.github.io/what-mqtt/>で動かすことが出来ます。  
内容薄い記事なので、デモだけも動かしてMQTTの雰囲気感じてもらえればと思います。

> ブラウザ上で動作するか検証するのが目的だったのですが、いざ作ってみたらWebページが思ったよりリッチになってしまいました。フロントエンド屋はそんなもんですよねーw

<!-- more -->

## MQTTとは

MQTTはPUB/SUB型のプロトコルで、従来のHTTPより軽量・省電力であることから、センサーなどの機器で永続的に発生する小さいデータを送受信する用途に向いているとされています。もともとはIBMが仕様を作っていました。

もうすでに[時雨堂さん](https://shiguredo.jp/news/20141209/)で商用化されてますし、MQTTは仕様自体が小さいため、良質な日本語の記事が多い印象です。
次に紹介する記事を読むとなんとなく全容がわかるかと思います。

* [IoTに最適化されたMQTTプロトコルとそれを実現する技術(PDF)](http://ngm2m.jp/m2m/files/symp2014_suzuki_pm.pdf)
* [MQTTについてのまとめ — そこはかとなく書くよん。](http://tdoc.info/blog/2014/01/27/mqtt.html)
* [Mosquitto(MQTT)を動かしてみた - 人と技術のマッシュアップ](http://tomowatanabe.hatenablog.com/entry/2014/04/21/095650)
* [初めての MQTT](https://gist.github.com/voluntas/89000a06a7b79f1230ab)
* [MQTTとJavaScript - @ledsun blog](http://ledsun.hatenablog.com/entry/2014/08/13/141908)

## Nodeで動かす

フロントエンドエンジニアが最も簡単にMQTTを動かすためには、Node.js上で[mqttjs/MQTT.js](https://github.com/mqttjs/MQTT.js)を使うのが一番簡単だと思います。モジュールを`npm install`して、少しスクリプトを書くと動きます。

```
npm install mqtt --save
```

hello_mqtt.js
```js
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
});

client.end();
```

## MQTT on Websocket

Node.js上では簡単に動作するMQTTですが、ブラウザ上で動作するためにはMQTTをWebsocketで置き換えて動かすのが一般的のようです。

* [MQTT over WebSockets](http://test.mosquitto.org/ws.html)
* [MQTT over Websockets with HiveMQ](http://www.hivemq.com/mqtt-over-websockets-with-hivemq/)

軽量で双方向通信を得意としているということで、Websocketと機能的に被るところがあると思っていたのですが、`Websocket vs MQTT`の関係ではなく、ブラウザ上では仲良く共存させるようです。  
> MQTTはTCP/IP上で動作してHTTPと同列なので、よく考えれば当然だったのですが。。。

Websocketの上をMQTTが走ることですべてのブラウザがMQTTデバイスになることができます。そんな凄い未来なのかイマイチ想像できませんが・・・今回は[mcollina/mows](https://github.com/mcollina/mows)を使いました。

```js
var mows   = require('mows');
var client = mows.createClient('ws://test.mosquitto.org:8080/mqtt');

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  // message is Buffer  
  console.log(message.toString());
});

client.end();
```

Node.jsで動かしたときとあまり大差ないですね。`mows`は内部的に`MQTT.js`のAPIをコールしています。  

注意する点としては接続先のプロトコルが`mqtt://`から`ws://`に変わっているとこでしょうか。Brokerによっては`mqtt://`と`ws://`での接続先ポートが異なる場合がありますので、ご注意ください。  
また、BrokerがWebsocketに対応している必要があります。

## まとめ

MQTTクライアントをブラウザ上で動かすにはWebsocketを使うという話でした。先日行われた[HTML5 Conference 2015](http://events.html5j.org/conference/2015/1/)でもIoT系のセッションが多く、今年のトレンドはIoT一色だなと感じています。

デモのWebページではmosquitto社が提供するテスト用のBrokerに接続しています。チャットアプリ程度ではまだMQTTの本当の価値って気付きにくいですが、ノード側で配置さえるセンサー機器を想像すると、Topicの考え方ってマッチしているなと思う次第です。  
一番身近なところではFacebook messengerでつかっているそうです。

こちらの記事も参考になりますよー。

* [IoT時代を支えるプロトコル「MQTT」（前編）：CodeZine](http://codezine.jp/article/detail/8000)
* [IoT時代を支えるプロトコル「MQTT」（中編）：CodeZine](http://codezine.jp/article/detail/8019)
* [IoT時代を支えるプロトコル「MQTT」（後編）：CodeZine](http://codezine.jp/article/detail/8020)
* [MQTT(本家)](http://mqtt.org/)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=1787287815&linkId=cc483ddd9d33ab4619dd61bfef53988b&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
    
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=B01N2AIBYT&linkId=7f696974c8dfce1893ea501ab5ce8c5f&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>