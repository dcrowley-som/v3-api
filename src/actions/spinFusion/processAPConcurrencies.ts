import {Action, Task, task} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";
import {ReportConcurrency} from "../../models/reportConcurrency";

export class ProcessAPConcurrencies extends Action {
    constructor() {
        super();
        this.name = "processAPConcurrencies";
        this.description = "AP run concurrency for each user";
        this.outputExample = { success: true };
    }

    async run() {
        // delete the queue
        await task.delQueue('after-episode');
        // clear table
        await ReportConcurrency.deleteMany({});
        // date ranges
        const startDate = new Date(2022, 0, 0, 0, 0, 0, 0);
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
            },
            {
                $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                    {
                        _id: "$episodeId",
                        episode: {
                            $first: "$$ROOT"
                        }
                    }
            },
            {
                $replaceRoot:
                /**
                 * replacementDocument: A document or string.
                 */
                    {
                        newRoot: "$episode"
                    }
            },
            {
                $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                    {
                        from: "allproviders",
                        localField: "episodeId",
                        foreignField: "episodeId",
                        as: "provider"
                    }
            },
            {
                $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                    {
                        path: "$provider",
                        preserveNullAndEmptyArrays: false
                    }
            },
            {
                $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                    {
                        from: "users",
                        localField: "provider.user",
                        foreignField: "_id",
                        as: "users"
                    }
            },
            {
                $addFields:
                /**
                 * newField: The new field name.
                 * expression: The new field expression.
                 */
                    {
                        user: {
                            $arrayElemAt: ["$users", 0]
                        }
                    }
            },
            {
                $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                    {
                        _id: "$user._id",
                        first: "$user.first",
                        last: "$user.last"
                    }
            }, {
                $group: {
                    _id: "$_id",
                    first: {$first: "$first"},
                    last: {$first: "$last"}
                }
            }
        ]);



        for (const user of users) {
            await task.enqueue('ProcessAPUserConcurrency', {startDate, endDate, user}, 'after-episode');
        }

        return { users }
    }
}
