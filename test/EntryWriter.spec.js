const { registryLog } = require('@netrunner/registry-log');
const ram = require('random-access-memory');
const { keyPair } = require('sodium-signatures');
const assert = require('assert');
const { EntryWriter } = require('../lib/EntryWriter');
const { createEntry, updateEntry, removeEntry } = require('../lib/util');

function whenReadyCreateWriter(feed, options) {
    return new Promise((resolve, reject) => {
        feed.ready(err => {
            if (err && options.throws) return reject(err);
            resolve(new EntryWriter(feed));
        });
    });
}

function get(feed, index) {
    return new Promise((resolve, reject) => {
        feed.get(index, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

module.exports = [
    (async function testInfiniteWriter() {
        const feed = registryLog(filename => ram(filename));
        const keys = keyPair();

        const writer = await whenReadyCreateWriter(feed);

        // write operation
        const a = createEntry(keys, "example", "a.tld");
        assert.equal(a.created, 0, "creation time is not set initially");
        assert.equal(a.updated, 0, "update time is not set initially");

        assert.ok(await writer.create(a), "entry must be created");
        
        const resultA = await get(feed, 0);
        assert.notEqual(resultA.created, a.created, "creation time must be the different");
        assert.notEqual(resultA.updated, a.updated, "update time must be different");

        assert.equal(resultA.removed, a.removed, "removed flag must be equal");
        assert.equal(resultA.removed, false, "removed flag must be disabled");

        assert.equal(resultA.name, a.name, "name must be equal");
        assert.equal(resultA.name, "example", "name must be equal");

        assert.equal(resultA.content, a.content, "content must be equal");
        assert.equal(resultA.content, "a.tld", "content must be equal");

        assert.deepEqual(resultA.key, a.key, "key must be equal");
        assert.deepEqual(resultA.sig, a.sig, "signature must be equal");

        // update operation
        const b = updateEntry(keys, "b.tld", a);
        assert.ok(await writer.update(b, a));

        const resultB = await get(feed, 1);
        assert.equal(resultB.created, b.created, "creation time must always be the same");
        assert.notEqual(resultB.updated, b.updated, "update time must be different");

        assert.equal(resultB.removed, b.removed, "removed flag must be equal");
        assert.equal(resultB.removed, false, "removed flag must be disabled");

        assert.equal(resultB.name, b.name, "name must be equal");
        assert.equal(resultB.name, "example", "name must be equal");

        assert.equal(resultB.content, b.content, "content must be equal");
        assert.equal(resultB.content, "b.tld", "content must be equal");

        assert.deepEqual(resultB.key, b.key, "key must be equal");
        assert.deepEqual(resultB.sig, b.sig, "signature must be equal");

        // remove operation
        const c = removeEntry(keys, b);
        assert.ok(await writer.remove(c, a));

        const resultC = await get(feed, 2);
        assert.equal(resultC.created, c.created, "creation time must always be the same");
        assert.notEqual(resultC.updated, c.updated, "update time must be different");

        assert.equal(resultC.removed, c.removed, "removed flag must be equal");
        assert.equal(resultC.removed, true, "removed flag must be activated");

        assert.equal(resultC.name, c.name, "name must be equal");
        assert.equal(resultC.name, "example", "name must be equal");

        assert.equal(resultC.content, c.content, "content must be equal");
        assert.equal(resultC.content, "b.tld", "content must be equal");

        assert.deepEqual(resultC.key, c.key, "key must be equal");
        assert.deepEqual(resultC.sig, c.sig, "signature must be equal");
    })()
]
