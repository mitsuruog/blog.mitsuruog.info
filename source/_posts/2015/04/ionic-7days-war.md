---
layout: post
title: "Androidアプリ開発初心者がionicでアプリを作って公開するまでの7日間の道のり"
date: 2015-04-17 23:30:00 +0900
comments: true
tags:
 - cordova
 - ionic
 - Android
---

[Ionic](http://ionicframework.com/)でAndroidアプリを初めて作って公開してみました。

ionicで開発自体はAngularJSベースということもあり、結構スムーズだったのですが、開発以外の部分で意外とハマったので、その辺り紹介しようと思います。

<!-- more -->

作ったアプリはこちらです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/hello-ionic-1-1.png %}

~~ダウンロードはこちら(現在は配布しておりません)~~

はい、千葉のローカルバスのアプリです。

では、早速本題へ。

## ionicでアプリscaffoldの作成

まず、ionicの概要についてご存知ない方はこちらを参照してください。

[キミはionicを知っているか？AngularJS+PhoneGap+美麗コンポーネント群！ | HTML5Experts.jp](https://html5experts.jp/canidoweb/7359/)

最初にionicを使ってアプリscaffoldを作成します。こちらは公式サイトの手順通りに行えばいいと思います。

[Getting Started with Ionic - Ionic Framework](http://ionicframework.com/getting-started/)

```sh
$ npm install -g cordova ionic
$ ionic start <アプリ名> tabs
$ cd <アプリ名>
$ ionic platform add android
$ ionic serve
```

最後の`ionic serve`すると、アプリのwebview部分がブラウザ上で表示されますので、比較的単純なデバックはこちらで行いながら開発していきます。

### パッケージ名の変更

ionicコマンドでアプリscaffoldの作成した場合は、必ず`config.xml`の`<widget id="">`のパッケージ名を変更してください。  
デフォルトでは`com.ionicframework.<アプリ名+乱数>`のような形式になっています。
これは後でストア公開するときのアプリの公開IDになります。ストア公開後は変更できませんので必ず変更するようにしてください。

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="com.mitsuruog.transitbus"
  version="0.0.1" xmlns="http://www.w3.org/ns/widgets"
  xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name>アプリ名</name>

  ...(省略)

```

## ionicでのアプリ開発

ionicはAngularJSベースですので、UI部分の開発は比較的AngularJSの知識が流用できます。  
今回は、Cordovaで利用頻度の高いpluginをAngularJSのモジュールでラップして使いやすくした、`ngCordova`を利用しました。

[ngCordova - Simple extensions for common Cordova Plugins - by the Ionic Framework Team - by the Ionic Framework Team](http://ngcordova.com/)

導入は、ngCordovaのbowerモジュールをインストールして、トップレベルのAngularJSモジュールで宣言すると利用できます。

```sh
$ bower install ngCordova --save
```

**app.js**

```js
angular.module('yourApp', ['ionic', 'ngCordova']);
```

ngCordovaのそれぞれのpluginを利用するためには、別途Cordovaコマンドにてpluginをインストールする必要があります。詳しくは公式サイトを参照してください。

[ngCordova - Document and Examples - by the Ionic Framework Team](http://ngcordova.com/docs/plugins/)

### 実機での実行、デバック(webview)

実機での実行とデバックは、USBケーブルでAndroid端末の実機とPCを接続してから下のコマンドを実行すると、実機上にアプリがビルドされて実行されます。

```sh
$ ionic run android
```

webviewデバックについては、Chromeを立ち上げて`chrome://inspect`することで、実機上のWebViewを直接インスペクトすることができます。

手前味噌ですが、以前こんな記事を書いてます。

[Androidやってる人でChromeDevtoolsのRemote DebuggingとScreencasting知らない人は使ってみた方がいいよ！ - I am mitsuruog](http://blog.mitsuruog.info/2013/12/androidchromedevtoolsremote.html)

### ionicテーマのカスタム

ionicのスタイルは`Sass`で出来ていて、テーマ部分は`_variables.scss`に入っています。上書き用の`.scss`を書いてコマンドを実行すると上書きすることができます。

[Writing a Sass Theme | Formulas | Learn Ionic](http://learn.ionicframework.com/formulas/working-with-sass/)

通常は、`./scss/ionic.app.scss`にカスタム用のscssファイルがあるので、こちらにカスタムする内容を書いていきます。Sassの環境構築についてはこちらを参照してください。

[Ionic CLI - Using Sass | Ionic Framework](http://ionicframework.com/docs/cli/sass.html)

[Sass: Syntactically Awesome Style Sheets](http://sass-lang.com/assets/img/illustrations/glasses-2087d741.svg)

コマンドの例はこちらです。

```sh
$ sass --watch scss/ionic.app.scss:www/css/ionic.app.css
```

これをプロジェクトのトップレベルで実行すると、`scss/ionic.app.scss`を参照して、`www/css/ionic.app.css`に上書き用のCSSを生成してくれます。  
`index.html`で、このCSSを読み込むとテーマをカスタムすることができます。

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title></title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above -->
    <link href="css/ionic.app.css" rel="stylesheet">

    ...(省略)

```

あとは、ガツガツ開発していきます。

PCのブラウザ上では正しく表示されているけど、実機だと表示できない・・・  
といった事がよくありますが、気にせず頑張ってください。  

その辺りの微妙な不安感を楽しめるかどうかが、ionicと仲良くなるコツです。(うーん、アプリ開発全般で言えることか・・・)

ちなみに、プラットフォームで表示に差異が生じた場合は、CSSを上書きするようなパッチを当てます。  
ionicではプラットフォームごとに、`platform-android`のようなCSSクラスを付与しているので、以下のように追加でCSSを書きます。

```css
.platform-android .hoge {
  color: red;
}
```

### アイコン&スプラッシュイメージ

ionicには、プラットフォームでサイズがまちまちで作成が面倒なアイコンやスプラッシュイメージを、ベースのイメージから自動生成する仕組みが備わっています。

[Automating Icons and Splash Screens | The Official Ionic Blog](http://blog.ionic.io/automating-icons-and-splash-screens/)

`resources/android`フォルダの直下にアイコンであれば`icon.png`、スプラッシュイメージであれば`splash.png`を作成して置いてください。
(iosであれば`resources/ios`に置いてください)

以下のコマンドを実行すると、各プラットフォームごとに画像を生成してくれて、`config.xml`まで書き換えてくれます。超便利。

```sh
$ ionic resources
```

ちなみに、アイコンはこちらから探してきました。

[Clipart - High Quality, Easy to Use, Free Support](https://openclipart.org/)

### google analyticsの導入

Webサイト同様にアプリでもユーザーの行動を分析したいので、google analyticsを導入します。
ngCordovaにはGoogleAnalytics用のpluginがありますが、今回はAndroid Native SDK v4対応の別のものを使いました。

[cmackay/google-analytics-plugin](https://github.com/cmackay/google-analytics-plugin)

```sh
$ cordova plugin add com.cmackay.plugins.googleanalytics
```

初期化には少し注意する必要があるので、こちらを参照してください。(使ってるライブラリ微妙に違うけど、雰囲気わかってくれるはず。)

[Using Google Analytics With IonicFramework](https://blog.nraboy.com/2014/06/using-google-analytics-ionicframework/)

Viewの切り替え時などは、ionicの`ion-view `のライフサイクルイベントをハンドルしてトラッキングします。

**controller.js**

```js
$scope.$on('$ionicView.beforeEnter', function() {
  navigator.analytics.sendAppView('view名');
});
```

どのバス停が人気があるかとか、こっそりトラッキングしてニヤニヤしてます。  
ちゃんと真面目にエラーのスタックトレースも取得してます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/hello-ionic-2-2.png 500 %}

> モバイルアプリのトラッキングはGoogle Analytics上のアナリティクス設定で新しいプロパティを作成する際に、トラッキングの対象を「モバイルアプリ」にしてください。(普段、Webページのトラッキングをやっているので、最初うっかりハマってしまいました。)


## 公開準備

アプリの作成が完了しましたので、公開するための準備を行います。

### アプリのビルド

アプリが出来上がったので、リリース用にビルドします。手順は公式サイトを参照してください。

[Publishing your app - Ionic Framework](http://ionicframework.com/docs/guide/publishing.html)

まず、アプリをリリースビルドします。

```sh
$ cordova build --release android
```

これで、`platforms/android/ant-build/MainActivity-release-unsigned.apk`というファイルが生成されます。  
これはunsigned APK(署名なしAPK)と呼ばれるもので、このままだとPlay storeに公開できません。

次に署名を作成します。`keytool`コマンドでprivate keyを生成します。  
この手順は初回1回のみです。生成されたprivate keyはズッ友なので無くさないように。。。

```sh
$ keytool -genkey -v -keystore <あなたのKeyの名前>.keystore
  -alias <エイリアス名> -keyalg RSA -keysize 2048 -validity 10000

姓名は何ですか。
  [Unknown]:  
組織単位名は何ですか。
  [Unknown]:  
組織名は何ですか。
  [Unknown]:  
都市名または地域名は何ですか。
  [Unknown]:  
都道府県名または州名は何ですか。
  [Unknown]:
この単位に該当する2文字の国コードは何ですか。
  [Unknown]:
CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknownでよろしいですか。
  [いいえ]:  y
```

この例だと、10,000日間有効な2,048ビットのRSAの鍵ペアと自己署名型証明書(SHA256withRSA)を生成するらしい。

次に、`jarsigner`コマンドを使って、APKを署名します。

```sh
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1
  -keystore <あなたのKeyの名前>.keystore platforms/android/ant-build/MainActivity-release-unsigned.apk <エイリアス名>

キーストアのパスワードを入力してください:
   追加中: META-INF/MANIFEST.MF
   追加中: META-INF/TRANSITB.SF
   追加中: META-INF/TRANSITB.RSA
  署名中: AndroidManifest.xml
  署名中: assets/_where-is-www.txt
  署名中: assets/www/app/animation.css
  署名中: assets/www/app/app.constant.js

...

  署名中: res/xml/config.xml
  署名中: resources.arsc
  署名中: classes.dex
jarは署名されました。

警告:
-tsaまたは-tsacertが指定されていないため、このjarにはタイムスタンプが付加されていません。タイムスタンプがないと、署名者証明書の有効期限(2042-09-01)後または将来の失効日後に、ユーザーはこのjarを検証できない可能性があります。
```

最後に`zipplugin`コマンドでAPKをzip化します。

```sh
$ zipalign -vf 4 platforms/android/ant-build/MainActivity-release-unsigned.apk <アプリ名>.apk

Verifying alignment of transitbus.apk (4)...
      50 META-INF/MANIFEST.MF (OK - compressed)
    7366 META-INF/TRANSITB.SF (OK - compressed)
   14812 META-INF/TRANSITB.RSA (OK - compressed)
   15959 AndroidManifest.xml (OK - compressed)
...

 2413084 resources.arsc (OK)
 2415741 classes.dex (OK - compressed)
Verification succesful
```

コマンドを実行した直下にapkファイルができているので、これをplayストアにうpすればいい。

[Androidにおいてなぜzipalignをやる必要があるのか - Qiita](http://qiita.com/kazuqqfp/items/8eae69e309c6ed75d661)

### ストア公開用アイコン&宣伝画像

まず、ストア公開用アイコンと宣伝画像ですね。正直、デザインセンスや画像編集ツール慣れてない身としては、ここが一番コストがかかったとこです。

画像編集ツールはいろいろ試して悩んだ結果。。。

[Keynote](https://www.apple.com/jp/mac/keynote/)が最も使いやすかったので使っていますw。
プレゼンテーション用のソフトなんですが、画像編集も便利
です。

アプリのデバイス枠はめ込み画像はこちらで作成できます。

[Device Art Generator | Android Developers](http://developer.android.com/distribute/tools/promote/device-art.html)

### ストア公開用スクリーンショット

続いてはスクリーンショットですが、個人だと手持ちの端末が1機種しかないので、タブレットとかの画像がエミュレータで実行したものを利用します。

エミュレータはGenymotionを使っています。

[Genymotion](https://www.genymotion.com/#!/)

導入はこちら。スクリーンショット撮るときにAndroid Studioの「Android Device Monitor」を使いますので、一緒にセットアップしておきます。

[Genymotion + Android Studio on Mac - Qiita](http://qiita.com/Sam/items/8d551f575b617fa0be7e)

Genymotion上に作成したapkファイルをどうインストールするか、少し悩んだのですが、起動したGenymotionのエミュレータに対してapkファイルをドラッグするとインストールできます。

エミュレータでのスクリーンショットですが、Genymotionから取得する場合は有料プランの機能のようです。  
そこで、下の記事のようにAndroid Device Monitorから実行中のエミュレータをアタッチすることで、スクリーンショットを取得することにしました。

[android emulator - Capture screenshot in GenyMotion - Stack Overflow](http://stackoverflow.com/questions/21771416/capture-screenshot-in-genymotion)

エミュレータが実行されている状態でAndroid Device Monitorを起動します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/hello-ionic-3-1.png %}

実行中のデバイスが表示されるので、「Screen capture」ボタンをクリックします。キャプチャ用の別画面が立ち上がります。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/hello-ionic-3-2.png %}

> 他に良い方法あれば教えてください。。。

## 公開

で、いろいろ揃えてストア公開しよう！と思ったら。。。

[Google Play デベロッパー コンソール - 基本事項 - Google Play デベロッパー ヘルプ](https://support.google.com/googleplay/android-developer/answer/6112435?hl=ja)

1回登録すればOKです。$25です。あ、はい。

というわけで無事公開できましたー。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2015/hello-ionic-3.jpg 320 %}


## 最後に

作るのに4日。そこから公開まで3日くらいかかりました。  
1日フルで使えた日はないので、実質はもう少し少ないと思いますが、予想より公開準備の部分のコストが掛かったと思います。  
初期の学習コストだと思うので次回以降は半分くらいになると思いますが。。。

普段やっているWebと違って、アプリの世界は結構大変ですね。

いつもエンジニアとしてアプリの機能を開発していますが、このように1から自身の手でやってみると、世の中に出ている素晴らしいアプリを作成する裏側でどれくらいの労力が掛かっているか、実感できてよかったです。

特にデザイン周りでは苦労しましたし、デザインスキルを持っている人は本当に素晴らしい。貴重な才能だなと思います。  
また機会があったら作ってみたいと思います。

ではではー。
