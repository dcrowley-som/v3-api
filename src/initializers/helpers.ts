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
        };
        api.helpers.datesFromParams = (params: any): any => {
            let start = new Date();
            let end  = new Date();
            if (params.selectedRange === 'Custom') {
                start = new Date(params.start);
                end = new Date(params.end);
            } else {
                switch (params.selectedRange) {
                    case 'CY-YTD':
                        start = new Date(start.getFullYear(), 0, 1, 0, 0, 0, 0);
                        end.setDate(end.getDate() + 1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'MTD':
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setDate(end.getDate() + 1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'Last CY':
                        start.setFullYear(start.getFullYear() - 1);
                        start.setMonth(0);
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setMonth(0);
                        end.setDate(1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'FY-YTD':
                        if (start.getMonth() < 6) {
                            start.setFullYear(start.getFullYear() - 1);
                        }
                        start.setMonth(6);
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setDate(end.getDate() + 1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'FY24':
                        start = new Date(2023, 6, 1, 0, 0, 0, 0);
                        end = new Date(2024, 5, 30, 23, 59, 59, 0);
                        break;
                    case 'PREV-CY-YTD':
                        start = new Date(start.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
                        end.setDate(end.getDate());
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'PREV-MTD':
                        start.setMonth(start.getMonth() - 1);
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setDate(1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'PREV-Last CY':
                        start.setFullYear(start.getFullYear() - 2);
                        start.setMonth(0);
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setFullYear(start.getFullYear() - 1);
                        end.setMonth(0);
                        end.setDate(1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'PREV-FY-YTD':
                        if (start.getMonth() < 6) {
                            start.setFullYear(start.getFullYear() - 2);
                        }
                        start.setMonth(6);
                        start.setDate(1);
                        start.setHours(0, 0, 0, 0);
                        end.setFullYear(end.getFullYear() - 1);
                        end.setDate(end.getDate() + 1);
                        end.setHours(0, 0, 0, 0);
                        end.setSeconds(end.getSeconds() - 1);
                        break;
                    case 'PREV-FY24':
                        start = new Date(2022, 6, 1, 0, 0, 0, 0);
                        end = new Date(2023, 5, 30, 23, 59, 59, 0);
                        break;
                }
            }
            return { start, end };
        }
    }
}
