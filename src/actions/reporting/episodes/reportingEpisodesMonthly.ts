import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../../models/epicepisode";

export class ReportingEpisodesMonthly extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesMonthly";
        this.description = "reportingEpisodesMonthly";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            categories: { required: true}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingEpisodesMonthly> }) {
        const categories: any = params.categories;
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        const rows = await EpicEpisode.aggregate(
            [
                {
                    $match: {
                        date: {
                            $gte: start,
                            $lte: end
                        },
                        cat1: {$in: categories.list}
                    }
                },
                {
                    $addFields:
                        {
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
                        {
                            _id: {
                                year: "$year",
                                month: "$month",
                                category: "$cat1"
                            },
                            episodes: {
                                $sum: 1
                            },
                            anMinutes: {
                                $sum: "$anMinutes"
                            },
                            inRoomMinutes: {
                                $sum: "$inRoomMinutes"
                            }
                        }
                },
                {
                    $sort: { "_id.category": 1 }
                },
                {
                    $group:
                        {
                            _id: {
                                year: "$_id.year",
                                month: "$_id.month"
                            },
                            categories: {
                                $push: {
                                    category: "$_id.category",
                                    episodes: "$episodes",
                                    anMinutes: "$anMinutes",
                                    inRoomMinutes: "$inRoomMinutes"
                                }
                            },
                            episodes: {
                                $sum: "$episodes"
                            },
                            anMinutes: {
                                $sum: "$anMinutes"
                            },
                            inRoomMinutes: {
                                $sum: "$inRoomMinutes"
                            }
                        }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ]
        );
        return { result: rows}
    }
}
