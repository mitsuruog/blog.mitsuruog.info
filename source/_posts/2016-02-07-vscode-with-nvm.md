---
layout: post
title: "vscodeとnvmを一緒に使う小ネタ"
date: 2016-02-07 23:59:59 +900
comments: true
tags:
  - vscode
  - nvm
---

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2016/vscode-with-nvm.png %}

# vscodeとnvmを一緒に使う小ネタ

ローカルのnode環境を[nvm](https://github.com/creationix/nvm)で作ってて、typescriptをnpm経由でインストールした時に少しハマったので自分用メモ

<!-- more -->

## 結論

ターミナルからvscodeを起動する必要があります。起動時に、nvmの設定を外部から指定すると動作します。

```
nvm use 5; code .
```

vscodeをターミナルから動かせるようにしておくことが前提条件です。
設定はこちらを参考にしてください。

[Setting up Visual Studio Code](https://code.visualstudio.com/Docs/editor/setup)

自分の場合はzshを使っているので、`.zshrc`に追加しました。

```
function code () { VSCODE_CWD="$PWD" open -n -b "com.microsoft.VSCode" --args $*; }
```

参考：
[VS Code with NVM · Issue #1895 · Microsoft/vscode](https://github.com/Microsoft/vscode/issues/1895)


## トラブル

vscodeの`task.json`に定義した`tsc`コマンドで`.ts`ファイルをコンパイルしようと思ったらエラーが発生。ぐぬぬ。。。

```
Failed to launch external program tsc HelloWorld.ts.
spawn tsc ENOENTspawn tsc ENOENT
```
