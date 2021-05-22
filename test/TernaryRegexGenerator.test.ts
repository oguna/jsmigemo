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
  });
});