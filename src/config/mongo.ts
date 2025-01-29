import {ActionheroConfigInterface} from "actionhero";

const namespace = "mongo";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
  }
}

export const DEFAULT = {
  [namespace]: (config: ActionheroConfigInterface) => {
    return {
      connection: process.env.MONGO_CONN || "mongodb://localhost:8081/v3atlas"
    }
  }
};
