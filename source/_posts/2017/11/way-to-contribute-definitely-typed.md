---
layout: post
title: "DefinitelyTypedに型定義ファイルを作ってコントリビュートする手順"
date: 2017-11-15 0:00:00 +900
comments: true
tags:
  - typescript
  - definitelytyped
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2017/TypeSctiptisfun.png %}

TypeScriptを使っていると、結構必要になる型定義ファイル。
型定義が存在しなかったり、古かったりするライブラリを使って、苦労した経験があるひとは多いのではないでしょうか。

今回は、DefinitelyTypedにコントリビュートする機会が最近増えたので、個人的な手順をまとめておきます。

<!-- more -->

## はじめに
まず、今回は新しい型定義ファイルを作成するケースを想定しています。

コントリビュートの仕方については、まず公式ドキュメントをさらりと眺めておいてください。
ただ、結構わかりにくいと思うので、これから順を追って説明していきます。

- https://github.com/DefinitelyTyped/DefinitelyTyped

それから型定義が存在しない事を確認しましょう。

- https://microsoft.github.io/TypeSearch/

## 事前準備

型定義のGeneratorがあるのでインストールしておく。
基本なくても大丈夫だと思いますが、フォルダやファイルヘッダーなど自動生成してくれて便利なので、インストールしておきましょう。

```
npm install -g dts-gen
```

DefinitelyTypedのリポジトリをcloneして、トップのフォルダで`dts-gen`コマンドを実行する。

```
dts-gen --dt --name my-package-name --template module
```

> `--template`の部分はいくつか指定があるのですが、あまり詳しく知らないです。
> （この辺り、どのtemplate使ったらいいか、わかりやすいドキュメントがあるといいんだけどなー。）

> (2017.11.23 追記)テンプレートっぽいの見つけたので貼っておきます。
> - https://github.com/Microsoft/TypeScript-Handbook/tree/master/pages/declaration%20files/templates

generateした結果はこんな感じで、`types`の下にディレクトリが作成されています。

```
DefinitelyTyped
  types
    my-package-name
      index.d.ts
      my-package-name-test.ts
      tsconfig.json
      tslint.json
```

## index.d.tsを書く
さぁ、ここからは実際に型定義を作成していきます。型定義は`index.d.ts`に定義します。

型定義の書き方についてはここでは紹介しませんが、内部構造が似ているライブラリを参考にすることが多いです。

## index.d.tsをデバックする
型定義ファイルが出来上がったら、実際にプロジェクトに投入して正しく機能するかデバックします。実は、`npm`からインストールされた型定義ファイルは、`node_modules/@types`の中に格納されています。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2017/DefinitelyTyped.png 250 %}

そのため、`@types`の下にライブラリ名と同じフォルダを作成して、その中に作成した`index.d.ts`を配置すると、あたかも`npm`インストールしたような振る舞いをします。

## testを書く
デバックも完了したら、PRを作成する準備に入ります。

コントリビュートするためには、型定義のテストを書く必要があります。テストは上の`my-package-name-test.ts`に書きます。

> テストというよりは、実際にライブラリを利用するようなコードを書きます。ライブラリの利用例をバリエーション豊かに書くといった感じです。

型定義で定義した内容を（なるべく）網羅したテストを書きます。

手前味噌ですが、自分が書いたテストを張っておきます。これも他のライブラリを見ながら書いていきます。

```
import * as React from "react";
import Alert from "react-s-alert";

const config = {
    position: "top",
    offset: 100,
    stack: {
        limit: 3,
        spacing: 50,
    },
    effect: "genie",
    beep: {
        info: "beep.mp3",
        error: "beep.mp3",
        warning: "beep.mp3",
        success: "beep.mp3",
    },
    timeout: 1000,
    html: true,
    onClose: () => {},
    onShow: () => {},
    customFields: {},
};

class Test extends React.Component {
    render() {
        return (
          <div>
              <Alert />
              <Alert
                  {...config}
              />
          </div>
        );
    }
}

Alert.info("I am a info message.", config);
Alert.error("I am an error message.", config);
Alert.warning("I am a warning message.", config);
Alert.success("I am a success message", config);

const index = Alert.info("Hello");
Alert.close(index);

Alert.closeAll();
```

(2017/11/15現在のコードなので古くなっているかもしれません。最新はこちらから見れます)
- https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-s-alert/react-s-alert-tests.tsx

## Lintチェックをする
テストを書いたらLintツールを実行して最終確認をします。

```
npm run lint my-package-name
```

## PRを作る
最後にDefinitelyTypedに対してPRを作成したら完了です。レビューなどで指摘がなければ、DefinitelyTypedにマージされて使えるようになると思います。

## まとめ
型定義を作ってDefinitelyTypedにコントリビュートする手順でした。

初めての時にプロセスを理解するまでに結構時間がかかったのでまとめてみました。
個人的には型定義のデバック方法を知れたのが一番の収穫でした。

いつもお世話になっている型定義なので、気軽に貢献できると嬉しいですね。
