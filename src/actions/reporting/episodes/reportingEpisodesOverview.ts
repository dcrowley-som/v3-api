import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../../models/epicepisode";

export class ReportingEpisodesOverview extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesOverview";
        this.description = "ReportingEpisodesOverview";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            groupBy: { required: true },
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingEpisodesOverview> }) {
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        const groupBy = "$" + params.groupBy;
        const rows = await EpicEpisode.aggregate([
            {
                $match: {
                    date: {
                        $gte: start,
                        $lte: end
                    }
                }
            }, {
                $group: {
                    _id: groupBy,
                    anMinutes: {$sum: "$anMinutes"},
                    episodes: {$sum: 1},
                    inRoomMinutes: {$sum: "$inRoomMinutes"}
                }
            }, {
                $sort: {
                    episodes: -1,
                    _id: 1
                }
            },
            {
                $group: {
                    _id: "all",
                    categories: {
                        $push: "$$ROOT"
                    },
                    anMinutes: { $sum: "$anMinutes"},
                    episodes: {$sum: "$episodes"},
                    inRoomMinutes: {$sum: "$inRoomMinutes"}
                }
            }
        ]);
        return { result: rows[0]}
    }
}
