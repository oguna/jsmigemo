import { CompactDictionary } from "./CompactDictionary";
import { RegexGenerator } from "./RegexGenerator";
import { romajiToHiraganaPredictively } from "./RomajiProcessor";
export class Migemo {
    dict: CompactDictionary | null;
    constructor() {
        this.dict = null;
    }
    queryAWord(word: string): string {
        let generator = RegexGenerator.getDEFAULT();
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
        //let zen = CharacterConverter.han2zen(query);
        //generator.add(zen);
        // queryを半角にして候補に加える
        //String han = CharacterConverter.zen2
        //generator.add(hen);

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
            //String kata = CharacterConverter.hira2kata(a);
            //generator.add(kata);
            // 半角カナを生成し候補に加える
            //generator.add(CharacterConverter.zen2han(kata));
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

    *parseQuery(query: string): IterableIterator<string> {
        let re = /[^A-Z\s]+|[A-Z]{2,}|([A-Z][^A-Z\s]+)|([A-Z]\s*$)/g;
        let myArray: RegExpExecArray|null;
        while ((myArray = re.exec(query)) !== null) {
            yield myArray[0];
        }
    }
}