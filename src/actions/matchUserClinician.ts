import {Action, config, log, task} from "actionhero";
import {User} from "../models/user";
import {Clinician} from "../models/clinician";


export class MatchUserClinician extends Action {
    constructor() {
        super();
        this.name = "matchUserClinician";
        this.description = "populate init user with clinician data";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('normal');
        const users = await User.find({
            userType: "Faculty",
            departmentCategory: {$nin: ["Faculty - Research", "Faculty - Volunteer", "Faculty - VA"]},
            npi: {$nin: ["", null]}
        });
        const notFound = [];
        for (let user of users) {
            const clinician = await Clinician.findOne({npi: user.npi});
            if (!clinician) {
                log("NO CLINICIAN FOR", 'notice', user)
                notFound.push(user);
                continue;
            }
            if (!user.epicProvId || user.epicProvId === "") {
                user.epicProvId = clinician.epicProvId;
            }
            if (!user.epicProvName || user.epicProvName === "") {
                user.epicProvName = clinician.epicProvName;
            }
            if (!user.epicUserId || user.epicUserId === "") {
                user.epicUserId = clinician.epicUserId;
            }
            if (!user.epicUserName || user.epicUserName === "") {
                user.epicUserName = clinician.epicUserName;
            }
            if (!user.sfUserCode || user.sfUserCode === "") {
                user.sfUserCode = clinician.sfUserCode;
            }
            if (!user.sfUserId || user.sfUserId === "") {
                user.sfUserId = clinician.sfUserId;
            }
            await user.save();
        }
        return { notFound };
    }


}
