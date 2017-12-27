---
layout: post
title: "RollbarのTelemetryがヤバすぎて恋に落ちるレベル"
date: 2017-12-27 0:00:00 +900
comments: true
tags:
  - rollbar
  - monitoring
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/rollbar04.png
---
私がフロントエンドの**障害監視**のために導入している、[Rollbar](https://rollbar.com/)というサービスの「Telemetry」という機能にかなり驚いたので紹介します。

ちなみに私はグローバルチームで働いている隠れRollbarエバンジェリストです。

## はじめに
私の場合、Rollbarを主にユーザーのWebブラウザで発生したエラーを収集するために利用しています。

Rollbarは、**今まで何が起きているか全くわからなかったユーザーのブラウザで起こったエラーを知ることができる可能性がある**という点において、自分の中では導入は必須という認識になっています。
(Rollbarには**無料枠がある**ため導入しない理由が正直見当たりません。)

そのため、自分が担当しているフロントエンド案件には、障害監視のためにRollbarを導入するようにしています。

最近「**Telemetry**」という機能が使えるようになったので、実際に運用しているサービスで有効にしたのですが、軽く衝撃を受けたので紹介したいと思いました。

## Telemetryでなにができるのか？

「Telemetry(テレメトリー)」とは、wikipediaの言葉を借りると、**遠隔測定**のことで観測対象から離れた地点から様々な観測を行い、そのデータを取得することです。

> [遠隔測定法 \- Wikipedia](https://ja.wikipedia.org/wiki/%E9%81%A0%E9%9A%94%E6%B8%AC%E5%AE%9A%E6%B3%95)

今回の場合は、ユーザーのブラウザ上で様々な観測を行い、そのデータをRollbarへ送信することです。
2017年12月のところ、次のようなデータを収集できるようです。

- `DOMContentLoaded`と`load`イベント
- ユーザーの行動(`click`と`input`イベント、SPA上での画面遷移)
- `xhr`や`fetch`のネットワークアクセスとレスポンスデータ
- `console.log`
- その他、Rollberへ任意に送信したメッセージ

下の画像は、あるエンドポイントを呼び出した際に400エラーが発生した時の実際のTelemetryデータです。
Telemetryを見ると、直前にユーザーがどのような行動をしていたかを把握することができます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/rollbar01.png %}

ちなみに、`textarea`の場合はその入力内容が`FormValue`として取得できるようです。
(ただし`input`で入力した中身は送信されないようで、Rollbar上では確認できませんでした。)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/rollbar02.png %}

個人的な感覚では、このTelemetryとあとで紹介する「**カスタムpayloadデータ**」を組み合わせることで、フロントエンドで発生したエラーの原因特定がかなり楽になりました。

## Telemetryの導入方法
Telemetryの導入については、[rollbar.js](https://github.com/rollbar/rollbar.js)のバージョンが「**2.0**」以上であれば自動で有効になります。もしTelemetryを収集したくない場合は、次のように`autoInstrument`を使って停止することができます。

```js
Rollbar.configure({
  ...
  // autoInstrumentはデフォルトでtrue
  autoInstrument: false,
  ...
});
```

また、このように`network`, `log`, `dom`, `navigation`, `connectivity`を使って部分的に停止することもができます。

```js
Rollbar.configure({
  ...
  autoInstrument: {
    network: true,
    log: true,
    dom: false,
    navigation: false,
    connectivity: true
  },
  ...
});
```

> [JavaScript Integration - Telemetry](https://rollbar.com/docs/notifier/rollbar.js/#telemetry)

## カスタムpayloadデータを設定する
Rollbarには、上の`configure`をつかってエラー情報を収集するpayloadにユーザーが任意のデータを追加することができます。

```js
Rollbar.configure({
  payload: {
    person: {},
    context: {},
    prettyUsefulData: {}
  }
});
```

> [JavaScript Integration - Payload](https://rollbar.com/docs/notifier/rollbar.js/#payload-1)

ここで設定したデータは「Telemetry」と同じように参照できるため、例えばページが開いた時に取得したバックエンドのデータなどを含めておいて、なにかあった時に参照するような用途で使えます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/rollbar03.png %}

## まとめ
Rollbarの「Telemetry」という機能についての紹介でした。

「Telemetry」でここまでできるということは、近いうちに**このログを元に実際の環境でもう一度再生できるようになる**と思います。

エラーが発生した場合、それを再現させるまでがどうしてもコストになってしまうため、[BrowserStack](https://www.browserstack.com/)や[Sauce Labs](https://saucelabs.com/)などのオンラインテストサービスと連携して、再現テストまで自動でできるようになったら嬉しいですね。

Telemetryの詳細については、これを書いた時と比べると変更があると思うので、公式のドキュメントを参照してください。場所はこちらです。

- [Introducing JavaScript Telemetry](https://rollbar.com/blog/introducing-javascript-telemetry/)
- [Telemetry](https://rollbar.com/docs/telemetry/)
