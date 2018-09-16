import { EntrySchema } from "@netrunner/registry-log";
export interface RegistryDatabaseOptions {
    expireTime?: number;
}
export declare abstract class RegistryDatabase {
    private options;
    constructor(options?: RegistryDatabaseOptions);
    expires(): Promise<void>;
    abstract getKeys(): Promise<string[]>;
    abstract get(key: string): Promise<EntrySchema | void>;
    abstract put(key: string, entry: EntrySchema): Promise<void>;
    abstract del(key: string): Promise<void>;
}
//# sourceMappingURL=RegistryDatabase.d.ts.map