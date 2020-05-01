import { describe, it } from "mocha";
import { assert } from "chai"
import { CompactDictionaryBuilder } from "../src/CompactDictionaryBuilder";
import {join} from 'path';
import {createReadStream} from 'fs';
import { createInterface } from 'readline';
import { CompactDictionary } from "../src/CompactDictionary";

describe('CompactDictionaryBuilder', function () {
    describe('#build()', function () {
        it('build', function () {
            let filename = join(__dirname, '/todofuken.txt');
            let rs = createReadStream(filename, 'utf8');
            let rl = createInterface(rs);
            let dict = new Map<string, string[]>();
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
                const d = new CompactDictionary(ab)
                const word = d.search("とうきょうと").next().value
                assert.equal(word, "東京都")
            })
        });
    });
});