import { describe, it } from "mocha";
import { assert } from "chai"
import { hira2kata_conv } from "../lib/CharacterConverter";

describe('CharacterConverter', function() {
  describe('#hira2kata()', function() {
    it('あ => ア', function() {
        assert.equal(hira2kata_conv('あ'), 'ア');
    });
    it('あいうアイウ => アイウアイウ', function() {
        assert.equal(hira2kata_conv('あいうアイウ'), 'アイウアイウ');
    });
  });
});