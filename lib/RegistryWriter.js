"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class RegistryWriter {
    constructor(feed, db) {
        this.feed = feed;
        this.db = db;
    }
    create(entry) {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
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
            }
            return resolve(false);
        });
    }
    update(entry) {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
            if (registered) {
                const updated = Date.now();
                entry = Object.assign({}, registered, { updated, name: registered.name });
                if (util_1.verify(entry)) {
                    this.feed.append(entry, async (err) => {
                        if (err)
                            return reject(err);
                        resolve(true);
                    });
                }
            }
            return resolve(false);
        });
    }
    remove(entry) {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
            if (registered) {
                const updated = Date.now();
                entry = Object.assign({}, registered, { updated, removed: true });
                if (util_1.verify(entry)) {
                    this.feed.append(entry, async (err) => {
                        if (err)
                            return reject(err);
                        resolve(true);
                    });
                }
            }
            return resolve(false);
        });
    }
}
exports.RegistryWriter = RegistryWriter;
//# sourceMappingURL=RegistryWriter.js.map