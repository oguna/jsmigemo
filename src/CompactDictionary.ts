import { LOUDSTrie } from "./LOUDSTrie";
import { BitVector } from "./BitVector";
import { BitList } from "./BitList";

export class CompactDictionary {
    keyTrie: LOUDSTrie;
    valueTrie: LOUDSTrie;
    mappingBitVector: BitVector;
    mapping: Int32Array;
    hasMappingBitList: BitList;

    constructor(buffer: ArrayBuffer) {
        let dv = new DataView(buffer);
        let offset = 0;
        [this.keyTrie, offset] = CompactDictionary.readTrie(dv, offset, true);
        [this.valueTrie, offset] = CompactDictionary.readTrie(dv, offset, false);
        let mappingBitVectorSize = dv.getUint32(offset);
        offset += 4;
        let mappingBitVectorWords = new Uint32Array(((mappingBitVectorSize + 63) >> 6) * 2);
        for (let i = 0; i < mappingBitVectorWords.length >> 1; i++) {
            mappingBitVectorWords[i * 2 + 1] = dv.getUint32(offset);
            offset += 4;
            mappingBitVectorWords[i * 2] = dv.getUint32(offset);
            offset += 4;
        }
        this.mappingBitVector = new BitVector(mappingBitVectorWords, mappingBitVectorSize);
        let mappingSize = dv.getUint32(offset);
        offset += 4;
        this.mapping = new Int32Array(mappingSize);
        for (let i = 0; i < mappingSize; i++) {
            this.mapping[i] = dv.getInt32(offset);
            offset += 4;
        }
        if (offset != buffer.byteLength) {
            throw new Error();
        }
        this.hasMappingBitList = CompactDictionary.createHasMappingBitList(this.mappingBitVector)
    }

    private static readTrie(dv: DataView, offset: number, compactHiragana: boolean): [LOUDSTrie, number] {
        let keyTrieEdgeSize = dv.getInt32(offset);
        offset += 4;
        let keyTrieEdges = new Uint16Array(keyTrieEdgeSize);
        for (let i = 0; i < keyTrieEdgeSize; i++) {
            let c: number;
            if (compactHiragana) {
                c = this.decode(dv.getUint8(offset));
                offset += 1;
            } else {
                c = dv.getUint16(offset);
                offset += 2;
            }
            keyTrieEdges[i] = c;
        }
        let keyTrieBitVectorSize = dv.getUint32(offset);
        offset += 4;
        let keyTrieBitVectorWords = new Uint32Array(((keyTrieBitVectorSize + 63) >> 6) * 2);
        for (let i = 0; i < keyTrieBitVectorWords.length >>> 1; i++) {
            keyTrieBitVectorWords[i * 2 + 1] = dv.getUint32(offset);
            offset += 4;
            keyTrieBitVectorWords[i * 2] = dv.getUint32(offset);
            offset += 4;
        }
        return [new LOUDSTrie(new BitVector(keyTrieBitVectorWords, keyTrieBitVectorSize), keyTrieEdges), offset];
    }

    private static decode(c: number): number {
        if (0x20 <= c && c <= 0x7e) {
            return c;
        }
        if (0xa1 <= c && c <= 0xf6) {
            return (c + 0x3040 - 0xa0);
        }
        throw new RangeError();
    }

    private static encode(c: number): number {
        if (0x20 <= c && c <= 0x7e) {
            return c;
        }
        if (0x3041 <= c && c <= 0x3096) {
            return (c - 0x3040 + 0xa0);
        }
        if (0x30fc == c) {
            return (c - 0x3040 + 0xa0);
        }
        throw new RangeError();
    }

    private static createHasMappingBitList(mappingBitVector: BitVector) {
        let numOfNodes = mappingBitVector.rank(mappingBitVector.size() + 1, false)
        let bitList = new BitList(numOfNodes)
        let bitPosition = 0
        for (let node = 1; node < numOfNodes; node++) {
            let hasMapping = mappingBitVector.get(bitPosition + 1)
            bitList.set(node, hasMapping)
            bitPosition = mappingBitVector.nextClearBit(bitPosition + 1)
        }
        return bitList
    }

    *search(key: string): IterableIterator<string> {
        let keyIndex = this.keyTrie.lookup(key);
        if (keyIndex != -1 && this.hasMappingBitList.get(keyIndex)) {
            let valueStartPos = this.mappingBitVector.select(keyIndex, false);
            let valueEndPos = this.mappingBitVector.nextClearBit(valueStartPos + 1);
            let size = valueEndPos - valueStartPos - 1;
            if (size > 0) {
                let offset = this.mappingBitVector.rank(valueStartPos, false);
                let result = new Array<string>(size);
                for (let i = 0; i < result.length; i++) {
                    yield this.valueTrie.reverseLookup(this.mapping[valueStartPos - offset + i]);
                }
                return result;
            }
        }
    }

    *predictiveSearch(key: string): IterableIterator<string> {
        let keyIndex = this.keyTrie.lookup(key);
        if (keyIndex > 1) {
            for (let i of this.keyTrie.predictiveSearch(keyIndex)) {
                if (this.hasMappingBitList.get(i)) {
                    let valueStartPos = this.mappingBitVector.select(i, false);
                    let valueEndPos = this.mappingBitVector.nextClearBit(valueStartPos + 1);
                    let size = valueEndPos - valueStartPos - 1;
                    let offset = this.mappingBitVector.rank(valueStartPos, false);
                    for (let j = 0; j < size; j++) {
                        yield this.valueTrie.reverseLookup(this.mapping[valueStartPos - offset + j]);
                    }
                }
            }
        }
    }
}