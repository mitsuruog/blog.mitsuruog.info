---
layout: post
title: "JWT(Json Web Token)を利用したWebAPIでのCredentialの受け渡しについて"
date: 2014-08-25 02:45:00 +0900
comments: true
tags: 
 - JSON Web Signature
 - Json Web token
 - JWS
 - JWT
 - WebAPI
---

AngularJSへの改宗が完了した「mitsuruog」です。   
AngularJSに限らずSingle page application(以下、SPA)を構築した場合、認証(Authenticate)とその後のWebAPIでの証明情報(Credential)の受け渡し方法について最近悩んでいます。  
調べていたらJson Web Token(以下、JWT)を利用した方法が[Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)で紹介されていて、試してみると結構使えそうでしたので紹介してみます。

<!-- more -->

1.  WebAPIでの証明情報の受け渡しの重要性
2.  Tokenを利用した証明情報の受け渡し
3.  実現するためのコア技術、JWT(Json Web Token)
4.  Tokenを利用した場合の課題など
5.  まとめ

## 1.　WebAPIでの証明情報の受け渡しの重要性

WebアプリケーションのフロントエンドをSPAで構築した場合、バックエンドへのアクセスは通常WebAPI経由になります。JSP時代のようなフロントとバックが密結合した状態ではなく、SPAでのWebAPIは一般的に広く公開されているものです。  
URLを知っていれば誰でもアクセスできる性質を持っています。(企業システムはVPNという閉じた世界で利用されることが多いもの事実ですが)

バックエンドではユーザ認証を行い、その証明情報を元に、不正なアクセスを除外したり、正しいアクセスに対して機能に対する認可を行わなければなりません。そのため、SPAでの証明情報の受け渡しは非常に重要です。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/JWT2.png %}


## 2.　Tokenを利用した証明情報の受け渡し

まず、従来のCookieを利用したやり方について簡単に説明します。ただし、「Token vs Cookie」のような関係ではなく、両者をうまく組み合わせた方がいいような気が今はしています。(ちょっと、まだ検証が足りてません)

Cookieを利用した証明情報とは「セッションID」をイメージするいいと思います。この方法の特徴は、認証がバックエンドに依存していることです。つまり、バックエンド側では、認証された個人情報やロールをセッションIDに紐づけて保持する必要がありました。そのため、Webアプリケーションはセッションをどこで保持するかを意識した設計を行う必要がありました。

それに対し、Tokenを利用した方法では認証はバックンドに依存しません。ここでの「Token」とは「**電子署名**」の一種です。こちらがTokenを利用した場合の証明情報の受け渡しフローです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/JWT3.png %}


まず認証後に、暗号学的ハッシュ関数(SHA-256など)を使って暗号化したTokenを生成して渡します。このときにロールや個人情報をTokenに含めることがポイントです。  
フロントエンドはWebAPIアクセスする際にHTTPヘッダーにTokenを設定します。WebAPIアクセスを受けたバックエンドはTokenを秘密鍵を使って復号し、Tokenが改ざんされていないことを確認することで、正しいアクセスであることを確認します。

Tokenには個人情報やロールが含まれているため、バックエンドにて認証の状態を保持する必要がありません。**同じ秘密鍵・暗号学的ハッシュ関数があれば異なるバックエンドであってもTokenを受け入れることが可能**です。

これは、バックエンドがクラウド・オートスケールアップしていくような流れの中で、従来ようなセッションを意識しない証明情報の受け渡し方法として注目しています。


## 3.　実現するためのコア技術、JWT(Json Web Token)とは

JWTとは、Json形式のclaims(※)を暗号化してURLで安全に送れるようにしたものです。 

> (※)claims(クレーム)：うーん、いまいちイメージが湧かない。たぶん、上の個人情報とかロールとかそんな印象だと思います。

JWTの構造はJSON Web Signature(JWS)とJSON Web Encryption(JWE)の2つ。 
(ちなみに上の[Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)はJWSです。)
JWS構造のJWTを簡単に図解すると「ヘッダー」「クレームセット」「署名」の3部構成になっています。それぞれBase64URLエンコードされており、署名はヘッダー・クレームセットから生成します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/JWT1.png %}

