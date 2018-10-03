export interface SessionEntrySchema {
    id: Uint8Array;
    publicKey: Uint8Array;
    signature: Uint8Array;
    serviceTime: number;
    requestTime: number;
}