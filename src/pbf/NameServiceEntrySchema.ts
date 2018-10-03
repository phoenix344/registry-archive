import { ServiceMode } from "./ServiceMode";

export interface NameServiceEntrySchema {
    id: Uint8Array;
    sessionId: Uint8Array;
    signature: Uint8Array;
    serviceTime: number;
    requestTime: number;
    expiredTime: number;
    mode: ServiceMode;
    name: string;
    target: string;
}