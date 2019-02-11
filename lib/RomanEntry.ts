import {binarySearch} from "./utils";

class RomanEntry {
    roman: string;
    hiragana: string;
    remain: number;
    index: number;
    constructor(roman: string, hiragana: string, remain: number) {
        this.roman = roman;
        this.hiragana = hiragana;
        this.remain = remain;
        this.index = RomanEntry.calculateIndex(roman);
    }
    static _calculateIndex(roman: string, start:number, end:number):number {
        let result = 0;
        for (let i = 0; i < 4; i++) {
            let index = i + start;
            let c = index < roman.length && index < end ? roman.charCodeAt(index) : 0;
            result |= c;
            if (i < 3) {
                result <<= 8;
            }
        }
        return result;
    }
    static calculateIndex(roman: string): number {
        return RomanEntry._calculateIndex(roman, 0, 4);
    }

}

const ROMAN_ENTRIES: RomanEntry[] = [
    new RomanEntry("-", "ー", 0),
    new RomanEntry("~", "〜", 0),
    new RomanEntry(".", "。", 0),
    new RomanEntry(",", "、", 0),
    new RomanEntry("z/", "・", 0),
    new RomanEntry("z.", "…", 0),
    new RomanEntry("z,", "‥", 0),
    new RomanEntry("zh", "←", 0),
    new RomanEntry("zj", "↓", 0),
    new RomanEntry("zk", "↑", 0),
    new RomanEntry("zl", "→", 0),
    new RomanEntry("z-", "〜", 0),
    new RomanEntry("z[", "『", 0),
    new RomanEntry("z]", "』", 0),
    new RomanEntry("[", "「", 0),
    new RomanEntry("]", "」", 0),
    new RomanEntry("va", "ゔぁ", 0),
    new RomanEntry("vi", "ゔぃ", 0),
    new RomanEntry("vu", "ゔ", 0),
    new RomanEntry("ve", "ゔぇ", 0),
    new RomanEntry("vo", "ゔぉ", 0),
    new RomanEntry("vya", "ゔゃ", 0),
    new RomanEntry("vyi", "ゔぃ", 0),
    new RomanEntry("vyu", "ゔゅ", 0),
    new RomanEntry("vye", "ゔぇ", 0),
    new RomanEntry("vyo", "ゔょ", 0),
    new RomanEntry("qq", "っ", 1),
    new RomanEntry("vv", "っ", 1),
    new RomanEntry("ll", "っ", 1),
    new RomanEntry("xx", "っ", 1),
    new RomanEntry("kk", "っ", 1),
    new RomanEntry("gg", "っ", 1),
    new RomanEntry("ss", "っ", 1),
    new RomanEntry("zz", "っ", 1),
    new RomanEntry("jj", "っ", 1),
    new RomanEntry("tt", "っ", 1),
    new RomanEntry("dd", "っ", 1),
    new RomanEntry("hh", "っ", 1),
    new RomanEntry("ff", "っ", 1),
    new RomanEntry("bb", "っ", 1),
    new RomanEntry("pp", "っ", 1),
    new RomanEntry("mm", "っ", 1),
    new RomanEntry("yy", "っ", 1),
    new RomanEntry("rr", "っ", 1),
    new RomanEntry("ww", "っ", 1),
    new RomanEntry("www", "w", 2),
    new RomanEntry("cc", "っ", 1),
    new RomanEntry("kya", "きゃ", 0),
    new RomanEntry("kyi", "きぃ", 0),
    new RomanEntry("kyu", "きゅ", 0),
    new RomanEntry("kye", "きぇ", 0),
    new RomanEntry("kyo", "きょ", 0),
    new RomanEntry("gya", "ぎゃ", 0),
    new RomanEntry("gyi", "ぎぃ", 0),
    new RomanEntry("gyu", "ぎゅ", 0),
    new RomanEntry("gye", "ぎぇ", 0),
    new RomanEntry("gyo", "ぎょ", 0),
    new RomanEntry("sya", "しゃ", 0),
    new RomanEntry("syi", "しぃ", 0),
    new RomanEntry("syu", "しゅ", 0),
    new RomanEntry("sye", "しぇ", 0),
    new RomanEntry("syo", "しょ", 0),
    new RomanEntry("sha", "しゃ", 0),
    new RomanEntry("shi", "し", 0),
    new RomanEntry("shu", "しゅ", 0),
    new RomanEntry("she", "しぇ", 0),
    new RomanEntry("sho", "しょ", 0),
    new RomanEntry("zya", "じゃ", 0),
    new RomanEntry("zyi", "じぃ", 0),
    new RomanEntry("zyu", "じゅ", 0),
    new RomanEntry("zye", "じぇ", 0),
    new RomanEntry("zyo", "じょ", 0),
    new RomanEntry("tya", "ちゃ", 0),
    new RomanEntry("tyi", "ちぃ", 0),
    new RomanEntry("tyu", "ちゅ", 0),
    new RomanEntry("tye", "ちぇ", 0),
    new RomanEntry("tyo", "ちょ", 0),
    new RomanEntry("cha", "ちゃ", 0),
    new RomanEntry("chi", "ち", 0),
    new RomanEntry("chu", "ちゅ", 0),
    new RomanEntry("che", "ちぇ", 0),
    new RomanEntry("cho", "ちょ", 0),
    new RomanEntry("cya", "ちゃ", 0),
    new RomanEntry("cyi", "ちぃ", 0),
    new RomanEntry("cyu", "ちゅ", 0),
    new RomanEntry("cye", "ちぇ", 0),
    new RomanEntry("cyo", "ちょ", 0),
    new RomanEntry("dya", "ぢゃ", 0),
    new RomanEntry("dyi", "ぢぃ", 0),
    new RomanEntry("dyu", "ぢゅ", 0),
    new RomanEntry("dye", "ぢぇ", 0),
    new RomanEntry("dyo", "ぢょ", 0),
    new RomanEntry("tsa", "つぁ", 0),
    new RomanEntry("tsi", "つぃ", 0),
    new RomanEntry("tse", "つぇ", 0),
    new RomanEntry("tso", "つぉ", 0),
    new RomanEntry("tha", "てゃ", 0),
    new RomanEntry("thi", "てぃ", 0),
    new RomanEntry("t'i", "てぃ", 0),
    new RomanEntry("thu", "てゅ", 0),
    new RomanEntry("the", "てぇ", 0),
    new RomanEntry("tho", "てょ", 0),
    new RomanEntry("t'yu", "てゅ", 0),
    new RomanEntry("dha", "でゃ", 0),
    new RomanEntry("dhi", "でぃ", 0),
    new RomanEntry("d'i", "でぃ", 0),
    new RomanEntry("dhu", "でゅ", 0),
    new RomanEntry("dhe", "でぇ", 0),
    new RomanEntry("dho", "でょ", 0),
    new RomanEntry("d'yu", "でゅ", 0),
    new RomanEntry("twa", "とぁ", 0),
    new RomanEntry("twi", "とぃ", 0),
    new RomanEntry("twu", "とぅ", 0),
    new RomanEntry("twe", "とぇ", 0),
    new RomanEntry("two", "とぉ", 0),
    new RomanEntry("t'u", "とぅ", 0),
    new RomanEntry("dwa", "どぁ", 0),
    new RomanEntry("dwi", "どぃ", 0),
    new RomanEntry("dwu", "どぅ", 0),
    new RomanEntry("dwe", "どぇ", 0),
    new RomanEntry("dwo", "どぉ", 0),
    new RomanEntry("d'u", "どぅ", 0),
    new RomanEntry("nya", "にゃ", 0),
    new RomanEntry("nyi", "にぃ", 0),
    new RomanEntry("nyu", "にゅ", 0),
    new RomanEntry("nye", "にぇ", 0),
    new RomanEntry("nyo", "にょ", 0),
    new RomanEntry("hya", "ひゃ", 0),
    new RomanEntry("hyi", "ひぃ", 0),
    new RomanEntry("hyu", "ひゅ", 0),
    new RomanEntry("hye", "ひぇ", 0),
    new RomanEntry("hyo", "ひょ", 0),
    new RomanEntry("bya", "びゃ", 0),
    new RomanEntry("byi", "びぃ", 0),
    new RomanEntry("byu", "びゅ", 0),
    new RomanEntry("bye", "びぇ", 0),
    new RomanEntry("byo", "びょ", 0),
    new RomanEntry("pya", "ぴゃ", 0),
    new RomanEntry("pyi", "ぴぃ", 0),
    new RomanEntry("pyu", "ぴゅ", 0),
    new RomanEntry("pye", "ぴぇ", 0),
    new RomanEntry("pyo", "ぴょ", 0),
    new RomanEntry("fa", "ふぁ", 0),
    new RomanEntry("fi", "ふぃ", 0),
    new RomanEntry("fu", "ふ", 0),
    new RomanEntry("fe", "ふぇ", 0),
    new RomanEntry("fo", "ふぉ", 0),
    new RomanEntry("fya", "ふゃ", 0),
    new RomanEntry("fyu", "ふゅ", 0),
    new RomanEntry("fyo", "ふょ", 0),
    new RomanEntry("hwa", "ふぁ", 0),
    new RomanEntry("hwi", "ふぃ", 0),
    new RomanEntry("hwe", "ふぇ", 0),
    new RomanEntry("hwo", "ふぉ", 0),
    new RomanEntry("hwyu", "ふゅ", 0),
    new RomanEntry("mya", "みゃ", 0),
    new RomanEntry("myi", "みぃ", 0),
    new RomanEntry("myu", "みゅ", 0),
    new RomanEntry("mye", "みぇ", 0),
    new RomanEntry("myo", "みょ", 0),
    new RomanEntry("rya", "りゃ", 0),
    new RomanEntry("ryi", "りぃ", 0),
    new RomanEntry("ryu", "りゅ", 0),
    new RomanEntry("rye", "りぇ", 0),
    new RomanEntry("ryo", "りょ", 0),
    new RomanEntry("n'", "ん", 0),
    new RomanEntry("nn", "ん", 0),
    new RomanEntry("n", "ん", 0),
    new RomanEntry("xn", "ん", 0),
    new RomanEntry("a", "あ", 0),
    new RomanEntry("i", "い", 0),
    new RomanEntry("u", "う", 0),
    new RomanEntry("wu", "う", 0),
    new RomanEntry("e", "え", 0),
    new RomanEntry("o", "お", 0),
    new RomanEntry("xa", "ぁ", 0),
    new RomanEntry("xi", "ぃ", 0),
    new RomanEntry("xu", "ぅ", 0),
    new RomanEntry("xe", "ぇ", 0),
    new RomanEntry("xo", "ぉ", 0),
    new RomanEntry("la", "ぁ", 0),
    new RomanEntry("li", "ぃ", 0),
    new RomanEntry("lu", "ぅ", 0),
    new RomanEntry("le", "ぇ", 0),
    new RomanEntry("lo", "ぉ", 0),
    new RomanEntry("lyi", "ぃ", 0),
    new RomanEntry("xyi", "ぃ", 0),
    new RomanEntry("lye", "ぇ", 0),
    new RomanEntry("xye", "ぇ", 0),
    new RomanEntry("ye", "いぇ", 0),
    new RomanEntry("ka", "か", 0),
    new RomanEntry("ki", "き", 0),
    new RomanEntry("ku", "く", 0),
    new RomanEntry("ke", "け", 0),
    new RomanEntry("ko", "こ", 0),
    new RomanEntry("xka", "ヵ", 0),
    new RomanEntry("xke", "ヶ", 0),
    new RomanEntry("lka", "ヵ", 0),
    new RomanEntry("lke", "ヶ", 0),
    new RomanEntry("ga", "が", 0),
    new RomanEntry("gi", "ぎ", 0),
    new RomanEntry("gu", "ぐ", 0),
    new RomanEntry("ge", "げ", 0),
    new RomanEntry("go", "ご", 0),
    new RomanEntry("sa", "さ", 0),
    new RomanEntry("si", "し", 0),
    new RomanEntry("su", "す", 0),
    new RomanEntry("se", "せ", 0),
    new RomanEntry("so", "そ", 0),
    new RomanEntry("ca", "か", 0),
    new RomanEntry("ci", "し", 0),
    new RomanEntry("cu", "く", 0),
    new RomanEntry("ce", "せ", 0),
    new RomanEntry("co", "こ", 0),
    new RomanEntry("qa", "くぁ", 0),
    new RomanEntry("qi", "くぃ", 0),
    new RomanEntry("qu", "く", 0),
    new RomanEntry("qe", "くぇ", 0),
    new RomanEntry("qo", "くぉ", 0),
    new RomanEntry("kwa", "くぁ", 0),
    new RomanEntry("kwi", "くぃ", 0),
    new RomanEntry("kwu", "くぅ", 0),
    new RomanEntry("kwe", "くぇ", 0),
    new RomanEntry("kwo", "くぉ", 0),
    new RomanEntry("gwa", "ぐぁ", 0),
    new RomanEntry("gwi", "ぐぃ", 0),
    new RomanEntry("gwu", "ぐぅ", 0),
    new RomanEntry("gwe", "ぐぇ", 0),
    new RomanEntry("gwo", "ぐぉ", 0),
    new RomanEntry("za", "ざ", 0),
    new RomanEntry("zi", "じ", 0),
    new RomanEntry("zu", "ず", 0),
    new RomanEntry("ze", "ぜ", 0),
    new RomanEntry("zo", "ぞ", 0),
    new RomanEntry("ja", "じゃ", 0),
    new RomanEntry("ji", "じ", 0),
    new RomanEntry("ju", "じゅ", 0),
    new RomanEntry("je", "じぇ", 0),
    new RomanEntry("jo", "じょ", 0),
    new RomanEntry("jya", "じゃ", 0),
    new RomanEntry("jyi", "じぃ", 0),
    new RomanEntry("jyu", "じゅ", 0),
    new RomanEntry("jye", "じぇ", 0),
    new RomanEntry("jyo", "じょ", 0),
    new RomanEntry("ta", "た", 0),
    new RomanEntry("ti", "ち", 0),
    new RomanEntry("tu", "つ", 0),
    new RomanEntry("tsu", "つ", 0),
    new RomanEntry("te", "て", 0),
    new RomanEntry("to", "と", 0),
    new RomanEntry("da", "だ", 0),
    new RomanEntry("di", "ぢ", 0),
    new RomanEntry("du", "づ", 0),
    new RomanEntry("de", "で", 0),
    new RomanEntry("do", "ど", 0),
    new RomanEntry("xtu", "っ", 0),
    new RomanEntry("xtsu", "っ", 0),
    new RomanEntry("ltu", "っ", 0),
    new RomanEntry("ltsu", "っ", 0),
    new RomanEntry("na", "な", 0),
    new RomanEntry("ni", "に", 0),
    new RomanEntry("nu", "ぬ", 0),
    new RomanEntry("ne", "ね", 0),
    new RomanEntry("no", "の", 0),
    new RomanEntry("ha", "は", 0),
    new RomanEntry("hi", "ひ", 0),
    new RomanEntry("hu", "ふ", 0),
    new RomanEntry("fu", "ふ", 0),
    new RomanEntry("he", "へ", 0),
    new RomanEntry("ho", "ほ", 0),
    new RomanEntry("ba", "ば", 0),
    new RomanEntry("bi", "び", 0),
    new RomanEntry("bu", "ぶ", 0),
    new RomanEntry("be", "べ", 0),
    new RomanEntry("bo", "ぼ", 0),
    new RomanEntry("pa", "ぱ", 0),
    new RomanEntry("pi", "ぴ", 0),
    new RomanEntry("pu", "ぷ", 0),
    new RomanEntry("pe", "ぺ", 0),
    new RomanEntry("po", "ぽ", 0),
    new RomanEntry("ma", "ま", 0),
    new RomanEntry("mi", "み", 0),
    new RomanEntry("mu", "む", 0),
    new RomanEntry("me", "め", 0),
    new RomanEntry("mo", "も", 0),
    new RomanEntry("xya", "ゃ", 0),
    new RomanEntry("lya", "ゃ", 0),
    new RomanEntry("ya", "や", 0),
    new RomanEntry("wyi", "ゐ", 0),
    new RomanEntry("xyu", "ゅ", 0),
    new RomanEntry("lyu", "ゅ", 0),
    new RomanEntry("yu", "ゆ", 0),
    new RomanEntry("wye", "ゑ", 0),
    new RomanEntry("xyo", "ょ", 0),
    new RomanEntry("lyo", "ょ", 0),
    new RomanEntry("yo", "よ", 0),
    new RomanEntry("ra", "ら", 0),
    new RomanEntry("ri", "り", 0),
    new RomanEntry("ru", "る", 0),
    new RomanEntry("re", "れ", 0),
    new RomanEntry("ro", "ろ", 0),
    new RomanEntry("xwa", "ゎ", 0),
    new RomanEntry("lwa", "ゎ", 0),
    new RomanEntry("wa", "わ", 0),
    new RomanEntry("wi", "うぃ", 0),
    new RomanEntry("we", "うぇ", 0),
    new RomanEntry("wo", "を", 0),
    new RomanEntry("wha", "うぁ", 0),
    new RomanEntry("whi", "うぃ", 0),
    new RomanEntry("whu", "う", 0),
    new RomanEntry("whe", "うぇ", 0),
    new RomanEntry("who", "うぉ", 0)]
    .sort((a,b)=>a.index - b.index);

