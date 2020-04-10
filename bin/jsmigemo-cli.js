#!/usr/bin/env node
/**
* jsmigemo-cli.js
*/

const migemo = require('../lib/index.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function help(prgname) {
    const MIGEMO_ABOUT = "jsmigemo - Js/Migemo Library";
    console.log(`${MIGEMO_ABOUT}\n
    \n
    USAGE: ${prgname} [OPTIONS]\n
    \n
    OPTIONS:\n
      -d --dict <dict>	Use a file <dict> for dictionary.\n
      -q --quiet		Show no message except results.\n
      -v --vim		Use vim style regexp.\n
      -e --emacs		Use emacs style regexp.\n
      -n --nonewline	Don't use newline match.\n
      -w --word <word>	Expand a <word> and soon exit.\n
      -h --help		Show this message.`);
}

let mode_vim = false;
let mode_emacs = false;
let mode_nonewline = false;
let mode_quiet = false;
let mode_help = false;
let file = path.join(migemo.migemo_module_path, '../migemo-compact-dict');
let word = null;
let prgname = process.argv[1];

for (let i = 2; i < process.argv.length; i++) {
    let arg = process.argv[i];
    switch (arg) {
        case '--vim':
        case '-v':
            mode_vim = true;
            break;
        case '--emacs':
        case '-e':
            mode_emacs = true;
            break;
        case '--nonewline':
        case '-n':
            mode_nonewline = true;
            break;
        case '--dict':
        case '-d':
            i++;
            file = process.argv[i];
            break;
        case '--word':
        case '-w':
            i++;
            word = process.argv[i];
            break;
        case '--quite':
        case '-q':
            mode_quiet = true;
            break;
        case '--help':
        case '-h':
            mode_help = true;
            break;
        default:
            console.error("Invalid option (Ignored): %s", arg);
            break;
    }
}
if (mode_help) {
    help(prgname);
    exit(0);
}

let buffer = fs.readFileSync(file);
let ab = new ArrayBuffer(buffer.length);
let view = new Uint8Array(ab);
buffer.copy(view);
let dict = new migemo.CompactDictionary(ab);

let rxop = ["|", "(", ")", "[", "]", ""];
if (mode_vim) {
    if (mode_nonewline) {
        rxop = ["\\|", "\\%(", "\\)", "[", "]", ""];
    } else {
        rxop = ["\\|", "\\%(", "\\)", "[", "]", "\\_s*"];
    }
}
else if (mode_emacs) {
    if (mode_nonewline) {
        rxop = ["\\|", "\\(", "\\)", "[", "]", ""];
    } else {
        rxop = ["\\|", "\\(", "\\)", "[", "]", "\\s-*"];
    }
}

let m = new migemo.Migemo(rxop);
m.setDict(dict);
m.setRxop(rxop);

if (word != null) {
    console.log(m.query(word));
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: mode_quiet ? '' : 'QUERY: '
    });

    rl.prompt();

    rl.on('line', (line) => {
        console.log((mode_quiet ? '' : 'PATTERN: ') + m.query(line.trim()));
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}
