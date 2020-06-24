import { describe, it } from "mocha";
import { assert } from "chai"
import { RomajiProcessor2 } from "../src/RomajiProcessor2";

describe('RomajiProcessor2', function () {
    it('romajiToHiragana', function () {
        const processor = RomajiProcessor2.buildProcessor();
        assert.equal(processor.romajiToHiragana("ro-maji"), "ろーまじ");
        assert.equal(processor.romajiToHiragana("atti"), "あっち");
        assert.equal(processor.romajiToHiragana("att"), "あっt");
        assert.equal(processor.romajiToHiragana("www"), "wっw");
        assert.equal(processor.romajiToHiragana("kk"), "っk");
        assert.equal(processor.romajiToHiragana("n"), "ん");
        assert.equal(processor.romajiToHiragana("kensaku"), "けんさく");
    });
    it('romajiToHiraganaPredictively_kiku', function () {
        const processor = RomajiProcessor2.buildProcessor();
        const a = processor.romajiToHiraganaPredictively("kiku");
        assert.equal(a.prefix, "きく");
        assert.deepEqual(a.suffixes, [""]);
    });
    it('romajiToHiraganaPredictively_saky', function () {
        const processor = RomajiProcessor2.buildProcessor();
        const a = processor.romajiToHiraganaPredictively("saky");
        assert.equal(a.prefix, "さ");
        assert.containsAllKeys(a.suffixes, ["きゃ", "きぃ", "きぇ", "きゅ", "きょ"]);
    });
});