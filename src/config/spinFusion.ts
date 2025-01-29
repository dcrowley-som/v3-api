import {ActionheroConfigInterface} from "actionhero";

const namespace = "spinFusion";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
  }
}

export const DEFAULT = {
  [namespace]: (config: ActionheroConfigInterface) => {
    return {
      systemId: 33,
      authHeaderPre: 'Basic ',
      // key: 'OTM3MDc6MDFlY2RkY2YyMjhlNGI4ZGJhNTU0ZDM5YjMyNjM4NWY=',
      key: 'NDgyNTUxOjJkMTZhYTI0ODkxZTQ1OTU5NTkwYjUyOTQ0ODc2ZjE0',
      url: {
        base: 'https://www.spinfusion.com/SpinSchedulev2.0/api/',
        listSchedules: 'Users/get/schedulesForSystem?systemId=33',
        getRaw: 'API_Schedules/get/assignments/bySchedule?scheduleIds=[SCHEDULE_IDS]&startDate=[START_DATE]&endDate=[END_DATE]'
        // schedule Ids = 123,124,156
        // start and end date = 2019-02-05
      }
    }
  }
};
