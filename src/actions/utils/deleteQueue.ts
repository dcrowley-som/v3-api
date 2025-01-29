import {Action, ParamsFrom, task} from "actionhero";

export class DeleteQueue extends Action {
    constructor() {
        super();
        this.name = "deleteQueue";
        this.description = "Deletes a task queue";
        this.outputExample = { hello: 'world' };
        this.inputs = {
            name: { required: true },
        }
    }

    async run({ params }: { params: ParamsFrom<DeleteQueue> }) {
        await task.delQueue(params.name);
        return { deleted: params.name }
    }
}
