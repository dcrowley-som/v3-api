import {Action, log, ParamsFrom} from "actionhero";
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
        let start = new Date();
        let end  = new Date();
        if (params.selectedRange === 'Custom') {
            start = new Date(params.start);
            end = new Date(params.end);
        } else {
            switch (params.selectedRange) {
                case 'YTD':
                    start = new Date(start.getFullYear(), 0, 1, 0, 0, 0, 0);
                    end.setDate(end.getDate() + 1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'MTD':
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setDate(end.getDate() + 1);
                    end.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'Last Year':
                    start.setFullYear(start.getFullYear() - 1);
                    start.setMonth(0);
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setMonth(0);
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setSeconds(end.getSeconds() - 1);
                    break;
                case 'FY 24':
                    start = new Date(2023, 6, 1, 0, 0, 0, 0);
                    end = new Date(2024, 5, 30, 23, 59, 59, 0);
                    break;
                case 'FY 25':
                    start = new Date(2024, 6, 1, 0, 0, 0, 0);
                    end = new Date(2025, 5, 30, 23, 59, 59, 0);
                    break;
            }
        }
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
