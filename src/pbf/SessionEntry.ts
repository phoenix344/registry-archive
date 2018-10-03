import Pbf from "pbf";
import { SessionEntrySchema } from "./SessionEntrySchema";

export class SessionEntry {
    public static get default(): SessionEntrySchema {
        return {
            id: new Uint8Array(0),
            publicKey: new Uint8Array(0),
            signature: new Uint8Array(0),
            serviceTime: 0,
            requestTime: 0
        };
    };

    public static decodeMessage(tag: number, obj?: SessionEntrySchema, pbf?: Pbf) {
        if (obj && pbf) {
            switch (tag) {
                case 1:
                    obj.id = pbf.readBytes();
                    break;
                case 2:
                    obj.publicKey = pbf.readBytes();
                    break;
                case 3:
                    obj.signature = pbf.readBytes();
                    break;
                case 4:
                    obj.serviceTime = pbf.readFixed64();
                    break;
                case 5:
                    obj.requestTime = pbf.readFixed64();
                    break;
            }
        }
    }

    public static encodeMessage(obj?: SessionEntrySchema, pbf?: Pbf) {
        if (obj && pbf) {
            
        }
    }
}