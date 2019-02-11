import { describe, it } from "mocha";
import { assert } from "chai"
import { Migemo } from "../lib/Migemo";
import { CompactDictionary } from "../lib";
import { readFileSync } from "fs";

describe("migemo", function () {
    let buff = readFileSync('migemo-compact-dict');
    function toArrayBuffer(buffer: Buffer): ArrayBuffer {
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return ab;
    }
    let arrayBuff = toArrayBuffer(buff);
    let dict = new CompactDictionary(arrayBuff);

    it("kikai", function () {
        let migemo = new Migemo();
        migemo.setDict(dict);
        let result = migemo.query("kikai");
        assert.equal(result, "(ｷｶｲ|キカイ|既会員|棋界|奇怪|喜界|毀壊|機[会械]|貴会|器械|気塊|きかい|ｋｉｋａｉ|kikai)");
    });

    it("連文節の検索（大文字区切り）", function() {
        let migemo = new Migemo();
        migemo.setDict(dict);
        let result = migemo.query("renbunsetuNoKensaku");
        let regex = RegExp(result);
        assert.isNotNull(regex.exec("連文節の検索"));
    });

    it("連文節の検索（空白区切り）", function() {
        let migemo = new Migemo();
        migemo.setDict(dict);
        let result = migemo.query("renbunsetu no kensaku");
        let regex = RegExp(result);
        assert.isNotNull(regex.exec("連文節の検索"));
    });
});
