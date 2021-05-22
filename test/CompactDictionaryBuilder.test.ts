import { CompactDictionaryBuilder } from "../src/CompactDictionaryBuilder";
import {join} from 'path';
import {createReadStream} from 'fs';
import { createInterface } from 'readline';
import { CompactDictionary } from "../src/CompactDictionary";

describe('CompactDictionaryBuilder', () => {
    describe('#build()', () => {
        it('build', () => {
            const filename = join(__dirname, '/todofuken.txt');
            const rs = createReadStream(filename, 'utf8');
            const rl = createInterface(rs);
            const dict = new Map<string, string[]>();
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
                expect(word).toBe("東京都")
            })
        });
    });
});