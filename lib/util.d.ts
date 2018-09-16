/// <reference types="@types/node" />
import { EntrySchema } from "@netrunner/registry-log";
export declare function hash(entry: EntrySchema): Buffer;
export declare function sign(secretKey: Buffer, entry: EntrySchema): Buffer;
export declare function verify(entry: EntrySchema): boolean;
export declare function writable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean;
export declare function removable(newEntry: EntrySchema, oldEntry?: EntrySchema | void): boolean;
//# sourceMappingURL=util.d.ts.map