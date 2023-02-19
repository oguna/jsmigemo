import { CompactDictionary } from "./CompactDictionary";
import {zen2han_conv, han2zen_conv, hira2kata_conv} from "./CharacterConverter";
import { TernaryRegexGenerator } from "./TernaryRegexGenerator";
import { RomajiProcessor2 } from "./RomajiProcessor2";
import { RomajiProcessor } from "./RomajiProcessor";
export class Migemo {
    dict: CompactDictionary | null;
    rxop: string[] | null;
    processor: RomajiProcessor;
    constructor() {
        this.dict = null;
        this.rxop = null;
        this.processor = RomajiProcessor2.build();
    }
    queryAWord(word: string): string {
        const generator = this.rxop === null ? TernaryRegexGenerator.getDEFAULT() : new TernaryRegexGenerator(this.rxop[0], this.rxop[1], this.rxop[2], this.rxop[3], this.rxop[4], this.rxop[5]);
        // query自信はもちろん候補に加える
        generator.add(word);
        // queryそのものでの辞書引き
        const lower = word.toLowerCase();
        if (this.dict != null) {
            for (const word of this.dict.predictiveSearch(lower)) {
                generator.add(word);
            }
        }
        // queryを全角にして候補に加える
        const zen = han2zen_conv(word);
        generator.add(zen);
        // queryを半角にして候補に加える
        const han = zen2han_conv(word);
        generator.add(han);

        // 平仮名、カタカナ、及びそれによる辞書引き追加
        const hiraganaResult = this.processor.romajiToHiraganaPredictively(lower);
        for (const a of hiraganaResult.suffixes) {
            const hira = hiraganaResult.prefix + a;
            generator.add(hira);
            // 平仮名による辞書引き
            if (this.dict != null) {
                for (const b of this.dict.predictiveSearch(hira)) {
                    generator.add(b);
                }
            }
            // 片仮名文字列を生成し候補に加える
            const kata = hira2kata_conv(hira);
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
        const words = this.parseQuery(word);
        let result = "";
        for (const w of words) {
            result += this.queryAWord(w);
        }
        return result;
    }

    setDict(dict: CompactDictionary | null) {
        this.dict = dict;
    }

    setRxop(rxop: string[] | null) {
        this.rxop = rxop;
    }

    setRomajiProcessor(processor: RomajiProcessor) {
        this.processor = processor;
    }

    *parseQuery(query: string): IterableIterator<string> {
        const re = /[^A-Z\s]+|[A-Z]{2,}|([A-Z][^A-Z\s]+)|([A-Z]\s*$)/g;
        let myArray: RegExpExecArray|null;
        while ((myArray = re.exec(query)) !== null) {
            yield myArray[0];
        }
    }
}