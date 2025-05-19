import {Action, config, log, task} from "actionhero";
import * as sql from "mssql";
import {Clinician} from "../../models/clinician";


export class ImportClinicians extends Action {
    constructor() {
        super();
        this.name = "importClinicians";
        this.description = "import from clinicians lookup table";
        this.outputExample = { success: true };
    }

    async run() {
        if (!config.mssql.enabled) {
            log("MSSQL NOT ENABLED");
            return;
        }
        await Clinician.deleteMany({});
        try {
            await sql.connect(config.mssql.configuration);
            const result: any = await sql.query('select * from PSC.DBO.ClinicianLookUp');
            if (!result.recordsets || !result.recordsets.length) {
                throw new Error('No Clinicians');
            }
            for (const row of result.recordsets[0]) {
                await task.enqueue("ImportClinician", row, 'normal');
            }
            return { success: true }
        } catch (error) {
            log('MSSQL CLINICIAN ERROR', error);
            return { success: false };
        }




    }
}
