import {Action, task} from "actionhero";
import {EpicEpisode} from "../models/epicepisode";


export class ProcessClinicalDays extends Action {
    constructor() {
        super();
        this.name = "processClinicalDays";
        this.description = "find records without clinical days and process";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('after-episode');
        const startDate = new Date(2025, 0, 0, 0, 0, 0, 0);
        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() - 1);
        const episodes = await EpicEpisode.aggregate([
            {
                $match: {
                    // user: new Types.ObjectId(user._id),
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $addFields: {
                    month: {$month: "$date"},
                    day: {$dayOfMonth: "$date"}
                }
            },
            {
                $group: {
                    _id: { month: "$month", day: "$day" },
                    episodes: {
                        $push: "$$ROOT"
                    }
                }
            }
        ]);
        for (const day of episodes) {
            await task.enqueue('ProcessClinicalDay2', { startDate, endDate, day }, 'after-episode');
        }
    }
}
