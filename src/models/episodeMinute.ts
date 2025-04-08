import {Schema, model, Types} from "mongoose";


export interface IEpisodeMinute extends Schema {
    episode: string,
    date: Date
}

const schema = new Schema<IEpisodeMinute>({
    episode: String,
    date: Date,
}, { timestamps: true });

export const EpisodeMinute = model<IEpisodeMinute>('EpisodeMinute', schema);
