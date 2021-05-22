import { CompactDictionary } from "../src/CompactDictionary";
import { readFileSync } from "fs";

describe('CompactDictionary', () => {
    describe('#constructor()', () => {
        it('constructor', () => {
            const buff = readFileSync('migemo-compact-dict');
            function toArrayBuffer(buffer: Buffer): ArrayBuffer {
                const ab = new ArrayBuffer(buffer.length);
                const view = new Uint8Array(ab);
                for (var i = 0; i < buffer.length; ++i) {
                    view[i] = buffer[i];
                }
                return ab;
            }
            const arrayBuff = toArrayBuffer(buff);
            const dict = new CompactDictionary(arrayBuff);
            const it = dict.search("きかい");
            let result = it.next();
            const list = []
            while (!result.done) {
                list.push(result.value);
                result = it.next();
            }
            expect(list).toContain("機械");
        });
    });
});