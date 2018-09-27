"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const sodium_signatures_1 = require("sodium-signatures");
function hash(entry) {
    return crypto_1.createHash("sha256").update(Buffer.concat([
        Buffer.from(entry.name),
        Buffer.from(entry.content),
        Buffer.from([entry.removed])
    ])).digest();
}
exports.hash = hash;
function sign(secretKey, entry) {
    return sodium_signatures_1.sign(hash(entry), secretKey);
}
exports.sign = sign;
function verify(entry) {
    return sodium_signatures_1.verify(hash(entry), entry.sig, entry.key);
}
exports.verify = verify;
function createEntry(keys, name, content) {
    const entry = {
        key: keys.publicKey,
        sig: Buffer.alloc(0),
        created: 0,
        updated: 0,
        name, content,
        removed: false
    };
    entry.sig = sign(keys.secretKey, entry);
    return entry;
}
exports.createEntry = createEntry;
function updateEntry(keys, content, entry) {
    if (!Buffer.from(entry.key).equals(keys.publicKey) && !entry.removed) {
        throw new Error("The key can't be updated or rewritten. The public key is not equal!");
    }
    const newEntry = Object.assign({}, entry);
    newEntry.content = content;
    newEntry.sig = sign(keys.secretKey, newEntry);
    return newEntry;
}
exports.updateEntry = updateEntry;
function removeEntry(keys, entry) {
    if (!Buffer.from(entry.key).equals(keys.publicKey)) {
        throw new Error("The key can't be updated or rewritten. The public key is not equal!");
    }
    else if (entry.removed) {
        throw new Error("The entry is already removed!");
    }
    const newEntry = Object.assign({}, entry);
    newEntry.removed = true;
    newEntry.sig = sign(keys.secretKey, newEntry);
    return newEntry;
}
exports.removeEntry = removeEntry;
function writable(newEntry, oldEntry) {
    if (oldEntry) {
        if ('undefined' !== typeof oldEntry.updated && 'undefined' !== typeof newEntry.updated && newEntry.updated > oldEntry.updated) {
            return verify(Object.assign({}, newEntry, { key: oldEntry.key })) && !newEntry.removed;
        }
        return false;
    }
    return verify(newEntry) && !newEntry.removed;
}
exports.writable = writable;
function removable(newEntry, oldEntry) {
    if (oldEntry) {
        if ('undefined' !== typeof oldEntry.updated && 'undefined' !== typeof newEntry.updated && oldEntry.updated < newEntry.updated) {
            return verify(Object.assign({}, newEntry, { key: oldEntry.key })) && newEntry.removed === true;
        }
        return false;
    }
    return verify(newEntry) && !!newEntry.removed === true;
}
exports.removable = removable;
//# sourceMappingURL=util.js.map