/// <reference types="@types/node" />
import { EntrySchema } from "@netrunner/registry-log";
import { SodiumSignaturesKeyPair } from 'sodium-signatures';
export interface ShortEntrySchema {
    name: string;
    content: string;
    removed: boolean;
}
export declare function hash(entry: ShortEntrySchema | EntrySchema): Buffer;
export declare function sign(secretKey: Buffer, entry: ShortEntrySchema | EntrySchema): Buffer;
export declare function verify(entry: EntrySchema): boolean;
export declare function createEntry(keys: SodiumSignaturesKeyPair, name: string, content: string): EntrySchema;
export declare function updateEntry(keys: SodiumSignaturesKeyPair, content: string, entry: EntrySchema): {
    key: Uint8Array;
    sig: Uint8Array;
    created: number;
    updated?: number | undefined;
    removed?: boolean | undefined;
    name: string;
    content: string;
};
export declare function removeEntry(keys: SodiumSignaturesKeyPair, entry: EntrySchema): {
    key: Uint8Array;
    sig: Uint8Array;
    created: number;
    updated?: number | undefined;
    removed?: boolean | undefined;
    name: string;
    content: string;
};
export declare function writable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean;
export declare function removable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean;
//# sourceMappingURL=util.d.ts.map