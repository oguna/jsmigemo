import { TernaryRegexGenerator } from "../src/TernaryRegexGenerator";

describe('RegexGenerator', () => {
  describe('#add()', () => {
    it('bad dad => (bad|dad)', () => {
        const generator = TernaryRegexGenerator.getDEFAULT();
        generator.add("bad");
        generator.add("dad");
        expect(generator.generate()).toBe("(bad|dad)");
    });
    it('bad bat => (ba[dt])', () => {
        const generator = TernaryRegexGenerator.getDEFAULT();
        generator.add("bad");
        generator.add("bat");
        expect(generator.generate()).toBe("ba[dt]");
    });
    it('a b a => [ab]', () => {
        const generator = TernaryRegexGenerator.getDEFAULT();
        generator.add("a");
        generator.add("b");
        generator.add("a");
        expect(generator.generate()).toBe("[ab]");
    });
    it('escape', () => {
        const generator = TernaryRegexGenerator.getDEFAULT();
        generator.add("a.b");
        expect(generator.generate()).toBe("a\\.b");
    });
    it('does not put supplementary-plane characters in a character class', () => {
        const first = String.fromCodePoint(0x20000);
        const second = String.fromCodePoint(0x20001);
        const generator = TernaryRegexGenerator.getDEFAULT();
        generator.add(first);
        generator.add(second);

        const pattern = generator.generate();
        expect(pattern).toBe(`(${first}|${second})`);
        expect(new RegExp(pattern).test(first)).toBe(true);
        expect(new RegExp(pattern).test(second)).toBe(true);
        expect(new RegExp(pattern, 'u').test(first)).toBe(true);
        expect(new RegExp(pattern, 'u').test(second)).toBe(true);
    });
    it('does not put newline matching inside a surrogate pair', () => {
        const supplementary = String.fromCodePoint(0x20000);
        const generator = new TernaryRegexGenerator("|", "(", ")", "[", "]", "\\_s*", "\\.[]{}()*+-?^$|");
        generator.add(`${supplementary}a`);

        expect(generator.generate()).toBe(`${supplementary}\\_s*a`);
    });
  });
});
