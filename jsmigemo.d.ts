declare module "utils" {
    export function binarySearch(a: number[], fromIndex: number, toIndex: number, key: number): number;
    export function binarySearchChar(a: string, fromIndex: number, toIndex: number, key: number): number;
    export function binarySearchString(a: string[], fromIndex: number, toIndex: number, key: string): number;
    export function bitCount(i: number): number;
    export function numberOfTrailingZeros(i: number): number;
}
declare module "BitVector" {
    export class BitVector {
        words: Uint32Array;
        sizeInBits: number;
        lb: Uint32Array;
        sb: Uint16Array;
        constructor(words: Uint32Array, sizeInBits: number);
        rank(pos: number, b: boolean): number;
        select(count: number, b: boolean): number;
        private lowerBoundBinarySearchLB;
        private lowerBoundBinarySearchSB;
        nextClearBit(fromIndex: number): number;
        size(): number;
        get(pos: number): boolean;
    }
}
declare module "LOUDSTrie" {
    import { BitVector } from "BitVector";
    export class LOUDSTrie {
        bitVector: BitVector;
        edges: string;
        constructor(bitVector: BitVector, edges: string);
        getKey(index: number): string;
        parent(x: number): number;
        firstChild(x: number): number;
        traverse(index: number, c: number): number;
        get(key: string): number;
        iterator(index: number): IterableIterator<number>;
        size(): number;
    }
}
declare module "CompactDictionary" {
    import { LOUDSTrie } from "LOUDSTrie";
    import { BitVector } from "BitVector";
    export class CompactDictionary {
        keyTrie: LOUDSTrie;
        valueTrie: LOUDSTrie;
        mappingBitVector: BitVector;
        mapping: Int32Array;
        constructor(buffer: ArrayBuffer);
        private static readTrie;
        private static decode;
        private static encode;
        search(key: string): IterableIterator<string>;
        predictiveSearch(key: string): IterableIterator<string>;
    }
}
declare module "RegexGenerator" {
    export class RegexNode {
        code: string;
        child: RegexNode | null;
        next: RegexNode | null;
        constructor(code: string);
    }
    export class RegexGenerator {
        or: string;
        beginGroup: string;
        endGroup: string;
        beginClass: string;
        endClass: string;
        newline: string;
        root: RegexNode | null;
        constructor(or: string, beginGroup: string, endGroup: string, beginClass: string, endClass: string, newline: string);
        static getDEFAULT(): RegexGenerator;
        static _add(node: RegexNode | null, word: string, offset: number): RegexNode | null;
        add(word: string): void;
        _generateStub(node: RegexNode | null): string;
        generate(): string;
    }
}
declare module "RomajiProcessor" {
    class RomanEntry {
        roman: string;
        hiragana: string;
        remain: number;
        index: number;
        constructor(roman: string, hiragana: string, remain: number);
        static _calculateIndex(roman: string, start: number, end: number): number;
        static calculateIndex(roman: string): number;
    }
    class RomajiPredictiveResult {
        estaglishedHiragana: string;
        predictiveSuffixes: Set<string>;
        constructor(estaglishedHiragana: string, predictiveSuffixes: Set<string>);
    }
    export function romajiToHiragana(romaji: string): string;
    export function findRomanEntryPredicatively(roman: string, offset: number): Set<RomanEntry>;
    export function romajiToHiraganaPredictively(romaji: string): RomajiPredictiveResult;
}
declare module "Migemo" {
    import { CompactDictionary } from "CompactDictionary";
    export class Migemo {
        dict: CompactDictionary | null;
        constructor();
        queryAWord(word: string): string;
        query(word: string): string;
        setDict(dict: CompactDictionary | null): void;
        parseQuery(query: string): IterableIterator<string>;
    }
}
declare module "RomanEntry" {
    export function romajiToHiragana(romaji: string): string;
}
declare module "SimpleDictionary" { }
declare module "index" {
    export * from "Migemo";
    export * from "CompactDictionary";
}
