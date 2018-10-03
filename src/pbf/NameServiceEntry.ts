import Pbf from "pbf";
import { NameServiceEntrySchema } from "./NameServiceEntrySchema";
import { ServiceMode } from "./ServiceMode";
import { convertEnum } from "../util";

export class NameServiceEntry {
    public static get default(): NameServiceEntrySchema {
        return {
            id: new Uint8Array(0),
            sessionId: new Uint8Array(0),
            signature: new Uint8Array(0),
            serviceTime: 0,
            requestTime: 0,
            expiredTime: 0,
            mode: ServiceMode.Create,
            name: "",
            target: ""
        };
    };

    public static decodeMessage(tag: number, obj?: NameServiceEntrySchema, pbf?: Pbf) {
        if ('object' === typeof obj && pbf) {
            switch (tag) {
                case 1:
                    obj.id = pbf.readBytes();
                    break;
                case 2:
                    obj.sessionId = pbf.readBytes();
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
                case 6:
                    obj.expiredTime = pbf.readFixed64();
                    break;
                case 7:
                    obj.mode = convertEnum(ServiceMode, pbf.readVarint());
                    break;
                case 8:
                    obj.name = pbf.readString();
                    break;
                case 9:
                    obj.target = pbf.readString();
                    break;
            }
        }
    }

    public static encodeMessage(obj?: NameServiceEntrySchema, pbf?: Pbf) {
        if (obj && pbf) {
            
        }
    }
}