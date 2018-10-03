import { EntrySchema, EntryWriter, writable, removable } from "@netrunner/registry-log";
import { Hypercore, HypercoreStreamOptions } from "hypercore";
import { RegistryDatabase } from './RegistryDatabase';
import { Readable } from "stream";

export interface RegistryWriterOptions extends HypercoreStreamOptions {
    throws?: boolean;
}

// TODO: rethink about the concept!
export class RegistryWriter {
    public writer!: EntryWriter;
    private feeds!: Map<Hypercore<EntrySchema>, Readable>;
    private isReady: boolean = false;

    constructor(
        feeds: Hypercore<EntrySchema>[],
        private db: RegistryDatabase,
        private options: RegistryWriterOptions = {}
    ) {
        if (!options) {
            options = { live: true };
        }
        this.addFeeds(feeds);
    }

    public async ready(): Promise<void> {
        if (!this.isReady) {
            const promises = [];
            for (const feed of this.feeds.keys()) {
                promises.push(this.feedReady(feed));
            }
            await Promise.all(promises);
            this.isReady = true;
        }
    }

    public async create(entry: EntrySchema): Promise<boolean> {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        return await this.writer.create(entry, registered);
    }

    public async update(entry: EntrySchema): Promise<boolean> {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        return await this.writer.update(entry, registered);
    }

    public async remove(entry: EntrySchema): Promise<boolean> {
        await this.ready();
        this.throwsIfFeedNotWritable();
        const registered = await this.db.get(entry.name);
        return await this.writer.remove(entry, registered);
    }

    // TODO: make another function
    public addFeed(feed: Hypercore<EntrySchema>): void {
        if (!this.feeds.has(feed)) {
            this.feeds.set(feed, feed.createReadStream(this.options).on("data", async (entry: EntrySchema) => {
                const registered = await this.db.get(entry.name);
                if (writable(entry, registered)) {
                    await this.db.put(entry.name, entry);
                }
                else if (removable(entry, registered)) {
                    await this.db.del(entry.name);
                }
            }));
        }
    }

    public addFeeds(feeds: Hypercore<EntrySchema>[]) {
        if (!this.feeds) {
            this.feeds = new Map();
        }
        for (const feed of feeds) {
            this.addFeed(feed);
        }
    }

    public removeFeed(feed: Hypercore<EntrySchema>) {
        if (this.feeds && this.feeds.has(feed)) {
            const readable = this.feeds.get(feed);
            if (readable) {
                readable.destroy();
            }
            this.feeds.delete(feed);
        }
    }

    public removeFeeds(feeds: Hypercore<EntrySchema>[]) {
        if (!this.feeds) {
            this.feeds = new Map();
        }
        for (const feed of feeds) {
            this.removeFeed(feed);
        }
    }

    private throwsIfFeedNotWritable() {
        if (!this.writer) {
            throw new Error("No writable feed available.");
        }
    }

    private feedReady(feed: Hypercore<EntrySchema>): Promise<void> {
        return new Promise((resolve, reject) => {
            feed.ready(err => {
                if (err && this.options.throws) return reject(err);
                if (feed.writable && !this.writer) {
                    this.writer = new EntryWriter(feed);
                }
                resolve();
            });
        });
    }

}

export function createRegistryWriter(feeds: Hypercore<EntrySchema>[], db: RegistryDatabase, options: RegistryWriterOptions = {}) {
    return new RegistryWriter(feeds, db, options);
}