const ROMAN_INDEXES = ROMAN_ENTRIES.map(e => e.index);

class RomajiPredictiveResult {
    estaglishedHiragana: string;
    predictiveSuffixes: Set<string>;
    constructor( estaglishedHiragana: string, predictiveSuffixes: Set<string>) {
        this.estaglishedHiragana = estaglishedHiragana;
        this.predictiveSuffixes = predictiveSuffixes;
    }
}

export function romajiToHiragana(romaji: string): string {
    if (romaji.length == 0) {
        return "";
    }
    let hiragana = "";
    let start = 0;
    let end = 1;
        while (start < romaji.length) {
            let lastFound = -1;
            let lower = 0;
            let upper = ROMAN_INDEXES.length;
            while (upper - lower > 1 && end <= romaji.length) {
                let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
                lower = binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
                if (lower >= 0) {
                    lastFound = lower;
                } else {
                    lower = -lower - 1;
                }
                let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
                upper = binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
                if (upper < 0) {
                    upper = -upper - 1;
                }
                end++;
            }
            if (lastFound >= 0) {
                let entry = ROMAN_ENTRIES[lastFound];
                hiragana = hiragana + entry.hiragana;
                start = start + entry.roman.length - entry.remain;
                end = start + 1;
            } else {
                hiragana = hiragana + romaji.charAt(start);
                start++;
                end = start + 1;
            }
        }
        return hiragana;
}

