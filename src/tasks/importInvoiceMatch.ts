import {api, Task} from "actionhero";
import {EpicEpisode} from "../models/epicepisode";
import {InvoiceMatch} from "../models/invoiceMatch";



export class ImportInvoiceMatch extends Task {
    constructor() {
        super();
        this.name = "ImportInvoiceMatch";
        this.description = "imports a single invoice";
        this.frequency = 0;
        this.queue = "after-episode";
        this.middleware = [];
    }

    async run(data: any) {
        const tz = api.helpers.resetDateTZ;
        const episode: any = await EpicEpisode.findOne({ episodeId: data.AN_EPISODE_ID.toString() });
        const obj = {
            episode: episode ? episode._id : null,
            episodeId: data.AN_EPISODE_ID,
            invoiceNumber: data.InvoiceNumber,
            origFSCName: data.OrigFSCName,
            transactionNumber: data.TransactionNumber,
            workRVU: data.WorkRVU,
            pervu: data.PERVU,
            malpractiveRVU: data.MalpractiveRVU,
            totalRVU: data.TotalRVU,
            unitsSAActual: data.UnitsSAActual,
            unitsSAModified: data.UnitsSAModified,
            unitsBase: data.UnitsBase,
            unitsDur: data.UnitsDur,
            unitsTime: data.UnitsTime,
            unitsTotal: data.UnitsTotal,
            unitsAdditional: data.UnitsAdditional,
            baseChargeAmount: data.BaseChargeAmount,
            baseWorkRVU: data.BaseWorkRVU,
            basePEFacRVU: data.BasePEFacRVU,
            basePENFRVU: data.BasePENFRVU,
            baseMalpracticeRVU: data.BaseMalpracticeRVU,
            charges: data.Charges,
            transactionAmount: data.TransactionAmounts,
            totalInvoiceCharges: data.TotalInvoiceCharges,
            sumPayments: data.SumPayments
        }
        await InvoiceMatch.create(obj);
        return { success: true };
    }
}
