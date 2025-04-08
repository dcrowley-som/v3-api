import {log, Task} from "actionhero";
import {ClinicalDay, IClinicalDay, IConcurrentCase} from "../models/clinicalday";


export class ProcessClinicalDay extends Task {
    constructor() {
        super();
        this.name = "ProcessClinicalDay";
        this.description = "checks concurrency for a singe work day";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }

    private toMinutes = (secs: number): number => {
        return secs / (1000 * 60);
    };

    async run(data: any) {
        const clinicalDay: IClinicalDay = {
            date: new Date( new Date(data.startDate).getFullYear(), data.day._id.month - 1, data.day._id.day),
            concurrentCases: [],
            user: data.user._id
        }
        const allStarts: number[] = [];
        const allStops: number[] = [];
        const episodes: any[] = [];
        for (const episode of data.day.episodes) {
            const ep: any = {
                start: new Date(episode.anesStart).getTime(),
                stop: new Date(episode.anesStop).getTime(),
                id: episode.episodeId
            }
            episodes.push(ep);
            allStarts.push(ep.start);
            allStops.push(ep.stop);
        }
        const firstStart = Math.min(...allStarts);
        const lastStop = Math.max(...allStops);
        // const lastStart = Math.max(...allStarts);
        // const firstStop = Math.min(...allStops);
        clinicalDay.start = new Date(firstStart);
        clinicalDay.stop = new Date(lastStop);
        clinicalDay.totalTime = lastStop - firstStart;
        for (let i = 0; i < episodes.length; i++) {
            for (let x = i + 1; x < episodes.length; x++) {
                const a = episodes[i];
                const b = episodes[x];
                const foundInConc = clinicalDay.concurrentCases.find((item: any) => {
                    return item.aEpisodeId === a.id && item.bEpisodeId === b.id;
                });
                if (foundInConc) {
                    foundInConc.overlapCount = foundInConc.overlapCount + 1;
                    continue;
                }
                const maxStart = Math.max(a.start, b.start);
                const minStop = Math.min(a.stop, b.stop);
                const minStart = Math.min(a.start, b.start);
                const maxStop = Math.max(a.stop, b.stop);
                const isOverlapped = minStop - maxStart;
                if (isOverlapped > 0) {
                    const concCase: IConcurrentCase = {
                      aEpisodeId: a.id,
                      bEpisodeId: b.id,
                      totalMinutes: this.toMinutes((maxStop - minStart)),
                        overlappingMinutes: this.toMinutes(isOverlapped),
                        firstStart: new Date(minStart),
                        lastStop: new Date(maxStop),
                        overlapStart: new Date(maxStart),
                        overlapEnd: new Date(minStop),
                        overlapCount: 0
                    };
                    clinicalDay.concurrentCases.push(concCase);
                }
            }
        }
        await ClinicalDay.updateOne({
            date: clinicalDay.date,
            user: clinicalDay.user
        }, clinicalDay, {
            upsert: true
        });
    }
}

