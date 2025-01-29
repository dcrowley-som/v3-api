import {Initializer, config, log, api} from "actionhero";

export class mssql extends Initializer {
    constructor() {
        super();
        this.name = "helpers";
        this.loadPriority = 1000;
        this.startPriority = 1000;
        this.stopPriority = 1000;
    }

    async initialize() {
        api.helpers = {};
        api.helpers.pad = (num: number | string) => {
            let str = num.toString()
            if (str.length < 2) {
                str = '0' + str
            }
            return str
        };
        api.helpers.resetDateTZ = (og: Date | string): Date => {
            const date = new Date(og);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            return date;
        }
    }
}
