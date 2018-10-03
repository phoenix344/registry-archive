import { EntrySchema } from "@netrunner/registry-log";
import { createHash } from 'crypto';
import { sign as sodiumSign, verify as sodiumVerify, SodiumSignaturesKeyPair } from 'sodium-signatures';

export interface ShortEntrySchema { name: string, content: string, removed: boolean }

export function hash(entry: ShortEntrySchema | EntrySchema): Buffer {
    return createHash("sha256").update(Buffer.concat([
        Buffer.from(entry.name),
        Buffer.from(entry.content),
        Buffer.from([entry.removed])
    ])).digest();
}

export function sign(secretKey: Buffer, entry: ShortEntrySchema | EntrySchema): Buffer {
    return sodiumSign(hash(entry), secretKey);
}

export function verify(entry: EntrySchema): boolean {
    return sodiumVerify(hash(entry), entry.sig as Buffer, entry.key as Buffer);
}

export function createEntry(keys: SodiumSignaturesKeyPair, name: string, content: string): EntrySchema {
    const entry: EntrySchema = {
        key: keys.publicKey,
        sig: Buffer.alloc(0),
        created: 0,
        updated: 0,
        name, content,
        removed: false
    };
    entry.sig = sign(keys.secretKey, entry);
    return entry;
}

export function updateEntry(keys: SodiumSignaturesKeyPair, content: string, entry: EntrySchema) {
    if (!Buffer.from(entry.key).equals(keys.publicKey) && !entry.removed) {
        throw new Error("The key can't be updated or rewritten. The public key is not equal!");
    }
    const newEntry = { ...entry };
    newEntry.content = content;
    newEntry.sig = sign(keys.secretKey, newEntry);
    return newEntry;
}

export function removeEntry(keys: SodiumSignaturesKeyPair, entry: EntrySchema) {
    if (!Buffer.from(entry.key).equals(keys.publicKey)) {
        throw new Error("The key can't be updated or rewritten. The public key is not equal!");
    }
    else if (entry.removed) {
        throw new Error("The entry is already removed!");
    }
    const newEntry = { ...entry };
    newEntry.removed = true;
    newEntry.sig = sign(keys.secretKey, newEntry);
    return newEntry;
}

export function writable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean {
    if (oldEntry) {
        if ('undefined' !== typeof oldEntry.updated && 'undefined' !== typeof newEntry.updated && newEntry.updated > oldEntry.updated) {
            return verify({ ...newEntry, key: oldEntry.key }) && !newEntry.removed;
        }
        return false;
    }
    return verify(newEntry) && !newEntry.removed;
}

export function removable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean {
    if (oldEntry) {
        if ('undefined' !== typeof oldEntry.updated && 'undefined' !== typeof newEntry.updated && oldEntry.updated < newEntry.updated) {
            return verify({ ...newEntry, key: oldEntry.key }) && newEntry.removed === true;
        }
        return false;
    }
    return verify(newEntry) && !!newEntry.removed === true;
}

export function convertEnum<T>(obj: any, index: number): T {
    return obj[obj[index]] as T;
}
