import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../../../models/sfassignment";
import {Types} from "mongoose";
import scheduleNames from "../../../../use_schedule_names.json";

export class ReportingAssignmentsProvider extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsProvider";
        this.description = "reportingAssignmentsProvider";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            last: { required: false},
            first: { required: false},
            user: { required: false},
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingAssignmentsProvider> }) {
        let user: string | undefined;
        if (params.last && params.first) {
            const ass1 = await SFAssignment.findOne({
                lName: params.last,
                fName: params.first,
                user: { $exists: true }
            });
            user = ass1.user.toString();
        }
        if (params.user) {
            user = params.user;
        }
        if (user === undefined) {
            throw new Error('No User');
        }
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        const rows = await SFAssignment.aggregate([
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
                        user: new Types.ObjectId(user),
                        "schedule.name": {$in: scheduleNames.names},
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
                            date: "$date",
                            schedule: "$schedule",
                            user: "$user"
                        },
                        assignments: {
                            $push: "$$ROOT"
                        }
                    }
            },
            {
                $sort:
                /**
                 * Provide any number of field/order pairs.
                 */
                    {
                        "_id.schedule": 1
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
                            user: "$_id.user",
                            date: "$_id.date"
                        },
                        schedules: {
                            $push: {
                                schedule: "$_id.schedule",
                                assignments: "$assignments"
                            }
                        }
                    }
            },
            // {
            //     $lookup:
            //     /**
            //      * from: The target collection.
            //      * localField: The local join field.
            //      * foreignField: The target join field.
            //      * as: The name for the results.
            //      * pipeline: Optional pipeline to run on the foreign collection.
            //      * let: Optional variables to use in the pipeline field stages.
            //      */
            //         {
            //             from: "epicepisodes",
            //             localField: "$id.user",
            //             foreignField: "user",
            //             as: "episodes",
            //             let: {
            //                 date: "$_id.date"
            //             },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         $expr: {
            //                             $eq: ["$date", "$$date"]
            //                         }
            //                     }
            //                 }
            //             ]
            //         }
            // },
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
                        localField: "_id.date",
                        foreignField: "date",
                        as: "episodes",
                        let: {
                            user: "$_id.user"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$user", "$$user"]
                                    }
                                }
                            }
                        ]
                    }
            },
            {
                $sort:
                /**
                 * Provide any number of field/order pairs.
                 */
                    {
                        "_id.date": 1
                    }
            }
        ]);
        return { result: rows}
    }
}
