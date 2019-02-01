---
layout: post
title: "react-nativeでNative moduleを呼び出す(Android編)"
date: 2019-02-01 0:00:00 +900
comments: true
tags:
  - その他
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/android-react-native-logo.png
---

react-nativeでAndroidのNative moduleを呼び出す方法です。基本的には下の公式ドキュメントのやり方を真似ていますが、一部そのままでは動作しなかった部分があるため、その辺りも紹介します。

- [Native Modules · React Native](https://facebook.github.io/react-native/docs/native-modules-android)

紹介する内容は次の通りです。

- 簡単なCounterをNative Moduleで実装した
- Native Moduleの呼び出し
- Native ModuleからConstantsを受け取る
- Native ModuleからのCallbackを扱う
- Native ModuleからのPromiseを扱う
- Native ModuleからのEventを扱う

対象のバージョンは次の通りです。

- react-native: 0.57.8
- Android SDK: 27(Oreo)

プロジェクト全体のコードはGitHubで見ることができます。

- https://github.com/mitsuruog/react-native-call-native-module-sample

ちなみにAndroid開発はほとんどやったことがありません。

## Native Moduleの呼び出し

まず`ReactContextBaseJavaModule`を継承した`CounterModule.java`を作成します。
その中に`getName`メソッドを作成して、このモジュール名を返すようにします。このモジュール名をreact-native側で利用します。

```java
// CounterModule.java
public class CounterModule extends ReactContextBaseJavaModule {
  public CounterModule(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
  }
  
  @Override
  public String getName() {
    return "Counter";
  }
}
```

続いて`ReactPackage`を実装した`CounterPackage.java`を作成します。
中身は新しく追加したreact-native側で利用できるように登録するためのものなので、あまり細かいことは気にせず、公式ドキュメントのまま実装していきます。

```java
// CounterPackage.java
public class CounterPackage implements ReactPackage {

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new CounterModule(reactContext));
    return modules;
  }
}
```

そして`MainApplication.java`の`getPackages`メソッドに`CounterPackage`を追加してreact-native側から参照できるようにします。

```diff
// MainApplication.java
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    ...

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
+              new CounterPackage(),
              new CalendarManagerPackage()
      );
    }
  }

  ...

}
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

`CounterModule.java`に`getConstants`メソッドを追加します。react-native側に渡したいものを`HashMap`の中に設定していきます。

```java
// CounterModule.java
  
  ...

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("initialCount", 0);
    return constants;
  }
```

react-native側では、`initialCount`は次のように利用することができます。

```js
// App.js
console.log(Counter.initialCount); // => 0
```

## Native ModuleからのCallbackを扱う

現在のcountを返す`getCount`メソッドを実装します。

Callbackは`Callback`クラスで定義されているので、これを引数で受け取って`invoke`でCallbackを実行します。

```java
// CounterModule.java
public class CounterModule extends ReactContextBaseJavaModule {

  private int count = 0;

  ...

  @ReactMethod
  public void getCount(Callback callback) {
    callback.invoke(count);
  }
}
```

> Native Moduleからreact-native側に公開するメソッドには`@ReactMethod`アノテーションをつける必要があります。
> また、react-nativeとNative Module間のやりとりは常に非同期であるため、戻り値は常に`void`になります。

react-native側では次のように利用します。

```js
// App.js
Counter.getCount(count => console.log(count)); // => 0
```

## Native ModuleからのPromiseを扱う

次はPromiseを扱ってみます。

`decrement`メソッドを実装します。正しく減算できた場合は`resolve`を、countが0で減算しようとした場合に`reject`を返すようにします。

Promiseは`Promise`クラスで定義されているので、これを引数で受け取ってそれぞれ`resolve`と`reject`を実行します。（シンプルでわかりやすいですね）

```java
// CounterModule.java

  ...

  @ReactMethod
  public void decrement(Promise promise) {
    if (count == 0) {
      promise.reject("E_COUNT", "count count cannot be negative.");
    } else {
      count = count - 1;
      promise.resolve(count);
    }
  }
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

Eventをreact-native側に送るには`ReactContext`が必要なので、`this.getReactApplicationContext()`から取得します。これを使ってイベントを通知します。

react-native側に送るペイロードは`WritableMap`を使って準備します。

```java
// CounterModule.java

  ...

  @ReactMethod
  public void decrement(Promise promise) {
    if (count == 0) {
      promise.reject("E_COUNT", "count count cannot be negative.");
    } else {
      count = count - 1;
      promise.resolve(count);

      // react-native側へ送るペイロード
      WritableMap params = Arguments.createMap();
      params.putInt("count", count);

      // react-native側にイベントを発火する
      this.getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("onDecrement", params);
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

> なにやら`DeviceEventEmitter`と`NativeAppEventEmitter`というものもあるらしい。

## まとめ

react-nativeでAndroidのNative moduleを呼び出す方法についてでした。
2つのものが繋がって動作すると楽しいですね。