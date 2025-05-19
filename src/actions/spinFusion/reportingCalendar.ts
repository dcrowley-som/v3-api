import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../../models/sfassignment";


export class ReportingCalendar extends Action {
    constructor() {
        super();
        this.name = "reportingCalendar";
        this.description = "reportingCalendar";
        this.inputs = {
            start: { required: false},
            end: { required: false},
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingCalendar> }) {

        const schedules = api.assignments.useScheduleNames.names;
        const start = new Date(params.start);
        const end = new Date(params.end);
        const result = await SFAssignment.aggregate([

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
                                schedule: "$schedule.name",
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
            // {
            //     $project: {
            //         _id: 0,
            //         title: {
            //             $concat: [
            //                 "$_id.aName",
            //                 " - ",
            //                 {$toString: {$size: "$assignments"}}
            //             ]
            //         },
            //         start: "$_id.date",
            //         extendedProps: {
            //             assignments: "$assignments"
            //         }
            //     }
            // },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    aName: "$_id.aName",
                    schedule: "$_id.schedule",
                    assignments: 1
                }
            },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                        {
                            date: 1,
                            schedule: 1,
                            aName: 1
                        }
                }
        ])
        return { result }
    }
}
