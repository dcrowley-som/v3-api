import { Action } from "actionhero";

export class Hello extends Action {
    constructor() {
        super();
        this.name = "hello";
        this.description = "Say Hello";
        this.outputExample = { hello: 'world' };
    }

    async run() {
        return { hello: 'world' };
    }
}
