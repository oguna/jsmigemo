import { describe, it } from "mocha";
import { assert } from "chai"
import { DoubleArray } from "../src/DoubleArray";

describe('DoubleArray', function () {
    it('lookup', function () {
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
        assert.equal(trie.lookup(""), 0);
        assert.equal(trie.lookup("a"), 1);
        assert.equal(trie.lookup("ab"), 5);
        assert.equal(trie.lookup("ac"), 6);
        assert.equal(trie.lookup("b"), 2);
        assert.equal(trie.lookup("d"), 4);
        assert.equal(trie.lookup("da"), 3);
        assert.equal(trie.lookup("c"), -1);
    });

    it('predictiveSearch', function() {
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
        assert.deepEqual(actual1, [5]);
        const actual2 = Array.from(trie.predictiveSearch("a"));
        assert.deepEqual(actual2, [1]);
    });

    it('commonPrefixSearch', function() {
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
        assert.deepEqual(actual1, [0, 1, 5]);
        const actual2 = Array.from(trie.commonPrefixSearch("ac"));
        assert.deepEqual(actual2, [0, 1, 6]);
        const actual3 = Array.from(trie.commonPrefixSearch("b"));
        assert.deepEqual(actual3, [0, 2]);
        const actual4 = Array.from(trie.commonPrefixSearch(""));
        assert.deepEqual(actual4, [0]);
        const actual5 = Array.from(trie.commonPrefixSearch("c"));
        assert.deepEqual(actual5, [0]);
    });
});