---
layout: post
title: "docker imageをdocker hubに公開する方法"
date: 2017-11-10 0:00:00 +900
comments: true
tags:
  - docker
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2017/docker_hub.png %}

docker imageをdocker hubに公開する方法についての小ネタです。

<!-- more -->

お仕事でdocker imageを作成して公開必要があったのですが、やり方よく知らなかったので、同僚のdocker得意なエンジニアに教えてもらいました。

## docker imageを作成する
まずは、docker imageを作成します。

今回はCircleCI 2.0で使うフロントエンドビルド用のimageを作成するため、ベースのimageに`circleci/node:8.9`を利用しました。

BuildDockerfile
```
FROM circleci/node:8.9

ENV PATH /home/circleci/.local/bin:${PATH}

# Install AWS CLI
RUN sudo apt-get install python-dev
RUN sudo curl -O https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py --user
RUN pip install awscli --upgrade --user
```

imageファイルができたら、docker imageをビルドします。

```
$ docker build -f BuildDockerfile .  
```

ビルドが終わったらimageのリストを表示して、image idを覚えておきます。今回の場合は、一番上にある`<none>`が作成したimageです。

```
$ docker images

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
<none>              <none>              680c58dbd0f9        29 seconds ago      986MB
circleci/node       8.9                 66a65e08d915        9 hours ago         894MB
codeprep/sqlite     latest              0c3ec62e9c37        7 days ago          13.6MB
...
```

> 直前に作ったimageであれば、一番上に表示されると思います。

## docker imageをテストする
docker imageをテストします。

テストの方法は「[docker imageの中身をデバックする方法](https://blog.mitsuruog.info/2017/11/way-to-debug-docker-image)」にあるとおりimageの中に入ってデバックします。

> image名には、上で取得したimage idを指定します。

## dockerにログインする
ここからは、imageを公開するための準備です。

[docker hub](https://hub.docker.com/)のアカウントでdockerにログインしておきます。

```
$ export DOCKER_ID_USER="mitsuruog"
$ docker login
```

`DOCKER_ID_USER`にはdocker hubにユーザー名を設定しておきます。あとで使います。（なくても大丈夫ですが。。。）

## docker imageにタグをつける
docker imageにタグ（名前）を付けます。

```
$ docker tag [image name] $DOCKER_ID_USER/cool-build-frontend
```

`image name`には、上で取得したimage idを指定し、`cool-build-frontend`に好きな名前を設定します。

タグつけが終わったらimageのリストを表示してimageにタグが付いていることを確認します。

```
$ docker images

REPOSITORY                      TAG                 IMAGE ID            CREATED             SIZE
mitsuruog/cool-build-frontend   latest              680c58dbd0f9        2 minutes ago       986MB
circleci/node                   8.9                 66a65e08d915        9 hours ago         894MB
codeprep/sqlite                 latest              0c3ec62e9c37        7 days ago          13.6MB
```

## docker imageを公開する
最後にimageをdocker hubに公開します。

```
$ docker push mitsuruog/cool-build-frontend  
```

結果は、こんな感じです。

- https://hub.docker.com/r/mitsuruog/cool-build-frontend/

## まとめ
ほぼ、自分用のメモですね。

手順については他にも色々あると思うので、あくまでやり方の1つとして参考してください。
