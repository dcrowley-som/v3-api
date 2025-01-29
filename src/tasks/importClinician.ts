import {api, Task} from "actionhero";
import {Clinician, IClinician} from "../models/clinician";


export class ImportClinician extends Task {
    constructor() {
        super();
        this.name = "ImportClinician";
        this.description = "imports a single clinician";
        this.frequency = 0;
        this.queue = "normal";
        this.middleware = [];
    }

    async run(data: any) {
        const obj: IClinician = {
            epicUserId: data.EpicUserID,
            epicProvId: data.EpicProvID,
            epicUserName: data.EpicUserName,
            epicProvName: data.EpicProvName,
            epicProvType: data.EpicProvType,
            mvUserId: data.MVUserID,
            mvFirstName: data.MVFirstName,
            mvLastName: data.MVLastName,
            mvUserType: data.MVUserTypeID,
            npi: data.NPI,
            isUMMC: data.UMMC_YN === 1,
            isMTC: data.MTC_YN === 1,
            isUMROI: data.UMROI_YN === 1,
            isUMCAP: data.UMCAP_YN === 1,
            isSTC: data.STC_YN === 1,
            isPediatrics: data.Pediatrics_YN === 1,
            sfUserCode: data.SF_UserCode,
            sfUserId: data.SF_UserID
        };
        await Clinician.create(obj);
        return { success: true };
    }
}
