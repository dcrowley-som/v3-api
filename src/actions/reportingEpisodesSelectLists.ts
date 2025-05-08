import {Action} from "actionhero";
import {EpicEpisode} from "../models/epicepisode";
import {User} from "../models/user";

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
            })
        return {
            cat1: cat1.sort(),
            providers: providers
        }
    }
}
