import { assert } from "chai"
import { LOUDSTrieBuilder } from "../src/LOUDSTrieBuilder";

describe('LOUDSTrieBuilder', function () {
    describe('#build()', function () {
        it('tiny', function () {
            let words = new Array<string>();
            words.push('baby');
            words.push('bad');
            words.push('bank');
            words.push('box');
            words.push('dad');
            words.push('dance');
            let trie = LOUDSTrieBuilder.build(words);
            assert.equal(trie.get('box'), 10);
            assert.equal(trie.bitVector.words.toString(), Uint32Array.from([1145789805, 0]).toString());
            assert.equal(trie.bitVector.sizeInBits, 32);
            assert.equal(trie.edges.join(), [48, 48, 98, 100, 97, 111, 97, 98, 100, 110, 120, 100, 110, 121,107, 99, 101].toString())
        });
        it('tiny2', function () {
            let words = new Array<string>();
            words.push('a');
            words.push('aa');
            words.push('ab');
            words.push('bb');
            let trie = LOUDSTrieBuilder.build(words);
            assert.equal(trie.get(""), 1);
            assert.equal(trie.get("a"), 2);
            assert.equal(trie.get("b"), 3);
            assert.equal(trie.get("aa"), 4);
            assert.equal(trie.get("ab"), 5);
            assert.equal(trie.get("bb"), 6);
            assert.equal(trie.get("bbb"), -1);
            assert.equal(trie.get("c"), -1);
            assert.equal(trie.bitVector.words.join(), [365, 0].join());
            assert.equal(trie.bitVector.sizeInBits, 12);
            assert.equal(trie.edges.join(), [48, 48, 97, 98, 97, 98, 98].join())
        });
    });
});