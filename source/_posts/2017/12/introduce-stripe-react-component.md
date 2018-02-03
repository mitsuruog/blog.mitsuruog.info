---
layout: post
title: "StripeをReactで作られたサービスに組み込んでみた話"
date: 2017-12-02 0:00:00 +900
comments: true
tags:
  - react
  - stripe
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/react-stripe.png
---
この記事は[Stripe Advent Calendar 2017 \- Adventar](https://adventar.org/calendars/2339react-stripe-elements)2日目の記事です。

自分がフロントエンドをやっている、オンラインプログラミング学習サービス[CODEPREP](https://codeprep.jp/)に、[Stripe](https://stripe.com/)決済を組み込んでみた時の話です。

> (注意)CODEPREPは**2018年1月4日をもってプレミアム会員プランを停止した**ため、このページはもう見ることはできません。

<!-- more -->

## はじめに
CODEPREPはReactで作られているので、こちらのReactコンポーネントを使ってみました。

- [stripe/react\-stripe\-elements: React components for Stripe\.js and Stripe Elements](https://github.com/stripe/react-stripe-elements)

> 自分がやったのは2017年07月くらいなので、一部内容が最新ではないものがあります。ご注意ください。

仕上がりはこんな感じです。
スタイル周りのカスタマイズが結構できたので、サービスに溶け込ませるように組み込むことができました。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/stripe-1.png %}

## 導入方法

> 紹介するコード概念を説明するものなので、そのままでは動かないかもしれません。ご注意ください。

導入方法は`npm install --save react-stripe-elements`してから、Reactコンポーネントを使っていきます。

### StripeProviderでアプリケーションをラップする
まず最初に`StripeProvider`でアプリケーションのルートコンポーネントをラップします。
この時に`apiKey`にアプリケーションアクセスキーを設定してください。

```
// index.jsx
import React from 'react';
import { render } from 'react-dom';
import { StripeProvider } from 'react-stripe-elements';

import Main from './Main.jsx'

const App = () => {
  return (
    <StripeProvider apiKey="<YOUR_APP_KEY>">
      <Main />
    </StripeProvider>
  );
};

render(<App />, document.getElementById('root'));
```

## Elementsで支払いフォームをラップする
次に`Elements`で支払いフォームをラップします。`Elements`は、Stripeの入力フォームをグルーピングするために利用するコンポーネントのようです。

```
// myCheckout.jsx
import React from 'react';
import { Elements } from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm.jsx'

class MyCheckout extends React.Component {
  render() {
    return (
      <Elements>
        <CheckoutForm />
      </Elements>
    );
  }
}

export default MyCheckout;
```

## injectStripeで支払いフォームをラップする
さらに`injectStripe`で支払いフォームをラップします。

`injectStripe`は、Stripeの入力フォームの様々な入力イベントを処理するために利用する**Higher-Order Component(HOC)**です。

公式ドキュメントでは、`injectStripe`は`Elements`と**一緒に使えない**ことになっているので、何も考えず`Elements`と`injectStripe`を使うコンポーネントを2つに分けた方がいいです。

```
// checkoutForm.jsx
import React from 'react';
import { injectStripe } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  render() {
    return (
      <form>
        ここに入力フォームが入る
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
```

## カード情報入力フォームを配置する
最後にカード情報入力用のコンポーネントを配置していきます。

StripeのReactコンポーネントには、All-on-one型の`CardElement`と、これらを別々に分割した`CardNumberElement`, `CardExpiryElement`, `CardCVCElement`があります。

自分の場合は、レイアウトを自由にしたかったので、別々に分割されたコンポーネントを利用しました。

かなりラフですが。。。入力部品を配置したらこのような感じになると思います。
```
// checkoutForm.jsx
import React from 'react';
import { injectStripe } from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  render() {
    return (
      <form>
        <CardNumberElement />
        <CardExpiryElement />
        <CardCVCElement />
        <button>支払い</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
```

これで導入については終わりです。次からは細かなイベントハンドリング方法やカスタマイズについて紹介します。

## 入力フォームのイベントハンドリング
入力フォームのイベントハンドリング方法について紹介します。

### フォームの入力チェック
フォームの入力チェックはStripeの入力コンポーネントの`onChange`にハンドラを設定して処理します。

```diff
// checkoutForm.jsx

...

class CheckoutForm extends React.Component {
+  constructor(props) {
+    super(props);
+    this.handleChange = this.handleChange.bind(this);
+  }

  render() {
    return (
      <form>
-        <CardNumberElement />
+        <CardNumberElement onChange={this.handleChange}/>
        <CardExpiryElement />
        <CardCVCElement />
        <button>支払い</button>
      </form>
    );
  }

+  handleChange(data) {
+    if (!data.complete) {
+      // ERROR
+      console.log(data.error.message);
+    }
+  }
}
```

onChangeハンドラには次のようなStripeのデータオブジェクトが渡されてくるので、これを元にエラーかどうか判断します。

```
{
  brand: "amex",
  complete: false,
  empty: false,
  error: {
    code: "invalid_number",
    message: "カード番号が無効です。",
    type: "validation_error"
  },
  value: undefined
}
```
エラーかどうかは`complete`を、メッセージは`error.massage`を見ればいいと思います。

注意点としては、このオブジェクトは入力フィールド単体で送られてくるので、フォーム全体を管理するためには別途Stateなどを使って状態を管理する必要があるということです。
ちょっと泥臭い実装ですが、自分はそれぞれの入力フォームのハンドラを別に定義して処理しました。

## フォームの送信処理
フォームの送信処理は、フォームの`onSubmit`にハンドラを設定して処理します。

> 現在のところフォーム送信処理は`PaymentRequestButtonElement`を使った方がエレガントかもしれません。

Stripeへの支払い処理には`stripe.createToken`を呼び出して、カード情報と支払い情報をStripe上に登録する必要があります。処理が完了すると、Stripeはトークンを発行するのでこれをバックエンドのデータベースなどに保存しておきます。

`stripe.createToken`は`injectStripe`で設定されるオブジェクトです。`injectStripe`でラップされたコンポーネントは`props`からこのオブジェクトを利用することが可能です。

```diff
// checkoutForm.jsx

...

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
+    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
-      <form>
+      <form onSubmit={this.handleSubmit}>
        <CardNumberElement onChange={this.handleChange}/>
        <CardExpiryElement />
        <CardCVCElement />
        <button>支払い</button>
      </form>
    );
  }

  handleChange(data) {
    if (!data.complete) {
      // ERROR
      console.log(data.error.message);
    }
  }

+  handleSubmit(e) {
+    // ここにバリデーション処理
+   
+    this.props.stripe.createToken().then(result => {
+      if (result.error) {
+        // ERROR
+        console.log(result.error.message);
+        return;
+      }
+      // ここで取得したトークンをバックエンドに送信して完了！！
+      console.log(result.token);
+    });
+  }
}
```

## スタイルのカスタマイズ方法
Stripeのコンポーネントはスタイルをカスタマイズすることが可能です。これを行うことで、サービスに溶け込ませるようにStripeを組み込むことができます。

自分の場合は、バリデーションエラーのスタイルをカスタマイズする必要がありました。なので、この手順はほぼ必須かと思います。
最初やり方がわからなかったのでStack Overflowで聞いてみました。

- [reactjs \- How can I put border styling with react\-stripe\-elements input component? \- Stack Overflow](https://stackoverflow.com/questions/43974321/how-can-i-put-border-styling-with-react-stripe-elements-input-component)

実際にrenderされた後のコードを見るとわかるのですが、Stripeのコンポーネントは`.StripeElement`というスタイルを持つDOMにラップされています。

`.StripeElement`はCSS命名規則のBEMに則ったいくつかの状態(modifier)を持つので、これらのスタイルを変更することでカスタマイズか可能です。

```
.StripeElement {
  border: 1px solid #eee;
}

.StripeElement--invalid {
  border: 1px solid red;
}

.StripeElement--focus {
  border: 1px solid blue;
}
```

こんな感じでスタイルをカスタマイズできます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/stripe-2.png 400 %}

> 現在は、`Elements`の`style`にCSSスタイルをセットするとスタイルが適用されるようです。便利。
> - https://stripe.com/docs/stripe-js/reference#element-options

## まとめ
自分がStripeを導入した時の手順でした。
2017年7月にやったのですが、既にいくつかやり方が古くなってるものがありますね。

アップデートが早いようなので、実際に組み込む前に公式のドキュメントを確認した方が良さそうです。
- https://github.com/stripe/react-stripe-elements
- https://stripe.com/docs/stripe-js/reference

### おまけ
導入当時はJCBに対応してなかったので、Stripeが対応してくれた時はチーム全員で大喜びしました。懐かしい記憶です。

> (Slackのログを確認したら、2017-08-22の出来事のようですね)
> {% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/stripe-3.png 350 %}
