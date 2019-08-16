#!/usr/bin/env node
/**
* jsmigemo-cli.js
*/

const migemo = require('../lib/index.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let buffer = fs.readFileSync(path.join(migemo.migemo_module_path, '../migemo-compact-dict'));
let ab = new ArrayBuffer(buffer.length);
let view = new Uint8Array(ab);
for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
}
let dict = new migemo.CompactDictionary(ab);
let m = new migemo.Migemo();
m.setDict(dict);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'QUERY: '
});

rl.prompt();

rl.on('line', (line) => {
    console.log("PATTERN: " + m.query(line.trim()));
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
