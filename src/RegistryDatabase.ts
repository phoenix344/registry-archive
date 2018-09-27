import { EntrySchema } from "@netrunner/registry-log";

export interface RegistryDatabaseOptions {
    expireTime?: number;
}

export abstract class RegistryDatabase {

    public constructor(private options: RegistryDatabaseOptions = {}) {
        if (!options.expireTime) {
            options.expireTime = Infinity;
        }
    }

    public async expires() {
        if (this.options.expireTime && isFinite(this.options.expireTime)) {
            const entries = await this.getKeys();
            const now = Date.now();
            const deletables = [];
            for (const key of entries) {
                const entry = await this.get(key);
                if (entry && 'undefined' !== typeof entry.updated && now > entry.updated + this.options.expireTime) {
                    deletables.push(this.del(entry.name));
                }
            }
            await Promise.all(deletables);
        }
    }

    public async abstract getKeys(): Promise<string[]>;
    public async abstract get(key: string): Promise<EntrySchema | void>;
    public async abstract put(key: string, entry: EntrySchema): Promise<void>;
    public async abstract del(key: string): Promise<void>;

}
