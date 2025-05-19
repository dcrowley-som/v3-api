import {Action, api, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";

export class ReportingUnmatched extends Action {
    constructor() {
        super();
        this.name = "reportingUnmatched";
        this.description = "reportingUnmatched";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingUnmatched> }) {
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
        const rows = await EpicEpisode.aggregate(
            [
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            date: {
                                $gte: start,
                                $lte: end
                            },
                            invoices: {
                                $size: 0
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
        return { result: rows };
    }
}
