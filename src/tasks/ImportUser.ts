import {Task} from "actionhero";
import {IUser, User} from "../models/user";

export class ImportUser extends Task {
    constructor() {
        super();
        this.name = "ImportUser";
        this.description = "imports a single profile from atlas v2";
        this.frequency = 0;
        this.queue = "normal";
        this.middleware = [];
    }

    getUserType(deptCat: string): string {
        if (deptCat.startsWith('CRNA')) {
            return "CRNA";
        } else if (deptCat.startsWith("Faculty")) {
            return "Faculty";
        } else if (deptCat.startsWith("Rsch")) {
            return "Research";
        } else if (deptCat === "Fellow") {
            return "Fellow";
        } else if (deptCat === "Resident") {
            return "Resident";
        } else {
            return "Staff";
        }
    }

    async run(data: any) {
        const obj: IUser = {
            email: data.email.primary,
            first: data.name.first,
            last: data.name.last,
            npi: data.billing.npi.number.toString(),
            epicProvId: "",
            epicProvName: "",
            epicUserId: "",
            epicUserName: data.administrative.epicUsername,
            sfUserCode: data.relatedSystems.spinFusionId,
            sfUserId: "",
            sfUserName: data.relatedSystems.spinFusionName,
            userType: this.getUserType(data.department.category),
            departmentCategory: data.department.category,
            atlasAdminId: "",
            v2UserId: data.user,
            v2ProfileId: data._id
        };
        await User.create(obj);
        return { success: true };
    }
}
