import {Action, api, config, log, ParamsFrom, task} from "actionhero";
import * as sql from "mssql";
import {EpicEpisode} from "../../models/epicepisode";

export class ImportEpicEpisodes extends Action {
    constructor() {
        super();
        this.name = "importEpicEpisodes";
        this.description = "import epic episodes";
        this.outputExample = { success: true };
        this.inputs = {
            startDate: {},
            endDate: {},
            category: {}
        }
    }

    async run({ params }: { params: ParamsFrom<ImportEpicEpisodes> }) {
        if (!config.mssql.enabled) {
            log("MSSQL NOT ENABLED");
            return;
        }
        let startDate = params.startDate ? new Date(params.startDate) : new Date();
        let endDate = params.endDate ? new Date(params.endDate) : new Date();
        let category = params.category ? params.category : "ALL";
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
        const pad = api.helpers.pad;
        const startString = pad(startDate.getMonth() + 1)  + '/' + pad(startDate.getDate()) + '/' + startDate.getFullYear();
        const endString = pad(endDate.getMonth() + 1)  + '/' + pad(endDate.getDate()) + '/' + endDate.getFullYear();
        await EpicEpisode.deleteMany({
            date: {$gte: startDate, $lte: endDate}
        });
        const query = 'EXEC REPORTING.DBO.USP_SSRS_CaseVolume_AN @pStartDate = \'' + startString + '\'' +
            ', @pEndDate = \'' + endString + '\'' +
            ', @pCategory = \'' + category + '\'' +
            ', @pRptType = \'DETAIL\'' +
            ', @pRptByPeriod = ' + null
        const request = new sql.Request();
        request.stream = true;
        request.query(query);
        request.on('row', (row: any) => {
            task.enqueue("ImportEpicEpisode", row, 'epic-episodes')
        });
        request.on('error', err => {
            log('MSSQL STREAM ERROR', 'error', err);
        });
        request.on('done', (result: any) => {
            log('MSSQL DONE', 'info', result);
            return { result: result };
        });
    }
}
