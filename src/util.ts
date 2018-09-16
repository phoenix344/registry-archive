import { EntrySchema } from "@netrunner/registry-log";
import { createHash } from 'crypto';
import { sign as sodiumSign, verify as sodiumVerify } from 'sodium-signatures';

export function hash(entry: EntrySchema): Buffer {
    return createHash("sha256").update(Buffer.concat([
        Buffer.from(entry.name),
        Buffer.from(entry.target),
        Buffer.from([entry.removed])
    ])).digest();
}

export function sign(secretKey: Buffer, entry: EntrySchema): Buffer {
    return sodiumSign(hash(entry), secretKey);
}

export function verify(entry: EntrySchema): boolean {
    return sodiumVerify(hash(entry), entry.sig as Buffer, entry.key as Buffer);
}

export function writable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean {
    if (oldEntry) {
        if (oldEntry.updated < newEntry.updated) {
            return verify({ ...newEntry, key: oldEntry.key }) && !newEntry.removed;
        }
    }
    return verify(newEntry) && !newEntry.removed;
}

export function removable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean {
    if (oldEntry) {
        if (oldEntry.updated < newEntry.updated) {
            return verify({ ...newEntry, key: oldEntry.key }) && newEntry.removed;
        }
    }
    return verify(newEntry) && newEntry.removed;
}