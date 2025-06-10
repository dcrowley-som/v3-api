import {Task, api, task} from "actionhero";
import {IReportConcurrencyItem, ReportConcurrency} from "../models/reportConcurrency";
import {Types} from "mongoose";
import {SFAssignment} from "../models/sfassignment";
import {EpicEpisode} from "../models/epicepisode";
import {AllProvider} from "../models/allprovider";

export class ProcessAPUserConcurrency extends Task {
    constructor() {
        super();
        this.name = "ProcessAPUserConcurrency";
        this.description = "AP process a user with concurrency by day and write to table";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }


    async run(data: any) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const paddedStart = new Date(data.startDate);
        paddedStart.setDate(paddedStart.getDate() - 1);
        const paddedEnd = new Date(data.endDate);
        paddedEnd.setDate(paddedEnd.getDate() + 1);
        const report = await AllProvider.aggregate(
            [
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            user: new Types.ObjectId(data.user._id)
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
                            from: "epicepisodes",
                            localField: "episodeId",
                            foreignField: "episodeId",
                            as: "epicEpisodes"
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
                            path: "$epicEpisodes",
                            preserveNullAndEmptyArrays: false
                        }
                },
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            "epicEpisodes.date": {
                                $gte: paddedStart,
                                $lte: paddedEnd,
                            }
                        }
                },
                {
                    $addFields: {
                        "epicEpisodes.provider": {
                            user: "$user",
                            anProvRole: "$anProvRole",
                            anesBegin: "$anesBegin",
                            anesEnd: "$anesEnd",
                            anMinute: "$anMinute"
                        }
                    }
                },
                {
                    $replaceRoot:
                    /**
                     * replacementDocument: A document or string.
                     */
                        {
                            newRoot: "$epicEpisodes"
                        }
                },
                {
                    $addFields: {
                        paddedStart: {
                            $dateSubtract: {
                                startDate: "$date",
                                unit: "day",
                                amount: 1,
                                timezone: "America/New_York"
                            }
                        },
                        paddedEnd: {
                            $dateAdd: {
                                startDate: "$date",
                                unit: "day",
                                amount: 1,
                                timezone: "America/New_York"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "episodeminutes",
                        localField: "episodeId",
                        foreignField: "episodeId",
                        as: "episodeMinutes",
                        let: {
                            provider: "$provider.user",
                            date: "$date"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$user", "$$provider"]
                                            },
                                            {
                                                $eq: [
                                                    "$assignmentDate",
                                                    "$$date"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
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
                            path: "$episodeMinutes",
                            preserveNullAndEmptyArrays: false
                        }
                },
                {
                    $replaceRoot:
                    /**
                     * replacementDocument: A document or string.
                     */
                        {
                            newRoot: "$episodeMinutes"
                        }
                },
                {
                    $addFields: {
                        day: {
                            $dayOfMonth: "$assignmentDate"
                        },
                        month: {
                            $month: "$assignmentDate"
                        },
                        year: {
                            $year: "$assignmentDate"
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: "$year",
                            month: "$month",
                            day: "$day",
                            assignmentDate: "$assignmentDate",
                            date: "$date",
                            user: "$user"
                        },
                        episodes: {
                            $push: "$episodeId"
                        }
                    }
                },
                // {
                //   $addFields:
                //     /**
                //      * newField: The new field name.
                //      * expression: The new field expression.
                //      */
                //     {
                //       "episodeMinutes.assignments": "$assignments"
                //     }
                // }
                {
                    $addFields: {
                        count: {
                            $size: "$episodes"
                        },
                        nextDate: {
                            $dateAdd: {
                                startDate: "$_id.assignmentDate",
                                unit: "day",
                                amount: 1,
                                timezone: "America/New_York"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "sfassignments",
                        localField: "_id.user",
                        foreignField: "user",
                        as: "assignments",
                        let: {
                            assignmentDate: "$_id.assignmentDate"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$date",
                                                    "$$assignmentDate"
                                                ]
                                            },
                                            {
                                                $in: [
                                                    "$schedule.name",
                                                    [
                                                        "CRNA GOR Daily",
                                                        "CRNA GOR Leave",
                                                        "CRNA MTC Daily",
                                                        "CRNA MTC Leave",
                                                        "CRNA TOR Call",
                                                        "CRNA TOR Daily",
                                                        "CRNA TOR Leave",
                                                        "Fellow Call",
                                                        "Fellow Leave",
                                                        "Fellow Rotation",
                                                        "GOR Call",
                                                        "Pain Daily",
                                                        "Peds Daily",
                                                        "Phys Daily",
                                                        "Phys Leave",
                                                        "Phys Overtime",
                                                        "Resident Call",
                                                        "Resident Leave",
                                                        "Rotation Schedule",
                                                        "STC Phys Daily",
                                                        "STC Phys Leave",
                                                        "Subspecialty Call",
                                                        "UMR CRNA Daily",
                                                        "UMROI + MTC Call + Daily",
                                                        "UMROI + MTC Leave",
                                                        "UMROI + MTC Overtime"
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        nextDay: {
                            $dayOfYear: {
                                date: "$nextDate",
                                timezone: "America/New_York"
                            }
                        },
                        currentDay: {
                            $dayOfYear: {
                                date: "$_id.assignmentDate",
                                timezone: "America/New_York"
                            }
                        },
                        assignments: {
                            $map: {
                                input: "$assignments",
                                as: "assignment",
                                in: "$$assignment.aName"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day"
                        },
                        assignments: {
                            $first: "$assignments"
                        },
                        minutes: {
                            $push: {
                                date: "$_id.date",
                                episodes: "$episodes"
                            }
                        },
                        sixToFour: {
                            $push: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    {
                                                        $dayOfYear: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    "$currentDay"
                                                ]
                                            },
                                            {
                                                $gte: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    6
                                                ]
                                            },
                                            {
                                                $lt: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    16
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        date: "$_id.date",
                                        episodes: "$episodes"
                                    },
                                    "$$REMOVE"
                                ]
                            }
                        },
                        fourToSeven: {
                            $push: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    {
                                                        $dayOfYear: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    "$currentDay"
                                                ]
                                            },
                                            {
                                                $gte: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    16
                                                ]
                                            },
                                            {
                                                $lt: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    19
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        date: "$_id.date",
                                        episodes: "$episodes"
                                    },
                                    "$$REMOVE"
                                ]
                            }
                        },
                        sevenToEleven: {
                            $push: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    {
                                                        $dayOfYear: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    "$currentDay"
                                                ]
                                            },
                                            {
                                                $gte: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    19
                                                ]
                                            },
                                            {
                                                $lt: [
                                                    {
                                                        $hour: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    23
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        date: "$_id.date",
                                        episodes: "$episodes"
                                    },
                                    "$$REMOVE"
                                ]
                            }
                        },
                        elevenToSeven: {
                            $push: {
                                $cond: [
                                    {
                                        $or: [
                                            {
                                                $eq: [
                                                    {
                                                        $dayOfYear: {
                                                            date: "$_id.date",
                                                            timezone:
                                                                "America/New_York"
                                                        }
                                                    },
                                                    "$nextDay"
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            {
                                                                $dayOfYear: {
                                                                    date: "$_id.date",
                                                                    timezone:
                                                                        "America/New_York"
                                                                }
                                                            },
                                                            "$currentDay"
                                                        ]
                                                    },
                                                    {
                                                        $gte: [
                                                            {
                                                                $hour: {
                                                                    date: "$_id.date",
                                                                    timezone:
                                                                        "America/New_York"
                                                                }
                                                            },
                                                            23
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        date: "$_id.date",
                                        episodes: "$episodes"
                                    },
                                    "$$REMOVE"
                                ]
                            }
                        },
                        hasOne: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$count", 1]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        hasTwo: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$count", 2]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        hasThree: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$count", 3]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        hasFour: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$count", 4]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        overFour: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $gt: ["$count", 4]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        first: {
                            $min: "$_id.date"
                        },
                        last: {
                            $max: "$_id.date"
                        }
                    }
                },
                {
                    $addFields: {
                        count: {
                            $size: "$minutes"
                        },
                        countSixToFour: {
                            $size: "$sixToFour"
                        },
                        countFourToSeven: {
                            $size: "$fourToSeven"
                        },
                        countSevenToEleven: {
                            $size: "$sevenToEleven"
                        },
                        countElevenToSeven: {
                            $size: "$elevenToSeven"
                        },
                        date: {
                            $dateFromString: {
                                dateString: {
                                    $concat: [
                                        {
                                            $toString: "$_id.year"
                                        },
                                        "-",
                                        {
                                            $toString: "$_id.month"
                                        },
                                        "-",
                                        {
                                            $toString: "$_id.day"
                                        }
                                    ]
                                },
                                timezone: "America/New_York"
                            }
                        }
                    }
                },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                        {
                            date: 1
                        }
                }
            ]
        );
        const toSave: IReportConcurrencyItem[] = report.map((row: any) => {
            const episodeIds = [];
            for (const minute of row.minutes) {
                if (minute.episodes && minute.episodes.length > 0) {
                    for (const episode of minute.episodes) {
                        episodeIds.push(episode);
                    }
                }
            }
            const uniqueEpisodes = [...new Set(episodeIds)];
            const uniqueAssignments: string[] = [...new Set(<string[]>row.assignments)];
            return {
                count: row.count,
                countSevenToFour: row.countSixToFour,
                countFourToSeven: row.countFourToSeven,
                countSevenToEleven: row.countSevenToEleven,
                countElevenToSeven: row.countElevenToSeven,
                countPreSeven: 0,
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
                assignments: uniqueAssignments,
                userId: data.user._id,
                baseUnits: 0,
                timeUnits: 0,
                totalUnits: 0,
                first: row.first,
                last: row.last,
                episodes: uniqueEpisodes
            }
        });
        await ReportConcurrency.insertMany(toSave);
        // for (const row of toSave) {
        //     await task.enqueue("ProcessUserConcurrency2", {date: row.date, user: row.userId, episodes: row.episodes}, 'after-episode')
        // }
        return true;
    }
}
