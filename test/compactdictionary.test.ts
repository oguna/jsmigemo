import { describe, it } from "mocha";
import { assert } from "chai"
import { CompactDictionary } from "../lib/CompactDictionary";
import { readFileSync } from "fs";

describe('CompactDictionary', function () {
    describe('#constructor()', function () {
        it('constructor', function () {
            let buff = readFileSync('migemo-compact-dict');
            function toArrayBuffer(buffer: Buffer): ArrayBuffer {
                var ab = new ArrayBuffer(buffer.length);
                var view = new Uint8Array(ab);
                for (var i = 0; i < buffer.length; ++i) {
                    view[i] = buffer[i];
                }
                return ab;
            }
            let arrayBuff = toArrayBuffer(buff);
            let dict = new CompactDictionary(arrayBuff);
            let it = dict.search("きかい");
            let result = it.next();
            let list = []
            while (!result.done) {
                list.push(result.value);
                result = it.next();
            }
            assert.include(list, "機械");
        });
    });
});