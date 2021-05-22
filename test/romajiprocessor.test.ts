import { romajiToHiragana, romajiToHiraganaPredictively } from "../src/RomajiProcessor";

describe('RomajiProcessor', () => {
  describe('#romajiToHiragana()', () => {
    it('should return correct romaji', () => {
      expect("ろーまじ").toBe( romajiToHiragana("ro-maji"));
      expect("あっち").toBe( romajiToHiragana("atti"));
      expect("あっt").toBe( romajiToHiragana("att"));
      expect("wっw").toBe( romajiToHiragana("www"));
      expect("っk").toBe( romajiToHiragana("kk"));
      expect("ん").toBe( romajiToHiragana("n"));
      expect(romajiToHiragana("kensaku")).toBe( "けんさく");
    });
  });

  describe('#romajiToHiraganaPredictively', () => {
    it('should return correct romaji and predictive suffix', () => {
      const kiku = romajiToHiraganaPredictively("kiku");
      expect(kiku.estaglishedHiragana).toBe("きく");
      expect(kiku.predictiveSuffixes).toEqual(new Set<string>([""]));

      const ky = romajiToHiraganaPredictively("ky");
      expect(ky.estaglishedHiragana).toBe("");
      expect(ky.predictiveSuffixes).toEqual(new Set<string>(["きゃ", "きぃ", "きぇ", "きゅ", "きょ"]));

      const kky = romajiToHiraganaPredictively("kky");
      expect(kky.estaglishedHiragana).toBe("っ");
      expect(kky.predictiveSuffixes).toEqual(new Set<string>(["きゃ", "きぃ", "きぇ", "きゅ", "きょ"]));

      const n = romajiToHiraganaPredictively("n");
      expect(n.estaglishedHiragana).toBe("");
      expect(n.predictiveSuffixes).toEqual(new Set<string>(["ん", "な", "に", "ぬ", "ね", "の", "にぃ", "にぇ", "にゃ", "にゅ", "にょ"]));
      expect(n.predictiveSuffixes).not.toContain("っ");

      const denk = romajiToHiraganaPredictively("denk")
      expect(denk.estaglishedHiragana).toBe("でん");
      expect(denk.predictiveSuffixes).toContain("か");
    });
  })
});