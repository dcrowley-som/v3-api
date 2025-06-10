import {Action, task} from "actionhero";
import {AllProvider} from "../../models/allprovider";
import fs from 'fs';
import path from "path";
import csv from "csv-parser";

export class ImportAllProviders extends Action {
    constructor() {
        super();
        this.name = "importAllProviders";
        this.description = "import all providers from csv";
    }

    async run() {
        await task.delQueue('epic-episodes');
        await AllProvider.deleteMany({});
        const p = path.normalize(path.join(__dirname, "..", "..", "..", "imports", 'allproviders.csv'));
        return new Promise((resolve, reject) => {
            fs.createReadStream(p)
                .pipe(csv())
                .on("data", data => {
                    task.enqueue('ImportAllProviderRow', {row: data}, "epic-episodes");
                })
                .on("error", err => {
                    reject(err);
                })
                .on('end', () => resolve(true));
        })
    }
}
