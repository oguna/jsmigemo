import { CompactDictionary } from "./CompactDictionary";
import { RegexGenerator } from "./RegexGenerator";
import { romajiToHiraganaPredictively } from "./RomajiProcessor";
import {zen2han_conv, han2zen_conv, hira2kata_conv} from "./CharacterConverter";
export class Migemo {
    dict: CompactDictionary | null;
    rxop: Array<string> | null;
    constructor() {
        this.dict = null;
        this.rxop = null;
    }
    queryAWord(word: string): string {
        let generator = this.rxop == null ? RegexGenerator.getDEFAULT() : new RegexGenerator(this.rxop[0], this.rxop[1], this.rxop[2], this.rxop[3], this.rxop[4], this.rxop[5]);
        // query自信はもちろん候補に加える
        generator.add(word);
        // queryそのものでの辞書引き
        let lower = word.toLowerCase();
        if (this.dict != null) {
            for (let word of this.dict.predictiveSearch(lower)) {
                generator.add(word);
            }
        }
        // queryを全角にして候補に加える
        let zen = han2zen_conv(word);
        generator.add(zen);
        // queryを半角にして候補に加える
        let han = zen2han_conv(word);
        generator.add(han);

        // 平仮名、カタカナ、及びそれによる辞書引き追加
        let hiraganaResult = romajiToHiraganaPredictively(lower);
        for (let a of hiraganaResult.predictiveSuffixes) {
            let hira = hiraganaResult.estaglishedHiragana + a;
            generator.add(hira);
            // 平仮名による辞書引き
            if (this.dict != null) {
                for (let b of this.dict.predictiveSearch(hira)) {
                    generator.add(b);
                }
            }
            // 片仮名文字列を生成し候補に加える
            let kata = hira2kata_conv(hira);
            generator.add(kata);
            // 半角カナを生成し候補に加える
            generator.add(zen2han_conv(kata));
        }
        return generator.generate();
    }

    query(word: string): string {
        if (word == "") {
            return "";
        }
        let words = this.parseQuery(word);
        let result = "";
        for (let w of words) {
            result += this.queryAWord(w);
        }
        return result;
    }

    setDict(dict: CompactDictionary | null) {
        this.dict = dict;
    }

    setRxop(rxop: [string] | null) {
        this.rxop = rxop;
    }

    *parseQuery(query: string): IterableIterator<string> {
        let re = /[^A-Z\s]+|[A-Z]{2,}|([A-Z][^A-Z\s]+)|([A-Z]\s*$)/g;
        let myArray: RegExpExecArray|null;
        while ((myArray = re.exec(query)) !== null) {
            yield myArray[0];
        }
    }
}