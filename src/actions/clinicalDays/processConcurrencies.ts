import {Action, Task, task} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";
import {ReportConcurrency} from "../../models/reportConcurrency";

export class ProcessConcurrencies extends Action {
    constructor() {
        super();
        this.name = "processConcurrencies";
        this.description = "run concurrency for each user";
        this.outputExample = { success: true };
    }

    async run() {
        // delete the queue
        await task.delQueue('after-episode');
        // clear table
        await ReportConcurrency.deleteMany({});
        // date ranges
        const startDate = new Date(2024, 0, 1, 0, 0, 0, 0);
        const endDate = new Date();

        // first get all clinicians
        const users = await EpicEpisode.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            }, {
                $group: {
                    _id: "$user"
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "users"
                }
            }, {
                $unwind: {
                    path: "$users"
                }
            }, {
                $replaceRoot: {
                    newRoot: "$users"
                }
            }, {
                $project: {
                    _id: 1,
                    first: 1,
                    last: 1
                }
            }
        ]);

        for (const user of users) {
            await task.enqueue('ProcessUserConcurrency', {startDate, endDate, user}, 'after-episode');
        }
    }
}
