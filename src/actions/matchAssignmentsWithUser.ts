import {Action, config, log, task} from "actionhero";
import {User} from "../models/user";


export class MatchAssignmentsWithUser extends Action {
    constructor() {
        super();
        this.name = "matchAssignmentsWithUser";
        this.description = "populate user in assignments";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('spin-fusion');
        const users = await User.find({
            userType: { $in: ['Faculty', 'Resident', 'Fellow', 'CRNA']}
        });
        for (const row of users) {
            await task.enqueue('MatchAssignmentWithUser', row, 'spin-fusion');
        }
        return { success: users.length };
    }


}


/*
_id	count
GOETZ, LINDA J.	57
KOERNER, ALBERT KENNEDY	173
D'ANGELO, MATTHEW R.	38
WALTON, LESLIE BLAIRE	243
ZIMMERMAN, LAURA ELIZABETH	1
TELLES-HERNANDEZ, LUIS	22
TAYLOR, PATRICK A.	1
TURNER, GAURI J	332
DOWNEY, MARK PATRICK	1
WARD, KRISTIN ELIZABETH	21
WALLACE, MONICA L.	1
OURSLER, RODGER FRANCIS	1
MARTZ, DOUGLAS G. JR.	133
RENNER, CORINNE YVETTE	19
 */
