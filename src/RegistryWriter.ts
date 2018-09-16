import { Hypercore } from 'hypercore';
import { EntrySchema } from "@netrunner/registry-log";
import { verify } from './util';
import { RegistryDatabase } from './RegistryDatabase';

export class RegistryWriter {
    public constructor(
        private feed: Hypercore<EntrySchema>,
        private db: RegistryDatabase) { }

    public create(entry: EntrySchema): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
            if (!registered) {
                const created = Date.now();
                const updated = created;
                entry = {
                    ...entry,
                    created,
                    updated,
                    removed: false
                };
                if (verify(entry)) {
                    this.feed.append(entry, async (err: Error) => {
                        if (err) return reject(err);
                        resolve(true);
                    });
                }
            }
            return resolve(false);
        });
    }

    public update(entry: EntrySchema): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
            if (registered) {
                const updated = Date.now();
                entry = {
                    ...registered,
                    updated,
                    name: registered.name
                };
                if (verify(entry)) {
                    this.feed.append(entry, async (err: Error) => {
                        if (err) return reject(err);
                        resolve(true);
                    });
                }
            }
            return resolve(false);
        });
    }

    public remove(entry: EntrySchema): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const registered = await this.db.get(entry.name);
            if (registered) {
                const updated = Date.now();
                entry = {
                    ...registered,
                    updated,
                    removed: true
                }
                if (verify(entry)) {
                    this.feed.append(entry, async (err: Error) => {
                        if (err) return reject(err);
                        resolve(true);
                    });
                }
            }
            return resolve(false);
        });
    }

}
