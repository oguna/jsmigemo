import { describe, it } from "mocha";
import { assert } from "chai"
import { bitCount } from "../src/utils";

describe('utils', function() {
  describe('#bitCount()', function() {
    it('should return 1 when the value is 1', function() {
      assert.equal(bitCount(1), 1);
    });
    it('should return 0xffffffff when the value is 32', function() {
      assert.equal(bitCount(0xffffffff), 32);
    });
    it('should return 0xfffffffe when the value is 31', function() {
      assert.equal(bitCount(0xfffffffe), 31);
    });
    it('should return 0xefffffff when the value is 31', function() {
      assert.equal(bitCount(0xefffffff), 31);
    });
  });
});