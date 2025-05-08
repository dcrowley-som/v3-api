import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../models/epicepisode";
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
        const cats: any = params.categoriess;
        const categories: any[] | undefined = cats && cats.list && cats.list.length > 0 ? cats.list : undefined;
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        let match: any = {
            $match: {
                    date: {
                        $gte: start,
                        $lte: end
                    },
                }
            };
        if (categories) {
            match.$match.cat1 = {$in: categories};
        }
        if (params.user) {
            match.$match.user = new Types.ObjectId(params.user);
        }
        console.log(match)
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
