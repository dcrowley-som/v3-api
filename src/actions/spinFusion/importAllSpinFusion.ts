import {Action, config, log, ParamsFrom, task} from "actionhero";
import axios from 'axios';
import {SFAssignment} from "../../models/sfassignment";

export class ImportAllSpinFusion extends Action {
    constructor() {
        super();
        this.name = "importAllSpinFusion";
        this.description = "import all spin fusion work assignments";
        this.outputExample = { success: true };
    }

    async run() {
        const delay = 2 * 60 * 1000;
        // Delete current records in date range
        await SFAssignment.deleteMany({});
        // await SFAssignment.deleteMany();
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
                await task.enqueue('GetSFAssignmentsForSchedule', { startString: '2024-07-01', endString: '2024-07-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay,'GetSFAssignmentsForSchedule', { startString: '2024-08-01', endString: '2024-08-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 2,'GetSFAssignmentsForSchedule', { startString: '2024-09-01', endString: '2024-09-30', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 3,'GetSFAssignmentsForSchedule', { startString: '2024-10-31', endString: '2024-10-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 3,'GetSFAssignmentsForSchedule', { startString: '2024-10-01', endString: '2024-10-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 4,'GetSFAssignmentsForSchedule', { startString: '2024-11-01', endString: '2024-11-30', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 5,'GetSFAssignmentsForSchedule', { startString: '2024-12-01', endString: '2024-12-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 6,'GetSFAssignmentsForSchedule', { startString: '2025-01-01', endString: '2025-01-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 7,'GetSFAssignmentsForSchedule', { startString: '2025-02-01', endString: '2025-02-28', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 8,'GetSFAssignmentsForSchedule', { startString: '2025-03-01', endString: '2024-05-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 9,'GetSFAssignmentsForSchedule', { startString: '2025-04-01', endString: '2025-04-30', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 10,'GetSFAssignmentsForSchedule', { startString: '2025-05-01', endString: '2025-05-31', schedule }, 'spin-fusion');
                await task.enqueueIn(delay * 11,'GetSFAssignmentsForSchedule', { startString: '2025-06-01', endString: '2025-06-30', schedule }, 'spin-fusion');
            }
        } catch (error) {
            log('Spin Fusion List Error', 'error', error);
            return error
        }


    }
}
