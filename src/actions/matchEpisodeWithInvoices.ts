import {Action, api, ParamsFrom, task} from "actionhero";
import {User} from "../models/user";
import {EpicEpisode} from "../models/epicepisode";


export class MatchEpisodeWithInvoices extends Action {
    constructor() {
        super();
        this.name = "matchEpisodeWithInvoices";
        this.description = "populate invoices in episodes";
        this.outputExample = { success: true };
        this.inputs = {
            startDate: {},
            endDate: {}
        }
    }

    async run({ params }: { params: ParamsFrom<MatchEpisodeWithInvoices> }) {
        await task.delQueue('epic-episodes');
        let startDate = params.startDate ? new Date(params.startDate) : new Date();
        let endDate = params.endDate ? new Date(params.endDate) : new Date();
        if (!params.startDate) {
            startDate.setMonth(startDate.getMonth() - 2);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
        } else {
            startDate.setMinutes(startDate.getTimezoneOffset());
        }
        if (params.endDate) {
            endDate.setDate(endDate.getDate() + 1)
            endDate.setMinutes(endDate.getTimezoneOffset());
            endDate.setSeconds(endDate.getSeconds() - 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(1);
            endDate.setHours(0, 0, 0, 0);
            endDate.setSeconds(endDate.getSeconds() - 1);
        }
        if (params.startDate) {
            await EpicEpisode.updateMany({
                date: {$gte: startDate, $lte: endDate}
            }, {$set: {invoices: []}})
            const episodesWDates = await EpicEpisode.find({
                date: {$gte: startDate, $lte: endDate}
            });
            for (const episode of episodesWDates) {
                await task.enqueue('MatchEpisodeWithInvoices', { episode }, 'epic-episodes');
            }
        } else {
            await EpicEpisode.updateMany({}, {$set: {invoices: []}})
            const episodes = await EpicEpisode.find({});
            for (const episode of episodes) {
                await task.enqueue('MatchEpisodeWithInvoices', { episode }, 'epic-episodes');
            }
        }
    }


}
