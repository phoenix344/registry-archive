"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegistryDatabase {
    constructor(options = {}) {
        this.options = options;
        if (!options.expireTime) {
            options.expireTime = Infinity;
        }
    }
    async expires() {
        if (this.options.expireTime && isFinite(this.options.expireTime)) {
            const entries = await this.getKeys();
            const now = Date.now();
            const deletables = [];
            for (const key of entries) {
                const entry = await this.get(key);
                if (entry && 'undefined' !== typeof entry.updated && now > entry.updated + this.options.expireTime) {
                    deletables.push(this.del(entry.name));
                }
            }
            await Promise.all(deletables);
        }
    }
}
exports.RegistryDatabase = RegistryDatabase;
//# sourceMappingURL=RegistryDatabase.js.map