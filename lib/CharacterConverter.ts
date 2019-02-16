const han2zen = new Map<string, string>()
han2zen.set('!', '！');
han2zen.set('"', '”');
han2zen.set('#', '＃');
han2zen.set('$', '＄');
han2zen.set('%', '％');
han2zen.set('&', '＆');
han2zen.set('\'', '’');
han2zen.set('(', '（');
han2zen.set(')', '）');
han2zen.set('*', '＊');
han2zen.set('+', '＋');
han2zen.set(',', '，');
han2zen.set('-', '－');
han2zen.set('.', '．');
han2zen.set('/', '／');
han2zen.set('0', '０');
han2zen.set('1', '１');
han2zen.set('2', '２');
han2zen.set('3', '３');
han2zen.set('4', '４');
han2zen.set('5', '５');
han2zen.set('6', '６');
han2zen.set('7', '７');
han2zen.set('8', '８');
han2zen.set('9', '９');
han2zen.set(':', '：');
han2zen.set(';', '；');
han2zen.set('<', '＜');
han2zen.set('=', '＝');
han2zen.set('>', '＞');
han2zen.set('?', '？');
han2zen.set('@', '＠');
han2zen.set('A', 'Ａ');
han2zen.set('B', 'Ｂ');
han2zen.set('C', 'Ｃ');
han2zen.set('D', 'Ｄ');
han2zen.set('E', 'Ｅ');
han2zen.set('F', 'Ｆ');
han2zen.set('G', 'Ｇ');
han2zen.set('H', 'Ｈ');
han2zen.set('I', 'Ｉ');
han2zen.set('J', 'Ｊ');
han2zen.set('K', 'Ｋ');
han2zen.set('L', 'Ｌ');
han2zen.set('M', 'Ｍ');
han2zen.set('N', 'Ｎ');
han2zen.set('O', 'Ｏ');
han2zen.set('P', 'Ｐ');
han2zen.set('Q', 'Ｑ');
han2zen.set('R', 'Ｒ');
han2zen.set('S', 'Ｓ');
han2zen.set('T', 'Ｔ');
han2zen.set('U', 'Ｕ');
han2zen.set('V', 'Ｖ');
han2zen.set('W', 'Ｗ');
han2zen.set('X', 'Ｘ');
han2zen.set('Y', 'Ｙ');
han2zen.set('Z', 'Ｚ');
han2zen.set('[', '［');
han2zen.set('\\', '￥');
han2zen.set(']', '］');
han2zen.set('^', '＾');
han2zen.set('_', '＿');
han2zen.set('`', '‘');
han2zen.set('a', 'ａ');
han2zen.set('b', 'ｂ');
han2zen.set('c', 'ｃ');
han2zen.set('d', 'ｄ');
han2zen.set('e', 'ｅ');
han2zen.set('f', 'ｆ');
han2zen.set('g', 'ｇ');
han2zen.set('h', 'ｈ');
han2zen.set('i', 'ｉ');
han2zen.set('j', 'ｊ');
han2zen.set('k', 'ｋ');
han2zen.set('l', 'ｌ');
han2zen.set('m', 'ｍ');
han2zen.set('n', 'ｎ');
han2zen.set('o', 'ｏ');
han2zen.set('p', 'ｐ');
han2zen.set('q', 'ｑ');
han2zen.set('r', 'ｒ');
han2zen.set('s', 'ｓ');
han2zen.set('t', 'ｔ');
han2zen.set('u', 'ｕ');
han2zen.set('v', 'ｖ');
han2zen.set('w', 'ｗ');
han2zen.set('x', 'ｘ');
han2zen.set('y', 'ｙ');
han2zen.set('z', 'ｚ');
han2zen.set('{', '｛');
han2zen.set('|', '｜');
han2zen.set('}', '｝');
han2zen.set('~', '～');
han2zen.set('｡', '。');
han2zen.set('｢', '「');
han2zen.set('｣', '」');
han2zen.set('､', '、');
han2zen.set('･', '・');
han2zen.set('ｦ', 'ヲ');
han2zen.set('ｧ', 'ァ');
han2zen.set('ｨ', 'ィ');
han2zen.set('ｩ', 'ゥ');
han2zen.set('ｪ', 'ェ');
han2zen.set('ｫ', 'ォ');
han2zen.set('ｬ', 'ャ');
han2zen.set('ｭ', 'ュ');
han2zen.set('ｮ', 'ョ');
han2zen.set('ｯ', 'ッ');
han2zen.set('ｰ', 'ー');
han2zen.set('ｱ', 'ア');
han2zen.set('ｲ', 'イ');
han2zen.set('ｳ', 'ウ');
han2zen.set('ｴ', 'エ');
han2zen.set('ｵ', 'オ');
han2zen.set('ｶ', 'カ');
han2zen.set('ｷ', 'キ');
han2zen.set('ｸ', 'ク');
han2zen.set('ｹ', 'ケ');
han2zen.set('ｺ', 'コ');
han2zen.set('ｻ', 'サ');
han2zen.set('ｼ', 'シ');
han2zen.set('ｽ', 'ス');
han2zen.set('ｾ', 'セ');
han2zen.set('ｿ', 'ソ');
han2zen.set('ﾀ', 'タ');
han2zen.set('ﾁ', 'チ');
han2zen.set('ﾂ', 'ツ');
han2zen.set('ﾃ', 'テ');
han2zen.set('ﾄ', 'ト');
han2zen.set('ﾅ', 'ナ');
han2zen.set('ﾆ', 'ニ');
han2zen.set('ﾇ', 'ヌ');
han2zen.set('ﾈ', 'ネ');
han2zen.set('ﾉ', 'ノ');
han2zen.set('ﾊ', 'ハ');
han2zen.set('ﾋ', 'ヒ');
han2zen.set('ﾌ', 'フ');
han2zen.set('ﾍ', 'ヘ');
han2zen.set('ﾎ', 'ホ');
han2zen.set('ﾏ', 'マ');
han2zen.set('ﾐ', 'ミ');
han2zen.set('ﾑ', 'ム');
han2zen.set('ﾒ', 'メ');
han2zen.set('ﾓ', 'モ');
han2zen.set('ﾔ', 'ヤ');
han2zen.set('ﾕ', 'ユ');
han2zen.set('ﾖ', 'ヨ');
han2zen.set('ﾗ', 'ラ');
han2zen.set('ﾘ', 'リ');
han2zen.set('ﾙ', 'ル');
han2zen.set('ﾚ', 'レ');
han2zen.set('ﾛ', 'ロ');
han2zen.set('ﾜ', 'ワ');
han2zen.set('ﾝ', 'ン');
han2zen.set('ﾞ', '゛');
han2zen.set('ﾟ', '゜');

