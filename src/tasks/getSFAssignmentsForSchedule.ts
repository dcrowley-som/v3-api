import {config, log, task, Task} from "actionhero";
import {ISFAssignment, SFAssignment} from "../models/sfassignment";
import axios from "axios";

export class GetSFAssignmentsForSchedule extends Task {
    constructor() {
        super();
        this.name = "GetSFAssignmentsForSchedule";
        this.description = "query SF for assignments in schedule per date range";
        this.frequency = 0;
        this.queue = "spin-fusion";
        this.middleware = [];
    }

    async run(data: any) {
        let url = config.spinFusion.url.getRaw;
        url = url.replace('[SCHEDULE_IDS]', data.schedule.id);
        url = url.replace('[START_DATE]', data.startString);
        url = url.replace('[END_DATE]', data.endString);
        try {
            const response = await axios({
                method: 'get',
                url: config.spinFusion.url.base + url,
                responseType: 'json',
                headers: {
                    Authorization: config.spinFusion.authHeaderPre + config.spinFusion.key
                }
            });
            for (const assignment of response.data.assignments) {
                const toSave: ISFAssignment = assignment;
                toSave.schedule = data.schedule;
                const date = new Date(assignment.date);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                toSave.date = date;
                await task.enqueue('ImportSFAssignment', toSave);
            }
        } catch (error) {
            log('Spin Fusion Assignments Error', 'error', error);
            return;
        }


    }
}
