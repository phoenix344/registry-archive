"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const sodium_signatures_1 = require("sodium-signatures");
function hash(entry) {
    return crypto_1.createHash("sha256").update(Buffer.concat([
        Buffer.from(entry.name),
        Buffer.from(entry.target),
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
function writable(newEntry, oldEntry) {
    if (oldEntry) {
        if (oldEntry.updated < newEntry.updated) {
            return verify(Object.assign({}, newEntry, { key: oldEntry.key })) && !newEntry.removed;
        }
        return false;
    }
    return verify(newEntry) && !newEntry.removed;
}
exports.writable = writable;
function removable(newEntry, oldEntry) {
    if (oldEntry) {
        if (oldEntry.updated < newEntry.updated) {
            return verify(Object.assign({}, newEntry, { key: oldEntry.key })) && newEntry.removed;
        }
        return false;
    }
    return verify(newEntry) && newEntry.removed;
}
exports.removable = removable;
//# sourceMappingURL=util.js.map