import {Schema, model, Types} from "mongoose";


export interface IEpisodeMinute extends Schema {
    date: Date,
    episodeId: string,
    assignmentDate: Date,
    user: any

}

const schema = new Schema<IEpisodeMinute>({
    episodeId: String,
    assignmentDate: Date,
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    date: Date
});

export const EpisodeMinute = model<IEpisodeMinute>('EpisodeMinute', schema);
