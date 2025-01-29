import {Schema, model, Types} from "mongoose";

export interface ISFAssignment {
    user: any,
    date: Date,
    lName: string,
    uId: string,
    uCode: string,
    fName: string,
    aName: string,
    aId: string,
    schedule: {
        name: string,
        id: number
    }
}

const schema = new Schema<ISFAssignment>({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    date: Date,
    lName: String,
    uId: String,
    uCode: String,
    fName: String,
    aName: String,
    aId: String,
    schedule: {
        name: String,
        id: Number
    }
}, { timestamps: true });

export const SFAssignment = model<ISFAssignment>('SFAssignment', schema);
