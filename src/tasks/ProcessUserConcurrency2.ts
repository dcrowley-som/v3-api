import {Task, api, task} from "actionhero";
import {IReportConcurrencyItem, ReportConcurrency} from "../models/reportConcurrency";
import {SFAssignment} from "../models/sfassignment";
import {EpisodeMinute} from "../models/episodeMinute";
import {Types} from "mongoose";
import scheduleNames from "../../use_schedule_names.json";
import {EpicEpisode} from "../models/epicepisode";

export class ProcessUserConcurrency2 extends Task {
    constructor() {
        super();
        this.name = "ProcessUserConcurrency2";
        this.description = "process a user with concurrency by day and write to table PART 2";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }


    async run(data: any) {
        const row = await ReportConcurrency.findOne({
            date: new Date(data.date),
            userId: data.user
        });
        if (!row) { return }
        // // console.log("found row");
        const assignments = await SFAssignment.find({
            user: data.user,
            date: new Date(data.date),
            "schedule.name": {$in: scheduleNames.names},
        });
        // console.log('Assignments ' + assignments.length)
        // console.log(data)
        const invoices = await EpicEpisode.aggregate([
            {
                $match:
                /**
                 * query: The query in MQL.
                 */
                    {
                        //user: new Types.ObjectId(data.user),
                        invoices: {
                            $not: {
                                $size: 0
                            }
                        },
                        //date: new Date(data.date)
                        episodeId: {
                            $in: data.episodes
                        }
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
                        path: "$invoices"
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
                        from: "invoicematches",
                        localField: "invoices",
                        foreignField: "_id",
                        as: "invoices"
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
                        path: "$invoices"
                    }
            },
            {
                $replaceRoot:
                /**
                 * replacementDocument: A document or string.
                 */
                    {
                        newRoot: "$invoices"
                    }
            },
            {
                $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                    {
                        _id: 1,
                        baseUnits: {
                            $sum: "$unitsBase"
                        },
                        timeUnits: {
                            $sum: "$unitsTime"
                        },
                        totalUnits: {
                            $sum: "$unitsTotal"
                        }
                    }
            }
        ]);
        row.assignments = assignments.map(item => item.aName);
        row.baseUnits = invoices.length ? invoices[0].baseUnits : 0;
        row.timeUnits = invoices.length ? invoices[0].timeUnits : 0;
        row.totalUnits = invoices.length ? invoices[0].totalUnits : 0;
        await row.save();

        return true;
    }
}