クレームセット部分には、個人情報やロールなどカスタム項目を設定します。これ以外にJWTの仕様で以下のような項目(クレーム名)が標準で定義されています。

*   **iss:** Token発行者
*   **sub:** Tokenを利用するアプリケーション名など。(issとセットで発行者側を識別するために使う)
*   **aud:** このTokenを利用することが想定される対象の識別子。例)このブログでの利用想定の場合は「blog.mitsuruog.info」のようになる(はず)
*   **exp:** Tokenの有効期間
*   **jti:** Tokenの一意性を保証するためのIDを設定する

JWTについての詳細は下記のブログを参照してください。おそらく私よりかなり正確な理解をされていると思います。(JWTの日本語情報はかなり希少です) 
特にhiyosi’s blogさんの記事はJWTの仕様とJWS構造のJWTの作成・検証(ただしscala)まで含まれており、非常に有用です。

[JSON Web Token (JWT) - OAuth.jp](http://oauth.jp/blog/2012/10/26/json-web-token-jwt/) 
[JWTについて簡単にまとめてみた - hiyosi’s blog](http://hiyosi.tumblr.com/post/70073770678/jwt)


## 4.　Tokenを利用した場合の課題など

Tokenを利用した場合の課題など、列挙しておきます。 
私自身、どれだけ理解しているか不安ですので、ご意見いただけると嬉しいです。


### 秘密鍵の管理

JWTを利用した場合、そのTokenの正当性は暗号化する際の秘密鍵がすべてです。Tokenがフロントエンドで分散して保持されているため、なんからの方法で秘密鍵が外部に漏れてしまった場合の被害は甚大になると思われます。 
スケールアウトしている場合など、秘密鍵の変更を素早く同期できる方法が必要です。


### リフレッシュトークン

おそらく、Tokenには何らかの有効期限を設けて運用すると思われます。Tokenの有効期限が切れた場合、Cookieを使っていた場合のセッションタイムアウトと同じ事態になりますので、OAuth2のリフレッシュトークンのような仕組みが必要になると思います。
これは課題とではなく、やるべきことですね。できればその辺りまでライブラリでカバーして欲しいです。


### セキュリティ

Cookieの場合、CSRF、セッションハイジャックなどセキュリティ脆弱性がありました。Tokenを使った場合は、Cookieを利用していないため、Cookieの仕組みによる脆弱性はないと思われますが、他にどのような危険性があるかはまだ未知数です。(専門家の人助けてー)

特に、URLパラメータにToken付与した場合とか、そもそも誤送信した時点でアウトなので、そもそもそのような利用シーンは想定しない方がいいか、などもう少し利用する上で検討しなければならない項目の見落としがありそうです。


## 5.　まとめ

JWTを利用した証明情報の受け渡し方法いかがでしたでしょうか。 
国内情報が少なくて、正直どこまで信頼できるか手探りの状態です。今後も引き続きWebAPI周りの認証とか証明情報の受け渡しとか注視していきます。

最近、AngularJSで各ソーシャル対応のTokenベース認証ライブラリが出ましたので、こちらを使ってみるのもいいかと思います。 
[sahat/satellizer](https://github.com/sahat/satellizer)

こちらが参考資料です。

*   **Blog**
    *   [Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
    *   [JSON Web Token (JWT) - OAuth.jp](http://oauth.jp/blog/2012/10/26/json-web-token-jwt/)
    *   [JWTについて簡単にまとめてみた - hiyosi’s blog](http://hiyosi.tumblr.com/post/70073770678/jwt)
*   **仕様**
    *   [JSON Web Token (JWT) draft25](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html)
    *   [JSON Web Token (JWT) -日本語 draft11-](http://openid-foundation-japan.github.io/draft-ietf-oauth-json-web-token-11.ja.html)
*   **ライブラリ**
    *   [auth0/express-jwt(nodejs/expressミドルウェア)](https://github.com/auth0/express-jwt)
    *   [auth0/node-jsonwebtoken(nodejs/JWS形式のJWT作成)](https://github.com/auth0/node-jsonwebtoken)
    *   [sahat/satellizer(javascript/AngularJS用のTokenベース認証ライブラリ)](https://github.com/sahat/satellizer)
