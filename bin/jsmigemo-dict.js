#!/usr/bin/env node
/**
* jsmigemo-cli.js
*/

const {CompactDictionaryBuilder} = require('../lib/CompactDictionaryBuilder.js')
const fs = require('fs');
const readline = require('readline');

if (process.argv.length <= 3) {
    console.error("usage: jsmigemo-cli <input> <output>");
    process.exit(1);
}

let ifilename = process.argv[2];
let ofilename = process.argv[3];

if (!fs.existsSync(ifilename)) {
    console.error("input file is not exist");
    process.exit(1);
}

let rs = fs.createReadStream(ifilename, 'utf8');
let rl = readline.createInterface(rs, {});
let dict = new Map();
rl.on('line', (line)=>{
    if (line.startsWith(';') || line.length === 0) {
        return;
    }
    const words = line.split('\t');
    const key = words[0];
    const value = words.slice(1);
    dict.set(key, value);
}).on('close', () => {
    const ab = CompactDictionaryBuilder.build(dict);
    fs.writeFileSync(ofilename, Buffer.from(ab));
})
