import {Task, api, task} from "actionhero";
import {IReportConcurrencyItem, ReportConcurrency} from "../models/reportConcurrency";

export class ProcessUserConcurrency extends Task {
    constructor() {
        super();
        this.name = "ProcessUserConcurrency";
        this.description = "process a user with concurrency by day and write to table";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }


    async run(data: any) {
        const report = await api.assignments.processConcurrency(new Date(data.startDate), new Date(data.endDate), data.user._id, "Work");
        const toSave: IReportConcurrencyItem[] = report.map((row: any) => {
            return {
                count: row.count,
                countSevenToFour: row.countSevenToFour,
                date: row.date,
                hasOne: row.hasOne,
                hasTwo: row.hasTwo,
                hasThree: row.hasThree,
                hasFour: row.hasFour,
                overFour: row.overFour,
                year: row._id.year,
                month: row._id.month,
                day: row._id.day,
                user: data.user.last + ', ' + data.user.first,
                assignments: <string[]>[],
                userId: data.user._id,
                baseUnits: 0,
                timeUnits: 0,
                totalUnits: 0,
                first: row.first,
                last: row.last
            }
        });
        await ReportConcurrency.insertMany(toSave);
        for (const row of toSave) {
            await task.enqueue("ProcessUserConcurrency2", { date: row.date, user: row.userId}, 'after-episode')
        }
        return true;
    }
}