const zen2han = new Map<string, string>();
zen2han.set('！', "!");
zen2han.set('”', "\"");
zen2han.set('＃', "#");
zen2han.set('＄', "$");
zen2han.set('％', "%");
zen2han.set('＆', "&");
zen2han.set('’', "'");
zen2han.set('（', "(");
zen2han.set('）', ")");
zen2han.set('＊', "*");
zen2han.set('＋', "+");
zen2han.set('，', ",");
zen2han.set('－', "-");
zen2han.set('．', ".");
zen2han.set('／', "/");
zen2han.set('０', "0");
zen2han.set('１', "1");
zen2han.set('２', "2");
zen2han.set('３', "3");
zen2han.set('４', "4");
zen2han.set('５', "5");
zen2han.set('６', "6");
zen2han.set('７', "7");
zen2han.set('８', "8");
zen2han.set('９', "9");
zen2han.set('：', ":");
zen2han.set('；', ";");
zen2han.set('＜', "<");
zen2han.set('＝', "=");
zen2han.set('＞', ">");
zen2han.set('？', "?");
zen2han.set('＠', "@");
zen2han.set('Ａ', "A");
zen2han.set('Ｂ', "B");
zen2han.set('Ｃ', "C");
zen2han.set('Ｄ', "D");
zen2han.set('Ｅ', "E");
zen2han.set('Ｆ', "F");
zen2han.set('Ｇ', "G");
zen2han.set('Ｈ', "H");
zen2han.set('Ｉ', "I");
zen2han.set('Ｊ', "J");
zen2han.set('Ｋ', "K");
zen2han.set('Ｌ', "L");
zen2han.set('Ｍ', "M");
zen2han.set('Ｎ', "N");
zen2han.set('Ｏ', "O");
zen2han.set('Ｐ', "P");
zen2han.set('Ｑ', "Q");
zen2han.set('Ｒ', "R");
zen2han.set('Ｓ', "S");
zen2han.set('Ｔ', "T");
zen2han.set('Ｕ', "U");
zen2han.set('Ｖ', "V");
zen2han.set('Ｗ', "W");
zen2han.set('Ｘ', "X");
zen2han.set('Ｙ', "Y");
zen2han.set('Ｚ', "Z");
zen2han.set('［', "[");
zen2han.set('￥', "\\");
zen2han.set('］', "]");
zen2han.set('＾', "^");
zen2han.set('＿', "_");
zen2han.set('‘', "`");
zen2han.set('ａ', "a");
zen2han.set('ｂ', "b");
zen2han.set('ｃ', "c");
zen2han.set('ｄ', "d");
zen2han.set('ｅ', "e");
zen2han.set('ｆ', "f");
zen2han.set('ｇ', "g");
zen2han.set('ｈ', "h");
zen2han.set('ｉ', "i");
zen2han.set('ｊ', "j");
zen2han.set('ｋ', "k");
zen2han.set('ｌ', "l");
zen2han.set('ｍ', "m");
zen2han.set('ｎ', "n");
zen2han.set('ｏ', "o");
zen2han.set('ｐ', "p");
zen2han.set('ｑ', "q");
zen2han.set('ｒ', "r");
zen2han.set('ｓ', "s");
zen2han.set('ｔ', "t");
zen2han.set('ｕ', "u");
zen2han.set('ｖ', "v");
zen2han.set('ｗ', "w");
zen2han.set('ｘ', "x");
zen2han.set('ｙ', "y");
zen2han.set('ｚ', "z");
zen2han.set('｛', "{");
zen2han.set('｜', "|");
zen2han.set('｝', "}");
zen2han.set('～', "~");
zen2han.set('。', "｡");
zen2han.set('「', "｢");
zen2han.set('」', "｣");
zen2han.set('、', "､");
zen2han.set('・', "･");
zen2han.set('ヲ', "ｦ");
zen2han.set('ァ', "ｧ");
zen2han.set('ィ', "ｨ");
zen2han.set('ゥ', "ｩ");
zen2han.set('ェ', "ｪ");
zen2han.set('ォ', "ｫ");
zen2han.set('ャ', "ｬ");
zen2han.set('ュ', "ｭ");
zen2han.set('ョ', "ｮ");
zen2han.set('ッ', "ｯ");
zen2han.set('ー', "ｰ");
zen2han.set('ア', "ｱ");
zen2han.set('イ', "ｲ");
zen2han.set('ウ', "ｳ");
zen2han.set('エ', "ｴ");
zen2han.set('オ', "ｵ");
zen2han.set('カ', "ｶ");
zen2han.set('キ', "ｷ");
zen2han.set('ク', "ｸ");
zen2han.set('ケ', "ｹ");
zen2han.set('コ', "ｺ");
zen2han.set('サ', "ｻ");
zen2han.set('シ', "ｼ");
zen2han.set('ス', "ｽ");
zen2han.set('セ', "ｾ");
zen2han.set('ソ', "ｿ");
zen2han.set('タ', "ﾀ");
zen2han.set('チ', "ﾁ");
zen2han.set('ツ', "ﾂ");
zen2han.set('テ', "ﾃ");
zen2han.set('ト', "ﾄ");
zen2han.set('ナ', "ﾅ");
zen2han.set('ニ', "ﾆ");
zen2han.set('ヌ', "ﾇ");
zen2han.set('ネ', "ﾈ");
zen2han.set('ノ', "ﾉ");
zen2han.set('ハ', "ﾊ");
zen2han.set('ヒ', "ﾋ");
zen2han.set('フ', "ﾌ");
zen2han.set('ヘ', "ﾍ");
zen2han.set('ホ', "ﾎ");
zen2han.set('マ', "ﾏ");
zen2han.set('ミ', "ﾐ");
zen2han.set('ム', "ﾑ");
zen2han.set('メ', "ﾒ");
zen2han.set('モ', "ﾓ");
zen2han.set('ヤ', "ﾔ");
zen2han.set('ユ', "ﾕ");
zen2han.set('ヨ', "ﾖ");
zen2han.set('ラ', "ﾗ");
zen2han.set('リ', "ﾘ");
zen2han.set('ル', "ﾙ");
zen2han.set('レ', "ﾚ");
zen2han.set('ロ', "ﾛ");
zen2han.set('ワ', "ﾜ");
zen2han.set('ン', "ﾝ");
zen2han.set('゛', "ﾞ");
zen2han.set('゜', "ﾟ");
zen2han.set('ヴ', "ｳﾞ");
zen2han.set('ガ', "ｶﾞ");
zen2han.set('ギ', "ｷﾞ");
zen2han.set('グ', "ｸﾞ");
zen2han.set('ゲ', "ｹﾞ");
zen2han.set('ゴ', "ｺﾞ");
zen2han.set('ザ', "ｻﾞ");
zen2han.set('ジ', "ｼﾞ");
zen2han.set('ズ', "ｽﾞ");
zen2han.set('ゼ', "ｾﾞ");
zen2han.set('ゾ', "ｿﾞ");
zen2han.set('ダ', "ﾀﾞ");
zen2han.set('ヂ', "ﾁﾞ");
zen2han.set('ヅ', "ﾂﾞ");
zen2han.set('デ', "ﾃﾞ");
zen2han.set('ド', "ﾄﾞ");
zen2han.set('バ', "ﾊﾞ");
zen2han.set('ビ', "ﾋﾞ");
zen2han.set('ブ', "ﾌﾞ");
zen2han.set('ベ', "ﾍﾞ");
zen2han.set('ボ', "ﾎﾞ");
zen2han.set('パ', "ﾊﾟ");
zen2han.set('ピ', "ﾋﾟ");
zen2han.set('プ', "ﾌﾟ");
zen2han.set('ペ', "ﾍﾟ");
zen2han.set('ポ', "ﾎﾟ");

export function han2zen_conv(source: string): string {
    let sb = "";
    for (let c of source) {
        let a = han2zen.get(c);
        if (a==undefined) {
            sb += c;
        } else {
            sb += a;
        }
    }
    return sb;
}

export function zen2han_conv(source: string): string {
    let sb = "";
    for (let c of source) {
        let a = zen2han.get(c);
        if (a==undefined) {
            sb += c;
        } else {
            sb += a;
        }
    }
    return sb;
}

export function hira2kata_conv(source: string): string {
    let sb = "";
    for (let i = 0; i < source.length; i++) {
        const c = source.charCodeAt(i);
        if ('ぁ'.charCodeAt(0) <= c && c <= 'ん'.charCodeAt(0)) {
            sb += String.fromCharCode((c - 'ぁ'.charCodeAt(0) + 'ァ'.charCodeAt(0)));
        } else {
            sb += String.fromCharCode(c);
        }
    }
    return sb;
}