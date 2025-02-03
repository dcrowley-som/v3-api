import {Action, log, task} from "actionhero";
import {User} from "../../models/user";


export class UsersCliniciansList extends Action {
    constructor() {
        super();
        this.name = "usersCliniciansList";
        this.description = "usersCliniciansList";
        this.outputExample = { success: true };
    }

    async run() {
        const users =  await User.find({
            userType: { $in: ['Faculty', 'CRNA', 'Resident', 'Fellow']}
        })
            .select('_id epicProvName epicProvId first last')
            .sort({
                last: 1,
                first: 1
            })
        return { result: users }
    }


}
