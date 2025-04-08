import {Schema, model, Types} from "mongoose";


export interface IConcurrentCase {
    aEpisodeId: string,
    bEpisodeId: string,
    totalMinutes:  number,
    overlappingMinutes: number,
    firstStart: Date,
    lastStop: Date,
    overlapStart: Date,
    overlapEnd: Date,
    overlapCount: number,
}

export interface IClinicalDay {
    user?: any,
    start?: Date,
    stop?: Date,
    date: Date,
    totalTime?: number,
    concurrentCases: IConcurrentCase[],

}

const schema = new Schema<IClinicalDay>({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    start: Date,
    stop: Date,
    date: Date,
    totalTime: Number,
    concurrentCases: [{
        aEpisodeId: String,
        bEpisodeId: String,
        totalMinutes: Number,
        overlappingMinutes: Number,
        firstStart: Date,
        lastEnd: Date,
        overlapStart: Date,
        overlapEnd: Date,
        overlapCount: Number,
    }]
}, { timestamps: true });

export const ClinicalDay = model<IClinicalDay>('ClinicalDay', schema);
