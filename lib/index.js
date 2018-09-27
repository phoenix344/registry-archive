"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntryWriter_1 = require("./EntryWriter");
const util_1 = require("./util");
class RegistryWriter {
    constructor(feeds, db, options = {}) {
        this.db = db;
        this.options = options;
        this.isReady = false;
        if (!options) {
            options = { live: true };
        }
        this.addFeeds(feeds);
    }
    async ready() {
        if (!this.isReady) {
            const promises = [];
            for (const feed of this.feeds.keys()) {
                promises.push(this.feedReady(feed));
            }
            await Promise.all(promises);
            this.isReady = true;
        }
    }
    async create(entry) {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        await this.writer.create(entry, registered);
    }
    async update(entry) {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        await this.writer.update(entry.content, registered);
    }
    async remove(entry) {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        await this.writer.remove(entry, registered);
    }
    addFeed(feed) {
        if (!this.feeds.has(feed)) {
            this.feeds.set(feed, feed.createReadStream(this.options).on("data", async (entry) => {
                const registered = await this.db.get(entry.name);
                if (util_1.writable(entry, registered)) {
                    await this.db.put(entry.name, entry);
                }
                else if (util_1.removable(entry, registered)) {
                    await this.db.del(entry.name);
                }
            }));
        }
    }
    addFeeds(feeds) {
        if (!this.feeds) {
            this.feeds = new Map();
        }
        for (const feed of feeds) {
            this.addFeed(feed);
        }
    }
    removeFeed(feed) {
        if (this.feeds && this.feeds.has(feed)) {
            const readable = this.feeds.get(feed);
            if (readable) {
                readable.destroy();
            }
            this.feeds.delete(feed);
        }
    }
    removeFeeds(feeds) {
        if (!this.feeds) {
            this.feeds = new Map();
        }
        for (const feed of feeds) {
            this.removeFeed(feed);
        }
    }
    throwsIfFeedNotWritable() {
        if (!this.writer) {
            throw new Error("No writable feed available.");
        }
    }
    feedReady(feed) {
        return new Promise((resolve, reject) => {
            feed.ready(err => {
                if (err && this.options.throws)
                    return reject(err);
                if (feed.writable && !this.writer) {
                    this.writer = new EntryWriter_1.EntryWriter(feed);
                }
                resolve();
            });
        });
    }
}
exports.RegistryWriter = RegistryWriter;
function createRegistryWriter(feeds, db, options = {}) {
    return new RegistryWriter(feeds, db, options);
}
exports.createRegistryWriter = createRegistryWriter;
//# sourceMappingURL=index.js.map