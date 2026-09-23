# jsmigemo

![Node.js CI](https://github.com/oguna/jsmigemo/workflows/Node.js%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/jsmigemo.svg)](https://badge.fury.io/js/jsmigemo)

JavaScriptでMigemoを利用するためのライブラリ

## Install from npm

```
$ npm install jsmigemo
```

## Install from CDN

`https://cdn.jsdelivr.net/npm/jsmigemo/dist/<filename>` の `<filename>` の部分に、用途に応じて以下のファイル名を指定してください。

| Format | Default | Minified |
|:------:|---------|----------|
| ESModule | jsmigemo.mjs | jsmigemo.min.mjs |
| CommonJS | jsmigemo.cjs | jsmigemo.min.cjs |
| IIFE | jsmigemo.iife.js | jsmigemo.min.iife.js |

DefaultとMinifiedの違いは以下です。
- Defaultは、ソースコードを1つにまとめただけの、変数名もそのまま残っているJSファイルです。開発時にはこちらをご利用ください。
- Minifiedは、ファイルサイズを小さくするための様々な処理をしたJSファイルです。配布時にはこちらをご利用ください。

ESModuleとCommonJS、IIFEの違いは以下です。
- ESModuleは、最近のバンドラやNode.JS、モダンブラウザなど幅広く利用できるフォーマットです。
- CommonJSは、browserifyやwebpack1のような古いバンドラでの利用を意図したフォーマットです。
- IIFEは、ES2022に対応した環境で通常の `<script>` タグから利用するためのフォーマットです。

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
import { readFile } from "node:fs/promises";
import { CompactDictionary, Migemo } from "jsmigemo";

const data = await readFile("migemo-compact-dict");
const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

const dict = new CompactDictionary(buffer);
const migemo = new Migemo();
migemo.setDict(dict);

console.log(migemo.query("kensaku"));
//=> (kensaku|けんさく|ケンサク|建策|憲[作冊]|検索|献策|研削|羂索|ｋｅｎｓａｋｕ|ｹﾝｻｸ)
```

### Deno

```js
import { CompactDictionary, Migemo } from "https://cdn.jsdelivr.net/npm/jsmigemo/dist/jsmigemo.min.mjs";

const data = await Deno.readFile("./migemo-compact-dict");
const dict = new CompactDictionary(data.buffer);
const migemo = new Migemo();
migemo.setDict(dict);

console.log(migemo.query("kensaku"));
//=> (kensaku|けんさく|ケンサク|建策|憲[作冊]|検索|献策|研削|羂索|ｋｅｎｓａｋｕ|ｹﾝｻｸ)
```

### Browser

```html
<input id="queryInput" type="text" placeholder="kensaku">
<pre id="regexOutput"></pre>

<script src="https://cdn.jsdelivr.net/npm/jsmigemo/dist/jsmigemo.min.iife.js"></script>
<script>
  const DICT_URL = "https://cdn.jsdelivr.net/npm/jsmigemo/migemo-compact-dict";

  const queryInput = document.getElementById("queryInput");
  const regexOutput = document.getElementById("regexOutput");

  let migemo = null;

  async function setup() {
    const response = await fetch(DICT_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const dict = new window.jsmigemo.CompactDictionary(buffer);
    migemo = new window.jsmigemo.Migemo();
    migemo.setDict(dict);
  }

  queryInput.addEventListener("input", () => {
    if (!migemo) {
      return;
    }
    regexOutput.textContent = migemo.query(queryInput.value.trim());
  });

  setup().catch((error) => {
    regexOutput.textContent = `辞書の読み込みに失敗: ${error.message}`;
  });
</script>
```

## 辞書ファイルの生成

```shell
> node  bin/jsmigemo-dict.mjs <text-dict-file> <compact-dict-file>
```

`<text-dict-file>` は、C/Miemoで使われているテキスト形式の辞書ファイルです。
`<compact-dict-file>` は、出力ファイル名です。

## ライセンス
本ライブラリに付属の辞書ファイルは、MITライセンスのプロジェクトから生成されています。
[yet-another-migemo-dict](https://github.com/oguna/yet-another-migemo-dict)

本プロジェクト配下のファイルは、MIT LICENSEのもとで配布します。
