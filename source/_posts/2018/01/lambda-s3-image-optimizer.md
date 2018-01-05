---
layout: post
title: "AWS Lambdaを使ってS3にアップロードしたイメージを最適化する"
date: 2018-01-05 0:00:00 +900
comments: true
tags:
  - lambda
  - aws
  - s3
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/lambda-s3.png
---
あけましておめでとうございます。

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)を使ってこのブログを計測したところ、画像の最適化とキャッシュを提案されたので、年末年始は[AWS Lambda](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/welcome.html)を使って画像の最適化を試していました。

## はじめに
やりたかったことは、ブログで使う画像を最適化してサイズを小さくすることです。

ブログの画像ファイルは全てS3から配信しているので、特定のS3バケットに画像がアップロードして、それをLambda関数で最適化して他のバケットにアップロードすると言った、よくあるユースケースを実現してみました。

![](https://docs.aws.amazon.com/lambda/latest/dg/images/s3-admin-iser-walkthrough-20.png)

出来上がったものは、下のリポジトリにおいてあります。

- https://github.com/mitsuruog/s3-image-optimizer

正直なところ下のAWS公式チュートリアルを少し改造しただけなので、これをそのまま使うよりはチュートリアルで自分で試して見た方がいいと思います。

- https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html

## カスタマイズした点
カスタマイズした点について少し触れておきます。

### 環境変数の利用
Lambda関数の設定画面から環境変数を設定することができたので、一部の変数を実行時に渡すようにしました。
Lambda関数の中では`process.env`にアタッチされるので、次のように利用できます。

```javascript
const DEFAULT_DST_BUCKET = process.env.DST_BUCKET;
```

### 画像へのキャッシュの指定方法
S3にアップロードされた画像にキャッシュを指定するには、S3オブジェクトの**メタデータ**を使ってHTTPヘッダーを追加します。
AWS-SDKの`S3.putObject`を見ると、`CacheControl`と`Expires`を使うことで、キャッシュ関連の設定を渡すことができます。

次のように設定してみました。

```javascript
s3.putObject({
  Bucket: YOUR_TARGET_BUCKET_NAME,
  Key: "image.png",
  Body: data, // image data
  ContentType: "image/png",
  CacheControl: "max-age=86400", // 86400s => 1day
  Expires: new Date(new Date().getTime() + (86400 * 1000)) // 現在日時より1日後
});
```

- [Class: AWS\.S3 — AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property)

### 画像をアップロード時に「public」設定にする

これも`S3.putObject`の`ACL`を使って設定を渡すことができます。

```javascript
s3.putObject({
  Bucket: YOUR_TARGET_BUCKET_NAME,
  Key: "image.png",
  Body: data, // image data
  ContentType: "image/png",
  CacheControl: "max-age=86400", // 86400s => 1day
  Expires: new Date(new Date().getTime() + (86400 * 1000)), // 現在日時より1日後
  ACL: "public-read"
});
```

> 次の値が設定できるようです。
> - "private"
> - "public-read"
> - "public-read-write"
> - "authenticated-read"
> - "aws-exec-read"
> - "bucket-owner-read"
> - "bucket-owner-full-control"

## 結果
結果どれくらいサイズが小さくなったかというと。。。

「**22.3MB => 16.2MB**」

うん、微妙。ちょっと減りました。
画像最適化をもう少し強くするともう少しサイズは減るかもしれません。

## さいごに
Lambdaの動作確認にちょうどいい感じだったので、正月休みに画像の最適化用のLambda関数を作ってみた話でした。

もう少しいいものがあるので、自分で試さない場合はこのあたりもチェックしてみてください。

- https://github.com/sourcey/s3-image-optimizer
- [kraken.io(有料)](https://kraken.io/)
