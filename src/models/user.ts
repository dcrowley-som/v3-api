import {Schema, model, Types} from "mongoose";

export interface IUser {
    _id?: any,
    email: string,
    first: string,
    last: string,
    npi: string,
    epicProvId: string,
    epicProvName: string,
    epicUserId: string,
    epicUserName: string,
    sfUserCode: string,
    sfUserId: string,
    sfUserName: string,
    userType: string,
    departmentCategory: string,
    atlasAdminId: string,
    v2UserId: string,
    v2ProfileId: string
}

const schema = new Schema<IUser>({
    email: String,
    first: String,
    last: String,
    npi: String,
    epicProvId: String,
    epicProvName: String,
    epicUserId: String,
    epicUserName: String,
    sfUserCode: String,
    sfUserId: String,
    sfUserName: String,
    userType: String,
    departmentCategory: String,
    atlasAdminId: String,
    v2UserId: String,
    v2ProfileId: String
}, { timestamps: true });

export const User = model<IUser>('User', schema);
