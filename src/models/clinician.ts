import {Schema, model, Types} from "mongoose";

export interface IClinician {
    epicUserId: string,
    epicProvId: string,
    epicUserName: string,
    epicProvName: string,
    epicProvType: string,
    mvUserId: string,
    mvFirstName: string,
    mvLastName: string,
    mvUserType: number,
    npi: string,
    isUMMC: boolean,
    isMTC: boolean,
    isUMROI: boolean,
    isUMCAP: boolean,
    isSTC: boolean,
    isPediatrics: boolean,
    sfUserCode: string,
    sfUserId: string
}

const schema = new Schema<IClinician>({
    epicUserId: String,
    epicProvId: String,
    epicUserName: String,
    epicProvName: String,
    epicProvType: String,
    mvUserId: String,
    mvFirstName: String,
    mvLastName: String,
    mvUserType: String,
    npi: String,
    isUMMC: {
        type: Boolean,
        default: false
    },
    isMTC: {
        type: Boolean,
        default: false
    },
    isUMROI: {
        type: Boolean,
        default: false
    },
    isUMCAP: {
        type: Boolean,
        default: false
    },
    isSTC: {
        type: Boolean,
        default: false
    },
    isPediatrics: {
        type: Boolean,
        default: false
    },
    sfUserCode: String,
    sfUserId: String
}, { timestamps: true });

export const Clinician = model<IClinician>('Clinician', schema);
