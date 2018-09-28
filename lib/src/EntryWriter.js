"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class EntryWriter {
    constructor(feed) {
        this.feed = feed;
    }
    create(entry, registered) {
        return new Promise(async (resolve, reject) => {
            if (!registered) {
                const created = Date.now();
                const updated = created;
                entry = Object.assign({}, entry, { created,
                    updated, removed: false });
                if (util_1.verify(entry)) {
                    this.feed.append(entry, async (err) => {
                        if (err)
                            return reject(err);
                        resolve(true);
                    });
                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false);
            }
        });
    }
    update(entry, registered) {
        return new Promise(async (resolve, reject) => {
            if (registered) {
                const updated = Date.now();
                entry = Object.assign({}, registered, { updated, sig: entry.sig, name: registered.name, content: entry.content });
                if (util_1.verify(entry)) {
                    this.feed.append(entry, async (err) => {
                        if (err)
                            return reject(err);
                        resolve(true);
                    });
                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false);
            }
        });
    }
    remove(entry, registered) {
        return new Promise(async (resolve, reject) => {
            if (registered) {
                const updated = Date.now();
                entry = Object.assign({}, registered, { sig: entry.sig, updated, content: entry.content, removed: true });
                if (util_1.verify(entry)) {
                    this.feed.append(entry, async (err) => {
                        if (err)
                            return reject(err);
                        resolve(true);
                    });
                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false);
            }
        });
    }
}
exports.EntryWriter = EntryWriter;
//# sourceMappingURL=EntryWriter.js.map