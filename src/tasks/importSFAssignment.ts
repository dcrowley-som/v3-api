import { Task } from "actionhero";
import {ISFAssignment, SFAssignment} from "../models/sfassignment";

export class ImportSFAssignment extends Task {
    constructor() {
        super();
        this.name = "ImportSFAssignment";
        this.description = "imports sfassignment model from sf feed";
        this.frequency = 0;
        this.queue = "spin-fusion";
        this.middleware = [];
    }

    async run(data: ISFAssignment) {
        return SFAssignment.create(data);
    }
}
