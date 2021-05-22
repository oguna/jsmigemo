import { LOUDSTrieBuilder } from "../src/LOUDSTrieBuilder";

describe('LOUDSTrieBuilder', () => {
    describe('#build()', () => {
        it('tiny', () => {
            const words = new Array<string>();
            words.push('baby');
            words.push('bad');
            words.push('bank');
            words.push('box');
            words.push('dad');
            words.push('dance');
            const trie = LOUDSTrieBuilder.build(words)[0];
            expect(trie.lookup('box')).toBe(10);
            expect(trie.bitVector.words.toString()).toBe(Uint32Array.from([1145789805, 0]).toString());
            expect(trie.bitVector.sizeInBits).toBe(32);
            expect(trie.edges.join()).toBe([32, 32, 98, 100, 97, 111, 97, 98, 100, 110, 120, 100, 110, 121,107, 99, 101].toString());
        });
        it('tiny2', function () {
            const words = new Array<string>();
            words.push('a');
            words.push('aa');
            words.push('ab');
            words.push('bb');
            const trie = LOUDSTrieBuilder.build(words)[0];
            expect(trie.lookup("")).toBe(1);
            expect(trie.lookup("a")).toBe(2);
            expect(trie.lookup("b"),).toBe(3);
            expect(trie.lookup("aa")).toBe(4);
            expect(trie.lookup("ab")).toBe(5);
            expect(trie.lookup("bb")).toBe(6);
            expect(trie.lookup("bbb")).toBe(-1);
            expect(trie.lookup("c")).toBe(-1);
            expect(trie.bitVector.words.join()).toBe([365, 0].join());
            expect(trie.bitVector.sizeInBits).toBe(12);
            expect(trie.edges.join()).toBe([32, 32, 97, 98, 97, 98, 98].join());
        });
    });
});