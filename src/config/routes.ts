import {RoutesConfig} from "actionhero";

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
                {path: "", action: "hello"},
                {path: "/debug/routes", action: "debugRoutes"},
                {path: "/status", action: "status"},
                {path: "/swagger", action: "swagger"},
                {path: "/createChatRoom", action: "createChatRoom"},
                // UTILS
                {path: "/utils/delete/queue", action: "deleteQueue"},
                // User
                {path: "/users/match/clinicians", action: "matchUserClinician"},
                {path: "/users/match/episodes", action: "matchEpisodeWithUser"},
                {path: "/users/match/assignments", action: "matchAssignmentsWithUser"},
                {path: "/users/clinicians/list", action: "usersCliniciansList"},
                // Reporting Episodes
                {path: "/reporting/episodes/select-lists", action: "reportingEpisodesSelectLists"},
                // Assignments
                {path: "reporting/assignments/list", action: "reportingAssignmentsList"},
                {path: "reporting/assignments/limited-list", action: "reportingAssignmentsLimitedList"},
                {path: "/spin-fusion/fix/duplicates", action: "removeDuplicateAssignments"},
                {path: "/spin-fusion/fix/users", action: "fixSFUsers"},
                {path: "spin-fusion/process/concurrencies", action: "processConcurrencies"},

            ],
            post: [
                // Invoices
                {path: "/episodes/invoices/match", action: "matchEpisodeWithInvoices"},
                {path: "/invoices/import", action: "importInvoiceMatches"},
                // Clinical Day
                {path: "clinical-days/process", action: "processClinicalDays"},
                // Spin Fusion
                {path: "/spin-fusion/import", action: "importSpinFusion"},
                {path: "/spin-fusion/import/all", action: "importAllSpinFusion"},
                // Epic Episodes
                {path: "/epic-episodes/import", action: "importEpicEpisodes"},
                // Clinicians
                {path: "/clinicians/import", action: "importClinicians"},
                // Users
                {path: "/users/import", action: "importUsers"},
                // Reporting - Episodes
                {path: "/reporting/episodes/count", action: "reportingEpisodesCount"},
                {path: "/reporting/episodes/overview", action: "reportingEpisodesOverview"},
                {path: "/reporting/episodes/monthly", action: "reportingEpisodesMonthly"},
                {path: "/reporting/episodes/table", action: "reportingEpisodesTable"},
                {path: "/reporting/episodes/provider", action: "reportingEpisodesProvider"},
                {path: "/reporting/episodes/details", action: "reportingEpisodesDetails"},
                // Report assignments
                {path: "/reporting/assignments/overview", action: "reportingAssignmentsOverview"},
                {path: "/reporting/assignments/provider", action: "reportingAssignmentsProvider"},
                {path: "/reporting/assignments/concurrency", action: "reportingConcurrency"},
                {path: "/reporting/assignments/daily-snapshot", action: "reportingAssignmentsDailySnapshot"},
                {path: "/reporting/assignments/calendar", action: "reportingCalendar"},
                {path: "/reporting/assignments/calendar-day", action: "reportingCalendarDay"},
                // reporting invoices
                {path: "/reporting/invoices/unmatched", action: "reportingUnmatched"},
            ]
        };
    },
};
