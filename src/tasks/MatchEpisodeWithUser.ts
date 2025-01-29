import {Task} from "actionhero";
import {IUser, User} from "../models/user";
import {EpicEpisode} from "../models/epicepisode";

export class MatchEpisodeWithUser extends Task {
    constructor() {
        super();
        this.name = "MatchEpisodeWithUser";
        this.description = "matches indiv episode with indiv user";
        this.frequency = 0;
        this.queue = "epic-episodes";
        this.middleware = [];
    }

    async run(data: IUser) {
        await EpicEpisode.updateMany({
            $or: [
                { responsibleProvName: data.epicProvName },
                { responsibleProvId: data.epicProvId }
            ]
        }, {
            $set: {
                user: data._id
            }
        });
        return { success: true };
    }
}
