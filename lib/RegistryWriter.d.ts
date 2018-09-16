import { Hypercore } from 'hypercore';
import { EntrySchema } from "@netrunner/registry-log";
import { RegistryDatabase } from './RegistryDatabase';
export declare class RegistryWriter {
    private feed;
    private db;
    constructor(feed: Hypercore<EntrySchema>, db: RegistryDatabase);
    create(entry: EntrySchema): Promise<boolean>;
    update(entry: EntrySchema): Promise<boolean>;
    remove(entry: EntrySchema): Promise<boolean>;
}
//# sourceMappingURL=RegistryWriter.d.ts.map