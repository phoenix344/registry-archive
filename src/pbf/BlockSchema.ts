import { SessionEntrySchema } from "./SessionEntrySchema";
import { NameServiceEntrySchema } from "./NameServiceEntrySchema";
import { StorageServiceEntrySchema } from "./StorageServiceEntrySchema";

export interface BlockSchema {
    syncTime: number;
    sessions: SessionEntrySchema[];
    names: NameServiceEntrySchema[];
    storage: StorageServiceEntrySchema[];
}
