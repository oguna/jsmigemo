import { LOUDSTrie } from "./LOUDSTrie";
import { BitVector } from "./BitVector";

export class LOUDSTrieBuilder {
    static build(keys:string[], generatedIndexes: Uint32Array|undefined = undefined): LOUDSTrie {
        let memo: Uint32Array;
        if (generatedIndexes === undefined) {
            memo = new Uint32Array(keys.length);
        } else if (generatedIndexes.length == keys.length) {
            memo = generatedIndexes!;
        } else {
            throw new Error();
        }
        
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == null) {
                throw new Error();
            }
            if (i > 0 && keys[i - 1] > keys[i]) {
                throw new Error();
            }
        }
        for (let i = 0; i < memo.length; i++) {
            memo[i] = 1;
        }
        let offset = 0;
        let currentNode = 1;
        let edges = [0x30, 0x30]; // TODO: '0'で穴埋めを'\0'にするか、なくす
        let childSizes = new Uint32Array(128);
        while (true) {
            let lastChar = 0;
            let lastParent = 0;
            let restKeys = 0;
            for (let i = 0; i < keys.length; i++) {
                if (memo[i] < 0) {
                    continue;
                }
                if (keys[i].length <= offset) {
                    memo[i] = -memo[i];
                    continue;
                }
                let currentChar = keys[i].charCodeAt(offset);
                let currentParent = memo[i];
                if (lastChar != currentChar || lastParent != currentParent) {
                    if (childSizes.length <= memo[i]) {
                        const tmp = new Uint32Array(childSizes.length * 2);
                        tmp.set(childSizes, 0);
                        childSizes = tmp;
                    }
                    childSizes[memo[i]]++;
                    currentNode++;
                    edges.push(currentChar);
                    lastChar = currentChar;
                    lastParent = currentParent;
                }
                memo[i] = currentNode;
                restKeys++;
            }
            if (restKeys == 0) {
                break;
            }
            offset++;
        }

        for (let i = 0; i < memo.length; i++) {
            memo[i] = -memo[i];
        }

        let numOfChildren = 0;
        for (let i = 1; i <= currentNode; i++) {
            numOfChildren += childSizes[i];
        }
        let numOfNodes = currentNode;
        let bitVectorWords = new Uint32Array(((numOfChildren + numOfNodes + 63 + 1) >> 6 )* 2);
        let bitVectorIndex = 1;
        bitVectorWords[0] = 1;
        for (let i = 1; i <= currentNode; i++) {
            bitVectorIndex++;
            let childSize = childSizes[i];
            for (let j = 0; j < childSize; j++) {
                bitVectorWords[bitVectorIndex >> 5] |= 1 << (bitVectorIndex & 31);
                bitVectorIndex++;
            }
        }

        let bitVector = new BitVector(bitVectorWords, bitVectorIndex);
        return new LOUDSTrie(bitVector, new Uint16Array(edges));
    }
}