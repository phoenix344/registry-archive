"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("../src/util"));
const sodium_signatures_1 = require("sodium-signatures");
const assert_1 = __importDefault(require("assert"));
function createEntry(keys, name, content, removed = false) {
    const entry = {
        key: keys.publicKey,
        sig: Buffer.alloc(0),
        created: 0,
        updated: 0,
        removed,
        name,
        content
    };
    entry.sig = util.sign(keys.secretKey, entry);
    return entry;
}
function updateEntry(keys, name, content, updateOffset, removed = false) {
    const entry = {
        key: keys.publicKey,
        sig: Buffer.alloc(0),
        created: 0,
        updated: updateOffset,
        removed,
        name,
        content
    };
    entry.sig = util.sign(keys.secretKey, entry);
    return entry;
}
module.exports = [
    (async function testHash() {
        const expected = Buffer.from("17e3bd05a73a8a17b4dc50aed7d544836559783c74eebacdec24d6b2f9064676", "hex");
        const actual = util.hash({
            name: "name",
            content: "content",
            removed: false
        });
        assert_1.default.deepEqual(actual, expected, "hash must be equal!");
    })(),
    (async function testSign() {
        const keys = sodium_signatures_1.keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            name: "name",
            content: "content",
            removed: false
        };
        entry.sig = util.sign(keys.secretKey, entry);
        assert_1.default.ok(entry.sig, "signature must exist!");
        assert_1.default.equal(entry.sig.byteLength, 64, `signature must have a size of 64 bytes, but got ${entry.sig.byteLength}.`);
    })(),
    (async function testVerifyOk() {
        const keys = sodium_signatures_1.keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            created: 0,
            name: "name",
            content: "content",
            removed: false
        };
        entry.sig = util.sign(keys.secretKey, entry);
        assert_1.default.equal(util.verify(entry), true, "signature must be valid!");
    })(),
    (async function testVerifyNotOk() {
        const keys = sodium_signatures_1.keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            created: 0,
            name: "name",
            content: "content",
            removed: false
        };
        entry.sig = util.sign(sodium_signatures_1.keyPair().secretKey, entry);
        assert_1.default.equal(util.verify(entry), false, "signature must be invalid!");
    })(),
    (async function testWritableIsValid() {
        const keys = sodium_signatures_1.keyPair();
        const entry = createEntry(keys, "name", "content", false);
        assert_1.default.equal(util.writable(entry), true, "entry must be valid!");
    })(),
    (async function testWritableIsInvalid() {
        const keys = sodium_signatures_1.keyPair();
        const entry = createEntry(keys, "name", "content", true);
        assert_1.default.equal(util.writable(entry), false, "entry must be invalid!");
    })(),
    (async function testWritableNewIsOutdated() {
        const keys = sodium_signatures_1.keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 100, false);
        const newEntry = updateEntry(keys, "name", "b", 0, false);
        assert_1.default.equal(util.writable(newEntry, oldEntry), false, "entry must be invalid!");
    })(),
    (async function testWritableNewIsInTime() {
        const keys = sodium_signatures_1.keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 0, false);
        const newEntry = updateEntry(keys, "name", "b", 100, false);
        assert_1.default.equal(util.writable(newEntry, oldEntry), true, "entry must be valid!");
    })(),
    (async function testDeletableIsValid() {
        const keys = sodium_signatures_1.keyPair();
        const entry = createEntry(keys, "name", "content", true);
        assert_1.default.equal(util.removable(entry), true, "entry must be valid!");
    })(),
    (async function testDeletableIsInvalid() {
        const keys = sodium_signatures_1.keyPair();
        const entry = createEntry(keys, "name", "content", false);
        assert_1.default.equal(util.removable(entry), false, "entry must be invalid!");
    })(),
    (async function testDeletableNewIsOutdated() {
        const keys = sodium_signatures_1.keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 100, false);
        const newEntry = updateEntry(keys, "name", "b", 0, true);
        assert_1.default.equal(util.removable(newEntry, oldEntry), false, "entry must be invalid!");
    })(),
    (async function testDeletableNewIsInTime() {
        const keys = sodium_signatures_1.keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 0, false);
        const newEntry = updateEntry(keys, "name", "b", 100, true);
        assert_1.default.equal(util.removable(newEntry, oldEntry), true, "entry must be valid!");
    })(),
];
//# sourceMappingURL=util.spec.js.map