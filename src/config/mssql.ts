import {ActionheroConfigInterface} from "actionhero";

const namespace = "mssql";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
  }
}

export const DEFAULT = {
  [namespace]: (config: ActionheroConfigInterface) => {
    return {
      enabled: false,
      configuration: {
        user: 'atlas',
        password: '^8X3#xGAzZ~n:qM]',
        server: 'anes-sql-srv-1.som.umaryland.edu',
        database: 'PSC',
        requestTimeout: 120000,
        options: {
          encrypt: true, // Use this if you're on Windows Azure
          trustServerCertificate: true
        }
      }
    }
  }
};

export const production = {
  [namespace]: () => {
    return {
      enabled:  process.env.ENABLE_MSSQL === 'yes',
    };
  },
};
