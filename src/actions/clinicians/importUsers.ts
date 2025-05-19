import {Action, config, log, task} from "actionhero";
import {User} from "../../models/user";
import axios from "axios";


export class ImportUsers extends Action {
    constructor() {
        super();
        this.name = "importUsers";
        this.description = "import from user from atlas v2 profiles";
        this.outputExample = { success: true };
    }

    async run() {
        await task.delQueue('normal');
        await User.deleteMany({});
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        try {
            // @ts-ignore
            const response = await fetch("http://172.16.145.110:8080/api/export/profiles", requestOptions)
            const data: any = await response.json();
            for (const row of data.results) {
                task.enqueue('ImportUser', row, 'normal');
            }
        } catch (error) {
            log('ATLAS v2 Profiles Error', error);
            return { success: false };
        }

    }


}
