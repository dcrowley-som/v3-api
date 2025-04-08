import {model, Schema, Types} from "mongoose";

export interface IInvoiceMatch {
    episode?: any,
    episodeId: string,
    invoiceNumber: number,
    origFSCName: string,
    transactionNumber: number,
    workRVU: number,
    pervu: number,
    malpractiveRVU: number,
    totalRVU: number,
    unitsSAActual: number,
    unitsSAModified: number,
    unitsBase: number,
    unitsDur: string,
    unitsTime: number,
    unitsTotal: number,
    unitsAdditional: number,
    baseChargeAmount: number,
    baseWorkRVU: number,
    basePEFacRVU: number,
    basePENFRVU: number,
    baseMalpracticeRVU: number,
    charges: number,
    transactionAmount: number,
    totalInvoiceCharges: number,
    sumPayments: number,
}

const schema = new Schema<IInvoiceMatch>({
    episode: {
        type: Types.ObjectId,
        ref: 'EpicEpisode',
    },
    episodeId: String,
    invoiceNumber: Number,
    origFSCName: String,
    transactionNumber: Number,
    workRVU: Number,
    pervu: Number,
    malpractiveRVU: Number,
    totalRVU: Number,
    unitsSAActual: Number,
    unitsSAModified: Number,
    unitsBase: Number,
    unitsDur: String,
    unitsTime: Number,
    unitsTotal: Number,
    unitsAdditional: Number,
    baseChargeAmount: Number,
    baseWorkRVU: Number,
    basePEFacRVU: Number,
    basePENFRVU: Number,
    baseMalpracticeRVU: Number,
    charges: Number,
    transactionAmount: Number,
    totalInvoiceCharges: Number,
    sumPayments: Number,
});

export const InvoiceMatch = model<IInvoiceMatch>('InvoiceMatch', schema);
