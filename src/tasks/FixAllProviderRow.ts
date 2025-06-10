import {api, Task} from "actionhero";
import {AllProvider, IAllProvider} from "../models/allprovider";
import {User} from "../models/user";
import {Clinician} from "../models/clinician";


export class FixAllProviderRow extends Task {
    constructor() {
        super();
        this.name = "FixAllProviderRow";
        this.description = "FIX imports a row from spreadsheet";
        this.frequency = 0;
        this.queue = "epic-episodes";
        this.middleware = [];
    }

    async run(data: any) {
        const clinician = await Clinician.findOne({
            epicProvId: data.row._id
        });
        if (clinician) {
            const nameArr = clinician.epicProvName.split(", ");
            const user = await User.create({
                first: nameArr[1],
                last: nameArr[0],
                npi: clinician.npi,
                epicProvId: clinician.epicProvId,
                epicProvName: clinician.epicProvName,
                epicUserId: clinician.epicUserId,
                epicUserName: clinician.epicUserName,
                sfUserCode: clinician.sfUserCode,
                sfUserId: clinician.sfUserId,
                userType: clinician.epicProvType
            });
            await AllProvider.updateMany({anProvId: clinician.epicProvId}, {
                $set: {user: user._id}
            })
        }
        return { success: true };
    }
}
