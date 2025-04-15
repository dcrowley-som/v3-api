import {Initializer, api, log} from "actionhero";
import {SFAssignment} from "../models/sfassignment";
import {Types} from "mongoose";
import scheduleNames from "../../use_schedule_names.json";

export class assignments extends Initializer {
    constructor() {
        super();
        this.name = "assignments";
    }

    async initialize() {
        api.assignments = {}
        api.assignments.processConcurrency = async (start: Date, end: Date, user: string, assignment: string = '') => {
            const schedules = scheduleNames.names;
            let m: any = {
                date: {
                    $gte: start,
                    $lte: end
                },
                "schedule.name": {$in: scheduleNames.names},
                user: new Types.ObjectId(user),
            };
            if (assignment !== '') {
                m = {
                    date: {
                        $gte: start,
                        $lte: end
                    },
                    "schedule.name": {$in: scheduleNames.names},
                    user: new Types.ObjectId(user),
                    aName: assignment
                }

            }
            return SFAssignment.aggregate(
                [
                    {
                        $match: m
                        /**
                         * query: The query in MQL.
                         */

                    },
                    {
                        $project:
                        /**
                         * specifications: The fields to
                         *   include or exclude.
                         */
                            {
                                date: 1,
                                user: 1
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
                                localField: "date",
                                foreignField: "date",
                                as: "episodes",
                                let: {
                                    user: "$user"
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$user", "$$user"]
                                            }
                                        }
                                    }
                                ]
                            }
                    },
                    {
                        $project:
                        /**
                         * specifications: The fields to
                         *   include or exclude.
                         */
                            {
                                date: 1,
                                episodes: "$episodes.episodeId"
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
                                localField: "episodes",
                                foreignField: "episode",
                                as: "minutes"
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
                                path: "$minutes"
                            }
                    },
                    {
                        $replaceRoot:
                        /**
                         * replacementDocument: A document or string.
                         */
                            {
                                newRoot: "$minutes"
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
                                    $dayOfMonth: "$date"
                                },
                                month: {
                                    $month: "$date"
                                },
                                year: {
                                    $year: "$date"
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
                                _id: {
                                    year: "$year",
                                    month: "$month",
                                    day: "$day",
                                    date: "$date"
                                },
                                episodes: {
                                    $push: "$episode"
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
                                preSeven: {
                                    $push: {
                                        $cond: [
                                            { $and: [
                                                    {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 0]},
                                                    {$lt: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 7]}
                                                ]},
                                            {
                                                date: "$_id.date",
                                                episodes: "$episodes"
                                            },
                                            "$$REMOVE"
                                        ]
                                    }
                                },
                                sevenToFour: {
                                    $push: {
                                        $cond: [
                                            { $and: [
                                                    {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 7]},
                                                    {$lt: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 16]}
                                                ]},
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
                                            { $and: [
                                                    {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 16]},
                                                    {$lt: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 19]}
                                                ]},
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
                                            { $and: [
                                                    {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 19]},
                                                    {$lt: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 23]}
                                                ]},
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
                                            { $and: [
                                                    {$gte: [{$hour: {date: "$_id.date", timezone: "America/New_York"}}, 23]}
                                                ]},
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
                                first: {$min: "$_id.date"},
                                last: {$max: "$_id.date"}
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
                                    $size: "$minutes"
                                },
                                countSevenToFour: {
                                    $size: "$sevenToFour"
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
                                countPreSeven: {
                                    $size: "$preSeven",
                                },
                                // firstMinute: {
                                //     $getField: {
                                //         input: {
                                //             $first: "$minutes"
                                //         },
                                //         field: "date"
                                //     }
                                // },
                                // lastMinute: {
                                //     $getField: {
                                //         input: {
                                //             $last: "$minutes"
                                //         },
                                //         field: "date"
                                //     }
                                // }
                                date: {
                                    $dateFromString: {
                                        dateString: {$concat: [
                                                {$toString: "$_id.year"},
                                                "-",
                                                {$toString: "$_id.month"},
                                                "-",
                                                {$toString: "$_id.day"}
                                            ]},
                                        timezone: "America/New_York"
                                    }
                                }
                                // date: { $toDate: {$concat: [
                                //             {$toString: "$_id.year"},
                                //             "-",
                                //             {$toString: "$_id.month"},
                                //             "-",
                                //             {$toString: "$_id.day"}
                                //         ]}}
                            }
                    }, {
                    $sort: {
                        date: 1
                    }
                }
                ]
            );
        }
    }
}
