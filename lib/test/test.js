"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
if (cluster_1.default.isMaster) {
    const { readdirSync } = require('fs');
    const files = readdirSync(__dirname).filter((file) => file.slice(file.lastIndexOf('.spec.js')) === '.spec.js');
    for (const file of files) {
        cluster_1.default.fork({ testFile: file });
    }
}
else {
    const { join } = require('path');
    process.on('unhandledRejection', (err, p) => {
        console.error(`(ノಠ益ಠ)ノ彡┻━┻ ${process.env.testFile}`);
        console.error(err.stack);
        process.exit(1);
    });
    Promise.all(require(join(__dirname, process.env.testFile))).then(() => {
        console.log(`ヾ(⌐■_■)ノ♪ ${process.env.testFile}`);
        process.exit();
    });
}
//# sourceMappingURL=test.js.map