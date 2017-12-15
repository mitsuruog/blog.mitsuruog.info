---
layout: post
title: "Webセキュリティ・ハンズオン 〜攻撃して学ぶ、HTML5のセキュリティ〜に参加してみた話"
date: 2015-03-23 00:49:22 +0900
comments: true
tags:
 - HTML5
 - Security
 - xss
 - cordova
---

3/21に[Webセキュリティ・ハンズオン 〜攻撃して学ぶ、HTML5のセキュリティ〜](https://firefox-os.doorkeeper.jp/events/21218)に参加してきました。

セキュリティ業界のガチ勢を目の前に、最近のWebのセキュリティについて自分はまだまだ素人だと思い知りました。
いろいろ収穫のあったので忘れないうちにまとめておきたいと思います。

企画・運営していただいた方々、本当にありがとうございました。

<!--  more -->

## 発見した脆弱性

まず、今回の課題は架空のSNSサービスを題材としたもので、フロント側とサーバー側の両方に脆弱性があるものでした。
私が参加したチームは猛者しかいなかったので、たくさんの脆弱性を見つけることができました。  
(私ではなく、チームのメンバーが発見したものがほとんどです。)

主にフロント側の脆弱性を中心に、思い出せる範囲だけ紹介したいと思います。

### 管理画面への侵入、及び管理者への昇格

> これができた時点で、今回の自分の仕事は終了でした。(by Malaさん)

これは、管理画面に認証がかかっていなかったことがまず悪いのですが、そもそも`test.html`や`admin.html`など容易に推測できるURLになっていることも問題でした。

あまりWebに詳しくない方が、Wordpressに代表されるようなテンプレートを利用する機会も多いと思いますが、そのまま利用した場合、わかる人には管理画面のURLばれているので危険ですね。
最近は、yeomanのテンプレートで管理側の機能も生成するものは気をつけた方がいいと思います。

管理者への昇格ですが、今回はブラウザのIndexedDBにログイン後のアカウント情報を持つ仕様でした。即Devtoolsで書き換えましたw。  
こういうセキュアな情報はフロント側では持ってはいけない典型的な例ですね。

### XSS

これは、SNSにコメント入力欄にXSS脆弱性があるというよくあるパターンなのですが、普通に`<script>alert(1)<script/>`と書いても実行されません。ではどうするかというと、次のように書きます。

```
<img src='#' onerror=alert(1) />
```
[security - XSS attack with javascript in img src attribute - Stack Overflow](http://stackoverflow.com/questions/1798633/xss-attack-with-javascript-in-img-src-attribute)

わざとタグの中でエラーが起きるような記述をして`onerror`を発火させます。同様に`mousemove`とかでもできます。

もう一つXSSできる方法があって、SNSに投稿する画像のexifに攻撃コードを注入する方法です。

[EXIF Cross Site Scripting, PHP Fun | Barry Shteiman](http://www.sectorix.com/2013/12/02/exif-cross-site-scripting-php-fun/)

このSNSは画像に付加されている撮影カメラの機種(？)を表示する仕様でした。そこにXSS脆弱性があった訳です。

基本的には`innerHTML`を`textContent`に置き換えるのがいいと思いますが、サービス仕様によっては`<a>`タグは許容したいとかありそうで、なかなか悩ましいですね。

### WebAPIの認証不備

これは、WebAPI側でトークンなどのチェックを一切行っていないことに起因するもので、APIアクセスすると誰でもSNSの内容が盗聴できる状態でした。

また、コメント投稿などAPI操作の際に、ユーザーIDをパラメータに含める謎仕様だったので、ローカルプロキシでリクエストを改ざんしたり、
広告用のiframeにCSRF用のコードを含めることで、容易になりすまし投稿や削除などができる状態でした。

これは、WebAPIの認証はしっかりやることと、フロント側にセキュアな情報は持たせないの2点につきます。

手前味噌で恐縮ですが、以前こんな記事書きました。

[JWT(Json Web Token)を利用したWebAPIでのCredentialの受け渡しについて](http://blog.mitsuruog.info/2014/08/jwtjson-web-tokenwebapicredential.html)

### ログインに関するもの

ログインに関するものは、まず何回でも失敗できるので、総当たり攻撃ができるということでした。数回失敗するとcaptchaを表示して相手が機械かどうか確認するのがいいそうです。

それからパスワード忘れ機能で、「好きな色はなに？」と聞いてくるのですが、デフォルトの仕様が「黒」だったので、ユーザー名を知っていればなりすましログインできる状態でしたw。  

過去には「好きなディズニーキャラクターは？」とういう仕様のサービスが実際にあったとか。。。なかったとか。。。

パスワード忘れの場合は、直接ログインさせるのではなく、メールなどでリセット用のアドレスを送付して1つクッションするのが一般的だと思います。  
それから、設問がイケてないと設計側の責任になるケースがあるので、設問自体をユーザーに決めさせるという方法もあるようです。

国によっては聞いてはいけない設問もあるようですので、こちらでチェックされるのがいいそうです。

[Choosing and Using Security Questions Cheat Sheet - OWASP](https://www.owasp.org/index.php/Choosing_and_Using_Security_Questions_Cheat_Sheet)

最近は、パスワードや個人情報を持つこと自体がリスクな場合は、認証自体をSNS認証(OAuthなど)に置き換えるのもありだと思いました。

### 連番

今回のSNSはユーザーID、メッセージなどほとんどが連番で予測可能でした。  
もう、連番のような推測可能な情報をWebで公開すること自体が脆弱性のような気もします。予測しにくいランダムな文字列を設定するように心がけたいですね。

たまに見過ごされがちなのが、投稿画像(動画)などの静的ファイルが連番になっている件で、他人に見られたくない画像がURLを予想して表示できる状態でした。

それと、削除された画像の扱いについてで、サービスによっては一定期間保管する(努力義務？)のようなものがあるそうで、そうした場合、Webからアクセスできない削除用フォルダのようなところに移動させたほうが良いそうです。

### iframeのpostMessage

今回、認証用のログインダイアログが別ドメインのiframeになっていて、結果をpostMessageで親画面に送っていたのですが、
postMessageのtargetOriginが指定されていないため、悪意のあるページにこの認証ダイアログがiframeが組み込まれると、認証後の情報をすべて抜き取られてしまいます。

ユーザーをあたかも正規サイトのような罠サイトに誘導して、ログインを促してセキュアな情報を抜き取る例の手口ですね。おー怖っ。

このことは、MDN読めば書いてあるのですが普段から脅威に気づいていないと読み飛ばしてしまいそうです。  
新しい機能を利用する場合は、セキュリティに関する留意点を確認すること。

[window.postMessage セキュリティに関すること- Web API インターフェイス | MDN](https://developer.mozilla.org/ja/docs/Web/API/Window/postMessage#Security_concerns)

### Cordova(WebViewのXSS)

こ、これは、恐ろしかったw。

XSSの続きなんですが、XSSの攻撃コードにCordovaのプラグインをコールするコードを設定すると、ネイティブの機能が呼び出されるという類のものです。

例）バイブを動作させるコード
```
<img src="a" onerror="navigator.vibrate(100)">
```

特に、最近はハイブリッド開発プラットホームが増えてきて、JSからネイティブの機能を操作ようになっているのですが、
そうなると今までのXSSがネイティブコードに対する脅威に昇格するので、今まで以上にXSSについて注意する必要があると思いました。

XSSをさせないのが一番だと思いますが、開発中にちょっと試してインストールしたような、不要なプラグインは気付いたら削除するべきですね。
あと、万が一何かあった場合は、Webviewから外にデータは流れないようにするべきだとおもいました。

[Crosswalk - xwalk_hosts](https://crosswalk-project.org/documentation/manifest/xwalk_hosts.html)

[Crosswalk - Content security policy](https://crosswalk-project.org/documentation/manifest/content_security_policy.html)

ふうふう。。。

## 大事なこと

まず、今回の課題は架空のSNSサービスを題材としたもので、フロント側とサーバー側の両方に脆弱性があるものでした。  
それぞれ脅威に対する対策については少し異なる部分もあると思うのですが、自分なりに感じた脅威に対する対策(心構え？)としては共通するものがあったかなと思います。

* 意図しないコード(人)を侵入させないこと。
* 意図しないコードを実行させないこと。
* もし、意図しないコードが実行されたとしても、外部に情報が漏れないこと。

フロント側の対策としてはXSSを中心に昔からよく言われている対策を進めていけばいいと思うのですが、次々と新しいクロスプラットフォームが発表され、HTMLの新しいタグやAPIが追加されるような変化が激しい状況下で、日々脅威となるポイントは増えているんだなと思いました。

## 最後に

昔から利便性とセキュリティは相反するものだとよく言われてきますが、
Webをより使いやすくするために追加された新機能や手法が新たな脅威を生む構図があり、なかなか考えさせられるものがありました。

いくつか攻撃コードの中には知っている手法もあったのですが、やはり知っているのと実際に攻撃してみたでは全く感じ方が異なりますね。  
このように実際に攻撃の実習と通して、Webセキュリティについて実践的に学べる場は本当に貴重だと思いました。

多くの企業システムに関わることが多いエンジニアとして、このような脅威があること実際の開発現場にて啓蒙していき、
より安全なWebシステムを作るために努力していきます的な優等生コメントで締めたいと思います。

企画・運営していただいた方々、本当にありがとうございました。  
思いは確かに伝わりました。

### 参考資料

* [安全なウェブサイトの作り方：IPA 独立行政法人 情報処理推進機構](http://www.ipa.go.jp/security/vuln/websecurity.html)
* [HTML5 を利用したWeb アプリケーションのセキュリティ問題に関する調査報告書](https://www.jpcert.or.jp/research/html5.html)
* [Androidセキュリティ勉強会～WebViewの脆弱性編～(PDF)](https://ierae.co.jp/uploads/webview.pdf)
* [HTML5 Security Cheatsheet(malaさんに教えていただいた、xssの例がいっぱいのってるサイト)](https://html5sec.org/)