import { LOUDSTrieBuilder } from "./LOUDSTrieBuilder";
import { CompactHiraganaString } from "./CompactHiraganaString";
import { BitList } from "./BitList";

export class CompactDictionaryBuilder {
    public static build(dict: Map<string, string[]>): ArrayBuffer {
        // remove some keys
        const keysToRemove = new Array<string>();
        for (const key of dict.keys()) {
            try {
                CompactHiraganaString.encodeString(key);
            } catch (e) {
                keysToRemove.push(key);
                console.log("skipped the world: " + key);
            }
        }
        for (const key of keysToRemove) {
            dict.delete(key);
        }

        // build key trie
        const keys = Array.from(dict.keys()).sort();
        const keyTrie = LOUDSTrieBuilder.build(keys)[0];

        // build value trie
        const valuesSet = new Set<string>();
        for (const value of dict.values()) {
            for (const v of value) {
                valuesSet.add(v);
            }
        }
        const values = Array.from(valuesSet.values()).sort();
        const valueTrie = LOUDSTrieBuilder.build(values)[0];

        // build trie mapping
        let mappingCount = 0;
        for (const i of dict.values()) {
            mappingCount += i.length;
        }
        const mapping = new Uint32Array(mappingCount);
        let mappingIndex = 0;
        const mappingBitList = new BitList();
        for (let i = 1; i <= keyTrie.size(); i++) {
            let key = keyTrie.reverseLookup(i);
            mappingBitList.add(false);
            let values = dict.get(key);
            if (values != undefined) {
                for (let j = 0; j < values.length; j++) {
                    mappingBitList.add(true);
                    mapping[mappingIndex] = valueTrie.lookup(values[j]);
                    mappingIndex++;
                }
            }
        }

        // calculate output size
        const keyTrieDataSize = 8 + keyTrie.edges.length + ((keyTrie.bitVector.size() + 63) >>> 6) * 8;
        const valueTrieDataSize = 8 + valueTrie.edges.length * 2 + ((valueTrie.bitVector.size() + 63) >>> 6) * 8;
        const mappingDataSize = 8 + ((mappingBitList.size + 63) >>> 6) * 8 + mapping.length * 4;
        const outputDataSize = keyTrieDataSize + valueTrieDataSize + mappingDataSize;

        // ready output
        const arrayBuffer = new ArrayBuffer(outputDataSize);
        const dataView = new DataView(arrayBuffer);
        let dataViewIndex = 0;

        // output key trie
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
        for (let i = 0; i < keyTrieBitVectorWords.length >>> 1; i++) {
            dataView.setUint32(dataViewIndex, keyTrieBitVectorWords[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, keyTrieBitVectorWords[i * 2]);
            dataViewIndex += 4;
        }

        // output value trie
        dataView.setInt32(dataViewIndex, valueTrie.edges.length);
        dataViewIndex += 4;
        for (let i = 0; i < valueTrie.edges.length; i++) {
            dataView.setUint16(dataViewIndex, valueTrie.edges[i]);
            dataViewIndex += 2;
        }
        dataView.setInt32(dataViewIndex, valueTrie.bitVector.size());
        dataViewIndex += 4;
        const valueTrieBitVectorWords = valueTrie.bitVector.words;
        for (let i = 0; i < valueTrieBitVectorWords.length >>> 1; i++) {
            dataView.setUint32(dataViewIndex, valueTrieBitVectorWords[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, valueTrieBitVectorWords[i * 2]);
            dataViewIndex += 4;
        }
        
        // output mapping
        dataView.setInt32(dataViewIndex, mappingBitList.size);
        dataViewIndex += 4;
        const mappingWordsLen = (mappingBitList.size + 63) >> 6;
        for (let i = 0; i < mappingWordsLen; i++) {
            dataView.setUint32(dataViewIndex, mappingBitList.words[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, mappingBitList.words[i * 2]);
            dataViewIndex += 4;
        }
        // TODO: padding to 64bit words
        dataView.setInt32(dataViewIndex, mapping.length);
        dataViewIndex += 4;
        for (let i = 0; i < mapping.length; i++) {
            dataView.setUint32(dataViewIndex, mapping[i]);
            dataViewIndex += 4;
        }

        // check data size
        if (dataViewIndex !== outputDataSize) {
            throw new Error(`file size is not valid: expected=${outputDataSize} actual=${dataViewIndex}`);
        }

        return arrayBuffer;
    }
}