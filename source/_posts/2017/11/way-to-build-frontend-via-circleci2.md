---
layout: post
title: "Circle CI 2.0でフロントエンドをビルドする"
date: 2017-11-28 0:00:00 +900
comments: true
tags:
  - circleci
  - unit test
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/circleci2.0.png
---
[create-react-app](https://github.com/facebookincubator/create-react-app)で作っているReactアプリをCircle CI 2.0でビルドする手順について紹介します。

今回説明するのは、CircleCI 2.0を使う上での大まかな流れについてです。

<!-- more -->

## 前提条件
フロントエンドのプロジェクトには`test`と`build`のタスクがあって、全て`npm run`で実行できるとします。
またデプロイについては、`build`タスクで1つのバンドルファイルを作成してS3にデプロイします。

## 定義ファイルを作成する
まずは定義ファイルを作成する必要があります。設定ファイルは`.circleci`フォルダの中に`config.yml`を作成して定義していきます。

```
root
  .circleci
    config.yml
```

定義ファイルのシンタックスについてはv1.0と比べると結構変わっているので注意が必要です。
Slackの作業ログを見ると、Dashboardのどこかで定義ファイルが生成できたようですが、どこだか忘れてしまいました。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/circleci2.0-1.png %}

定義ファイルを生成すると次のようなファイルが作成されます。

デフォルトではCircleCIが準備したDocker imageを使います。(`image: circleci/node:8.9`の部分)
node, npm, yarnは既にimageに含まれているので、最小構成であればこれで大丈夫だと思います。

```
# Javascript Node CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-javascript/ for more details
#
version: 2
jobs:
  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:8.9

      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      # - image: circleci/mongo:3.4.4

    working_directory: ~/workspace

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: yarn install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      # run tests!
      - run: yarn test
```

定義ファイルの書き方については公式サンプルプロジェクトを見てください。

- https://github.com/CircleCI-Public/circleci-demo-javascript-express

## Docker imageを作成する
**（この工程は必要な場合のみです。）**

デフォルトではCircleCIが準備したDocker imageを使うのですが、これをさらにカスタムしてツールなどを導入したい場合は、新しくDocker imageを準備する必要があります。

自分の場合、S3にデプロイする場合はAWS-CLIツールを利用するので、これをインストールしたimageを作成する必要がありました。
imageを作成する際は、`circleci/node:8.9`を継承することができますので、ぜひそうしましょう。

```
FROM circleci/node:8.9

# ここから下にいろいろ定義する
...
```

実際に作成したimageはこちらです。

- https://hub.docker.com/r/mitsuruog/cool-build-frontend/

docker imageの作成方法についてはこちらを参照してください。

- [docker imageをdocker hubに公開する方法](https://blog.mitsuruog.info/2017/11/way-to-publish-docker-image)

## Jobを定義する
次にJobを定義します。この後の手順としては、`Job`を定義してこれをワークフローの中で順番に呼び出していきます。

Jobとは、CircleCIの中で再利用できると便利だなと思う一連のタスクをまとめたものです。例えば、`test` とか`test and build`などがそれにあたります。
とにかく次のワークフローの中ではこの**ジョブ名**を利用してフローを作成するので、このことを意識して定義するといいと思います。

基本的には`jobs:`の直下にタスク名(上の例では`build:`)を定義して、`steps:`の中にやりたいことを順番に書いていきます。
この辺りは1.0をやったことがある人であれば、想像できると思います。

```
version: 2
jobs:
  build:
    steps:
      - run step1
      - run step2
      - run step3
      ...
```

細かな設定は公式ドキュメントを参考にしてください。

- [Configuration Reference](https://circleci.com/docs/2.0/configuration-reference/)

## ワークフローを定義する
最後に定義したJobをワークフローとして組み立てていきます。

基本的には`workflows:`の直下にワークフロー名を定義して、`jobs:`の中にやりたいことを順番に書いていきます。

```
workflows:
  version: 2
  test_build_and_deploy:
    jobs:
      - test
      - build
      - deploy
```

ちなみに`test`などの、次のJobに進む前に完了していなければならないJobがある場合、`requires`を使うことで表現することができます。

```
workflows:
  version: 2
  test_build_and_deploy:
    jobs:
      - test
      - build
          requires:
            - test
      - deploy
          requires:
            - build
```

この場合、`test` -> `build` -> `deploy`の順にワークフローが実行されます。
ワークフローを定義する場合、同じ階層にあるJobは並列に実行されるため、`requires`でフローの制御は必須だと思います。

また、特定のブランチのみ実行させたい場合は、`filters`と`branches`を組み合わせることで表現可能です。

```
workflows:
  version: 2
  test_build_and_deploy:
    jobs:
      - test
      - build
          filters:
            branches:
              only:
                - develop
```
この場合は`develop`プランチの場合のみbuildのJobが実行されるようになります。

定義したワークフローはCircleCI上の「WORKFLOWS」にて確認することができます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/circleci2.0-2.png %}

## おまけ
Circle CIのデフォルトのマシンリソースは`medium`(CPU 2.0 RAM 4GB)となっていて、最近のフロントエンドのテスト、デプロイにおいてはスペック不足感が否めません。

> CPUはコア数かな？

自分の場合は、テストでjs-domを使っているのですが、頻繁に次のようなエラーが発生していました。

```
ENOMEM: not enough memory, read
```

そんな時は、`resource_class`でマシンスペックをあげることができます。
しかし、今のところCircle CIのカスタマーサポートに依頼する必要があります。詳しくはこちらを見てください。

- https://circleci.com/docs/2.0/configuration-reference/#resource_class

> 有効にしたいOrganization名と一緒に依頼すると割と早めに対応してくれました。Circle CIのカスタマーサポート素晴らしい！！

> {% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/circleci2.0-3.png %}

> とはいえ、将来的には`resource_class`はプレミアム機能になるかもしれないです。要注意！

## まとめ
CircleCI 2.0でフロントエンドをビルドするための大まかな手順でした。
本題とは全く関係ないのですが、Circle CIのカスタマーサポート迅速でよかったなー。

CircleCI 2.0の公式ドキュメントについてはこちらを参照してください。

- https://circleci.com/docs/2.0/
