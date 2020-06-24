import { exception } from "console";

export class DoubleArray {
    base: Int16Array;
    check: Int16Array;
    charConverter: (arg: number)=>number;
    charSize: number;

    constructor(base: Int16Array, check: Int16Array, charConverter: (arg: number)=>number, charSize: number) {
        this.base = base;
        this.check = check;
        this.charConverter = charConverter;
        this.charSize = charSize;
    }

    public traverse(n: number, k: number): number {
        const m = this.base[n] + k;
        if (this.check[m] == n) {
            return m;
        } else {
            return -1;
        }
    }

    public lookup(str: string): number {
        if (str.length == 0) {
            return 0;
        }
        let n = 0;
        for (let i = 0; i < str.length; i++) {
            const c = this.charConverter(str.charCodeAt(i))
            if (c < 1) {
                throw new Error()
            }
            n = this.traverse(n, c);
            if (n == -1) {
                return -1
            }
        }
        return n;
    }

    public *commonPrefixSearch(key: string): IterableIterator<number> {
        let index = 0;
        let offset = 0;
        while (index != -1) {
            const lastIndex = index;
            if (offset == key.length) {
                index = -1
            } else {
                const c = this.charConverter(key.charCodeAt(offset));
                index = this.traverse(index, c);
                offset++;
            }
            yield lastIndex;
        }
    }

    public *predictiveSearch(key: string): IterableIterator<number> {
        const n = this.lookup(key);
        if (n == -1) {
            return;
        }
        yield *this.visitRecursive(n);
    }

    public *visitRecursive(n: number): IterableIterator<number> {
        yield n;
        for (let i = 0; i < this.charSize; i++) {
            const m = this.base[n] + i + 1
            if (m >= this.check.length) {
                return;
            }
            if (this.check[m] == n) {
                this.visitRecursive(m);
            }
        }
    }

}