function findRomanEntryPredicatively(roman: string, offset: number): Set<RomanEntry>  {
    let lastFound = -1;
    let startIndex = 0;
    let endIndex = ROMAN_INDEXES.length;
    for (let i = 0; i < 4; i++) {
        if (roman.length <= offset + i) {
            break;
        }
        let startKey = RomanEntry._calculateIndex(roman, offset, offset + i + 1);
        startIndex = binarySearch(ROMAN_INDEXES, startIndex, endIndex, startKey);
        if (startIndex >= 0) {
            lastFound = startIndex;
        } else {
            startIndex = -startIndex - 1;
        }
        let endKey = startKey + (1 << (24 - 8 * i));
        endIndex = binarySearch(ROMAN_INDEXES, startIndex, endIndex, endKey);
        if (endIndex < 0) {
            endIndex = -endIndex - 1;
        }
        if (endIndex - startIndex == 1) {
            return new Set([ROMAN_ENTRIES[startIndex]]);
        }
    }
    let result = new Set<RomanEntry>();
    for (let i = startIndex; i < endIndex; i++) {
        result.add(ROMAN_ENTRIES[i]);
    }
    return result;
}

function romajiToHiraganaPredictively(romaji: string): RomajiPredictiveResult {
    if (romaji.length == 0) {
        return new RomajiPredictiveResult("", new Set([""]));
    }
    let hiragana = "";
    let start = 0;
    let end = 1;
    while (start < romaji.length) {
        let lastFound = -1;
        let lower = 0;
        let upper = ROMAN_INDEXES.length;
        while (upper - lower > 1 && end <= romaji.length) {
            let lowerKey = RomanEntry._calculateIndex(romaji, start, end);
            lower = binarySearch(ROMAN_INDEXES, lower, upper, lowerKey);
            if (lower >= 0) {
                lastFound = lower;
            } else {
                lower = -lower - 1;
            }
            let upperKey = lowerKey + (1 << (32 - 8 * (end - start)));
            upper = binarySearch(ROMAN_INDEXES, lower, upper, upperKey);
            if (upper < 0) {
                upper = -upper - 1;
            }
            end++;
        }
        if (end > romaji.length && upper - lower != 1) {
            let set = new Set<string>();
            for (let i = lower; i < upper; i++) {
                let re = ROMAN_ENTRIES[i];
                if (re.remain > 0) {
                    let set2 = findRomanEntryPredicatively(romaji, end - 1 - re.remain);
                    for (let re2 of set2) {
                        if (re2.remain == 0) {
                            set.add(re.hiragana + re2.hiragana);
                        }
                    }
                } else {
                    set.add(re.hiragana);
                }
            }
            return new RomajiPredictiveResult(hiragana.toString(), set);
        }
        if (lastFound >= 0) {
            let entry = ROMAN_ENTRIES[lastFound];
            hiragana = hiragana + entry.hiragana;
            start = start + entry.roman.length - entry.remain;
            end = start + 1;
        } else {
            hiragana = hiragana + romaji.charAt(start);
            start++;
            end = start + 1;
        }
    }
    return new RomajiPredictiveResult(hiragana.toString(), new Set([""]) );
}
