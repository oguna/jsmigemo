import { DoubleArray } from "../src/DoubleArray";

describe('DoubleArray', () => {
    it('lookup', () => {
        const base = new Int16Array([0, 3, -1, -1, 2, -1, -1, -1, -1]);
        const check = new Int16Array([-1, 0, 0, 4, 0, 1, 1, -1, -1]);
        const charConverter = function (c: number): number {
            if (0x61 <= c && c <= 0x7a) {
                return c-0x61 + 1
            } else {
                return -1
            }
        }
        const charSize = 26;
        const trie = new DoubleArray(base, check, charConverter, charSize);
        expect(trie.lookup("")).toBe(0);
        expect(trie.lookup("a")).toBe(1);
        expect(trie.lookup("ab")).toBe(5);
        expect(trie.lookup("ac")).toBe(6);
        expect(trie.lookup("b")).toBe(2);
        expect(trie.lookup("d")).toBe(4);
        expect(trie.lookup("da")).toBe(3);
        expect(trie.lookup("c")).toBe(-1);
    });

    it('predictiveSearch', () => {
        const base = new Int16Array([0, 3, -1, -1, 2, -1, -1, -1, -1]);
        const check = new Int16Array([-1, 0, 0, 4, 0, 1, 1, -1, -1]);
        const charConverter = function (c: number): number {
            if (0x61 <= c && c <= 0x7a) {
                return c-0x61 + 1
            } else {
                return -1
            }
        }
        const charSize = 26;
        const trie = new DoubleArray(base, check, charConverter, charSize);
        const actual1 = Array.from(trie.predictiveSearch("ab"));
        expect(actual1).toEqual([5]);
        const actual2 = Array.from(trie.predictiveSearch("a"));
        expect(actual2).toEqual([1, 5, 6]);
    });

    it('commonPrefixSearch', () => {
        const base = new Int16Array([0, 3, -1, -1, 2, -1, -1, -1, -1]);
        const check = new Int16Array([-1, 0, 0, 4, 0, 1, 1, -1, -1]);
        const charConverter = function (c: number): number {
            if (0x61 <= c && c <= 0x7a) {
                return c-0x61 + 1
            } else {
                return -1
            }
        }
        const charSize = 26;
        const trie = new DoubleArray(base, check, charConverter, charSize);
        const actual1 = Array.from(trie.commonPrefixSearch("ab"))
        expect(actual1).toEqual([0, 1, 5]);
        const actual2 = Array.from(trie.commonPrefixSearch("ac"));
        expect(actual2).toEqual([0, 1, 6]);
        const actual3 = Array.from(trie.commonPrefixSearch("b"));
        expect(actual3).toEqual([0, 2]);
        const actual4 = Array.from(trie.commonPrefixSearch(""));
        expect(actual4).toEqual([0]);
        const actual5 = Array.from(trie.commonPrefixSearch("c"));
        expect(actual5).toEqual([0]);
    });
});