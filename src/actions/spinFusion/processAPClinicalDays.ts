import {Action, task} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";


export class ProcessAPClinicalDays extends Action {
    constructor() {
        super();
        this.name = "processAPClinicalDays";
        this.description = "AP find records without clinical days and process";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('after-episode');
        const startDate = new Date(2023, 0, 0, 0, 0, 0, 0);
        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() - 1);
        const episodes = await EpicEpisode.find({
            date: { $gte: startDate, $lte: endDate }
        })
        for (const episode of episodes) {
            await task.enqueue('ProcessAPClinicalDay', { episode }, 'after-episode');
        }
    }
}
