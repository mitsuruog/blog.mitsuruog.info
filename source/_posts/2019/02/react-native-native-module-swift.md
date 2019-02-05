---
layout: post
title: "react-nativeでNative moduleを呼び出す(Swift編)"
date: 2019-02-05 0:00:00 +900
comments: true
tags:
  - react-native
  - swift
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/swift-react-native-logo.png
---

react-nativeでSwiftのNative moduleを呼び出す方法です。基本的には下のBlogのやり方を真似ています。

- [Swift in React Native \- The Ultimate Guide Part 1: Modules](https://teabreak.e-spres-oh.com/swift-in-react-native-the-ultimate-guide-part-1-modules-9bb8d054db03)

紹介する内容は次の通りです。

- 簡単なCounterをNative Moduleで実装した
- Native Moduleの呼び出し
- Native ModuleからConstantsを受け取る
- Native ModuleからのCallbackを扱う
- Native ModuleからのPromiseを扱う
- Native ModuleからのEventを扱う

対象のバージョンは次の通りです。

- react-native: 0.57.8
- Swift: 4.2.1
- Xcode: 10.1

プロジェクト全体のコードはGitHubで見ることができます。

- https://github.com/mitsuruog/react-native-call-native-module-sample

ちなみにSwiftとObjecvive-Cは初めて書きました。

## Native Moduleの呼び出し

まず、`Counter.swift`というSwiftのクラスを作成します。
この時にObjective-C Bridging Headerの設定をするか確認されるので、「Create Bridging Header」を選択してBride Headerファイルを作成します。

このようなダイアログが表示されるはずです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/swift-react-native1.png 550 %}

> Bride Headerファイルは、一度設定されるとXcodeのプロジェクトファイルで管理されているため、手動でファイル名などを変更することは避けましょう。

Bride Headerファイルにreact-nativeのモジュールをインポートしておきます。

```objective-c
// Bridging-Header.h

#import "React/RCTBridgeModule.h"
```

続いて、SwiftクラスにCounterクラスを定義します。

```swift
// Counter.swift

import Foundation

@objc(Counter)
class Counter: NSObject {
}
```

次にObjective-Cのファイルを作成して、Native ModuleをJavaScript側に公開するためのマクロを登録します。

`RCT_EXTERN_MODULE`の最初の引数がJavaScript側に公開される名前で、第2引数がNative ModuleのSuper Classを渡します。

```objective-c
// Counter.m

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Counter, NSObject)
@end
```

react-native側では`NativeModules`の中に、先ほど定義したモジュール名でNative Moduleが渡されてくるので、これを利用します。

```js
// App.js
import { NativeModules } from 'react-native';

const { Counter } = NativeModules;

// 何かの処理
// Counter.doSomething();
```

これでNative Moduleをreact-native側で利用する準備が整いました。

## Native ModuleからConstantsを受け取る

Native Module側からcounterの初期値を返します。

`Counter.swift`に`constantsToExport`メソッドを追加します。react-native側に渡したいものをdictionaryの中に設定していきます。

続いて`requiresMainQueueSetup`メソッドも追加します。これはこのクラスの初期化をメインスレッドかバックグラウンドスレッドのどちらで行うかを指定するためのものです。
何も指定しない場合、次のような警告が表示されます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/swift-react-native2.png 350 %}

```java
// Counter.swift
  
  ...

  @objc
  override func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": 0]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    // true  - メインスレッドで初期化される
    // false - メバックグラウンドスレッドで初期化される
    return true
  }
}
```

react-native側では、`initialCount`は次のように利用することができます。

```js
// App.js
console.log(Counter.initialCount); // => 0
```

## Native ModuleからのCallbackを扱う

現在のcountを返す`getCount`メソッドを実装します。

Callbackは`RCTResponseSenderBlock`クラスで定義されているので、これを引数で受け取ってCallbackを実行します。

```swift
// Counter.swift

@objc(Counter)
class Counter: RCTEventEmitter {
  
  private var count = 0

  ...

  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
    callback([count])
  }
}
```

