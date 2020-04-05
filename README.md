# jsmigemo

![Node.js CI](https://github.com/oguna/jsmigemo/workflows/Node.js%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/jsmigemo.svg)](https://badge.fury.io/js/jsmigemo)

JavaScriptでMigemoを利用するためのライブラリ

## HOW TO USE

### CLI

```
$ npm install jsmigemo
$ jsmigemo
QUERY: kensaku
PATTERN: (kensaku|けんさく|ケンサク|建策|憲[作冊]|検索|献策|研削|羂索|ｋｅｎｓａｋｕ|ｹﾝｻｸ)
```

### Node.js

```js
const migemo = require('jsmigemo');
const path = require('path');
const fs = require('fs');
let buffer = fs.readFileSync(path.join(migemo.migemo_module_path, '../../migemo-compact-dict'));
let ab = new ArrayBuffer(buffer.length);
let view = new Uint8Array(ab);
for (var i = 0; i < buffer.length; ++i) {
	view[i] = buffer[i];
}
let dict = new migemo.CompactDictionary(ab);
let m = new migemo.Migemo();
m.setDict(dict);
console.log(m.query('kensaku'));
//=> (kensaku|けんさく|ケンサク|建策|憲[作冊]|検索|献策|研削|羂索|ｋｅｎｓａｋｕ|ｹﾝｻｸ)
```

### Browser

`jsmigemo.js` と `migemo-compact-dict` を本リポジトリから用意します。

jsmigemoを使うHTMLに次のタグを追加し、`jsmigemo.js` を読み込みます。

```html
<script type="text/javascript" src='jsmigemo.js'></script>
```

次に、scriptタグ内で、辞書ファイルをサーバから読み込みます。

```js
var cd;
var req = new XMLHttpRequest();
req.open("get", "migemo-compact-dict", true);
req.responseType = "arraybuffer";
req.onload = function () {
	var ab = req.response;
	cd = new jsmigemo.CompactDictionary(ab);
}
req.send(null);
```

読み込み完了後、migemoを初期化します。
setDictメソッドで、先に読み込んだ辞書ファイルを指定します。
queryメソッドで、検索したい単語をローマ字で引数に与えると、その単語にヒットする正規表現が返ります。

```js
var migemo = new jsmigemo.Migemo()
migemo.setDict(cd);
var rowregex = migemo.query(queryInputElement.value);
```

queryメソッドはステートレスのため、複数のスレッドから同時に呼び出すことができます。

## TODO
- 辞書ファイルの生成スクリプト
- 辞書ファイルを他の辞書（kuromoji-ipadic-neologdとか）から生成する
- 処理の高速化
- サンプル: Promise & AbortControllerによる処理のキャンセル

## ライセンス
本ライブラリに付属の辞書ファイルは、SKK辞書から生成されています。
そのため、辞書ファイル `migemo-compact-dict` のライセンスはSKK辞書から継承しています。
SKK辞書のライセンスについては、[SKK辞書配布ページ](http://openlab.ring.gr.jp/skk/wiki/wiki.cgi?page=SKK%BC%AD%BD%F1)をご覧ください。

`migemo-compact-dict` 以外のファイルについては、MIT LICENSEのもとで配布します。

## 辞書ファイルの作成

**WIP**

KaoriYa氏配布のC/Migemoに含まれている `migemo-dict` を入力ファイルとします。
以下のコマンドにより、 `migemo-compact-dict` に、サイズが最適化された辞書ファイルが生成されます。

```
node ./bin/jsmigemo-dict migemo-dict migemo-compact-dict
```