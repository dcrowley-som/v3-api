import {api, Task} from "actionhero";
import {EpicEpisode, IEpicEpisode} from "../models/epicepisode";


export class ImportEpicEpisode extends Task {
    constructor() {
        super();
        this.name = "ImportEpicEpisode";
        this.description = "imports a single epic episode";
        this.frequency = 0;
        this.queue = "epic-episodes";
        this.middleware = [];
    }

    async run(data: any) {
        const tz = api.helpers.resetDateTZ;
        const obj: IEpicEpisode = {
            user: undefined,
            cat1: data.RptCat_1,
            cat2: data.RptCat_2,
            episodeId: data.AN_EPISODE_ID,
            responsibleProvId: data.AN_RESP_PROV_ID,
            responsibleProvName: data.AN_RESP_PROV_NAME,
            billingService: data.BILLING_SERVICE,
            csn: data.AN_52_ENC_CSN_ID,
            procedure: data.AN_PROC_NAME,
            date: tz(data.AN_DATE),
            day: data.TheDayName,
            anesStart: tz(data.AN_START_DATETIME),
            anesStop: tz(data.AN_STOP_DATETIME),
            surgeryDate: tz(data.SURGERY_DATETIME),
            outORDate: tz(data.OUT_OR_DTTM),
            logId: data.LOG_ID,
            mrn: data.PAT_MRN,
            birthDate: data.BIRTH_DATE,
            age: data.AGE_DOS,
            deptId: data.AN52_DEP_ID,
            locationId: data.AN52_LOC_ID,
            locationName: data.AN52_LOC_NAME,
            orLocation: data.OR_LOC_NAME,
            room: data.OR_ROOM_NAME,
            service: data.OR_SERVICE,
            primaryPhysicianId: data.PRIMARY_PHYSICIAN_ID,
            primaryPhysicianName: data.PRIMARY_PHYSICIAN_NM,
            encounterClosed: data.AN_52_ENC_CLOSED_YN,
            encounterClosedDate: tz(data.AN_52_ENC_CLOSE_DATE),
            anMinutes: data.AN_Minutes,
            inRoomMinutes: data.InRoom_Minutes,
            fiscalYear: data.FiscalYear,
            anMonth: data.AN_MONTH,
            fpiFiscalQ: data.FPI_FiscalQuarter,
            qtr: data['FY24-Q3']
        };
        await EpicEpisode.create(obj);
        return { success: true };
    }
}
