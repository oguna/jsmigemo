import { hira2kata_conv } from "../src/CharacterConverter";

describe('CharacterConverter', () => {
  describe('#hira2kata()', () => {
    it('あ => ア', () => {
        expect(hira2kata_conv('あ')).toBe('ア');
    });
    it('あいうアイウ => アイウアイウ', () => {
        expect(hira2kata_conv('あいうアイウ')).toBe('アイウアイウ');
    });
  });
});