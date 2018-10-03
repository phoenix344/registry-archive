const { RegistryWriter } = require('../lib/RegistryWriter');
const { RegistryDatabase } = require('../lib/RegistryDatabase');
const { registryLog } = require('@netrunner/registry-log');
const util = require('../lib/util');
const ram = require('random-access-memory');
const { keyPair } = require("sodium-signatures");

class DB extends RegistryDatabase {
    constructor(options) {
        super(options);
        this.entries = {};
    }

    async getKeys() {
        return Object.keys(this.entries);
    }
    async get(key) {
        return this.entries[key];
    }
    async put(key, value) {
        this.entries[key] = value;
    }
    async del(key) {
        delete this.entries[key];
    }
}

module.exports = [
    (async function testRegistryWriter() {
        const keysA = keyPair();
        const keysB = keyPair();
        const keysC = keyPair();

        const a = registryLog(filename => ram(filename));
        const b = registryLog(filename => ram(filename));
        const c = registryLog(filename => ram(filename));

        const db = new DB();
        const rw = new RegistryWriter([a, b, c], db);

        await rw.ready();

        await rw.create(util.createEntry(keysA, 'A', 'test1'));

        const onGet = (name) => function (err, data) {
            if (err) {
                console.log(name);
                console.error(name, err);
            } else {
                console.log(name, data);
            }
        }

        a.get(0, onGet('A'));
        b.get(0, onGet('B'));
        c.get(0, onGet('C'));

    })()
]