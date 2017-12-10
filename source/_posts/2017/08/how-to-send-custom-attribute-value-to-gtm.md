---
layout: post
title: "リンククリック時にカスタムデータをGoogle tag managerに送信する"
date: 2017-08-01 0:00:00 +900
comments: true
tags:
  - その他
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/tagmanager_email.png
---
Google tag managerを使った小ネタの紹介です。

<!-- more -->

## 想定ユースケース

特定のリンクをクリックした時にGoogle tag managerに何か特別な値も一緒に送りたい。

Google tag managerのクリックイベントハンドラでは、ページのURL・遷移先URL・リンクのラベルなどの基本的な情報は取れます。
しかし、それだけでは分析する上で十分ではない場合が多く、もう少し送信できるデータの種類を増やしたいと思うことは多いのではないでしょうか。

そんな時に利用できるのが、今回紹介する小ネタです。

## 手順

### リンクにCustom Attributeを設定する

対象のリンクに次のようにCustom Attribute(今回は`data-ga-custom-value`)を設定します。Attribute名は任意ですが、次のステップでも同じ値を利用する必要があります。

```
<a href="/jump/to/cool/web-site"
   data-ga-custom-value="何かのキャンペーンコードとか">Click</a>
```

### Google tag manager上でユーザー定義変数を定義する

次に、Google tag manager上でユーザー定義変数を定義するのですが、少しテクニックが必要です。

#### 変数のタイプは「カスタムJavaScript」とする

まず、変数のタイプは「カスタムJavaScript」とします。
これを設定することで、Google tag manager何かのイベントを検知したタイミングで任意のJavaScriptを実行して、その結果をユーザー定義変数に格納します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/gtm_1.png %}

#### Custom Attributeを取得するコードを設定する

続いて、Custom Attributeを取得するために次のコードを入力します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/gtm_2.png %}

実際のコードはこちらです。

```
function() {
  var el = {{Click Element}}
  var data = el.getAttribute("data-ga-custom-value");
  return data;
}
```

`{% raw %}{{Click Element}}{% endraw %}`は、Google tag manager上のビルトイン関数で、クリックしたElementのObjectを返します。

そのあとは、通常のJavaScriptの世界なので`getAttribute()`を使ってCustom Attributeの値を取得すればOKです。


### Google tag managerのタグにカスタム変数を設定する

最後に、Google tag managerのタグの設定の際に、ユーザー定義変数を利用すればOKです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/gtm_3.png %}

変数のリストの中に含まれています。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/gtm_4.png %}

## まとめ

自由にデータが送信できようになるので、やって見ると結構感動的でした。

「こんなことできたらいいなー。」と思っていたのですが、なかなか日本語の情報が見つからなかったのでまとめてみました。

- [Google Tag Manager event tracking using data attribute elements](https://www.thyngster.com/google-tag-manager-event-tracking-using-data-attribute-elements/)
