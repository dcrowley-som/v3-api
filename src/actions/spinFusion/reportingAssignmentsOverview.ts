import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../../models/sfassignment";

export class ReportingAssignmentsOverview extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsOverview";
        this.description = "reportingAssignmentsOverview";
        this.inputs = {
            start: { required: false},
            end: { required: false}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingAssignmentsOverview> }) {
        const start = new Date(params.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(params.end);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        end.setSeconds(end.getSeconds() - 1);
        const rows = await SFAssignment.aggregate([
            {
                $match:
                /**
                 * query: The query in MQL.
                 */
                    {
                        date: {
                            $gte: new Date(start),
                            $lte: new Date(end),
                        },
                        "schedule.name": { $in: api.assignments.useScheduleNames.names }
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
                            lName: "$lName",
                            fName: "$fName"
                        },
                        assignments: {
                            $push: "$$ROOT"
                        }
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
                            date: "$_id.date",
                            schedule: "$_id.schedule"
                        },
                        users: {
                            $push: "$$ROOT"
                        }
                    }
            },
            {
                $group: {
                    _id: {
                        date: "$_id.date"
                    },
                    schedules: {
                        $push: "$$ROOT"
                    }
                }
            }, {
                $sort: {
                    "_id.date": 1
                }
            }
        ]);
        return { result: rows}
    }
}