続いて`Counter.m`にメソッドを追加します。

```objc
// Counter.m

@interface RCT_EXTERN_MODULE(Counter, NSObject)
  RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)
@end
```

react-native側では次のように利用します。

```js
// App.js
Counter.getCount(count => console.log(count)); // => 0
```

## Native ModuleからのPromiseを扱う

次はPromiseを扱ってみます。

`decrement`メソッドを実装します。正しく減算できた場合は`resolve`を、countが0で減算しようとした場合に`reject`を返すようにします。

Promiseは`resolve`の場合の`RCTPromiseResolveBlock`と`reject`の場合の`RCTPromiseRejectBlock`を利用します。

rejectする場合は、第3引数にErrorオブジェクトが必要なので、`NSError`でエラーを作成しておきます。

```swift
// Counter.swift

@objc(Counter)
class Counter: NSObject {
 
  ...

  @objc
  func decrement(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    if (count == 0) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("E_COUNT", "count count cannot be negative.", error)
    } else {
      count -= 1
      resolve("count was decremented.")
    }
  }
}
```

続いて`Counter.m`にメソッドを追加します。

```diff
// Counter.m

@interface RCT_EXTERN_MODULE(Counter, NSObject)
  RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)
+  RCT_EXTERN_METHOD(decrement: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
@end
```

react-native側では通常のPromiseと同じように扱うことができます。

```js
// App.js
Counter.decrement()
  .then(count => console.log(count))
  .catch(error => console.error(error));
```

## Native ModuleからEventを受け取る

最後にdecrementした時に、`onDecrement`イベントが発火するようにして、これをreact-native側で利用できるようにします。

Eventをreact-native側に送るには`RCTEventEmitter`が必要なので、`Counter.m`を変更してインポートしておきます。

```diff
// Counter.m
#import "React/RCTBridgeModule.h"
+ #import "React/RCTEventEmitter.h"

- @interface RCT_EXTERN_MODULE(Counter, NSObject)
+ @interface RCT_EXTERN_MODULE(Counter, RCTEventEmitter)
  ...
@end
```

続いて`Counter.swift`を変更します。

まずクラスを`RCTEventEmitter`のサブクラスにします。次に`supportedEvents`を実装して、Native Moduleから発火されるイベント名を返すようにします。
最後に`requiresMainQueueSetup`をoverrideに変更します。

```diff
// Counter.swift

@objc(Counter)
- class Counter: NSObject {
+ class Counter: RCTEventEmitter {
 
  ...

+  @objc
+  override func supportedEvents() -> [String]! {
+    return ["onDecrement"]
+  }

  @objc
-  static func requiresMainQueueSetup() -> Bool {
+  override static func requiresMainQueueSetup() -> Bool {
    ...
  }

  ...
  
}
```

react-native側にイベントを送るには`sendEvent`を使います。送るペイロードは`Map`を使って準備します。

```diff
// Counter.swift

  ...

  @objc
  func decrement(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    if (count == 0) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("E_COUNT", "count count cannot be negative.", error)
    } else {
      count -= 1
+      sendEvent(withName: "onDecrement", body: ["count": count])
      resolve("count was decremented.")
    }
  }
}
```

react-native側では`NativeEventEmitter`の中にNative Moduleのインスタンスを設定してEventEmitterを取得します。
あとは、EventEmitterにEventListenerを設定すればOKです。

```js
// App.js
import { NativeModules, NativeEventEmitter } from 'react-native';

const counterEventEmitter = new NativeEventEmitter(Counter);

counterEventEmitter.addListener('onDecrement', ({ count }) => {
  console.log(count); // => 1
});
```

## まとめ

react-nativeでSwiftのNative moduleを呼び出す方法についてでした。

Objective-Cを書いていたら、遠い昔に触って挫折した苦い記憶が蘇ってきました。

JavaScript側はAndroidと同じ形で処理できるので、マルチプラットフォームのNative Moduleを扱う場合は、両者を等しく扱えるようなI/F設計が重要な気がします。