import {Action, task} from "actionhero";
import {AllProvider} from "../../models/allprovider";
import fs from 'fs';
import path from "path";
import csv from "csv-parser";

export class FixAllProviders extends Action {
    constructor() {
        super();
        this.name = "fixAllProviders";
        this.description = "Fix import all providers from csv";
    }

    async run() {
        await task.delQueue('epic-episodes');
        const allProviders = await AllProvider.aggregate([
            {
                $match: {
                    user: null
                }
            },
            {
                $group: {
                    _id: "$anProvId"
                }
            }
        ]);
        for (const provider of allProviders) {
            await task.enqueue('FixAllProviderRow', {row: provider}, 'epic-episodes');
        }
        return { num: allProviders.length}
    }
}
