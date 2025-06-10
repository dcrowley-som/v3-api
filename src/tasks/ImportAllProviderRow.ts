import {api, Task} from "actionhero";
import {AllProvider, IAllProvider} from "../models/allprovider";
import {User} from "../models/user";


export class ImportAllProviderRow extends Task {
    constructor() {
        super();
        this.name = "ImportAllProviderRow";
        this.description = "imports a row from spreadsheet";
        this.frequency = 0;
        this.queue = "epic-episodes";
        this.middleware = [];
    }

    async run(data: any) {
        const row = data.row;
        const obj: IAllProvider = {
            user: null,
            episodeId: row.AN_EPISODE_ID.toString(),
            anesStart: row.AN_START_DATETIME,
            anesStaffLine: row.ANSTAFF_LINE,
            anProvName: row.AN_PROV_NAME,
            anProvId: row.AN_PROV_ID,
            anProvRole: row.AN_PROV_ROLE,
            anProvRoleC: row.AN_PROV_ROLE_C,
            anesBegin: row.AN_BEGIN_LOCAL_DTTM,
            anesEnd: row.AN_END_LOCAL_DTTM,
            anMinute: row.AN_TOTAL_MINUTES
        };
        const user = await User.findOne({
            epicProvId: obj.anProvId,
        });
        if (user) {
            obj.user = user._id;
        }
        await AllProvider.create(obj);
        return { success: true };
    }
}
