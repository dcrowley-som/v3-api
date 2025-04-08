import {log, Task} from "actionhero";
import {ClinicalDay, IClinicalDay, IConcurrentCase} from "../models/clinicalday";
import {EpisodeMinute} from "../models/episodeMinute";


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
                d.setMinutes(d.getMinutes() + i);
                toSave.push({
                    episode: id,
                    date: d
                })
            }
        }
        if (toSave.length) {
            await EpisodeMinute.insertMany(toSave);
        }
    }
}

