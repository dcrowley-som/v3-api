import {Action, ParamsFrom} from "actionhero";
import {ReportConcurrency} from "../models/reportConcurrency";
import {Types} from "mongoose";


export class ReportingAssignmentsDailySnapshot extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsDailySnapshot";
        this.description = "reportingAssignmentsDailySnapshot";
        this.inputs = {
            providers: { required: true},
            date: { required: false}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingAssignmentsDailySnapshot> }) {
        const providers: any = params.providers;
        const providersList: any[] = providers.list.map((item: any) => {
            return new Types.ObjectId(item);
        })
        // const result = await ReportConcurrency.find({
        //     userId: { $in: providersList },
        //     date: new Date(params.date)
        // })
        //     .sort({
        //         user: 1
        //     });
        const result = await ReportConcurrency.aggregate(
            [
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            userId: {
                                $in: providersList
                            },
                            // date: {
                            //     $dateFromString: {
                            //       dateString: params.date,
                            //       timezone: "America/New_York"
                            //     }
                            // }
                            date: new Date(params.date)
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
                            from: "epicepisodes",
                            localField: "episodes",
                            foreignField: "episodeId",
                            as: "episodes"
                        }
                },
                {
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */
                        {
                            episode: {
                                $arrayElemAt: ["$episodes", 0]
                            }
                        }
                },
                {
                    $unset:
                    /**
                     * Provide the field name to exclude.
                     * To exclude multiple fields, pass the field names in an array.
                     */
                        "episodes"
                },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                        {
                            "episode.anesStart": 1
                        }
                },
                {
                    $group:
                    /**
                     * _id: The id of the group.
                     * fieldN: The first field name.
                     */
                        {
                            _id: "$userId",
                            userId: {
                                $first: "$userId"
                            },
                            count: {
                                $first: "$count"
                            },
                            countSevenToFour: {
                                $first: "$countSevenToFour"
                            },
                            countFourToSeven: {
                                $first: "$countFourToSeven"
                            },
                            countSevenToEleven: {
                                $first: "$countSevenToEleven"
                            },
                            countElevenToSeven: {
                                $first: "$countElevenToSeven"
                            },
                            countPreSeven: {
                                $first: "$countPreSeven"
                            },
                            date: {
                                $first: "$date"
                            },
                            baseUnits: {
                                $first: "$baseUnits"
                            },
                            timeUnits: {
                                $first: "$timeUnits"
                            },
                            totalUnits: {
                                $first: "$totalUnits"
                            },
                            user: {
                                $first: "$user"
                            },
                            assignments: {
                                $first: "$assignments"
                            },
                            first: {
                                $first: "$first"
                            },
                            last: {
                                $first: "$last"
                            },
                            episodes: {
                                $push: "$episode"
                            }
                        }
                }
            ]
        );

        return { result }
    }
}
