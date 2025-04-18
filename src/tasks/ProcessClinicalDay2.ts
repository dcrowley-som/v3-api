import {log, Task} from "actionhero";
import {ClinicalDay, IClinicalDay, IConcurrentCase} from "../models/clinicalday";
import {EpisodeMinute} from "../models/episodeMinute";
import {Mongoose, SchemaTypes, Types} from "mongoose";


export class ProcessClinicalDay2 extends Task {
    constructor() {
        super();
        this.name = "ProcessClinicalDay2";
        this.description = "checks concurrency for a singe work day";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }

    private toMinutes = (secs: number): number => {
        return secs / (1000 * 60);
    };

    async run(data: any) {
        const toSave: any[] = [];
        const episodeIds = data.day.episodes.map((e: any) => e.episodeId);
        await EpisodeMinute.deleteMany({
            "episodeId": { $in: episodeIds },
        })
        for (const episode of data.day.episodes) {
            const id = episode.episodeId;
            const start = new Date(episode.anesStart);
            const stop =  new Date(episode.anesStop);
            const startTime = start.getTime();
            const stopTime = stop.getTime();
            const seconds = stopTime - startTime;
            const minutes = this.toMinutes(seconds);
            // console.log(minutes)
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
                    episodeId: id,
                    assignmentDate: aDate,

                })
                // await EpisodeMinute.create({
                //     date: d,
                //     meta: {
                //         episode: id,
                //         assignmentDate: aDate,
                //     }
                // })
            }
        }
        if (toSave.length) {
           await EpisodeMinute.insertMany(toSave);
        }
    }
}

