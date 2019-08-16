import { describe, it } from "mocha";
import { assert } from "chai"
import { Migemo } from "../src/Migemo";
import { CompactDictionary } from "../src";
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
        assert.equal(result, "(kikai|きかい|キカイ|喜界|器械|奇怪|既会員|棋界|機[会械]|毀壊|気塊|貴会|ｋｉｋａｉ|ｷｶｲ)");
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
