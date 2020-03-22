import { describe, it } from "mocha";
import { assert } from "chai"
import { romajiToHiragana, romajiToHiraganaPredictively } from "../src/RomajiProcessor";

describe('RomajiProcessor', function () {
  describe('#romajiToHiragana()', function () {
    it('should return correct romaji', function () {
      assert.equal("ろーまじ", romajiToHiragana("ro-maji"));
      assert.equal("あっち", romajiToHiragana("atti"));
      assert.equal("あっt", romajiToHiragana("att"));
      assert.equal("wっw", romajiToHiragana("www"));
      assert.equal("っk", romajiToHiragana("kk"));
      assert.equal("ん", romajiToHiragana("n"));
      assert.equal(romajiToHiragana("kensaku"), "けんさく");
    });
  });

  describe('#romajiToHiraganaPredictively', function () {
    it('should return correct romaji and predictive suffix', function () {
      let kiku = romajiToHiraganaPredictively("kiku");
      assert.equal(kiku.estaglishedHiragana, "きく");
      assert.containsAllKeys(kiku.predictiveSuffixes, [""]);

      let ky = romajiToHiraganaPredictively("ky");
      assert.equal(ky.estaglishedHiragana, "");
      assert.containsAllKeys(ky.predictiveSuffixes, ["きゃ", "きぃ", "きぇ", "きゅ", "きょ"]);

      let kky = romajiToHiraganaPredictively("kky");
      assert.equal(kky.estaglishedHiragana, "っ");
      assert.containsAllKeys(kky.predictiveSuffixes, ["きゃ", "きぃ", "きぇ", "きゅ", "きょ"]);

      let n = romajiToHiraganaPredictively("n");
      assert.equal(n.estaglishedHiragana, "");
      assert.containsAllKeys(n.predictiveSuffixes, ["ん", "な", "に", "ぬ", "ね", "の", "にゃ", "にゅ", "にょ"]);
      assert.doesNotHaveAnyKeys(n.predictiveSuffixes, ["っ"]);

      let denk = romajiToHiraganaPredictively("denk")
      assert.equal(denk.estaglishedHiragana, "でん");
      assert.include(denk.predictiveSuffixes, "か");
    });
  })
});