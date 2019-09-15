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
            let builder = LOUDSTrieBuilder.build(words);
            assert.equal(builder.get('box'), 10);
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
        });
    });
});