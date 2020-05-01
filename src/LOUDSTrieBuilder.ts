import { LOUDSTrie } from "./LOUDSTrie";
import { BitVector } from "./BitVector";
import { BitList } from "./BitList";

export class LOUDSTrieBuilder {
    static build(keys: string[]): [LOUDSTrie, Uint32Array] {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == null) {
                throw new Error();
            }
            if (i > 0 && keys[i - 1] > keys[i]) {
                throw new Error();
            }
        }
        let nodes = new Uint32Array(keys.length)
        for (let i = 0; i < nodes.length; i++) {
            nodes[i] = 1
        }
        let cursor = 0
        let currentNode = 1
        let edges = "  "
        let louds = new BitList()
        louds.add(true)
        while (true) {
            let lastChar = 0
            let lastParent = 0
            let restKeys = 0
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].length < cursor) {
                    continue
                }
                if (keys[i].length == cursor) {
                    louds.add(false)
                    lastParent = nodes[i]
                    lastChar = 0
                    continue
                }
                let currentChar = keys[i].charCodeAt(cursor)
                let currentParent = nodes[i]
                if (lastParent != currentParent) {
                    louds.add(false)
                    louds.add(true)
                    edges += String.fromCharCode(currentChar)
                    currentNode = currentNode + 1
                } else if (lastChar != currentChar) {
                    louds.add(true)
                    edges += String.fromCharCode(currentChar)
                    currentNode = currentNode + 1
                }
                nodes[i] = currentNode
                lastChar = currentChar
                lastParent = currentParent
                restKeys++
            }
            if (restKeys == 0) {
                break
            }
            cursor++
        }
        let bitVectorWords = new Uint32Array(louds.words.buffer, 0, ((louds.size + 63) >> 6) * 2)
        let bitVector = new BitVector(bitVectorWords, louds.size)
        let uint16Edges = new Uint16Array(edges.length)
        for (let i = 0; i< edges.length; i++) {
            uint16Edges[i] = edges.charCodeAt(i)
        }
        return [new LOUDSTrie(bitVector, uint16Edges), nodes]
    }
}