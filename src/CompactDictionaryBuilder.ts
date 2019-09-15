import { LOUDSTrieBuilder } from "./LOUDSTrieBuilder";
import { CompactHiraganaString } from "./CompactHiraganaString";

export class CompactDictionaryBuilder {
    public static build(dict: Map<string, string[]>): ArrayBuffer {
        // build key trie
        const t0 = performance.now();
        const keys = Array.from(dict.keys());
        const generatedKeyIndex = new Uint32Array(keys.length);
        const keyTrie = LOUDSTrieBuilder.build(keys, generatedKeyIndex);

        // build value trie
        const t1 = performance.now();
        const values = new Array<string>();
        dict.forEach((value, key, map) => {
            for (const v in value) {
                values.push(v);
            }
        })
        const valueTrie = LOUDSTrieBuilder.build(values);

        // build trie mapping
        const t2 = performance.now();
        const mappingCount = values.length;
        const mapping = new Uint32Array(mappingCount);
        let mappingIndex = 0;
        const mappingBitSet = new Array<boolean>(keyTrie.size() + mappingCount); 
        let mappingBitSetIndex = 0;
        for (let i = 1; i <= keyTrie.size(); i++) {
            const key = keyTrie.getKey(i);
            mappingBitSet[mappingBitSetIndex++] = false;
            const value = dict.get(key);
            if (value !== undefined) {
                for (let j = 0; j < value.length; j++) {
                    mappingBitSet[mappingBitSetIndex++] = true;
                    mapping[mappingIndex++] = valueTrie.get(value[j]);
                }
            }
        } 

        // calculate output size
        const keyTrieDataSize = 8 + keyTrie.edges.length + Math.floor((keyTrie.bitVector.size() + 63) / 64) * 5;
        const valueTrieDataSize = 8 + valueTrie.edges.length + Math.floor((valueTrie.bitVector.size() + 63) / 64) * 5;
        const mappingDataSize = 8 + Math.floor((mappingBitSet.length + 63) / 64) * 5 + Math.floor((mapping.length + 63) / 64) * 5;
        const outputDataSize = keyTrieDataSize + valueTrieDataSize + mappingDataSize;

        // ready output
        const t3 = performance.now();
        const arrayBuffer = new ArrayBuffer(outputDataSize);
        const dataView = new DataView(arrayBuffer);
        let dataViewIndex = 0;

        // output key trie
        const t4 = performance.now();
        dataView.setInt32(dataViewIndex, keyTrie.edges.length);
        dataViewIndex += 4;
        for (let i = 0; i < keyTrie.edges.length; i++) {
            const compactChar = CompactHiraganaString.encodeChar(keyTrie.edges[i]);
            dataView.setUint8(dataViewIndex, compactChar);
            dataViewIndex += 1;
        }
        dataView.setInt32(dataViewIndex, keyTrie.bitVector.size());
        dataViewIndex += 4;
        const keyTrieBitVectorWords = keyTrie.bitVector.words;
        for (let i = 0; i < keyTrieBitVectorWords.length; i++) {
            dataView.setUint32(dataViewIndex, keyTrieBitVectorWords[i]);
            dataViewIndex += 4;
        }

        // output value trie
        const t5 = performance.now();
        dataView.setInt32(dataViewIndex, valueTrie.edges.length);
        dataViewIndex += 4;
        for (let i = 0; i < valueTrie.edges.length; i++) {
            dataView.setUint8(dataViewIndex, valueTrie.edges.charCodeAt(i));
            dataViewIndex += 1;
        }
        dataView.setInt32(dataViewIndex, valueTrie.bitVector.size());
        dataViewIndex += 4;
        const valueTrieBitVectorWords = valueTrie.bitVector.words;
        for (let i = 0; i < valueTrieBitVectorWords.length; i++) {
            dataView.setUint32(dataViewIndex, valueTrieBitVectorWords[i]);
            dataViewIndex += 4;
        }
        
        // output mapping
        const t6 = performance.now();
        dataView.setInt32(dataViewIndex, mappingBitSetIndex);
        dataViewIndex += 4;
        const mappingWords = this.bitSetToIntArray(mappingBitSet);
        for (let i = 0; i < mappingWords.length; i++) {
            dataView.setUint32(dataViewIndex, mappingWords[i]);
            dataViewIndex += 4;
        }
        dataView.setInt32(dataViewIndex, mappingWords.length);
        dataViewIndex += 4;
        for (let i = 0; i < mapping.length; i++) {
            dataView.setUint32(dataViewIndex, mapping[i]);
            dataViewIndex += 4;
        }

        const t7 = performance.now();
        return arrayBuffer;
    }

    private static bitSetToIntArray(bitSet: boolean[]): Uint32Array {
        const uint32Length = (bitSet.length + 31) / 32;
        const result = new Uint32Array(uint32Length);
        for (let i = 0; i < bitSet.length; i++) {
            result[i / 32] |= (bitSet[i] ? 1 : 0) << (i % 32);
        }
        return result;
    }
}