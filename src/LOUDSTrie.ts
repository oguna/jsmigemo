import {binarySearchChar} from "./utils";
import {BitVector} from "./BitVector";

export class LOUDSTrie {
    bitVector: BitVector;
    edges: string;

    constructor(bitVector: BitVector, edges: string) {
        this.bitVector = bitVector;
        this.edges = edges;
    }

    getKey(index: number) {
        if (index <= 0 || this.edges.length <= index) {
            throw new RangeError();
        }
        let sb = "";
        while (index > 1) { 
            sb = this.edges[index] + sb;
            index = this.parent(index);
        }
        return sb;
    }

    parent(x: number): number {
        return this.bitVector.rank(this.bitVector.select(x, true), false);
    }

    firstChild(x: number): number {
        let y = this.bitVector.select(x, false) + 1;
        if (this.bitVector.get(y)) {
            return this.bitVector.rank(y, true) + 1;
        } else {
            return -1;
        }
    }

    traverse(index: number, c: number): number {
        let firstChild = this.firstChild(index);
        if (firstChild == -1) {
            return -1;
        }
        let childStartBit = this.bitVector.select(firstChild, true);
        let childEndBit = this.bitVector.nextClearBit(childStartBit);
        let childSize = childEndBit - childStartBit;
        let result = binarySearchChar(this.edges, firstChild, firstChild + childSize, c);
        return result >= 0 ? result : -1;
    }

    get(key: string) {
        let nodeIndex = 1;
        for (let i = 0; i < key.length; i++) {
            let c = key.charCodeAt(i);
            nodeIndex = this.traverse(nodeIndex, c);
            if (nodeIndex == -1) {
                break;
           }
        }
        return (nodeIndex >= 0) ? nodeIndex : -1;
    }

    *iterator(index: number): IterableIterator<number> {
        yield index;
        let child = this.firstChild(index);
        if (child == -1) {
            return;
        }
        let childPos = this.bitVector.select(child, true);
        while (this.bitVector.get(childPos)) {
            yield *this.iterator(child);
            child++;
            childPos++;
        }
    }

    size() {
        return this.edges.length - 2;
    }
}