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

const buffer = fs.readFileSync('migemo-compact-dict');
const dict = new migemo.CompactDictionary(buffer.buffer);
const m = new migemo.Migemo();
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
let cd;
const req = new XMLHttpRequest();
req.open("get", "migemo-compact-dict", true);
req.responseType = "arraybuffer";
req.onload = function () {
	const ab = req.response;
	cd = new jsmigemo.CompactDictionary(ab);
}
req.send(null);
```

読み込み完了後、migemoを初期化します。
setDictメソッドで、先に読み込んだ辞書ファイルを指定します。
queryメソッドで、検索したい単語をローマ字で引数に与えると、その単語にヒットする正規表現が返ります。

```js
const migemo = new jsmigemo.Migemo()
migemo.setDict(cd);
const rowregex = migemo.query(queryInputElement.value);
```

queryメソッドはステートレスのため、複数のスレッドから同時に呼び出すことができます。

## 辞書ファイルの生成

```shell
> node  bin/jsmigemo-dict.mjs <text-dict-file> <compact-dict-file>
```

`<text-dict-file>` は、C/Miemoで使われているテキスト形式の辞書ファイルです。
`<compact-dict-file>` は、出力ファイル名です。

## ライセンス
本ライブラリに付属の辞書ファイルは、SKK辞書から生成されています。
そのため、辞書ファイル `migemo-compact-dict` のライセンスはSKK辞書から継承しています。
SKK辞書のライセンスについては、[SKK辞書配布ページ](http://openlab.ring.gr.jp/skk/wiki/wiki.cgi?page=SKK%BC%AD%BD%F1)をご覧ください。

`migemo-compact-dict` 以外のファイルについては、MIT LICENSEのもとで配布します。
