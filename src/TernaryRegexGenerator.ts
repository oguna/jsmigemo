import { BitList } from "./BitList";

class TernaryRegexNode {
    value: number = 0;
    child: TernaryRegexNode | null = null;
    left: TernaryRegexNode | null = null;
    right: TernaryRegexNode | null = null;
    level: number = 0;
    successor(): TernaryRegexNode {
        let t = this.right!;
        while (t.left != null) {
            t = t.left;
        }
        return t;
    }
    predecessor(): TernaryRegexNode {
        let t = this.left!;
        while (t.left != null) {
            t = t.left;
        }
        while (t.right != null) {
            t = t.right;
        }
        return t;
    }
}

function skew(t: TernaryRegexNode | null): TernaryRegexNode | null {
    if (t == null) {
        return null;
    } else if (t.left == null) {
        return t;
    } else if (t.left.level == t.level) {
        let l = t.left;
        t.left = l.right;
        l.right = t;
        return l;
    } else {
        return t;
    }
}

function split(t: TernaryRegexNode | null): TernaryRegexNode | null {
    if (t == null) {
        return null;
    } else if (t.right == null || t.right.right == null) {
        return t;
    } else if (t.level == t.right.right.level) {
        let r = t.right;
        t.right = r.left;
        r.left = t;
        r.level = r.level + 1;
        return r;
    } else {
        return t;
    }
}

function add(node: TernaryRegexNode | null, word: string, offset: number): TernaryRegexNode | null {
    if (offset < word.length) {
        const value = word.codePointAt(offset)!;
        let [node_, target, inserted] = insert(value, node);
        if (inserted || target.child != null) {
            target.child = add(target.child, word, offset + (value > 0xffff ? 2 : 1));
        }
        return node_;
    } else {
        return null;
    }
}

function isBmpScalarValue(value: number): boolean {
    return value <= 0xffff && (value < 0xd800 || value > 0xdfff);
}

function* traverseSiblings(node: TernaryRegexNode | null): IterableIterator<TernaryRegexNode> {
    if (node != null) {
        yield* traverseSiblings(node.left);
        yield node;
        yield* traverseSiblings(node.right);
    }
}

function insert(x: number, t: TernaryRegexNode | null): [TernaryRegexNode | null, TernaryRegexNode, boolean] {
    let r: TernaryRegexNode | null;
    let inserted = false;
    if (t == null) {
        r = new TernaryRegexNode();
        r.value = x;
        r.level = 1;
        r.left = null;
        r.right = null;
        return [r, r, true];
    } else if (x < t.value) {
        [t.left, r, inserted] = insert(x, t.left);
    } else if (x > t.value) {
        [t.right, r, inserted] = insert(x, t.right);
    } else {
        return [t, t, false];
    }
    t = skew(t);
    t = split(t);
    return [t, r, inserted];
}

export class TernaryRegexGenerator {
    or: string;
    beginGroup: string;
    endGroup: string;
    beginClass: string;
    endClass: string;
    newline: string;
    root: TernaryRegexNode | null;
    escapedCharacters: BitList;

    constructor(or: string, beginGroup: string, endGroup: string, beginClass: string, endClass: string, newline: string, escape: string) {
        this.or = or;
        this.beginGroup = beginGroup;
        this.endGroup = endGroup;
        this.beginClass = beginClass;
        this.endClass = endClass;
        this.newline = newline;
        this.root = null;
        this.escapedCharacters = TernaryRegexGenerator.initializeEscapeCharacters(escape);
    }

    static getDEFAULT(): TernaryRegexGenerator {
        const ESCAPE = "\\.[]{}()*+-?^$|";
		return new TernaryRegexGenerator("|", "(", ")", "[", "]", "", ESCAPE);
	}

    static initializeEscapeCharacters(escape: string): BitList {
        const bits = new BitList(128);
        for (let i = 0; i < escape.length; i++) {
            const c = escape.charCodeAt(i)
            if (c < 128) {
                bits.set(c, true);
            } else {
                throw new Error("アスキー文字のみエスケープできます")
            }
        }
        return bits;
    }

    add(word: string) {
        if (word.length == 0) {
            return;
        }
        this.root = add(this.root, word, 0);
    }

    generateStub(node: TernaryRegexNode | null): string {
        let buf = "";
        let bmpNoChild = 0;
        let otherNoChild = 0;
        let haschild = 0;
        for (let n of traverseSiblings(node)) {
            if (n.child != null) {
                haschild++;
            } else if (isBmpScalarValue(n.value)) {
                bmpNoChild++;
            } else {
                otherNoChild++;
            }
        }
        const alternatives = (bmpNoChild > 0 ? 1 : 0) + otherNoChild + haschild;

        if (alternatives > 1) {
            buf += this.beginGroup;
        }

        let generatedAlternatives = 0;
        if (bmpNoChild > 0) {
            if (bmpNoChild > 1) {
                buf += this.beginClass;
            }
            for (let n of traverseSiblings(node)) {
                if (n.child != null || !isBmpScalarValue(n.value)) {
                    continue;
                }
                if (n.value < 128 && this.escapedCharacters.get(n.value)) {
                    buf += '\\';
                }
                buf += String.fromCodePoint(n.value);
            }
            if (bmpNoChild > 1) {
                buf += this.endClass;
            }
            generatedAlternatives++;
        }

        if (otherNoChild > 0) {
            for (let n of traverseSiblings(node)) {
                if (n.child != null || isBmpScalarValue(n.value)) {
                    continue;
                }
                if (generatedAlternatives > 0) {
                    buf += this.or;
                }
                buf += String.fromCodePoint(n.value);
                generatedAlternatives++;
            }
        }

        for (let n of traverseSiblings(node)) {
            if (n.child == null) {
                continue;
            }
            if (generatedAlternatives > 0) {
                buf += this.or;
            }
            if (n.value < 128 && this.escapedCharacters.get(n.value)) {
                buf += '\\';
            }
            buf += String.fromCodePoint(n.value)
            if (this.newline != null) { // TODO: always true
                buf += this.newline;
            }
            buf += this.generateStub(n.child)
            generatedAlternatives++;
        }

        if (alternatives > 1) {
            buf += this.endGroup;
        }
        return buf;
    }

    generate(): string {
        if (this.root == null) {
            return "";
        } else {
            return this.generateStub(this.root);
        }
    }
}
