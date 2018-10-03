import Pbf from "pbf";
import { BlockSchema } from './BlockSchema';
import { NameServiceEntrySchema } from './NameServiceEntrySchema';
import { NameServiceEntry } from "./NameServiceEntry";
import { SessionEntrySchema } from "./SessionEntrySchema";
import { SessionEntry } from './SessionEntry';
import { StorageServiceEntrySchema } from './StorageServiceEntrySchema';
import { StorageServiceEntry } from "./StorageServiceEntry";

export class Block {

    private static get defaultBlock(): BlockSchema {
        return {
            syncTime: Date.now(),
            sessions: [],
            names: [],
            storage: []
        };
    };

    public decode(buf: Buffer | Uint8Array): BlockSchema {
        const pbf = new Pbf(buf);
        return pbf.readFields<BlockSchema>((tag: number, obj?: BlockSchema, pbf?: Pbf) => {
            if ('object' === typeof obj && pbf) {
                switch (tag) {
                    case 1:
                        obj.syncTime = pbf.readFixed64();
                        break;
                    case 2:
                        obj.sessions.push(pbf.readMessage<SessionEntrySchema>(SessionEntry.decodeMessage), SessionEntry.default);
                        break;
                    case 3:
                        obj.names.push(pbf.readMessage<NameServiceEntrySchema>(NameServiceEntry.decodeMessage, NameServiceEntry.default));
                        break;
                    case 4:
                        obj.storage.push(pbf.readMessage<StorageServiceEntrySchema>(StorageServiceEntry.decodeMessage, StorageServiceEntry.default));
                        break;
                }
            }
        }, Block.defaultBlock);
    }

    encode(obj: BlockSchema): Buffer {
        const pbf = new Pbf();

        pbf.writeFixed64(obj.syncTime);

        for (const session of obj.sessions) {
            pbf.writeMessage<SessionEntrySchema>(2, SessionEntry.encodeMessage, session)
        }

        for (const name of obj.names) {
            pbf.writeMessage<NameServiceEntrySchema>(3, NameServiceEntry.encodeMessage, name)
        }

        for (const storage of obj.storage) {
            pbf.writeMessage<StorageServiceEntrySchema>(4, StorageServiceEntry.encodeMessage, storage)
        }

        return Buffer.from(pbf.finish());
    }

}
