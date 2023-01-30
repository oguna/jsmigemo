export class RomajiPredictiveResult {
    prefix: string;
    suffixes: string[];
    constructor(prefix: string, suffixes: string[]) {
        this.prefix = prefix;
        this.suffixes = suffixes;
    }
}

export interface RomajiProcessor {
    romajiToHiragana(romaji: string): string;
    romajiToHiraganaPredictively(romaji: string): RomajiPredictiveResult;
}