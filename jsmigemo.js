define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function binarySearch(a, fromIndex, toIndex, key) {
        var low = fromIndex;
        var high = toIndex - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const midVal = a[mid];
            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid;
        }
        return -(low + 1);
    }
    exports.binarySearch = binarySearch;
    function binarySearchChar(a, fromIndex, toIndex, key) {
        var low = fromIndex;
        var high = toIndex - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const midVal = a.charCodeAt(mid);
            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid;
        }
        return -(low + 1);
    }
    exports.binarySearchChar = binarySearchChar;
    function binarySearchString(a, fromIndex, toIndex, key) {
        var low = fromIndex;
        var high = toIndex - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const midVal = a[mid];
            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid;
        }
         -(low + 1);
    }
    exports.binarySearchString = binarySearchString;
    function bitCount(i) {
        i = i - ((i >>> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
        i = (i + (i >>> 4)) & 0x0f0f0f0f;
        i = i + (i >>> 8);
        i = i + (i >>> 16);
        return i & 0x3f;
    }
    exports.bitCount = bitCount;
    function numberOfTrailingZeros(i) {
        let x, y;
        if (i == 0)
            return 64;
        let n = 63;
        y = i;
        if (y != 0) {
            n = n - 32;
            x = y;
        }
        else
            x = (i >>> 32);
        y = x << 16;
        if (y != 0) {
            n = n - 16;
            x = y;
        }
        y = x << 8;
        if (y != 0) {
            n = n - 8;
            x = y;
        }
        y = x << 4;
        if (y != 0) {
            n = n - 4;
            x = y;
        }
        y = x << 2;
        if (y != 0) {
            n = n - 2;
            x = y;
        }
        return n - ((x << 1) >>> 31);
    }
    exports.numberOfTrailingZeros = numberOfTrailingZeros;
});
define("BitVector", ["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const LB = 512;
    const SB = 64;
    class BitVector {
        constructor(words, sizeInBits) {
            if ((sizeInBits + 63) >> 5 != words.length) {
                throw new Error();
            }
            this.words = words;
            this.sizeInBits = sizeInBits;
            this.lb = new Uint32Array((sizeInBits + 511) >>> 9);
            this.sb = new Uint16Array(this.lb.length * 8);
            let sum = 0;
            let sumInLb = 0;
            for (let i = 0; i < this.sb.length; i++) {
                let bc = i < (this.words.length >>> 1) ? utils_1.bitCount(this.words[i * 2]) + utils_1.bitCount(this.words[i * 2 + 1]) : 0;
                this.sb[i] = sumInLb;
                sumInLb += bc;
                if ((i & 7) == 7) {
                    this.lb[i >> 3] = sum;
                    sum += sumInLb;
                    sumInLb = 0;
                }
            }
        }
        rank(pos, b) {
            // TODO: optimize
            if (pos < 0 && this.sizeInBits <= pos) {
                throw new RangeError();
            }
            let count1 = this.sb[pos >>> 6] + this.lb[pos >>> 9];
            let posInDWord = pos & 63;
            if (posInDWord >= 32) {
                count1 += utils_1.bitCount(this.words[(pos >>> 5) & 0xFFFFFFFE]);
            }
            for (let i = (pos & 0xFFFFFFE0); i < pos; i++) {
                if (this.get(i)) {
                    count1 = count1 + 1;
                }
            }
            return b ? count1 : (pos - count1);
        }
        select(count, b) {
            let lbIndex = this.lowerBoundBinarySearchLB(count, b) - 1;
            let countInLb = count - (b ? this.lb[lbIndex] : (512 * lbIndex - this.lb[lbIndex]));
            let sbIndex = this.lowerBoundBinarySearchSB(countInLb, lbIndex * 8, lbIndex * 8 + 8, b) - 1;
            let countInSb = countInLb - (b ? this.sb[sbIndex] : (64 * (sbIndex % 8) - this.sb[sbIndex]));
            let wordL = this.words[sbIndex * 2];
            let wordU = this.words[sbIndex * 2 + 1];
            if (!b) {
                wordL = ~wordL;
                wordU = ~wordU;
            }
            let lowerBitCount = utils_1.bitCount(wordL);
            let i = 0;
            if (countInSb > lowerBitCount) {
                wordL = wordU;
                countInSb -= lowerBitCount;
                i = 32;
            }
            while (countInSb > 0) {
                countInSb -= wordL & 1;
                wordL >>>= 1;
                i++;
            }
            return sbIndex * 64 + (i - 1);
        }
        lowerBoundBinarySearchLB(key, b) {
            let high = this.lb.length;
            let low = -1;
            while (high - low > 1) {
                let mid = (high + low) >>> 1;
                if ((b ? this.lb[mid] : 512 * mid - this.lb[mid]) < key) {
                    low = mid;
                }
                else {
                    high = mid;
                }
            }
            return high;
        }
        lowerBoundBinarySearchSB(key, fromIndex, toIndex, b) {
            let high = toIndex;
            let low = fromIndex - 1;
            while (high - low > 1) {
                let mid = (high + low) >>> 1;
                if ((b ? this.sb[mid] : 64 * (mid & 7) - this.sb[mid]) < key) {
                    low = mid;
                }
                else {
                    high = mid;
                }
            }
            return high;
        }
        nextClearBit(fromIndex) {
            let u = fromIndex >> 5;
            let word = ~this.words[u] & (0xffffffff << fromIndex);
            while (true) {
                if (word != 0)
                    return (u * 32) + utils_1.numberOfTrailingZeros(word);
                if (++u == this.words.length)
                    return -1;
                word = ~this.words[u];
            }
        }
        size() {
            return this.sizeInBits;
        }
        get(pos) {
            if (pos < 0 && this.sizeInBits <= pos) {
                throw new RangeError();
            }
            return ((this.words[pos >>> 5] >>> (pos & 31)) & 1) == 1;
        }
    }
    exports.BitVector = BitVector;
});
define("LOUDSTrie", ["require", "exports", "utils"], function (require, exports, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LOUDSTrie {
        constructor(bitVector, edges) {
            this.bitVector = bitVector;
            this.edges = edges;
        }
        getKey(index) {
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
        parent(x) {
            return this.bitVector.rank(this.bitVector.select(x, true), false);
        }
        firstChild(x) {
            let y = this.bitVector.select(x, false) + 1;
            if (this.bitVector.get(y)) {
                return this.bitVector.rank(y, true) + 1;
            }
            else {
                return -1;
            }
        }
        traverse(index, c) {
            let firstChild = this.firstChild(index);
            if (firstChild == -1) {
                return -1;
            }
            let childStartBit = this.bitVector.select(firstChild, true);
            let childEndBit = this.bitVector.nextClearBit(childStartBit);
            let childSize = childEndBit - childStartBit;
            let result = utils_2.binarySearchChar(this.edges, firstChild, firstChild + childSize, c);
            return result >= 0 ? result : -1;
        }
        get(key) {
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
        *iterator(index) {
            yield index;
            let child = this.firstChild(index);
            if (child == -1) {
                return;
            }
            let childPos = this.bitVector.select(child, true);
            while (this.bitVector.get(childPos)) {
                yield* this.iterator(child);
                child++;
                childPos++;
            }
        }
        size() {
            return this.edges.length - 2;
        }
    }
    exports.LOUDSTrie = LOUDSTrie;
});
define("CompactDictionary", ["require", "exports", "LOUDSTrie", "BitVector"], function (require, exports, LOUDSTrie_1, BitVector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CompactDictionary {
        constructor(buffer) {
            let dv = new DataView(buffer);
            let offset = 0;
            [this.keyTrie, offset] = CompactDictionary.readTrie(dv, offset, true);
            [this.valueTrie, offset] = CompactDictionary.readTrie(dv, offset, false);
            let mappingBitVectorSize = dv.getUint32(offset);
            offset += 4;
            let mappingBitVectorWords = new Uint32Array(Math.floor((mappingBitVectorSize + 63) / 64) * 2);
            for (let i = 0; i < mappingBitVectorWords.length >> 1; i++) {
                mappingBitVectorWords[i * 2 + 1] = dv.getUint32(offset);
                offset += 4;
                mappingBitVectorWords[i * 2] = dv.getUint32(offset);
                offset += 4;
            }
            this.mappingBitVector = new BitVector_1.BitVector(mappingBitVectorWords, mappingBitVectorSize);
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
        }
        static readTrie(dv, offset, compactHiragana) {
            let keyTrieEdgeSize = dv.getInt32(offset);
            offset += 4;
            let keyTrieEdges = "";
            for (let i = 0; i < keyTrieEdgeSize; i++) {
                let c;
                if (compactHiragana) {
                    c = String.fromCodePoint(this.decode(dv.getUint8(offset)));
                    offset += 1;
                }
                else {
                    c = String.fromCodePoint(dv.getUint16(offset));
                    offset += 2;
                }
                keyTrieEdges = keyTrieEdges + c;
            }
            let keyTrieBitVectorSize = dv.getUint32(offset);
            offset += 4;
            let keyTrieBitVectorWords = new Uint32Array(Math.floor((keyTrieBitVectorSize + 63) / 64) * 2);
            for (let i = 0; i < keyTrieBitVectorWords.length >>> 1; i++) {
                keyTrieBitVectorWords[i * 2 + 1] = dv.getUint32(offset);
                offset += 4;
                keyTrieBitVectorWords[i * 2] = dv.getUint32(offset);
                offset += 4;
            }
            return [new LOUDSTrie_1.LOUDSTrie(new BitVector_1.BitVector(keyTrieBitVectorWords, keyTrieBitVectorSize), keyTrieEdges), offset];
        }
        static decode(c) {
            if (0x20 <= c && c <= 0x7e) {
                return c;
            }
            if (0xa1 <= c && c <= 0xf6) {
                return (c + 0x3040 - 0xa0);
            }
            throw new RangeError();
        }
        static encode(c) {
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
        *search(key) {
            let keyIndex = this.keyTrie.get(key);
            if (keyIndex != -1) {
                let valueStartPos = this.mappingBitVector.select(keyIndex, false);
                let valueEndPos = this.mappingBitVector.nextClearBit(valueStartPos + 1);
                let size = valueEndPos - valueStartPos - 1;
                if (size > 0) {
                    let offset = this.mappingBitVector.rank(valueStartPos, false);
                    let result = new Array(size);
                    for (let i = 0; i < result.length; i++) {
                        yield this.valueTrie.getKey(this.mapping[valueStartPos - offset + i]);
                    }
                    return result;
                }
            }
        }
        *predictiveSearch(key) {
            let keyIndex = this.keyTrie.get(key);
            if (keyIndex > 1) {
                var result = new Array();
                for (let i of this.keyTrie.iterator(keyIndex)) {
                    let valueStartPos = this.mappingBitVector.select(i, false);
                    let valueEndPos = this.mappingBitVector.nextClearBit(valueStartPos + 1);
                    let size = valueEndPos - valueStartPos - 1;
                    let offset = this.mappingBitVector.rank(valueStartPos, false);
                    for (let j = 0; j < size; j++) {
                        yield this.valueTrie.getKey(this.mapping[valueStartPos - offset + j]);
                    }
                }
            }
        }
    }
    exports.CompactDictionary = CompactDictionary;
});
define("RegexGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RegexNode {
        constructor(code) {
            this.code = code;
            this.child = null;
            this.next = null;
        }
    }
    exports.RegexNode = RegexNode;
    class RegexGenerator {
        constructor(or, beginGroup, endGroup, beginClass, endClass, newline) {
            this.or = or;
            this.beginGroup = beginGroup;
            this.endGroup = endGroup;
            this.beginClass = beginClass;
            this.endClass = endClass;
            this.newline = newline;
            this.root = null;
        }
        static getDEFAULT() {
            return new RegexGenerator("|", "(", ")", "[", "]", "");
        }
        static _add(node, word, offset) {
            if (node == null) {
                if (offset >= word.length) {
                    return null;
                }
                node = new RegexNode(word[offset]);
                if (offset < word.length - 1) {
                    node.child = RegexGenerator._add(null, word, offset + 1);
                }
                return node;
            }
            let thisNode = node;
            const code = word[offset];
            if (code < node.code) {
                let newNode = new RegexNode(code);
                newNode.next = node;
                node = newNode;
                if (offset < word.length) {
                    node.child = RegexGenerator._add(null, word, offset + 1);
                }
                thisNode = node;
            }
            else {
                while (node.next != null && node.next.code <= code) {
                    node = node.next;
                }
                if (node.code == code) {
                    if (node.child == null) {
                        return thisNode;
                    }
                }
                else {
                    let newNode = new RegexNode(code);
                    newNode.next = node.next;
                    node.next = newNode;
                    node = newNode;
                }
                if (word.length == offset + 1) {
                    node.child = null;
                    return thisNode;
                }
                node.child = RegexGenerator._add(node.child, word, offset + 1);
            }
            return thisNode;
        }
        add(word) {
            if (word.length == 0) {
                return;
            }
            this.root = RegexGenerator._add(this.root, word, 0);
        }
        _generateStub(node) {
            const escapeCharacters = "\\.[]{}()*+-?^$|";
            let brother = 1;
            let haschild = 0;
            let buf = "";
            for (let tmp = node; tmp != null; tmp = tmp.next) {
                if (tmp.next != null) {
                    brother++;
                }
                if (tmp.child != null) {
                    haschild++;
                }
            }
            let nochild = brother - haschild;
            if (brother > 1 && haschild > 0) {
                buf += this.beginGroup;
            }
            if (nochild > 0) {
                if (nochild > 1) {
                    buf = buf + this.beginClass;
                }
                for (let tmp = node; tmp != null; tmp = tmp.next) {
                    if (tmp.child != null) {
                        continue;
                    }
                    if (escapeCharacters.indexOf(tmp.code) != -1) {
                        buf = buf + "\\";
                    }
                    buf = buf + tmp.code;
                }
                if (nochild > 1) {
                    buf += this.endClass;
                }
            }
            if (haschild > 0) {
                if (nochild > 0) {
                    buf += this.or;
                }
                let tmp = null;
                for (tmp = node; tmp.child == null; tmp = tmp.next) {
                }
                while (true) {
                    if (escapeCharacters.indexOf(tmp.code) != -1) {
                        buf += "\\";
                    }
                    buf = buf + tmp.code;
                    if (this.newline != null) {
                        buf += this.newline;
                    }
                    buf = buf + this._generateStub(tmp.child);
                    for (tmp = tmp.next; tmp != null && tmp.child == null; tmp = tmp.next) {
                    }
                    if (tmp == null) {
                        break;
                    }
                    if (haschild > 1) {
                        buf += this.or;
                    }
                }
            }
            if (brother > 1 && haschild > 0) {
                buf += this.endGroup;
            }
            return buf;
        }
        generate() {
            if (this.root == null) {
                return "";
            }
            else {
                return this._generateStub(this.root);
            }
        }
    }
    exports.RegexGenerator = RegexGenerator;
});
define("RomajiProcessor", ["require", "exports", "utils"], function (require, exports, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RomanEntry {
        constructor(roman, hiragana, remain) {
            this.roman = roman;
            this.hiragana = hiragana;
            this.remain = remain;
            this.index = RomanEntry.calculateIndex(roman);
        }
        static _calculateIndex(roman, start, end) {
            let result = 0;
            for (let i = 0; i < 4; i++) {
                let index = i + start;
                let c = index < roman.length && index < end ? roman.charCodeAt(index) : 0;
                result |= c;
                if (i < 3) {
                    result <<= 8;
                }
            }
            return result;
        }
        static calculateIndex(roman) {
            return RomanEntry._calculateIndex(roman, 0, 4);
        }
    }
    const ROMAN_ENTRIES = [
        new RomanEntry("-", "ー", 0),
        new RomanEntry("~", "〜", 0),
        new RomanEntry(".", "。", 0),
        new RomanEntry(",", "、", 0),
        new RomanEntry("z/", "・", 0),
        new RomanEntry("z.", "…", 0),
        new RomanEntry("z,", "‥", 0),
        new RomanEntry("zh", "←", 0),
        new RomanEntry("zj", "↓", 0),
        new RomanEntry("zk", "↑", 0),
        new RomanEntry("zl", "→", 0),
        new RomanEntry("z-", "〜", 0),
        new RomanEntry("z[", "『", 0),
        new RomanEntry("z]", "』", 0),
        new RomanEntry("[", "「", 0),
        new RomanEntry("]", "」", 0),
        new RomanEntry("va", "ゔぁ", 0),
        new RomanEntry("vi", "ゔぃ", 0),
        new RomanEntry("vu", "ゔ", 0),
        new RomanEntry("ve", "ゔぇ", 0),
        new RomanEntry("vo", "ゔぉ", 0),
        new RomanEntry("vya", "ゔゃ", 0),
        new RomanEntry("vyi", "ゔぃ", 0),
        new RomanEntry("vyu", "ゔゅ", 0),
        new RomanEntry("vye", "ゔぇ", 0),
        new RomanEntry("vyo", "ゔょ", 0),
        new RomanEntry("qq", "っ", 1),
        new RomanEntry("vv", "っ", 1),
        new RomanEntry("ll", "っ", 1),
        new RomanEntry("xx", "っ", 1),
        new RomanEntry("kk", "っ", 1),
        new RomanEntry("gg", "っ", 1),
        new RomanEntry("ss", "っ", 1),
        new RomanEntry("zz", "っ", 1),
        new RomanEntry("jj", "っ", 1),
        new RomanEntry("tt", "っ", 1),
        new RomanEntry("dd", "っ", 1),
        new RomanEntry("hh", "っ", 1),
        new RomanEntry("ff", "っ", 1),
        new RomanEntry("bb", "っ", 1),
        new RomanEntry("pp", "っ", 1),
        new RomanEntry("mm", "っ", 1),
        new RomanEntry("yy", "っ", 1),
        new RomanEntry("rr", "っ", 1),
        new RomanEntry("ww", "っ", 1),
        new RomanEntry("www", "w", 2),
        new RomanEntry("cc", "っ", 1),
        new RomanEntry("kya", "きゃ", 0),
        new RomanEntry("kyi", "きぃ", 0),
        new RomanEntry("kyu", "きゅ", 0),
        new RomanEntry("kye", "きぇ", 0),
        new RomanEntry("kyo", "きょ", 0),
        new RomanEntry("gya", "ぎゃ", 0),
        new RomanEntry("gyi", "ぎぃ", 0),
        new RomanEntry("gyu", "ぎゅ", 0),
        new RomanEntry("gye", "ぎぇ", 0),
        new RomanEntry("gyo", "ぎょ", 0),
        new RomanEntry("sya", "しゃ", 0),
        new RomanEntry("syi", "しぃ", 0),
        new RomanEntry("syu", "しゅ", 0),
        new RomanEntry("sye", "しぇ", 0),
        new RomanEntry("syo", "しょ", 0),
        new RomanEntry("sha", "しゃ", 0),
        new RomanEntry("shi", "し", 0),
        new RomanEntry("shu", "しゅ", 0),
        new RomanEntry("she", "しぇ", 0),
        new RomanEntry("sho", "しょ", 0),
        new RomanEntry("zya", "じゃ", 0),
        new RomanEntry("zyi", "じぃ", 0),
        new RomanEntry("zyu", "じゅ", 0),
        new RomanEntry("zye", "じぇ", 0),
        new RomanEntry("zyo", "じょ", 0),
        new RomanEntry("tya", "ちゃ", 0),
        new RomanEntry("tyi", "ちぃ", 0),
        new RomanEntry("tyu", "ちゅ", 0),
        new RomanEntry("tye", "ちぇ", 0),
        new RomanEntry("tyo", "ちょ", 0),
        new RomanEntry("cha", "ちゃ", 0),
        new RomanEntry("chi", "ち", 0),
        new RomanEntry("chu", "ちゅ", 0),
        new RomanEntry("che", "ちぇ", 0),
        new RomanEntry("cho", "ちょ", 0),
        new RomanEntry("cya", "ちゃ", 0),
        new RomanEntry("cyi", "ちぃ", 0),
        new RomanEntry("cyu", "ちゅ", 0),
        new RomanEntry("cye", "ちぇ", 0),
        new RomanEntry("cyo", "ちょ", 0),
        new RomanEntry("dya", "ぢゃ", 0),
        new RomanEntry("dyi", "ぢぃ", 0),
        new RomanEntry("dyu", "ぢゅ", 0),
        new RomanEntry("dye", "ぢぇ", 0),
        new RomanEntry("dyo", "ぢょ", 0),
        new RomanEntry("tsa", "つぁ", 0),
        new RomanEntry("tsi", "つぃ", 0),
        new RomanEntry("tse", "つぇ", 0),
        new RomanEntry("tso", "つぉ", 0),
        new RomanEntry("tha", "てゃ", 0),
        new RomanEntry("thi", "てぃ", 0),
        new RomanEntry("t'i", "てぃ", 0),
        new RomanEntry("thu", "てゅ", 0),
        new RomanEntry("the", "てぇ", 0),
        new RomanEntry("tho", "てょ", 0),
        new RomanEntry("t'yu", "てゅ", 0),
        new RomanEntry("dha", "でゃ", 0),
        new RomanEntry("dhi", "でぃ", 0),
        new RomanEntry("d'i", "でぃ", 0),
        new RomanEntry("dhu", "でゅ", 0),
        new RomanEntry("dhe", "でぇ", 0),
        new RomanEntry("dho", "でょ", 0),
        new RomanEntry("d'yu", "でゅ", 0),
        new RomanEntry("twa", "とぁ", 0),
        new RomanEntry("twi", "とぃ", 0),
        new RomanEntry("twu", "とぅ", 0),
        new RomanEntry("twe", "とぇ", 0),
        new RomanEntry("two", "とぉ", 0),
        new RomanEntry("t'u", "とぅ", 0),
        new RomanEntry("dwa", "どぁ", 0),
        new RomanEntry("dwi", "どぃ", 0),
        new RomanEntry("dwu", "どぅ", 0),
        new RomanEntry("dwe", "どぇ", 0),
        new RomanEntry("dwo", "どぉ", 0),
        new RomanEntry("d'u", "どぅ", 0),
        new RomanEntry("nya", "にゃ", 0),
        new RomanEntry("nyi", "にぃ", 0),
        new RomanEntry("nyu", "にゅ", 0),
        new RomanEntry("nye", "にぇ", 0),
        new RomanEntry("nyo", "にょ", 0),
        new RomanEntry("hya", "ひゃ", 0),
        new RomanEntry("hyi", "ひぃ", 0),
        new RomanEntry("hyu", "ひゅ", 0),
        new RomanEntry("hye", "ひぇ", 0),
        new RomanEntry("hyo", "ひょ", 0),
        new RomanEntry("bya", "びゃ", 0),
        new RomanEntry("byi", "びぃ", 0),
        new RomanEntry("byu", "びゅ", 0),
        new RomanEntry("bye", "びぇ", 0),
        new RomanEntry("byo", "びょ", 0),
        new RomanEntry("pya", "ぴゃ", 0),
        new RomanEntry("pyi", "ぴぃ", 0),
        new RomanEntry("pyu", "ぴゅ", 0),
        new RomanEntry("pye", "ぴぇ", 0),
        new RomanEntry("pyo", "ぴょ", 0),
        new RomanEntry("fa", "ふぁ", 0),
        new RomanEntry("fi", "ふぃ", 0),
        new RomanEntry("fu", "ふ", 0),
        new RomanEntry("fe", "ふぇ", 0),
        new RomanEntry("fo", "ふぉ", 0),
        new RomanEntry("fya", "ふゃ", 0),
        new RomanEntry("fyu", "ふゅ", 0),
        new RomanEntry("fyo", "ふょ", 0),
        new RomanEntry("hwa", "ふぁ", 0),
        new RomanEntry("hwi", "ふぃ", 0),
        new RomanEntry("hwe", "ふぇ", 0),
        new RomanEntry("hwo", "ふぉ", 0),
        new RomanEntry("hwyu", "ふゅ", 0),
        new RomanEntry("mya", "みゃ", 0),
        new RomanEntry("myi", "みぃ", 0),
        new RomanEntry("myu", "みゅ", 0),
        new RomanEntry("mye", "みぇ", 0),
        new RomanEntry("myo", "みょ", 0),
        new RomanEntry("rya", "りゃ", 0),
        new RomanEntry("ryi", "りぃ", 0),
        new RomanEntry("ryu", "りゅ", 0),
        new RomanEntry("rye", "りぇ", 0),
        new RomanEntry("ryo", "りょ", 0),
        new RomanEntry("n'", "ん", 0),
        new RomanEntry("nn", "ん", 0),
        new RomanEntry("n", "ん", 0),
        new RomanEntry("xn", "ん", 0),
        new RomanEntry("a", "あ", 0),
        new RomanEntry("i", "い", 0),
        new RomanEntry("u", "う", 0),
        new RomanEntry("wu", "う", 0),
        new RomanEntry("e", "え", 0),
        new RomanEntry("o", "お", 0),
        new RomanEntry("xa", "ぁ", 0),
        new RomanEntry("xi", "ぃ", 0),
        new RomanEntry("xu", "ぅ", 0),
        new RomanEntry("xe", "ぇ", 0),
        new RomanEntry("xo", "ぉ", 0),
        new RomanEntry("la", "ぁ", 0),
        new RomanEntry("li", "ぃ", 0),
        new RomanEntry("lu", "ぅ", 0),
        new RomanEntry("le", "ぇ", 0),
        new RomanEntry("lo", "ぉ", 0),
        new RomanEntry("lyi", "ぃ", 0),
        new RomanEntry("xyi", "ぃ", 0),
        new RomanEntry("lye", "ぇ", 0),
        new RomanEntry("xye", "ぇ", 0),
        new RomanEntry("ye", "いぇ", 0),
        new RomanEntry("ka", "か", 0),
        new RomanEntry("ki", "き", 0),
        new RomanEntry("ku", "く", 0),
        new RomanEntry("ke", "け", 0),
        new RomanEntry("ko", "こ", 0),
        new RomanEntry("xka", "ヵ", 0),
        new RomanEntry("xke", "ヶ", 0),
        new RomanEntry("lka", "ヵ", 0),
        new RomanEntry("lke", "ヶ", 0),
        new RomanEntry("ga", "が", 0),
        new RomanEntry("gi", "ぎ", 0),
        new RomanEntry("gu", "ぐ", 0),
        new RomanEntry("ge", "げ", 0),
        new RomanEntry("go", "ご", 0),
        new RomanEntry("sa", "さ", 0),
        new RomanEntry("si", "し", 0),
        new RomanEntry("su", "す", 0),
        new RomanEntry("se", "せ", 0),
        new RomanEntry("so", "そ", 0),
        new RomanEntry("ca", "か", 0),
        new RomanEntry("ci", "し", 0),
        new RomanEntry("cu", "く", 0),
        new RomanEntry("ce", "せ", 0),
        new RomanEntry("co", "こ", 0),
        new RomanEntry("qa", "くぁ", 0),
        new RomanEntry("qi", "くぃ", 0),
        new RomanEntry("qu", "く", 0),
        new RomanEntry("qe", "くぇ", 0),
        new RomanEntry("qo", "くぉ", 0),
        new RomanEntry("kwa", "くぁ", 0),
        new RomanEntry("kwi", "くぃ", 0),
        new RomanEntry("kwu", "くぅ", 0),
        new RomanEntry("kwe", "くぇ", 0),
        new RomanEntry("kwo", "くぉ", 0),
        new RomanEntry("gwa", "ぐぁ", 0),
        new RomanEntry("gwi", "ぐぃ", 0),
        new RomanEntry("gwu", "ぐぅ", 0),
        new RomanEntry("gwe", "ぐぇ", 0),
        new RomanEntry("gwo", "ぐぉ", 0),
        new RomanEntry("za", "ざ", 0),
        new RomanEntry("zi", "じ", 0),
        new RomanEntry("zu", "ず", 0),
        new RomanEntry("ze", "ぜ", 0),
        new RomanEntry("zo", "ぞ", 0),
        new RomanEntry("ja", "じゃ", 0),
        new RomanEntry("ji", "じ", 0),
        new RomanEntry("ju", "じゅ", 0),
        new RomanEntry("je", "じぇ", 0),
        new RomanEntry("jo", "じょ", 0),
        new RomanEntry("jya", "じゃ", 0),
        new RomanEntry("jyi", "じぃ", 0),
        new RomanEntry("jyu", "じゅ", 0),
        new RomanEntry("jye", "じぇ", 0),
        new RomanEntry("jyo", "じょ", 0),
        new RomanEntry("ta", "た", 0),
        new RomanEntry("ti", "ち", 0),
        new RomanEntry("tu", "つ", 0),
        new RomanEntry("tsu", "つ", 0),
        new RomanEntry("te", "て", 0),
        new RomanEntry("to", "と", 0),
        new RomanEntry("da", "だ", 0),
        new RomanEntry("di", "ぢ", 0),
        new RomanEntry("du", "づ", 0),
        new RomanEntry("de", "で", 0),
        new RomanEntry("do", "ど", 0),
        new RomanEntry("xtu", "っ", 0),
        new RomanEntry("xtsu", "っ", 0),
        new RomanEntry("ltu", "っ", 0),
        new RomanEntry("ltsu", "っ", 0),
        new RomanEntry("na", "な", 0),
        new RomanEntry("ni", "に", 0),
        new RomanEntry("nu", "ぬ", 0),
        new RomanEntry("ne", "ね", 0),
        new RomanEntry("no", "の", 0),
        new RomanEntry("ha", "は", 0),
        new RomanEntry("hi", "ひ", 0),
        new RomanEntry("hu", "ふ", 0),
        new RomanEntry("fu", "ふ", 0),
        new RomanEntry("he", "へ", 0),
        new RomanEntry("ho", "ほ", 0),
        new RomanEntry("ba", "ば", 0),
        new RomanEntry("bi", "び", 0),
        new RomanEntry("bu", "ぶ", 0),
        new RomanEntry("be", "べ", 0),
        new RomanEntry("bo", "ぼ", 0),
        new RomanEntry("pa", "ぱ", 0),
        new RomanEntry("pi", "ぴ", 0),
        new RomanEntry("pu", "ぷ", 0),
        new RomanEntry("pe", "ぺ", 0),
        new RomanEntry("po", "ぽ", 0),
        new RomanEntry("ma", "ま", 0),
        new RomanEntry("mi", "み", 0),
        new RomanEntry("mu", "む", 0),
        new RomanEntry("me", "め", 0),
        new RomanEntry("mo", "も", 0),
        new RomanEntry("xya", "ゃ", 0),
        new RomanEntry("lya", "ゃ", 0),
        new RomanEntry("ya", "や", 0),
        new RomanEntry("wyi", "ゐ", 0),
        new RomanEntry("xyu", "ゅ", 0),
        new RomanEntry("lyu", "ゅ", 0),
        new RomanEntry("yu", "ゆ", 0),
        new RomanEntry("wye", "ゑ", 0),
        new RomanEntry("xyo", "ょ", 0),
        new RomanEntry("lyo", "ょ", 0),
        new RomanEntry("yo", "よ", 0),
        new RomanEntry("ra", "ら", 0),
        new RomanEntry("ri", "り", 0),
        new RomanEntry("ru", "る", 0),
        new RomanEntry("re", "れ", 0),
        new RomanEntry("ro", "ろ", 0),
        new RomanEntry("xwa", "ゎ", 0),
        new RomanEntry("lwa", "ゎ", 0),
        new RomanEntry("wa", "わ", 0),
        new RomanEntry("wi", "うぃ", 0),
        new RomanEntry("we", "うぇ", 0),
        new RomanEntry("wo", "を", 0),
        new RomanEntry("wha", "うぁ", 0),
        new RomanEntry("whi", "うぃ", 0),
        new RomanEntry("whu", "う", 0),
        new RomanEntry("whe", "うぇ", 0),
        new RomanEntry("who", "うぉ", 0)
    ]
        .sort((a, b) => a.index - b.index);
    const ROMAN_INDEXES = ROMAN_ENTRIES.map(e => e.index);
    class RomajiPredictiveResult {
        constructor(estaglishedHiragana, predictiveSuffixes) {
            this.estaglishedHiragana = estaglishedHiragana;
            this.predictiveSuffixes = predictiveSuffixes;
        }
    }
    function romajiToHiragana(romaji) {
        if (romaji.length == 0) {
            return "";
        }
        let hiragana = "";
        let start = 0;
        let end = 1;
        while (start < romaji.length) {
            let lastFound = -1;
            let lower = 0;
            let upper = ROMAN_INDEXES.length;
            while (upper - lower > 1 && end <= romaji.length) {
                let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
                lower = utils_3.binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
                if (lower >= 0) {
                    lastFound = lower;
                }
                else {
                    lower = -lower - 1;
                }
                let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
                upper = utils_3.binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
                if (upper < 0) {
                    upper = -upper - 1;
                }
                end++;
            }
            if (lastFound >= 0) {
                let entry = ROMAN_ENTRIES[lastFound];
                hiragana = hiragana + entry.hiragana;
                start = start + entry.roman.length - entry.remain;
                end = start + 1;
            }
            else {
                hiragana = hiragana + romaji.charAt(start);
                start++;
                end = start + 1;
            }
        }
        return hiragana;
    }
    exports.romajiToHiragana = romajiToHiragana;
    function findRomanEntryPredicatively(roman, offset) {
        let lastFound = -1;
        let startIndex = 0;
        let endIndex = ROMAN_INDEXES.length;
        for (let i = 0; i < 4; i++) {
            if (roman.length <= offset + i) {
                break;
            }
            let startKey = RomanEntry._calculateIndex(roman, offset, offset + i + 1);
            startIndex = utils_3.binarySearch(ROMAN_INDEXES, startIndex, endIndex, startKey);
            if (startIndex >= 0) {
                lastFound = startIndex;
            }
            else {
                startIndex = -startIndex - 1;
            }
            let endKey = startKey + (1 << (24 - 8 * i));
            endIndex = utils_3.binarySearch(ROMAN_INDEXES, startIndex, endIndex, endKey);
            if (endIndex < 0) {
                endIndex = -endIndex - 1;
            }
            if (endIndex - startIndex == 1) {
                return new Set([ROMAN_ENTRIES[startIndex]]);
            }
        }
        let result = new Set();
        for (let i = startIndex; i < endIndex; i++) {
            result.add(ROMAN_ENTRIES[i]);
        }
        return result;
    }
    exports.findRomanEntryPredicatively = findRomanEntryPredicatively;
    function romajiToHiraganaPredictively(romaji) {
        if (romaji.length == 0) {
            return new RomajiPredictiveResult("", new Set([""]));
        }
        let hiragana = "";
        let start = 0;
        let end = 1;
        while (start < romaji.length) {
            let lastFound = -1;
            let lower = 0;
            let upper = ROMAN_INDEXES.length;
            while (upper - lower > 1 && end <= romaji.length) {
                let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
                lower = utils_3.binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
                if (lower >= 0) {
                    lastFound = lower;
                }
                else {
                    lower = -lower - 1;
                }
                let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
                upper = utils_3.binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
                if (upper < 0) {
                    upper = -upper - 1;
                }
                end++;
            }
            if (end > romaji.length && upper - lower != 1) {
                let set = new Set();
                for (let i = lower; i < upper; i++) {
                    let re = ROMAN_ENTRIES[i];
                    if (re.remain > 0) {
                        let set2 = findRomanEntryPredicatively(romaji, end - 1 - re.remain);
                        for (let re2 of set2) {
                            if (re2.remain == 0) {
                                set.add(re.hiragana + re2.hiragana);
                            }
                        }
                    }
                    else {
                        set.add(re.hiragana);
                    }
                }
                return new RomajiPredictiveResult(hiragana.toString(), set);
            }
            if (lastFound >= 0) {
                let entry = ROMAN_ENTRIES[lastFound];
                hiragana = hiragana + entry.hiragana;
                start = start + entry.roman.length - entry.remain;
                end = start + 1;
            }
            else {
                hiragana = hiragana + romaji.charAt(start);
                start++;
                end = start + 1;
            }
        }
        return new RomajiPredictiveResult(hiragana.toString(), new Set([""]));
    }
    exports.romajiToHiraganaPredictively = romajiToHiraganaPredictively;
});
define("Migemo", ["require", "exports", "RegexGenerator", "RomajiProcessor"], function (require, exports, RegexGenerator_1, RomajiProcessor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Migemo {
        constructor() {
            this.dict = null;
        }
        queryAWord(word) {
            let generator = RegexGenerator_1.RegexGenerator.getDEFAULT();
            // query自信はもちろん候補に加える
            generator.add(word);
            // queryそのものでの辞書引き
            let lower = word.toLowerCase();
            if (this.dict != null) {
                for (let word of this.dict.predictiveSearch(lower)) {
                    generator.add(word);
                }
            }
            // queryを全角にして候補に加える
            //let zen = CharacterConverter.han2zen(query);
            //generator.add(zen);
            // queryを半角にして候補に加える
            //String han = CharacterConverter.zen2
            //generator.add(hen);
            // 平仮名、カタカナ、及びそれによる辞書引き追加
            let hiraganaResult = RomajiProcessor_1.romajiToHiraganaPredictively(lower);
            for (let a of hiraganaResult.predictiveSuffixes) {
                let hira = hiraganaResult.estaglishedHiragana + a;
                generator.add(hira);
                // 平仮名による辞書引き
                if (this.dict != null) {
                    for (let b of this.dict.predictiveSearch(hira)) {
                        generator.add(b);
                    }
                }
                // 片仮名文字列を生成し候補に加える
                //String kata = CharacterConverter.hira2kata(a);
                //generator.add(kata);
                // 半角カナを生成し候補に加える
                //generator.add(CharacterConverter.zen2han(kata));
            }
            return generator.generate();
        }
        query(word) {
            if (word == "") {
                return "";
            }
            let words = this.parseQuery(word);
            let result = "";
            for (let w of words) {
                result += this.queryAWord(w);
            }
            return result;
        }
        setDict(dict) {
            this.dict = dict;
        }
        *parseQuery(query) {
            let re = /[^A-Z\s]+|[A-Z]{2,}|([A-Z][^A-Z\s]+)|([A-Z]\s*$)/g;
            let myArray;
            while ((myArray = re.exec(query)) !== null) {
                yield myArray[0];
            }
        }
    }
    exports.Migemo = Migemo;
});
define("RomanEntry", ["require", "exports", "utils"], function (require, exports, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RomanEntry {
        constructor(roman, hiragana, remain) {
            this.roman = roman;
            this.hiragana = hiragana;
            this.remain = remain;
            this.index = RomanEntry.calculateIndex(roman);
        }
        static _calculateIndex(roman, start, end) {
            let result = 0;
            for (let i = 0; i < 4; i++) {
                let index = i + start;
                let c = index < roman.length && index < end ? roman.charCodeAt(index) : 0;
                result |= c;
                if (i < 3) {
                    result <<= 8;
                }
            }
            return result;
        }
        static calculateIndex(roman) {
            return RomanEntry._calculateIndex(roman, 0, 4);
        }
    }
    const ROMAN_ENTRIES = [
        new RomanEntry("-", "ー", 0),
        new RomanEntry("~", "〜", 0),
        new RomanEntry(".", "。", 0),
        new RomanEntry(",", "、", 0),
        new RomanEntry("z/", "・", 0),
        new RomanEntry("z.", "…", 0),
        new RomanEntry("z,", "‥", 0),
        new RomanEntry("zh", "←", 0),
        new RomanEntry("zj", "↓", 0),
        new RomanEntry("zk", "↑", 0),
        new RomanEntry("zl", "→", 0),
        new RomanEntry("z-", "〜", 0),
        new RomanEntry("z[", "『", 0),
        new RomanEntry("z]", "』", 0),
        new RomanEntry("[", "「", 0),
        new RomanEntry("]", "」", 0),
        new RomanEntry("va", "ゔぁ", 0),
        new RomanEntry("vi", "ゔぃ", 0),
        new RomanEntry("vu", "ゔ", 0),
        new RomanEntry("ve", "ゔぇ", 0),
        new RomanEntry("vo", "ゔぉ", 0),
        new RomanEntry("vya", "ゔゃ", 0),
        new RomanEntry("vyi", "ゔぃ", 0),
        new RomanEntry("vyu", "ゔゅ", 0),
        new RomanEntry("vye", "ゔぇ", 0),
        new RomanEntry("vyo", "ゔょ", 0),
        new RomanEntry("qq", "っ", 1),
        new RomanEntry("vv", "っ", 1),
        new RomanEntry("ll", "っ", 1),
        new RomanEntry("xx", "っ", 1),
        new RomanEntry("kk", "っ", 1),
        new RomanEntry("gg", "っ", 1),
        new RomanEntry("ss", "っ", 1),
        new RomanEntry("zz", "っ", 1),
        new RomanEntry("jj", "っ", 1),
        new RomanEntry("tt", "っ", 1),
        new RomanEntry("dd", "っ", 1),
        new RomanEntry("hh", "っ", 1),
        new RomanEntry("ff", "っ", 1),
        new RomanEntry("bb", "っ", 1),
        new RomanEntry("pp", "っ", 1),
        new RomanEntry("mm", "っ", 1),
        new RomanEntry("yy", "っ", 1),
        new RomanEntry("rr", "っ", 1),
        new RomanEntry("ww", "っ", 1),
        new RomanEntry("www", "w", 2),
        new RomanEntry("cc", "っ", 1),
        new RomanEntry("kya", "きゃ", 0),
        new RomanEntry("kyi", "きぃ", 0),
        new RomanEntry("kyu", "きゅ", 0),
        new RomanEntry("kye", "きぇ", 0),
        new RomanEntry("kyo", "きょ", 0),
        new RomanEntry("gya", "ぎゃ", 0),
        new RomanEntry("gyi", "ぎぃ", 0),
        new RomanEntry("gyu", "ぎゅ", 0),
        new RomanEntry("gye", "ぎぇ", 0),
        new RomanEntry("gyo", "ぎょ", 0),
        new RomanEntry("sya", "しゃ", 0),
        new RomanEntry("syi", "しぃ", 0),
        new RomanEntry("syu", "しゅ", 0),
        new RomanEntry("sye", "しぇ", 0),
        new RomanEntry("syo", "しょ", 0),
        new RomanEntry("sha", "しゃ", 0),
        new RomanEntry("shi", "し", 0),
        new RomanEntry("shu", "しゅ", 0),
        new RomanEntry("she", "しぇ", 0),
        new RomanEntry("sho", "しょ", 0),
        new RomanEntry("zya", "じゃ", 0),
        new RomanEntry("zyi", "じぃ", 0),
        new RomanEntry("zyu", "じゅ", 0),
        new RomanEntry("zye", "じぇ", 0),
        new RomanEntry("zyo", "じょ", 0),
        new RomanEntry("tya", "ちゃ", 0),
        new RomanEntry("tyi", "ちぃ", 0),
        new RomanEntry("tyu", "ちゅ", 0),
        new RomanEntry("tye", "ちぇ", 0),
        new RomanEntry("tyo", "ちょ", 0),
        new RomanEntry("cha", "ちゃ", 0),
        new RomanEntry("chi", "ち", 0),
        new RomanEntry("chu", "ちゅ", 0),
        new RomanEntry("che", "ちぇ", 0),
        new RomanEntry("cho", "ちょ", 0),
        new RomanEntry("cya", "ちゃ", 0),
        new RomanEntry("cyi", "ちぃ", 0),
        new RomanEntry("cyu", "ちゅ", 0),
        new RomanEntry("cye", "ちぇ", 0),
        new RomanEntry("cyo", "ちょ", 0),
        new RomanEntry("dya", "ぢゃ", 0),
        new RomanEntry("dyi", "ぢぃ", 0),
        new RomanEntry("dyu", "ぢゅ", 0),
        new RomanEntry("dye", "ぢぇ", 0),
        new RomanEntry("dyo", "ぢょ", 0),
        new RomanEntry("tsa", "つぁ", 0),
        new RomanEntry("tsi", "つぃ", 0),
        new RomanEntry("tse", "つぇ", 0),
        new RomanEntry("tso", "つぉ", 0),
        new RomanEntry("tha", "てゃ", 0),
        new RomanEntry("thi", "てぃ", 0),
        new RomanEntry("t'i", "てぃ", 0),
        new RomanEntry("thu", "てゅ", 0),
        new RomanEntry("the", "てぇ", 0),
        new RomanEntry("tho", "てょ", 0),
        new RomanEntry("t'yu", "てゅ", 0),
        new RomanEntry("dha", "でゃ", 0),
        new RomanEntry("dhi", "でぃ", 0),
        new RomanEntry("d'i", "でぃ", 0),
        new RomanEntry("dhu", "でゅ", 0),
        new RomanEntry("dhe", "でぇ", 0),
        new RomanEntry("dho", "でょ", 0),
        new RomanEntry("d'yu", "でゅ", 0),
        new RomanEntry("twa", "とぁ", 0),
        new RomanEntry("twi", "とぃ", 0),
        new RomanEntry("twu", "とぅ", 0),
        new RomanEntry("twe", "とぇ", 0),
        new RomanEntry("two", "とぉ", 0),
        new RomanEntry("t'u", "とぅ", 0),
        new RomanEntry("dwa", "どぁ", 0),
        new RomanEntry("dwi", "どぃ", 0),
        new RomanEntry("dwu", "どぅ", 0),
        new RomanEntry("dwe", "どぇ", 0),
        new RomanEntry("dwo", "どぉ", 0),
        new RomanEntry("d'u", "どぅ", 0),
        new RomanEntry("nya", "にゃ", 0),
        new RomanEntry("nyi", "にぃ", 0),
        new RomanEntry("nyu", "にゅ", 0),
        new RomanEntry("nye", "にぇ", 0),
        new RomanEntry("nyo", "にょ", 0),
        new RomanEntry("hya", "ひゃ", 0),
        new RomanEntry("hyi", "ひぃ", 0),
        new RomanEntry("hyu", "ひゅ", 0),
        new RomanEntry("hye", "ひぇ", 0),
        new RomanEntry("hyo", "ひょ", 0),
        new RomanEntry("bya", "びゃ", 0),
        new RomanEntry("byi", "びぃ", 0),
        new RomanEntry("byu", "びゅ", 0),
        new RomanEntry("bye", "びぇ", 0),
        new RomanEntry("byo", "びょ", 0),
        new RomanEntry("pya", "ぴゃ", 0),
        new RomanEntry("pyi", "ぴぃ", 0),
        new RomanEntry("pyu", "ぴゅ", 0),
        new RomanEntry("pye", "ぴぇ", 0),
        new RomanEntry("pyo", "ぴょ", 0),
        new RomanEntry("fa", "ふぁ", 0),
        new RomanEntry("fi", "ふぃ", 0),
        new RomanEntry("fu", "ふ", 0),
        new RomanEntry("fe", "ふぇ", 0),
        new RomanEntry("fo", "ふぉ", 0),
        new RomanEntry("fya", "ふゃ", 0),
        new RomanEntry("fyu", "ふゅ", 0),
        new RomanEntry("fyo", "ふょ", 0),
        new RomanEntry("hwa", "ふぁ", 0),
        new RomanEntry("hwi", "ふぃ", 0),
        new RomanEntry("hwe", "ふぇ", 0),
        new RomanEntry("hwo", "ふぉ", 0),
        new RomanEntry("hwyu", "ふゅ", 0),
        new RomanEntry("mya", "みゃ", 0),
        new RomanEntry("myi", "みぃ", 0),
        new RomanEntry("myu", "みゅ", 0),
        new RomanEntry("mye", "みぇ", 0),
        new RomanEntry("myo", "みょ", 0),
        new RomanEntry("rya", "りゃ", 0),
        new RomanEntry("ryi", "りぃ", 0),
        new RomanEntry("ryu", "りゅ", 0),
        new RomanEntry("rye", "りぇ", 0),
        new RomanEntry("ryo", "りょ", 0),
        new RomanEntry("n'", "ん", 0),
        new RomanEntry("nn", "ん", 0),
        new RomanEntry("n", "ん", 0),
        new RomanEntry("xn", "ん", 0),
        new RomanEntry("a", "あ", 0),
        new RomanEntry("i", "い", 0),
        new RomanEntry("u", "う", 0),
        new RomanEntry("wu", "う", 0),
        new RomanEntry("e", "え", 0),
        new RomanEntry("o", "お", 0),
        new RomanEntry("xa", "ぁ", 0),
        new RomanEntry("xi", "ぃ", 0),
        new RomanEntry("xu", "ぅ", 0),
        new RomanEntry("xe", "ぇ", 0),
        new RomanEntry("xo", "ぉ", 0),
        new RomanEntry("la", "ぁ", 0),
        new RomanEntry("li", "ぃ", 0),
        new RomanEntry("lu", "ぅ", 0),
        new RomanEntry("le", "ぇ", 0),
        new RomanEntry("lo", "ぉ", 0),
        new RomanEntry("lyi", "ぃ", 0),
        new RomanEntry("xyi", "ぃ", 0),
        new RomanEntry("lye", "ぇ", 0),
        new RomanEntry("xye", "ぇ", 0),
        new RomanEntry("ye", "いぇ", 0),
        new RomanEntry("ka", "か", 0),
        new RomanEntry("ki", "き", 0),
        new RomanEntry("ku", "く", 0),
        new RomanEntry("ke", "け", 0),
        new RomanEntry("ko", "こ", 0),
        new RomanEntry("xka", "ヵ", 0),
        new RomanEntry("xke", "ヶ", 0),
        new RomanEntry("lka", "ヵ", 0),
        new RomanEntry("lke", "ヶ", 0),
        new RomanEntry("ga", "が", 0),
        new RomanEntry("gi", "ぎ", 0),
        new RomanEntry("gu", "ぐ", 0),
        new RomanEntry("ge", "げ", 0),
        new RomanEntry("go", "ご", 0),
        new RomanEntry("sa", "さ", 0),
        new RomanEntry("si", "し", 0),
        new RomanEntry("su", "す", 0),
        new RomanEntry("se", "せ", 0),
        new RomanEntry("so", "そ", 0),
        new RomanEntry("ca", "か", 0),
        new RomanEntry("ci", "し", 0),
        new RomanEntry("cu", "く", 0),
        new RomanEntry("ce", "せ", 0),
        new RomanEntry("co", "こ", 0),
        new RomanEntry("qa", "くぁ", 0),
        new RomanEntry("qi", "くぃ", 0),
        new RomanEntry("qu", "く", 0),
        new RomanEntry("qe", "くぇ", 0),
        new RomanEntry("qo", "くぉ", 0),
        new RomanEntry("kwa", "くぁ", 0),
        new RomanEntry("kwi", "くぃ", 0),
        new RomanEntry("kwu", "くぅ", 0),
        new RomanEntry("kwe", "くぇ", 0),
        new RomanEntry("kwo", "くぉ", 0),
        new RomanEntry("gwa", "ぐぁ", 0),
        new RomanEntry("gwi", "ぐぃ", 0),
        new RomanEntry("gwu", "ぐぅ", 0),
        new RomanEntry("gwe", "ぐぇ", 0),
        new RomanEntry("gwo", "ぐぉ", 0),
        new RomanEntry("za", "ざ", 0),
        new RomanEntry("zi", "じ", 0),
        new RomanEntry("zu", "ず", 0),
        new RomanEntry("ze", "ぜ", 0),
        new RomanEntry("zo", "ぞ", 0),
        new RomanEntry("ja", "じゃ", 0),
        new RomanEntry("ji", "じ", 0),
        new RomanEntry("ju", "じゅ", 0),
        new RomanEntry("je", "じぇ", 0),
        new RomanEntry("jo", "じょ", 0),
        new RomanEntry("jya", "じゃ", 0),
        new RomanEntry("jyi", "じぃ", 0),
        new RomanEntry("jyu", "じゅ", 0),
        new RomanEntry("jye", "じぇ", 0),
        new RomanEntry("jyo", "じょ", 0),
        new RomanEntry("ta", "た", 0),
        new RomanEntry("ti", "ち", 0),
        new RomanEntry("tu", "つ", 0),
        new RomanEntry("tsu", "つ", 0),
        new RomanEntry("te", "て", 0),
        new RomanEntry("to", "と", 0),
        new RomanEntry("da", "だ", 0),
        new RomanEntry("di", "ぢ", 0),
        new RomanEntry("du", "づ", 0),
        new RomanEntry("de", "で", 0),
        new RomanEntry("do", "ど", 0),
        new RomanEntry("xtu", "っ", 0),
        new RomanEntry("xtsu", "っ", 0),
        new RomanEntry("ltu", "っ", 0),
        new RomanEntry("ltsu", "っ", 0),
        new RomanEntry("na", "な", 0),
        new RomanEntry("ni", "に", 0),
        new RomanEntry("nu", "ぬ", 0),
        new RomanEntry("ne", "ね", 0),
        new RomanEntry("no", "の", 0),
        new RomanEntry("ha", "は", 0),
        new RomanEntry("hi", "ひ", 0),
        new RomanEntry("hu", "ふ", 0),
        new RomanEntry("fu", "ふ", 0),
        new RomanEntry("he", "へ", 0),
        new RomanEntry("ho", "ほ", 0),
        new RomanEntry("ba", "ば", 0),
        new RomanEntry("bi", "び", 0),
        new RomanEntry("bu", "ぶ", 0),
        new RomanEntry("be", "べ", 0),
        new RomanEntry("bo", "ぼ", 0),
        new RomanEntry("pa", "ぱ", 0),
        new RomanEntry("pi", "ぴ", 0),
        new RomanEntry("pu", "ぷ", 0),
        new RomanEntry("pe", "ぺ", 0),
        new RomanEntry("po", "ぽ", 0),
        new RomanEntry("ma", "ま", 0),
        new RomanEntry("mi", "み", 0),
        new RomanEntry("mu", "む", 0),
        new RomanEntry("me", "め", 0),
        new RomanEntry("mo", "も", 0),
        new RomanEntry("xya", "ゃ", 0),
        new RomanEntry("lya", "ゃ", 0),
        new RomanEntry("ya", "や", 0),
        new RomanEntry("wyi", "ゐ", 0),
        new RomanEntry("xyu", "ゅ", 0),
        new RomanEntry("lyu", "ゅ", 0),
        new RomanEntry("yu", "ゆ", 0),
        new RomanEntry("wye", "ゑ", 0),
        new RomanEntry("xyo", "ょ", 0),
        new RomanEntry("lyo", "ょ", 0),
        new RomanEntry("yo", "よ", 0),
        new RomanEntry("ra", "ら", 0),
        new RomanEntry("ri", "り", 0),
        new RomanEntry("ru", "る", 0),
        new RomanEntry("re", "れ", 0),
        new RomanEntry("ro", "ろ", 0),
        new RomanEntry("xwa", "ゎ", 0),
        new RomanEntry("lwa", "ゎ", 0),
        new RomanEntry("wa", "わ", 0),
        new RomanEntry("wi", "うぃ", 0),
        new RomanEntry("we", "うぇ", 0),
        new RomanEntry("wo", "を", 0),
        new RomanEntry("wha", "うぁ", 0),
        new RomanEntry("whi", "うぃ", 0),
        new RomanEntry("whu", "う", 0),
        new RomanEntry("whe", "うぇ", 0),
        new RomanEntry("who", "うぉ", 0)
    ]
        .sort((a, b) => a.index - b.index);
    const ROMAN_INDEXES = ROMAN_ENTRIES.map(e => e.index);
    class RomajiPredictiveResult {
        constructor(estaglishedHiragana, predictiveSuffixes) {
            this.estaglishedHiragana = estaglishedHiragana;
            this.predictiveSuffixes = predictiveSuffixes;
        }
    }
    function romajiToHiragana(romaji) {
        if (romaji.length == 0) {
            return "";
        }
        let hiragana = "";
        let start = 0;
        let end = 1;
        while (start < romaji.length) {
            let lastFound = -1;
            let lower = 0;
            let upper = ROMAN_INDEXES.length;
            while (upper - lower > 1 && end <= romaji.length) {
                let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
                lower = utils_4.binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
                if (lower >= 0) {
                    lastFound = lower;
                }
                else {
                    lower = -lower - 1;
                }
                let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
                upper = utils_4.binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
                if (upper < 0) {
                    upper = -upper - 1;
                }
                end++;
            }
            if (lastFound >= 0) {
                let entry = ROMAN_ENTRIES[lastFound];
                hiragana = hiragana + entry.hiragana;
                start = start + entry.roman.length - entry.remain;
                end = start + 1;
            }
            else {
                hiragana = hiragana + romaji.charAt(start);
                start++;
                end = start + 1;
            }
        }
        return hiragana;
    }
    exports.romajiToHiragana = romajiToHiragana;
    function findRomanEntryPredicatively(roman, offset) {
        let lastFound = -1;
        let startIndex = 0;
        let endIndex = ROMAN_INDEXES.length;
        for (let i = 0; i < 4; i++) {
            if (roman.length <= offset + i) {
                break;
            }
            let startKey = RomanEntry._calculateIndex(roman, offset, offset + i + 1);
            startIndex = utils_4.binarySearch(ROMAN_INDEXES, startIndex, endIndex, startKey);
            if (startIndex >= 0) {
                lastFound = startIndex;
            }
            else {
                startIndex = -startIndex - 1;
            }
            let endKey = startKey + (1 << (24 - 8 * i));
            endIndex = utils_4.binarySearch(ROMAN_INDEXES, startIndex, endIndex, endKey);
            if (endIndex < 0) {
                endIndex = -endIndex - 1;
            }
            if (endIndex - startIndex == 1) {
                return new Set([ROMAN_ENTRIES[startIndex]]);
            }
        }
        let result = new Set();
        for (let i = startIndex; i < endIndex; i++) {
            result.add(ROMAN_ENTRIES[i]);
        }
        return result;
    }
    function romajiToHiraganaPredictively(romaji) {
        if (romaji.length == 0) {
            return new RomajiPredictiveResult("", new Set([""]));
        }
        let hiragana = "";
        let start = 0;
        let end = 1;
        while (start < romaji.length) {
            let lastFound = -1;
            let lower = 0;
            let upper = ROMAN_INDEXES.length;
            while (upper - lower > 1 && end <= romaji.length) {
                let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
                lower = utils_4.binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
                if (lower >= 0) {
                    lastFound = lower;
                }
                else {
                    lower = -lower - 1;
                }
                let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
                upper = utils_4.binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
                if (upper < 0) {
                    upper = -upper - 1;
                }
                end++;
            }
            if (end > romaji.length && upper - lower != 1) {
                let set = new Set();
                for (let i = lower; i < upper; i++) {
                    let re = ROMAN_ENTRIES[i];
                    if (re.remain > 0) {
                        let set2 = findRomanEntryPredicatively(romaji, end - 1 - re.remain);
                        for (let re2 of set2) {
                            if (re2.remain == 0) {
                                set.add(re.hiragana + re2.hiragana);
                            }
                        }
                    }
                    else {
                        set.add(re.hiragana);
                    }
                }
                return new RomajiPredictiveResult(hiragana.toString(), set);
            }
            if (lastFound >= 0) {
                let entry = ROMAN_ENTRIES[lastFound];
                hiragana = hiragana + entry.hiragana;
                start = start + entry.roman.length - entry.remain;
                end = start + 1;
            }
            else {
                hiragana = hiragana + romaji.charAt(start);
                start++;
                end = start + 1;
            }
        }
        return new RomajiPredictiveResult(hiragana.toString(), new Set([""]));
    }
});
define("SimpleDictionary", ["require", "exports", "utils"], function (require, exports, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SimpleDictionary {
        constructor(keys, values) {
            this.keys = keys;
            this.values = values;
        }
        static build(file) {
            let lines = file.split("\n");
            let keyValuePairs = Array();
            for (let line of lines) {
                if (!line.startsWith(";") && line.length != 0) {
                    let semicolonPos = line.indexOf('\t');
                    let key = line.substr(0, semicolonPos);
                    let value = line.substr(semicolonPos + 1);
                    keyValuePairs.push([key, value]);
                }
            }
            keyValuePairs.sort((a, b) => {
                if (a[0] > b[0]) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
            let keys = keyValuePairs.map((a) => a[0]);
            let values = keyValuePairs.map((a) => a[1]);
            return new SimpleDictionary(keys, values);
        }
        predictiveSearch(hiragana) {
            if (hiragana.length > 0) {
                let stop = hiragana.substring(0, hiragana.length - 1) + String.fromCodePoint(hiragana.codePointAt(hiragana.length - 1) || 0 + 1);
                let startPos = utils_5.binarySearchString(this.keys, 0, this.keys.length, hiragana);
                if (startPos < 0) {
                    startPos = -(startPos + 1);
                }
                let endPos = utils_5.binarySearchString(this.keys, 0, this.keys.length, stop);
                if (endPos < 0) {
                    endPos = -(endPos + 1);
                }
                let result = Array();
                for (let i = startPos; i < endPos; i++) {
                    for (let j of this.values[i].split("\t")) {
                        result.push(j);
                    }
                }
                return result;
            }
            else {
                return [];
            }
        }
    }
});
define("index", ["require", "exports", "Migemo", "CompactDictionary"], function (require, exports, Migemo_1, CompactDictionary_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(Migemo_1);
    __export(CompactDictionary_1);
});
