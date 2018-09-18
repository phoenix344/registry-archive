const util = require("../lib/util");
const { keyPair } = require("sodium-signatures");
const assert = require("assert");

function createEntry(keys, name, target, removed = false) {
    const entry = {
        key: keys.publicKey,
        created: 0,
        updated: 0,
        removed,
        name,
        target
    };
    entry.sig = util.sign(keys.secretKey, entry);
    return entry;
}

function updateEntry(keys, name, target, updateOffset, removed = false) {
    const entry = {
        key: keys.publicKey,
        created: 0,
        updated: updateOffset,
        removed,
        name,
        target
    };
    entry.sig = util.sign(keys.secretKey, entry);
    return entry;
}

module.exports = [
    (async function testHash() {
        const expected = Buffer.from("61ce50dd22bbe1bfb614b1a35b2cc3b19847177e09938be1746e1b4e733df60e", "hex");
        const actual = util.hash({
            name: "name",
            target: "target",
            removed: false
        });
        assert.deepEqual(actual, expected, "hash must be equal!");
    })(),
    (async function testSign() {
        const keys = keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            name: "name",
            target: "target",
            removed: false
        };

        entry.sig = util.sign(keys.secretKey, entry);

        assert.ok(entry.sig, "signature must exist!");
        assert.equal(entry.sig.byteLength, 64, `signature must have a size of 64 bytes, but got ${entry.sig.byteLength}.`);

    })(),
    (async function testVerifyOk() {
        const keys = keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            name: "name",
            target: "target",
            removed: false
        };

        entry.sig = util.sign(keys.secretKey, entry);
        assert.equal(util.verify(entry), true, "signature must be valid!");
    })(),
    (async function testVerifyNotOk() {
        const keys = keyPair();
        const entry = {
            key: keys.publicKey,
            sig: Buffer.alloc(0),
            name: "name",
            target: "target",
            removed: false
        };

        entry.sig = util.sign(keyPair().secretKey, entry);
        assert.equal(util.verify(entry), false, "signature must be invalid!")
    })(),

    (async function testWritableIsValid() {
        const keys = keyPair();
        const entry = createEntry(keys, "name", "target", false);
        assert.equal(util.writable(entry), true, "entry must be valid!");
    })(),
    (async function testWritableIsInvalid() {
        const keys = keyPair();
        const entry = createEntry(keys, "name", "target", true);
        assert.equal(util.writable(entry), false, "entry must be invalid!");
    })(),
    (async function testWritableNewIsOutdated() {
        const keys = keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 100, false);
        const newEntry = updateEntry(keys, "name", "b", 0, false);
        assert.equal(util.writable(newEntry, oldEntry), false, "entry must be invalid!");
    })(),
    (async function testWritableNewIsInTime() {
        const keys = keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 0, false);
        const newEntry = updateEntry(keys, "name", "b", 100, false);
        assert.equal(util.writable(newEntry, oldEntry), true, "entry must be valid!");
    })(),

    (async function testDeletableIsValid() {
        const keys = keyPair();
        const entry = createEntry(keys, "name", "target", true);
        assert.equal(util.removable(entry), true, "entry must be valid!");
    })(),
    (async function testDeletableIsInvalid() {
        const keys = keyPair();
        const entry = createEntry(keys, "name", "target", false);
        assert.equal(util.removable(entry), false, "entry must be invalid!");
    })(),
    (async function testDeletableNewIsOutdated() {
        const keys = keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 100, false);
        const newEntry = updateEntry(keys, "name", "b", 0, true);
        assert.equal(util.removable(newEntry, oldEntry), false, "entry must be invalid!");
    })(),
    (async function testDeletableNewIsInTime() {
        const keys = keyPair();
        const oldEntry = updateEntry(keys, "name", "a", 0, false);
        const newEntry = updateEntry(keys, "name", "b", 100, true);
        assert.equal(util.removable(newEntry, oldEntry), true, "entry must be valid!");
    })(),
];