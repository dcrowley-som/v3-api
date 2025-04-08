import {Task} from "actionhero";
import {InvoiceMatch} from "../models/invoiceMatch";
import {EpicEpisode} from "../models/epicepisode";


export class MatchEpisodeWithInvoices extends Task {
    constructor() {
        super();
        this.name = "MatchEpisodeWithInvoices";
        this.description = "matches indiv episode with invoices";
        this.frequency = 0;
        this.queue = "epic-episodes";
        this.middleware = [];
    }

    async run(data: any) {
        const invoices = await InvoiceMatch.find({episode: data.episode._id, invoiceNumber: {$ne: null}});
        await EpicEpisode.updateOne({
            _id: data.episode._id
        }, {
            $set: {
                invoices: invoices.map((row: any) => {
                    return row._id;
                })
            }
        });
    }
}
