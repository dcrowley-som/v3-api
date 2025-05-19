import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../../models/sfassignment";


export class ReportingCalendarDay extends Action {
    constructor() {
        super();
        this.name = "reportingCalendarDay";
        this.description = "reportingCalendarDay";
        this.inputs = {
            date: { required: false}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingCalendarDay> }) {

        const schedules = api.assignments.useScheduleNames.names;
        const date = new Date(params.date);
        const result = await SFAssignment.aggregate([

                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            date: date,
                            "schedule.name": {$in: schedules}
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
                                aName: "$aName",
                                date: "$date"
                            },
                            assignments: {
                                $push: "$$ROOT"
                            }
                        }
                },
                // {
                //     $group:
                //     /**
                //      * _id: The id of the group.
                //      * fieldN: The first field name.
                //      */
                //         {
                //             _id: "$_id.date",
                //             assignments: {
                //                 $push: {
                //                     aName: "$_id.aName",
                //                     assignments: "$assignments"
                //                 }
                //             }
                //         }
                // },
            {
                $project: {
                    _id: 0,
                    title: {
                        $concat: [
                            "$_id.aName",
                            " - ",
                            {$toString: {$size: "$assignments"}}
                        ]
                    },
                    start: "$_id.date",
                    extendedProps: {
                        assignments: "$assignments"
                    }
                }
            },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                        {
                            start: 1,
                            title: 1
                        }
                }
        ])
        return { result }
    }
}
