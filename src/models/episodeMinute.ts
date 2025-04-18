import {Schema, model, Types} from "mongoose";


export interface IEpisodeMinute extends Schema {
    date: Date,
    episodeId: string,
    assignmentDate: Date

}

const schema = new Schema<IEpisodeMinute>({
    episodeId: String,
    assignmentDate: Date,
    date: Date
}, { timestamps: true });

export const EpisodeMinute = model<IEpisodeMinute>('EpisodeMinute', schema);
