import { describe, it } from "mocha";
import { assert } from "chai"
import { bitCount } from "../src/utils";

describe('utils', function() {
  describe('#bitCount()', function() {
    it('should return 1 when the value is 1', function() {
      assert.equal(bitCount(1), 1);
    });
  });
});