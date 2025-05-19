import {Action} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";
import {User} from "../../models/user";

export class ReportingEpisodesSelectLists extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesSelectLists";
        this.description = "reportingEpisodesSelectLists";
    }

    async run() {
        const cat1 = await EpicEpisode.distinct('cat1');
        const cat2 = await EpicEpisode.distinct('cat2');
        const providers = await User.find().select('_id first last epicProvId epicProvName')
            .sort({
                last: 1,
                first: 1
            });
        const deptCats = await User.aggregate(
            [
                {
                    $match:
                    /**
                     * query: The query in MQL.
                     */
                        {
                            $or: [
                                {
                                    departmentCategory: {
                                        $regex: "Faculty"
                                    }
                                },
                                {
                                    departmentCategory: {
                                        $regex: "CRNA"
                                    }
                                }
                            ]
                        }
                },
                {
                    $group:
                    /**
                     * _id: The id of the group.
                     * fieldN: The first field name.
                     */
                        {
                            _id: "$departmentCategory",
                            users: {
                                $push: "$_id"
                            }
                        }
                },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                        {
                            _id: 1
                        }
                }
            ]
        )
        return {
            cat1: cat1.sort(),
            providers: providers,
            deptCats: deptCats
        }
    }
}
