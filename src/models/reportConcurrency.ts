import {Schema, model, Types} from "mongoose";


export interface IReportConcurrencyItem {
    count: number,
    date: Date,
    countSevenToFour: number,
    hasOne: number,
    hasTwo: number,
    hasThree: number,
    hasFour: number,
    overFour: number,
    year: number,
    month: number,
    day: number,
    user: string,
    assignments: string[],
    userId: any,
    baseUnits: number,
    timeUnits: number,
    totalUnits: number,
    first: Date,
    last: Date
}

const schema = new Schema<IReportConcurrencyItem>({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    count: Number,
    countSevenToFour: Number,
    date: Date,
    hasOne: Number,
    hasTwo: Number,
    hasThree: Number,
    hasFour: Number,
    overFour: Number,
    year: Number,
    month: Number,
    day: Number,
    baseUnits: Number,
    timeUnits: Number,
    totalUnits: Number,
    user: String,
    assignments: [String],
    first: Date,
    last: Date
}, { timestamps: true });

export const ReportConcurrency = model<IReportConcurrencyItem>('ReportConcurrency', schema);
