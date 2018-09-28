"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registry_log_1 = require("@netrunner/registry-log");
const sodium_signatures_1 = require("sodium-signatures");
const assert_1 = __importDefault(require("assert"));
const RegistryDatabase_1 = require("../src/RegistryDatabase");
const EntryWriter_1 = require("../src/EntryWriter");
const util_1 = require("../src/util");
const ram = require('random-access-memory');
class DB extends RegistryDatabase_1.RegistryDatabase {
    constructor(options) {
        super(options);
        this.entries = {};
    }
    async getKeys() {
        return Object.keys(this.entries);
    }
    async get(key) {
        return this.entries[key];
    }
    async put(key, value) {
        this.entries[key] = value;
    }
    async del(key) {
        delete this.entries[key];
    }
}
function whenReadyCreateWriter(feed, options = {}) {
    return new Promise((resolve, reject) => {
        feed.ready(err => {
            if (err && options.throws)
                return reject(err);
            resolve(new EntryWriter_1.EntryWriter(feed));
        });
    });
}
function get(feed, index) {
    return new Promise((resolve, reject) => {
        feed.get(index, (err, data) => {
            if (err)
                return reject(err);
            resolve(data);
        });
    });
}
module.exports = [
    (async function testInfiniteWriter() {
        const feed = registry_log_1.registryLog((filename) => ram(filename));
        const keys = sodium_signatures_1.keyPair();
        const writer = await whenReadyCreateWriter(feed);
        // write operation
        const a = util_1.createEntry(keys, "example", "a.tld");
        assert_1.default.equal(a.created, 0, "creation time is not set initially");
        assert_1.default.equal(a.updated, 0, "update time is not set initially");
        assert_1.default.ok(await writer.create(a), "entry must be created");
        const resultA = await get(feed, 0);
        assert_1.default.notEqual(resultA.created, a.created, "creation time must be the different");
        assert_1.default.notEqual(resultA.updated, a.updated, "update time must be different");
        assert_1.default.equal(resultA.removed, a.removed, "removed flag must be equal");
        assert_1.default.equal(resultA.removed, false, "removed flag must be disabled");
        assert_1.default.equal(resultA.name, a.name, "name must be equal");
        assert_1.default.equal(resultA.name, "example", "name must be equal");
        assert_1.default.equal(resultA.content, a.content, "content must be equal");
        assert_1.default.equal(resultA.content, "a.tld", "content must be equal");
        assert_1.default.deepEqual(resultA.key, a.key, "key must be equal");
        assert_1.default.deepEqual(resultA.sig, a.sig, "signature must be equal");
        // update operation
        const b = util_1.updateEntry(keys, "b.tld", a);
        assert_1.default.ok(await writer.update(b, a));
        const resultB = await get(feed, 1);
        assert_1.default.equal(resultB.created, b.created, "creation time must always be the same");
        assert_1.default.notEqual(resultB.updated, b.updated, "update time must be different");
        assert_1.default.equal(resultB.removed, b.removed, "removed flag must be equal");
        assert_1.default.equal(resultB.removed, false, "removed flag must be disabled");
        assert_1.default.equal(resultB.name, b.name, "name must be equal");
        assert_1.default.equal(resultB.name, "example", "name must be equal");
        assert_1.default.equal(resultB.content, b.content, "content must be equal");
        assert_1.default.equal(resultB.content, "b.tld", "content must be equal");
        assert_1.default.deepEqual(resultB.key, b.key, "key must be equal");
        assert_1.default.deepEqual(resultB.sig, b.sig, "signature must be equal");
        // remove operation
        const c = util_1.removeEntry(keys, b);
        assert_1.default.ok(await writer.remove(c, a));
        const resultC = await get(feed, 2);
        assert_1.default.equal(resultC.created, c.created, "creation time must always be the same");
        assert_1.default.notEqual(resultC.updated, c.updated, "update time must be different");
        assert_1.default.equal(resultC.removed, c.removed, "removed flag must be equal");
        assert_1.default.equal(resultC.removed, true, "removed flag must be activated");
        assert_1.default.equal(resultC.name, c.name, "name must be equal");
        assert_1.default.equal(resultC.name, "example", "name must be equal");
        assert_1.default.equal(resultC.content, c.content, "content must be equal");
        assert_1.default.equal(resultC.content, "b.tld", "content must be equal");
        assert_1.default.deepEqual(resultC.key, c.key, "key must be equal");
        assert_1.default.deepEqual(resultC.sig, c.sig, "signature must be equal");
    })()
];
//# sourceMappingURL=EntryWriter.spec.js.map