#!/usr/bin/env node
/**
* jsmigemo-skk2migemo.js
*/

const migemo = require('../dist/lib/index.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

if (process.argv.length <= 2) {
    console.error("usage: jsmigemo-cli <input>");
    process.exit(1);
}

let filename = process.argv[2];

if (!fs.existsSync(filename)) {
    console.error("input file is not exist");
    process.exit(1);
}

let rs = fs.createReadStream(filename, 'utf8');
let rl = readline.createInterface(rs, {});
let dict = new Map();
rl.on('line', (line)=>{
    if (line.startsWith(";;")) {
       return; 
    }
    let keyValues = line.split(' ', 2);
    let key = keyValues[0];
    let value = keyValues[1];
    if (key.startsWith("<") || key.startsWith(">") || key.startsWith("?")) {
        return;
    }
    if (key.endsWith("<") || key.endsWith(">") || key.endsWith("?")) {
        return;
    }
    let haveNumber = key.match("#");
    if (key.match("[a-z]$") && !key.match("^[ -~]+$")) {
        key = key.substr(0, key.length - 2); 
    }
    if (value.startsWith("/")) {
        value = value.substr(1);
    }
    if (value.endsWith("/")) {
        value = value.substr(0, value.length - 1);
    }
    if (dict.has(key)) {
        dict.set(key, dict.get(key).concat(value.split("/")));
    } else {
        dict.set(key, value.split("/"))
    }
}).on('close', () => {
let outputContent = "";
for (var [k,v] of dict.entries()) {
    v = [...new Set(v)];
    outputContent += k + "\t" + v.join("\t") + "\n";
}
fs.writeFileSync("a.txt", outputContent);
})
