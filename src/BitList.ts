export class BitList {
    words: Uint32Array;
    size: number;
    constructor(size?: number) {
        if (size == undefined) {
            this.words = new Uint32Array(8)
            this.size = 0
        } else {
            this.words = new Uint32Array((size + 31) >> 5)
            this.size = size;
        }
    }
    add(value: boolean) {
        if (this.words.length < (this.size + 1 + 31) >> 5) {
            let newWords = new Uint32Array(this.words.length * 2)
            newWords.set(this.words, 0)
            this.words = newWords
        }
        this.set(this.size, value)
        this.size++
    }

    set(pos: number, value: boolean) {
        if (this.size < pos) {
            throw new Error()
        }
        if (value) {
            this.words[pos >> 5] |= 1 << (pos & 31)
        } else {
            this.words[pos >> 5] &= ~(1 << (pos & 31))
        }
    }

    get(pos: number): boolean {
        if (this.size < pos) {
            throw new Error()
        }
        return ((this.words[pos >> 5] >> (pos & 31)) & 1) == 1
    }
}