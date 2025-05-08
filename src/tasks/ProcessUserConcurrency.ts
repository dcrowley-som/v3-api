import {Task, api, task} from "actionhero";
import {IReportConcurrencyItem, ReportConcurrency} from "../models/reportConcurrency";
import {Types} from "mongoose";
import {SFAssignment} from "../models/sfassignment";

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
        // const report = await api.assignments.processConcurrency(new Date(data.startDate), new Date(data.endDate), data.user._id, '');
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const paddedStart = new Date(data.startDate);
        paddedStart.setDate(paddedStart.getDate() - 1);
        const paddedEnd = new Date(data.endDate);
        paddedEnd.setDate(paddedEnd.getDate() + 1);
        const report = await SFAssignment.aggregate(
            [
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            date: {
                                $gte: paddedStart,
                                $lte: paddedEnd
                            },
                            user: new Types.ObjectId(data.user._id),
                            "schedule.name": {$in: api.assignments.useScheduleNames.names},
                        }
                },
                {
                    $group:
                    /**
                     * _id: The id of the group.
                     * fieldN: The first field name.
                     */
                        {
                            _id: {
                                date: "$date",
                                user: "$user"
                            },
                            assignments: {
                                $push: "$$ROOT"
                            }
                        }
                },
                {
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */
                        {
                            paddedStart: {
                                $dateSubtract: {
                                    startDate: "$_id.date",
                                    unit: "day",
                                    amount: 1,
                                    timezone: "America/New_York"
                                }
                            },
                            paddedEnd: {
                                $dateAdd: {
                                    startDate: "$_id.date",
                                    unit: "day",
                                    amount: 1,
                                    timezone: "America/New_York"
                                }
                            }
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
                            localField: "_id.user",
                            foreignField: "user",
                            as: "episodes",
                            let: {
                                paddedStart: "$paddedStart",
                                paddedEnd: "$paddedEnd"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$date",
                                                        "$$paddedStart"
                                                    ]
                                                },
                                                {
                                                    $lte: ["$date", "$$paddedEnd"]
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
                            path: "$episodes"
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
                            from: "episodeminutes",
                            localField: "episodes.episodeId",
                            foreignField: "episodeId",
                            as: "episodeminutes",
                            let: {
                                date: "$_id.date"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$assignmentDate", "$$date"]
                                        }
                                    }
                                }
                            ]
                        }
                },
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            episodeminutes: {
                                $not: {
                                    $size: 0
                                }
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
                            path: "$episodeminutes"
                        }
                },
                {
                    $replaceRoot:
                    /**
                     * replacementDocument: A document or string.
                     */
                        {
                            newRoot: "$episodeminutes"
                        }
                },
                {
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */

                        {
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
                            date: "$date"
                        },
                        episodes: {
                            $push: "$episodeId"
                        }
                    }
                },
                {
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */
                        {
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
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */
                        {
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
                        minutes: {
                            $push: {
                                date: "$_id.date",
                                episodes: "$episodes"
                            }
                        },
                        // preSix: {
                        //     $push: {
                        //         $cond: [
                        //             { $and: [
                        //                     {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 0]},
                        //                     {$lt: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 6]}
                        //                 ]},
                        //             {
                        //                 date: "$_id.date",
                        //                 episodes: "$episodes"
                        //             },
                        //             "$$REMOVE"
                        //         ]
                        //     }
                        // },
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
                // {
                //   $match:
                //     /**
                //      * query: The query in MQL.
                //      */
                //     {
                //       elevenToSeven: {
                //         $not: {
                //           $size: 0
                //         }
                //       }
                //     }
                // }
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
                        // sixToFour: false,
                        // fourToSeven: false,
                        // sevenToEleven: false,
                        // elevenToSeven: false,
                        // minutes: false,
                        // _id: false
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
        // console.log(data)
        // console.log(report);
        // return;
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
                assignments: <string[]>[],
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
        for (const row of toSave) {
            await task.enqueue("ProcessUserConcurrency2", {date: row.date, user: row.userId, episodes: row.episodes}, 'after-episode')
        }
        return true;
    }
}
