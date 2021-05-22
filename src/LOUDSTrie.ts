import { binarySearchUint16 } from "./utils";
import { BitVector } from "./BitVector";

export class LOUDSTrie {
    bitVector: BitVector;
    edges: Uint16Array;

    constructor(bitVector: BitVector, edges: Uint16Array) {
        this.bitVector = bitVector;
        this.edges = edges;
    }

    reverseLookup(index: number): string {
        if (index <= 0 || this.edges.length <= index) {
            throw new RangeError();
        }
        let sb = new Array<number>();
        while (index > 1) {
            sb.push(this.edges[index]);
            index = this.parent(index);
        }
        return sb.reverse().map(v => String.fromCharCode(v)).join('');
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
        let result = binarySearchUint16(this.edges, firstChild, firstChild + childSize, c);
        return result >= 0 ? result : -1;
    }

    lookup(key: string): number {
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

    *predictiveSearch(index: number): IterableIterator<number> {
        let lower = index;
        let upper = index + 1;
        while (upper - lower > 0) {
            for (let i = lower; i < upper; i++) {
                yield i;
            }
            lower = this.bitVector.rank(this.bitVector.select(lower, false) + 1, true) + 1;
            upper = this.bitVector.rank(this.bitVector.select(upper, false) + 1, true) + 1;
        }
    }

    size() {
        return this.edges.length - 2;
    }
}