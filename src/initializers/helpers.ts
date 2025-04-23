import {Initializer, api, log} from "actionhero";

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
        api.helpers.neededMonths = (start: Date, end: Date): any[] => {
            const neededMonths = [];
            let currMonth = new Date(start.getFullYear(), start.getMonth(), 1).getTime();
            neededMonths.push({ year: start.getFullYear(), month: start.getMonth() + 1 });
            const endMonth = new Date(end.getFullYear(), end.getMonth(), 1).getTime();
            while (currMonth < endMonth) {
                const curr = new Date(currMonth);
                const next = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
                neededMonths.push({ year: next.getFullYear(), month: next.getMonth() + 1 });
                currMonth = next.getTime();
            }
            return neededMonths;
        }
        api.helpers.datesFromParams = (params: any): any => {
            let start = new Date();
            let end  = new Date();
            switch (params.selectedRange) {
                case 'Custom':
                    start = new Date(params.start);
                    end = new Date(params.end);
                    break;
                case 'PREV-Custom':
                    start = new Date(params.start);
                    start.setFullYear(start.getFullYear() - 1);
                    end = new Date(params.end);
                    end.setFullYear(end.getFullYear() - 1);
                    break;
                case 'CY-YTD':
                    start = new Date(start.getFullYear(), 0, 1, 0, 0, 0, 0);
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'ROLLING-12':
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    start.setFullYear(start.getFullYear() - 1);
                    break;
                case 'PREV-ROLLING-12':
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    start.setFullYear(start.getFullYear() - 2);
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    end.setFullYear(end.getFullYear() - 1);
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
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'FY24':
                    start = new Date(2023, 6, 1, 0, 0, 0, 0);
                    end = new Date(2024, 5, 30, 23, 59, 59, 0);
                    break;
                case 'PREV-CY-YTD':
                    start = new Date(start.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'PREV-MTD':
                    start.setFullYear(start.getFullYear() - 1);
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setFullYear(end.getFullYear() - 1);
                    end.setDate(end.getDate() + 1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'PREV-Last CY':
                    start.setFullYear(start.getFullYear() - 2);
                    start.setMonth(0);
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setFullYear(start.getFullYear() + 1);
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
                    end.setDate(1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'PREV-FY24':
                    start = new Date(2022, 6, 1, 0, 0, 0, 0);
                    end = new Date(2023, 5, 30, 23, 59, 59, 0);
                    break;
            }
            log('Start', 'info', { start })
            log('End', 'info', { end} )
            return { start, end };
        }
    }
}
