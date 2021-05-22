import { bitCount } from "../src/utils";

describe('utils', () => {
  describe('#bitCount()', () => {
    it('should return 1 when the value is 1', () => {
      expect(bitCount(1)).toBe(1);
    });
    it('should return 0xffffffff when the value is 32', () => {
      expect(bitCount(0xffffffff)).toBe(32);
    });
    it('should return 0xfffffffe when the value is 31', () => {
      expect(bitCount(0xfffffffe)).toBe(31);
    });
    it('should return 0xefffffff when the value is 31', () => {
      expect(bitCount(0xefffffff)).toBe(31);
    });
  });
});