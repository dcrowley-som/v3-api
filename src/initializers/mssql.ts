import { Initializer, config, log } from "actionhero";
import * as sql from "mssql";

export class mssql extends Initializer {
    constructor() {
        super();
        this.name = "mssql";
        this.loadPriority = 500;
        this.startPriority = 500;
        this.stopPriority = 1000;
    }

    async initialize() {
        if (!config.mssql.enabled) {
            log("MSSQL NOT ENABLED");
            return;
        }
        try {
            await sql.connect(config.mssql.configuration)
            log('MSSQL CONNECTED ' + config.mssql.configuration.server);
        } catch (e) {
            log('MSSQL CONNECT ERROR', e);
            throw e
        }
    }

    async start() {
    }

    async stop() {
        // if (config.mssql.enabled) {
        //     await sql.pool.close();
        // }
    }
}
