---
layout: post
title: "ReactのHigher order component(HOC)をTypeScriptで作る"
date: 2018-02-21 0:00:00 +900
comments: true
tags:
  - react
  - typescript
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/hoc2.png
---
ReactのHigher order component(以下、HOC)をTypeScriptで作る方法の紹介です。
作り方を探したところ、こちらの記事がほぼ完璧だと思ったので、本人に許可をもらってゆるく翻訳しながら紹介することにしました。

(完全な翻訳を目指しているわけではないので、細かいニュアンスまで気になる方は英語の記事を直接読んでください。あと少しコードは自分好みに変えてます。)

- React Higher-Order Components in TypeScript made simple
 https://codeburst.io/react-higher-order-components-in-typescript-made-simple-6f9b55691af1

> 本人によると、この記事はHOCの作り方について同僚とディスカッションした内容をまとめたものだそうです。同僚大事。

## HOCとは何か？

[公式ドキュメント](https://reactjs.org/docs/higher-order-components.html)によると、HOCとは

> a higher-order component is a function that takes a component and returns a new component
> (HOCとは、コンポーネントをもらって新しいコンポーネントを返す関数です。)

HOCは機能横断的な機能を抽出するために利用され、複数のコンポーネントを一箇所にまとめることで、コードの重複を減らすことができます。
ちなみに、もっとも有名なHOCは[react-redux](https://github.com/reactjs/react-redux)の`connect`だそうです。

## これから学ぶこと

この記事では、`clickCountHOC`というHOCを作成します。

`clickCountHOC`はクリック数を子コンポーネント(**wrapped コンポーネント**と呼ぶ)のpropsに渡します。さらにクリック数を表示して、`style` propを使ってスタイリングすることが可能です。
そして最後に、クリックした時に`console.log`が出力できるよう、設定できるようにします。

これらの要素は、HOCの全ての側面を可能な限りシンプルに説明するために選ばれています。

## Props

まず、HOCを作成する際には**3種類のProps**について考える必要があります。

- `OriginalProps`は、ラップされるコンポーネントが持つ**オリジナルのProps**です。HOCはこれらの内容をを全く知りません。
- `ExternalProps`は、HOCによって定義されたPropsです。これらはラップされるコンポーネントには渡されません。
- `InjectedProps`は、HOCが**ラップされるコンポーネントに追加するProps**です。これらは基本的に、HOCのStateと`ExternalProps`を合成したものです。

これら3つのpropの関連は次のような図で表すことができます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/hoc1.png %}

この図でわかるように、resulting component(HOCで新しく作られたコンポーネント)のPropsは`OriginalProps & ExternalProps`(2つを合成したもの)です。

今回の例の`clickCountHOC`Propsはこのようになります。

```typescript
interface ExternalProps {
  style?: React.CSSProperties;
}

export interface InjectedProps {
  clickCount?: number;
}
```

`InjectedProps`はHOCを利用する際に使うため、exportする必要があります(後述)。
そしてStateはシンプルで、ただクリックカウントがあるだけです。

```typescript
interface State {
  clickCount: number;
}
```

## Options
最初に言ったように、HOCとは、コンポーネントをもらって新しいコンポーネントを返す関数です。

(これを簡単に図示すると)

```typescript
Component => Component
```

しかし、多くのHOCはオプションの設定をもらってHOCを返す、カリー化されたHOCファクトリーのような形式になっています。(`react-redux`もそう)

```typescript
options => Component => Component
```

これらのオプションはHOC自体を変更するために利用される静的な定義体です。
また、これらはStateやPropsに対するアクセスはできず、HOCファクトリーが呼び出された時に**一度だけ評価される**ことに注意してください。

もし、この場所からPropsやStateを操作する必要がある場合、唯一の方法は、関数としてオプションを指定することです。引数としてPropsやStateを受け取ることができます。

`clickCountHOC`のオプションはシンプルで、クリックした時にメッセージをコンソールに出力するかを指示するためのフラグです。

```typescript
interface Options {
  debug?: boolean;
}
```

## 全てを一箇所にまとめる
必要な全てのPropsを定義し終えたら、HOCを書く事ができます。


```typescript
export const clickCountHOC = ({ debug = false }: Options = {}) =>
  <OriginalProps extends {}>(
    WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>
  ) => {
    // body
  }
```

一目見ただけでは、少し複雑に見えるので、パーツごとに分解してみましょう。

```typescript
({ debug = false }: Options = {}) =>
```

最初の行は一つの引数をもらうラムダ関数で、ES6のdestructuring構文を使って、デフォルト値を持つキーとして分解されています。(今回の場合、キーは`debug`)
これにより呼び出し元が、この関数を**引数なし**か**1つの`Options`を引数**として呼び出せるようになります。そして一部のキーが渡されなかった場合、内部的にデフォルト値が利用されます。

```typescript
<OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>
) => {
  // body
}
```

2つめは、1つの型引数`OriginalProps`を伴ったgenericラムダ関数です。
`extends {}`は、HOCがJSXタグではなくラムダ関数であることを指し示すための、決まり文句のようなものです。

このラムダ関数は`WrappedComponent`というただ1つの引数をとり、2つの型になる可能性があります。(大文字から始まることに注意してください。これは意図的で、後ろの方に理由が書いてあります。)

> (注意)原文では、`React.ComponentClass`と`React.StatelessComponent`の2つを使っていますが、コメントでよりシンプルなやり方として`React.ComponentType`が提示されていたので、これを使っています。

- `React.ComponentType` - `React.ComponentClass` と `React.StatelessComponent` を合成した型です。

このPropsの型は上の図にある、2つの型がラップされるコンポーネントに渡される場所に対応しています。
これで基本的な構文ができたので、あとは中身を作っていくだけです。

```typescript
export const clickCountHOC = ({ debug = false }: Options = {}) =>
  <OriginalProps extends {}>(
    WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>
  ) => {

    type ResultProps = OriginalProps & ExternalProps;

    return class ClickCountHOC extends React.Component<ResultProps, State> {

      static displayName = `ClickCountHOC(${WrappedComponent.displayName})`;

      constructor(props: ResultProps) {
        super(props);

        this.state = {
          clickCount: 0,
        };

        this.onClick = this.onClick.bind(this);
      }

      public render(): JSX.Element {
        return (
          <div onClick={this.onClick} style={this.props.style}>
            <span>Clicked {this.state.clickCount} times</span>
            <WrappedComponent {...this.props} {...this.state} />
          </div>
        )
      }

      private onClick() {
        if (debug) {
          console.debug("clicked");
        }
        this.setState({ clickCount: this.state.clickCount + 1 });
      }
    }
  };
```

まず最初に、resulting componentのpropsの型(上の例では`ResultProps`)を定義します。
単純に`OriginalProps & ExternalProps`とします。

次に、このProps型を持つresulting componentのクラスを作成します。stateにも適切なものを設定してください。

静的なプロパティ`displayName`を定義します。これは(ReactDev toolなどで)デバックする際に、ラップされたコンポーネント名を知るために役立つものです。そして、stateを初期化するシンプルなコンストラクタを定義します。

`handleClick`はクリックカウントを計算するための関数で、`debug`が有効な場合にメッセージをコンソールに出力します。

最後は、`render`関数です。`style`とClickハンドラを持つ`div`タグです。divの中の`span`はクリックカウントを表示します。
これが`WrappedComponent`が大文字で始める理由です、そうでなければこのようにレンダリングできません。
`OriginalProps`にあったもの全てとHOCのStateにある`clickCount`と一緒に渡されます。

## HOCを使う

HOCの使い方について紹介しましょう。まず`ClickArea`というコンポーネントを作成して、これをHCOでラップします。

```typescript
import { InjectedProps } from "./ClickCountHOC";

interface ClickAreaProps {
}

const ClickArea = (props: ClickAreaProps & InjectedProps) => (
  <div>Click me!!</div>
);

export default ClickArea;
```

注意することは、このpropsの型は`ClickAreaProps`(すなわち`OriginalProps`)と`InjectedProps`の合成ということです。こうすることで、HOCとラップされたコンポーネントからpropsを使う事ができます。

最後にラップした2つのコンポーネントを作成します。(1つはデバック機能付き)

```typescript
import { clickCountHOC } from "./ClickCountHOC";
import ClickArea from "./ClickArea";

export interface HelloProps {
}

const Wrapped1 = clickCountHOC()(ClickArea);
const Wrapped2 = clickCountHOC({ debug: true })(ClickArea);

export class Hello extends React.Component<HelloProps, {}> {
  render() {
    return (
      <div>
        <h1>Here is a simple example with HOC</h1>
        <Wrapped1 style={{ padding: 10 }} />
        <Wrapped2 style={{ padding: 10, background: "gray" }} />
      </div>
    )
  }
}
```

このように好きなコンポーネントと一緒に使う事ができ、TypeScriptの型チェックの恩恵も受けることができます。

以上

## まとめ

HOCをTypeScriptで作る際の簡単なサンプルと説明でした。

英語の記事に方には、[HOCのテンプレート](https://gist.github.com/no23reason/3d1d34b712313260b68e58b6113246e9#file-hoc-template-ts)もあるので、ぜひチェックしてみてください。

記事の中のコードは全てこちらのリポジトリで見ることができます。

- https://github.com/mitsuruog/react-typescript-hoc-sample

HOCの作り方は最初難しいので、このような素晴らしい記事に出会えて本当によかったです。ありがとう！Dan

Making HOC with TypeScript is complex work at the first glance. but I am so happy to find such a great article!!
Thanks Dan. I love you!!
