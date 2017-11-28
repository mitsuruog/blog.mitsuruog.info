---
layout: post
title: "BootstrapのModalにパラメータを渡す"
date: 2014-01-23 00:07:00 +0900
comments: true
tags:
 - bootstrap
---

[Bootstrap](http://getbootstrap.com/)の小ネタです。

[Bootstrap](http://getbootstrap.com/)には[Modal](http://getbootstrap.com/javascript/#modals)というダイアログを表示する機能が内包されています。このModalを表示する際にパラメータを渡す方法について調べました。
ユースケースとしては、一覧から詳細ダイアログを開く際にパラメータを渡す場合などでしょうか。

<!-- more -->

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/bootstrap-modal.png %}

Modalにパラメータを渡す方法は昔から議論されていて、最近まで変更がされているようです。Github上のIssueはこちら

Pass data arguments to modal? · Issue #531 · twbs/bootstrap
[https://github.com/twbs/bootstrap/issues/531](https://github.com/twbs/bootstrap/issues/531)

## 1. 3.0.3以前

3.0.3以前は以下のようにパラメータを渡すのですが、Modal初回構築時のパラメータで固定されてしまうため、一覧▶︎詳細のような用途では使えませんでした。

```js
$myModal = $('#myModal').modal({
  person: 'mitsuruog'
});

//2.3.1と3.0.0ではネームスベースが微妙に異なる

//2.3.1
$myModal.on('show', function(e) {
  var name = $(this).data('modal').options.person
};

//3.0.0
$myModal.on('show.bs.modal', function(e) {
  var name = $(this).data('bs.modal').options.person
}
```

## 2. 3.0.3以降

3.0.3以降では、以下の用にmodalを呼び出す際に、2つめのパラメータにセットすることで、イベントオブジェクトにセットされてくるように改善されています。

```js
//3.0.3以降
$myModal = $('#myModal').modal({}, {
  person: 'mitsuruog'
});

$myModal.on('show.bs.modal', function(e) {
  var name = e.relatedTarget.person;
}
```

これで、一覧▶︎詳細のような用途で使えるようになりました。

めでたし。めでたし。
