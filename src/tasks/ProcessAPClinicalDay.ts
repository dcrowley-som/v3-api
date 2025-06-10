import {log, Task} from "actionhero";
import {ClinicalDay, IClinicalDay, IConcurrentCase} from "../models/clinicalday";
import {EpisodeMinute} from "../models/episodeMinute";
import {Mongoose, SchemaTypes, Types} from "mongoose";
import {AllProvider} from "../models/allprovider";


export class ProcessAPClinicalDay extends Task {
    constructor() {
        super();
        this.name = "ProcessAPClinicalDay";
        this.description = "AP checks concurrency for a singe work day";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }

    private toMinutes = (secs: number): number => {
        return secs / (1000 * 60);
    };

    async run(data: any) {
        const toSave: any[] = [];
        await EpisodeMinute.deleteMany({
            "episodeId": data.episode.episodeId,
        });
        const episode = data.episode;
        const allProviders = await AllProvider.find({episodeId: episode.episodeId, user: {$ne: null }});
        if (!allProviders.length) {
            return;
        }
        for (const provider of allProviders) {
            const start = new Date(provider.anesBegin);
            const stop =  new Date(provider.anesEnd);
            const startTime = start.getTime();
            const stopTime = stop.getTime();
            const seconds = stopTime - startTime;
            const minutes = this.toMinutes(seconds);
            for (let i = 0; i < minutes; i++) {
                const d = new Date(start);
                const aDate = new Date(d);
                aDate.setHours(0, 0, 0, 0);
                if (start.getHours() < 6) {
                    aDate.setDate(aDate.getDate() - 1);
                }
                d.setMinutes(d.getMinutes() + i);
                toSave.push({
                    date: new Date(d),
                    episodeId: episode.episodeId,
                    assignmentDate: aDate,
                    user: provider.user
                })
            }
        }
        if (toSave.length) {
           await EpisodeMinute.insertMany(toSave);
        }
    }
}

