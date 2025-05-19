import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";
import {Types} from "mongoose";

export class ReportingEpisodesProvider extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesProvider";
        this.description = "reportingEpisodesProvider";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            user: { required: true},
            categories: { required: true}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingEpisodesProvider> }) {
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
                        user: new Types.ObjectId(params.user),
                        cat1: { $in: categories.list }
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
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]
        );
        const neededMonths = api.helpers.neededMonths(start, end);
        const fixed = [];
        for (const n of neededMonths) {
            const found = rows.find((m: any) => {
                return m._id.year === n.year && m._id.month === n.month;
            });
            if (found) {
                fixed.push(found);
            } else {
                fixed.push({
                    _id: {
                        month: n.month,
                        year: n.year,
                    },
                    episodes: 0,
                    inRoomMinutes: 0,
                    anMinutes: 0,
                });
            }
        }
        return { result: fixed}
    }
}
