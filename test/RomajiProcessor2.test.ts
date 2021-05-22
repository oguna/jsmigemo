import { RomajiProcessor2 } from "../src/RomajiProcessor2";

describe('RomajiProcessor2', () => {
    it('romajiToHiragana', () => {
        const processor = RomajiProcessor2.buildProcessor();
        expect(processor.romajiToHiragana("ro-maji")).toBe("ろーまじ");
        expect(processor.romajiToHiragana("atti")).toBe("あっち");
        expect(processor.romajiToHiragana("att")).toBe("あっt");
        expect(processor.romajiToHiragana("www")).toBe("wっw");
        expect(processor.romajiToHiragana("kk")).toBe("っk");
        expect(processor.romajiToHiragana("n")).toBe("ん");
        expect(processor.romajiToHiragana("kensaku")).toBe("けんさく");
    });
    it('romajiToHiraganaPredictively_kiku', () => {
        const processor = RomajiProcessor2.buildProcessor();
        const a = processor.romajiToHiraganaPredictively("kiku");
        expect(a.prefix).toBe("きく");
        expect(a.suffixes).toStrictEqual([""]);
    });
    it('romajiToHiraganaPredictively_saky', () => {
        const processor = RomajiProcessor2.buildProcessor();
        const a = processor.romajiToHiraganaPredictively("saky");
        expect(a.prefix).toBe("さ");
        expect(a.suffixes).toStrictEqual(["きゃ", "きぇ", "きぃ", "きょ", "きゅ"]);
    });
});