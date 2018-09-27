import { EntrySchema } from "@netrunner/registry-log";
import { Hypercore, HypercoreStreamOptions } from "hypercore";
import { EntryWriter } from './EntryWriter';
import { RegistryDatabase } from './RegistryDatabase';
export interface RegistryFeedOptions extends HypercoreStreamOptions {
    throws?: boolean;
}
export declare class RegistryWriter {
    private db;
    private options;
    writer: EntryWriter;
    private feeds;
    private isReady;
    constructor(feeds: Hypercore<EntrySchema>[], db: RegistryDatabase, options?: RegistryFeedOptions);
    ready(): Promise<void>;
    create(entry: EntrySchema): Promise<void>;
    update(entry: EntrySchema): Promise<void>;
    remove(entry: EntrySchema): Promise<void>;
    addFeed(feed: Hypercore<EntrySchema>): void;
    addFeeds(feeds: Hypercore<EntrySchema>[]): void;
    removeFeed(feed: Hypercore<EntrySchema>): void;
    removeFeeds(feeds: Hypercore<EntrySchema>[]): void;
    private throwsIfFeedNotWritable;
    private feedReady;
}
export declare function createRegistryWriter(feeds: Hypercore<EntrySchema>[], db: RegistryDatabase, options?: RegistryFeedOptions): RegistryWriter;
//# sourceMappingURL=index.d.ts.map