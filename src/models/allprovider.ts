import {model, Schema, Types} from "mongoose";

export interface IAllProvider {
    user?: any,
    episodeId: string;
    anesStart: Date,
    anesStaffLine: number,
    anProvName: string,
    anProvId: string,
    anProvRole: string,
    anProvRoleC: string,
    anesBegin: Date,
    anesEnd: Date,
    anMinute: number
}


const schema = new Schema<IAllProvider>({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    episodeId: String,
    anesStart: Date,
    anesStaffLine: Number,
    anProvName: String,
    anProvId: String,
    anProvRole: String,
    anProvRoleC: String,
    anesBegin: Date,
    anesEnd: Date,
    anMinute: Number
}, { timestamps: true });

export const AllProvider = model<IAllProvider>('AllProvider', schema);

