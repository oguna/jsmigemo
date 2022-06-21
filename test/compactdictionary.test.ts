import { CompactDictionary } from "../src/CompactDictionary";
import { readFileSync } from "fs";

describe('CompactDictionary', () => {
    describe('#constructor()', () => {
        it('constructor', () => {
            const buff = readFileSync('migemo-compact-dict');
            const dict = new CompactDictionary(buff.buffer);
            const it = dict.search("きかい");
            let result = it.next();
            const list: string[] = []
            while (!result.done) {
                list.push(result.value);
                result = it.next();
            }
            expect(list).toContain("機械");
        });
    });
});