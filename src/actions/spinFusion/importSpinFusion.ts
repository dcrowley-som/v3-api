import {Action, api, config, log, ParamsFrom, task} from "actionhero";
import axios from 'axios';
import {SFAssignment} from "../../models/sfassignment";

export class ImportSpinFusion extends Action {
    constructor() {
        super();
        this.name = "importSpinFusion";
        this.description = "import spin fusion work assignments";
        this.outputExample = { success: true };
        this.inputs = {
            startDate: {},
            endDate: {},
            // increment: {}
        }
    }

    async run({ params }: { params: ParamsFrom<ImportSpinFusion> }) {
        // format dates
        let startDate: Date;
        let endDate: Date;
        if (params.startDate) {
            startDate = new Date(params.startDate);
            startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
        } else {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
        }
        if (params.endDate) {
            endDate = new Date(params.endDate);
            endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
        } else {
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 4);
            endDate.setDate(1);
            endDate.setHours(0, 0, 0, 0);
            endDate.setSeconds(endDate.getSeconds() - 1);
        }
        const pad = api.helpers.pad;
        const startString = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
        const endString = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}`;

        // const nextStart = new Date(startDate);
        // const nextEnd = new Date(startDate);
        // nextStart.setMonth(nextStart.getMonth() + 1);
        // nextEnd.setMonth(nextEnd.getMonth() + 2);
        // nextEnd.setSeconds(nextEnd.getSeconds() - 1);
        // const nextStartString = `${nextStart.getFullYear()}-${pad(nextStart.getMonth() + 1)}-${pad(nextStart.getDate())}`;
        // const nextEndString = `${nextEnd.getFullYear()}-${pad(nextEnd.getMonth() + 1)}-${pad(nextEnd.getDate())}`;
        // let toIncrement = params.increment === 'yes';
        // if (toIncrement) {
        //     const finalDate = new Date(2025, 5, 30);
        //     if (endDate.getTime() < finalDate.getTime()) {
        //         toIncrement = false;
        //     }
        // }

        // Delete current records in date range
        await SFAssignment.deleteMany({
            startDate: {$gte: startDate},
            endDate: {$lte: endDate}
        });
        // Delete MSSQL records
        // Not yet
        // get list of schedules
        try {
            const response = await axios({
                method: 'get',
                url: config.spinFusion.url.base + config.spinFusion.url.listSchedules,
                responseType: 'json',
                headers: {
                    Authorization: config.spinFusion.authHeaderPre + config.spinFusion.key
                }
            });
            for (const schedule of response.data.schedules) {
                await task.enqueue('GetSFAssignmentsForSchedule', { startString, endString, schedule }, 'spin-fusion');
                // if (toIncrement) {
                //     await task.enqueueIn((15 * 60 * 1000), 'importSFAssignment', {startString: nextStartString, endString: nextEndString, schedule}, 'spin-fusion');
                // }
            }
        } catch (error) {
            log('Spin Fusion Lis Error', 'error', error);
            return error
        }


    }
}
