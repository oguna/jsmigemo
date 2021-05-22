import { CompactHiraganaString } from "../src/CompactHiraganaString";

describe('CompactHiraganaString', () => {
    it('constructor', () => {
        const hiragana = "ぁあぃいぅうぇえぉおかがきぎく" +
        "ぐけげこごさざしじすずせぜそぞた" +
        "だちぢっつづてでとどなにぬねのは" +
        "ばぱひびぴふぶぷへべぺほぼぽまみ" +
        "むめもゃやゅゆょよらりるれろゎわ" +
        "ゐゑをんゔゕゖ";
        const encoded = CompactHiraganaString.encodeString(hiragana);
        const decoded = CompactHiraganaString.decodeBytes(encoded);
        expect(decoded).toBe(hiragana);
        expect(encoded.length).toBe(hiragana.length);
    });
});