import { ServiceMode } from "./ServiceMode";

export interface StorageServiceEntrySchema {
    id: Uint8Array;
    sessionId: Uint8Array;
    signature: Uint8Array;
    serviceTime: number;
    requestTime: number;
    expiredTime: number;
    mode: ServiceMode;

    // mapping to registered name
    name?: string;

    key: string;
    value: Uint8Array;
}