import {Action, task} from "actionhero";
import {User} from "../../models/user";
import {EpicEpisode} from "../../models/epicepisode";


export class MatchEpisodeWithInvoices extends Action {
    constructor() {
        super();
        this.name = "matchEpisodeWithInvoices";
        this.description = "populate invoices in episodes";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('epic-episodes');
        await EpicEpisode.updateMany({}, {$set: {invoices: []}})
        const episodes = await EpicEpisode.find({});
        for (const episode of episodes) {
            await task.enqueue('MatchEpisodeWithInvoices', { episode }, 'epic-episodes');
        }
    }


}
