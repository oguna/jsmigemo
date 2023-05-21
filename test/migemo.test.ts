import { Migemo } from "../src/Migemo";
import { CompactDictionary } from "../src/CompactDictionary";
import { readFileSync } from "fs";
import { RomajiProcessor1, RomanEntry } from "../src/RomajiProcessor1";

describe("migemo", () => {
    const buff = readFileSync('migemo-compact-dict');
    const dict = new CompactDictionary(buff.buffer);

    it("kikai", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("kikai");
        expect(result).toBe("(kikai|きかい|キカイ|喜界|器械|奇怪|既会員|棋界|機[会械]|毀壊|気塊|貴会|ｋｉｋａｉ|ｷｶｲ)");
    });

    it("連文節の検索（大文字区切り）", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("renbunsetuNoKensaku");
        const regex = RegExp(result);
        expect(regex.exec("連文節の検索")).toEqual(expect.anything());
    });

    it("連文節の検索（空白区切り）", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("renbunsetu no kensaku");
        const regex = RegExp(result);
        expect(regex.exec("連文節の検索")).toEqual(expect.anything());
    });

    it("AZIK配列対応", () => {
        const data = readFileSync('test/romantable_azik.txt', 'utf-8')
        const roman_entries: RomanEntry[] = []
        for (const line of data.split('\n')) {
            const [a, b] = line.trim().split('\t')
            roman_entries.push(new RomanEntry(a ,b , 0))
        }
        const rp = new RomajiProcessor1(roman_entries)
        const migemo = new Migemo()
        migemo.setDict(dict)
        migemo.setRomajiProcessor(rp)
        const result = migemo.query('keqsaku')
        expect(result).toBe('(keqsaku|けんさく|ケンサク|建策|憲[作冊]|検索|献策|研削|羂索|ｋｅｑｓａｋｕ|ｹﾝｻｸ)')
    })

    it("#17", () => {
        const ESCAPE = "\\.[]{}()*+-?^$|";
        const migemo = new Migemo();
        migemo.setDict(dict);
        migemo.setRxop(["\\|", "\\%(", "\\)", "[", "]", "", ESCAPE])
        const result = migemo.query("kensaku");
        const TOBE = "\\%(kensaku\\|けんさく\\|ケンサク\\|建策\\|憲[作冊]\\|検索\\|献策\\|研削\\|羂索\\|ｋｅｎｓａｋｕ\\|ｹﾝｻｸ\\)"
        expect(result).toBe(TOBE);
    })

    it("#21,#22", () => {
        const VIM_ESCAPE = "\\.[]}*+-?^$|"; // {と()はエスケープしない
        const migemo = new Migemo();
        migemo.setDict(dict);
        migemo.setRxop(["\\|", "\\%(", "\\)", "[", "]", "", VIM_ESCAPE])
        const result_i = migemo.query("i");
        const TOCONTAIN_i = '(concat "I\\\\057O\\%(")\\|ポート")\\)'
        expect(result_i).toContain(TOCONTAIN_i);
        const result_j = migemo.query("j");
        const TOCONTAIN_j = 'k\\$_{eff\\}\\$'
        expect(result_j).toContain(TOCONTAIN_j);
    })
});
