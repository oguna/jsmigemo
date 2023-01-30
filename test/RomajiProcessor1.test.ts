import { RomajiProcessor1, RomanEntry } from "../src/RomajiProcessor1";
import {readFileSync} from 'fs';

describe('RomajiProcessor', () => {
  describe('#romajiToHiragana()', () => {
    it('should return correct romaji', () => {
      const rp = RomajiProcessor1.build();
      expect("ろーまじ").toBe( rp.romajiToHiragana("ro-maji"));
      expect("あっち").toBe( rp.romajiToHiragana("atti"));
      expect("あっt").toBe( rp.romajiToHiragana("att"));
      expect("wっw").toBe( rp.romajiToHiragana("www"));
      expect("っk").toBe( rp.romajiToHiragana("kk"));
      expect("ん").toBe( rp.romajiToHiragana("n"));
      expect(rp.romajiToHiragana("kensaku")).toBe( "けんさく");
    });
  });

  describe('#romajiToHiraganaPredictively', () => {
    it('should return correct romaji and predictive suffix', () => {
      const rp = RomajiProcessor1.build();
      const kiku = rp.romajiToHiraganaPredictively("kiku");
      expect(kiku.prefix).toBe("きく");
      expect(kiku.suffixes).toEqual([""]);

      const ky = rp.romajiToHiraganaPredictively("ky");
      expect(ky.prefix).toBe("");
      expect(ky.suffixes.sort()).toEqual(["きゃ", "きぃ", "きぇ", "きゅ", "きょ"].sort());

      const kky = rp.romajiToHiraganaPredictively("kky");
      expect(kky.prefix).toBe("っ");
      expect(kky.suffixes.sort()).toEqual(["きゃ", "きぃ", "きぇ", "きゅ", "きょ"].sort());

      const n = rp.romajiToHiraganaPredictively("n");
      expect(n.prefix).toBe("");
      expect(n.suffixes.sort()).toEqual(["ん", "な", "に", "ぬ", "ね", "の", "にぃ", "にぇ", "にゃ", "にゅ", "にょ"].sort());
      expect(n.suffixes).not.toContain("っ");

      const denk = rp.romajiToHiraganaPredictively("denk")
      expect(denk.prefix).toBe("でん");
      expect(denk.suffixes).toContain("か");
    });
  })

  describe('AZIK配列対応', () => {
    it('azik', () => {
      const data = readFileSync('test/romantable_azik.txt', 'utf-8')
      const roman_entries: RomanEntry[] = []
      for (const line of data.split('\n')) {
        const [a, b] = line.trim().split('\t')
        roman_entries.push(new RomanEntry(a ,b , 0))
      }
      const rp = new RomajiProcessor1(roman_entries)
      const kzsztz = rp.romajiToHiragana('kzsztz')
      expect('かんさんたん').toBe(kzsztz)
      const xtu = rp.romajiToHiragana(';')
      expect('っ').toBe(xtu)
      const xaca = rp.romajiToHiragana('xaca')
      expect('しゃちゃ').toBe(xaca)
      const choon = rp.romajiToHiragana(':')
      expect('ー').toBe(choon)
    })
  })
});