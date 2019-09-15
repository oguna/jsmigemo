import { describe, it } from "mocha";
import { assert } from "chai"
import { CompactHiraganaString } from "../src/CompactHiraganaString";

describe('CompactHiraganaString', function () {
    it('constructor', function () {
        const hiragana = "ぁあぃいぅうぇえぉおかがきぎく" +
        "ぐけげこごさざしじすずせぜそぞた" +
        "だちぢっつづてでとどなにぬねのは" +
        "ばぱひびぴふぶぷへべぺほぼぽまみ" +
        "むめもゃやゅゆょよらりるれろゎわ" +
        "ゐゑをんゔゕゖ";
        const encoded = CompactHiraganaString.encodeString(hiragana);
        const decoded = CompactHiraganaString.decodeBytes(encoded);
        assert.equal(decoded, hiragana);
        assert.equal(encoded.length, hiragana.length);
    });
});