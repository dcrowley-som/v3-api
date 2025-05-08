import {Action, api} from "actionhero";

export class Hello extends Action {
    constructor() {
        super();
        this.name = "hello";
        this.description = "Say Hello";
    }

    async run() {
        return { hello: 'world' };
    }
}

export class DebugRoutes extends Action {
    constructor() {
        super();
        this.name = "debugRoutes";
        this.description = "Debug Routes";
    }

    async run() {
        return {
            routes: api.routes,
            actions: api.actions
        }
    }
}
