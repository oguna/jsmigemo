# jsmigemo

[![Build Status](https://travis-ci.org/oguna/jsmigemo.svg?branch=master)](https://travis-ci.org/oguna/jsmigemo)

JavaScriptでMigemoを利用するためのライブラリ

## TODO
- 辞書ファイルの生成スクリプト
- 辞書ファイルを他の辞書（kuromoji-ipadic-neologdとか）から生成する
- 処理の高速化
- シングルJSファイルでの配布
- CLIアプリ化

## 辞書ファイルについて
本ライブラリに付属の辞書ファイルは、SKK辞書から生成されています。
そのため、辞書ファイル `migemo-compact-dict` のライセンスはSKK辞書から継承しています。
SKK辞書のライセンスについては、[SKK辞書配布ページ](http://openlab.ring.gr.jp/skk/wiki/wiki.cgi?page=SKK%BC%AD%BD%F1)をご覧ください。

## シングルJSファイルとして出力

```
node .\node_modules\webpack\bin\webpack.js
```