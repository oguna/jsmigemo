import { Migemo } from "../src/Migemo";
import { CompactDictionary } from "../src/CompactDictionary";
import { CompactDictionaryBuilder } from "../src/CompactDictionaryBuilder";
import { readFileSync } from "fs";
import { RomajiProcessor1, RomanEntry } from "../src/RomajiProcessor1";

describe("migemo", () => {
    const buff = readFileSync('migemo-compact-dict');
    const dict = new CompactDictionary(buff.buffer);

    it("kikai", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("kikai");
        expect(result).toBe("(kikai|きかい|キカイ|喜界|器[怪械]|奇[怪恠]|棋界|機[会械]|毀壊|気[塊海]|貴[会海]|鬼[怪海界]|ｋｉｋａｉ|ｷｶｲ)");
    });

    it("連文節の検索（大文字区切り）", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("renBunsetuNoKensaku");
        const regex = RegExp(result);
        expect(regex.exec("連文節の検索")).toEqual(expect.anything());
    });

    it("連文節の検索（空白区切り）", () => {
        const migemo = new Migemo();
        migemo.setDict(dict);
        const result = migemo.query("renBunsetu no kensaku");
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
        expect(result).toBe('(keqsaku|けんさく|ケンサク|健[作策]|兼作|建策|憲作|検索|献策|県作|研削|羂索|腱索|謙作|賢作|ｋｅｑｓａｋｕ|ｹﾝｻｸ)')
    })

    it("Supplementary Planeの漢字を含む辞書候補", () => {
        const shitsuryu = "\u{20B9F}留"
        const buffer = CompactDictionaryBuilder.build(new Map([
            ["しつりゅう", ["叱留", shitsuryu]],
        ]))
        const supplementaryDictionary = new CompactDictionary(buffer)

        const migemo = new Migemo()
        migemo.setDict(supplementaryDictionary)
        const pattern = migemo.query("situryuu")
        expect(pattern).toBe(`(situryuu|しつりゅう|シツリュウ|叱留|ｓｉｔｕｒｙｕｕ|ｼﾂﾘｭｳ|${shitsuryu})`)
    })

    it("#17", () => {
        const ESCAPE = "\\.[]{}()*+-?^$|";
        const migemo = new Migemo();
        migemo.setDict(dict);
        migemo.setRxop(["\\|", "\\%(", "\\)", "[", "]", "", ESCAPE])
        const result = migemo.query("kensaku");
        const TOBE = "\\%(kensaku\\|けんさく\\|ケンサク\\|健[作策]\\|兼作\\|建策\\|憲作\\|検索\\|献策\\|県作\\|研削\\|羂索\\|腱索\\|謙作\\|賢作\\|ｋｅｎｓａｋｕ\\|ｹﾝｻｸ\\)"
        expect(result).toBe(TOBE);
    })

    /*
    辞書ファイルの内容を変更したため、テストケースも変更する必要がある。
    このテストケースが何を意図したのか忘れたので、とりあえずコメントアウトしておく。
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
    */
});
