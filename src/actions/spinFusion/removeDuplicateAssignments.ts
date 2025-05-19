import {Action, config, log} from "actionhero";
import {SFAssignment} from "../../models/sfassignment";

export class RemoveDuplicateAssignments extends Action {
    constructor() {
        super();
        this.name = "removeDuplicateAssignments";
        this.description = "removeDuplicateAssignments";
        this.outputExample = { success: true };
    }

    async run() {
        const dups = await SFAssignment.aggregate(
            [
                {
                    $group:
                    /**
                     * _id: The id of the group.
                     * fieldN: The first field name.
                     */
                        {
                            _id: {
                                uid: "$uId",
                                aId: "$aId",
                                date: "$date",
                                scheduleId: "$schedule.id"
                            },
                            count: {
                                $sum: 1
                            },
                            rows: {
                                $push: "$$ROOT"
                            }
                        }
                },
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            count: {
                                $gt: 1
                            }
                        }
                },
                {
                    $addFields:
                    /**
                     * newField: The new field name.
                     * expression: The new field expression.
                     */
                        {
                            rows: {
                                $arrayElemAt: ["$rows", 0]
                            }
                        }
                },
                {
                    $replaceRoot:
                    /**
                     * replacementDocument: A document or string.
                     */
                        {
                            newRoot: "$rows"
                        }
                },
                {
                    $project:
                    /**
                     * specifications: The fields to
                     *   include or exclude.
                     */
                        {
                            _id: 1
                        }
                }
            ], { allowDiskUse: true}
        );
        const allIds = dups.map((d: any) => d._id);
        await SFAssignment.deleteMany({
            _id: { $in: allIds }
        });
        return { success: true };
    }
}
