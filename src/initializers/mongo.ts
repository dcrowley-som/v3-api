import { Initializer, config, log } from "actionhero";
import { connect, disconnect } from 'mongoose';

export class mongo extends Initializer {
    constructor() {
        super();
        this.name = "mongo";
        this.loadPriority = 500;
        this.startPriority = 500;
        this.stopPriority = 1000;
    }

    async initialize() {
        try {
            await connect(config.mongo.connection, {
                autoIndex: false
            });
            log('MONGO CONNECTED: ' + config.mongo.connection);
        } catch (e) {
            log('MONGO CONNECT ERROR', e);
            throw e
        }
    }

    async start() {
    }

    async stop() {
        await disconnect();
    }
}
