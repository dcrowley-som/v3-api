import { RoutesConfig } from "actionhero";

const namespace = "routes";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
  }
}

export const DEFAULT: { [namespace]: () => RoutesConfig } = {
  [namespace]: () => {
    return {
      get: [
        { path: "", action: "hello" },
        { path: "/status", action: "status" },
        { path: "/swagger", action: "swagger" },
        { path: "/createChatRoom", action: "createChatRoom" },
          // UTILS
        { path: '/utils/delete/queue', action: "deleteQueue" },
          // User
        { path: "/users/match/clinicians", action: "matchUserClinician" },
        { path: "/users/match/episodes", action: "matchEpisodeWithUser" },
        { path: "/users/match/assignments", action: "matchAssignmentsWithUser" },
        { path: "/users/clinicians/list", action: "usersCliniciansList"},
        // Reporting Episodes
        { path: "/reporting/episodes/select-lists", action: "reportingEpisodesSelectLists" },
          // Assignments
        {path: 'reporting/assignments/list', action: "reportingAssignmentsList"},
        {path: '/spin-fusion/fix/duplicates', action: "removeDuplicateAssignments"},
        {path: '/spin-fusion/fix/users', action: "fixSFUsers"},
        {path: 'spin-fusion/process/concurrencies', action: "processConcurrencies"},
        // invoices
        { path: '/episodes/invoices/match', action: "matchEpisodeWithInvoices" },
      ],
      post: [
        // Invoices
        { path: '/invoices/import', action: 'importInvoiceMatches' },
          // Clinical Day
        { path: "clinical-days/process", action: "processClinicalDays" },
          // Spin Fusion
          { path: "/spin-fusion/import", action: "importSpinFusion" },
          { path: "/spin-fusion/import/all", action: "importAllSpinFusion" },
          // Epic Episodes
        { path: "/epic-episodes/import", action: "importEpicEpisodes" },
          // Clinicians
        { path: "/clinicians/import", action: "importClinicians" },
          // Users
        { path: "/users/import", action: "importUsers" },
          // Reporting - Episodes
        { path: '/reporting/episodes/overview', action: "reportingEpisodesOverview" },
        { path: '/reporting/episodes/monthly', action: "reportingEpisodesMonthly" },
        { path: '/reporting/episodes/table', action: "reportingEpisodesTable" },
        { path: '/reporting/episodes/provider', action: "reportingEpisodesProvider" },
        { path: '/reporting/episodes/details', action: "reportingEpisodesDetails" },
          // Report assignments
        { path: '/reporting/assignments/overview', action: "reportingAssignmentsOverview" },
        { path: '/reporting/assignments/provider', action: "reportingAssignmentsProvider" },
        { path: '/reporting/assignments/concurrency', action: "reportingConcurrency" },
          // reporting invoices
        { path: '/reporting/invoices/unmatched', action: "reportingUnmatched" },
      ],

      /* ---------------------
      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: https://www.actionherojs.com/tutorials/web-server#Routes

      examples:

      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      ]

      ---------------------- */
    };
  },
};
