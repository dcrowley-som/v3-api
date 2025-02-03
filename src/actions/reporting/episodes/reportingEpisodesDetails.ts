import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../../models/epicepisode";
import {Types} from "mongoose";

export class ReportingEpisodesDetails extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesDetails";
        this.description = "reportingEpisodesDetails";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            user: { required: false},
            categories: { required: true}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingEpisodesDetails> }) {
        const categories: any = params.categories;
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        let match: any = {
                $match: {
                    date: {
                        $gte: start,
                        $lte: end
                    },
                    cat1: { $in: categories.list }
                }
            };
        if (params.user) {
            match = {
                $match: {
                    date: {
                        $gte: start,
                            $lte: end
                    },
                    user : new Types.ObjectId(params.user),
                    cat1: { $in: categories.list }
                }
            };
        }
        const rows = await EpicEpisode.aggregate(
            [
                match,
                {
                    $sort: {
                      date: 1,
                        cat1: 1
                    }
                }
            ]
        );
        return { result: rows };
    }
}
