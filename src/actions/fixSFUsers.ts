import {Action, config, log} from "actionhero";
import {SFAssignment} from "../models/sfassignment";
import {User} from "../models/user";

export class FixSFUsers extends Action {
    constructor() {
        super();
        this.name = "fixSFUsers";
        this.description = "fixSFUsers";
        this.outputExample = { success: true };
    }

    async run() {
        const fixes = [{
            "_id": {
                "lName": "Abraham",
                "fName": "Hellen",
                "uCode": "abrh",
                "uId": "697199"
            },
            "count": 128
        },
            {
                "_id": {
                    "lName": "Scott",
                    "fName": "Christopher",
                    "uCode": "scoc",
                    "uId": "22817"
                },
                "count": 165
            },
            {
                "_id": {
                    "lName": "Martz",
                    "fName": "Douglas",
                    "uCode": "MARD",
                    "uId": "2966"
                },
                "count": 419
            },
            {
                "_id": {
                    "lName": "Moore",
                    "fName": "Cynthia",
                    "uCode": "mooc",
                    "uId": "686271"
                },
                "count": 51
            },
            {
                "_id": {
                    "lName": "Muntuerto",
                    "fName": "Anne Marie",
                    "uCode": "muna",
                    "uId": "17126"
                },
                "count": 2
            },
            {
                "_id": {
                    "lName": "Colbert",
                    "fName": "Phyllis",
                    "uCode": "colc",
                    "uId": "2914"
                },
                "count": 472
            },
            {
                "_id": {
                    "lName": "Renner",
                    "fName": "Corinne",
                    "uCode": "Renner",
                    "uId": "685218"
                },
                "count": 437
            },
            {
                "_id": {
                    "lName": "Diaz",
                    "fName": "Magdaline",
                    "uCode": "diazm",
                    "uId": "692715"
                },
                "count": 222
            },
            {
                "_id": {
                    "lName": "Koerner",
                    "fName": "Ken",
                    "uCode": "KOEK",
                    "uId": "22451"
                },
                "count": 37
            },
            {
                "_id": {
                    "lName": "Nigatu",
                    "fName": "Zuriashwork",
                    "uCode": "nigz",
                    "uId": "682142"
                },
                "count": 55
            },
            {
                "_id": {
                    "lName": "Powers",
                    "fName": "Tara",
                    "uCode": "powt",
                    "uId": "469021"
                },
                "count": 59
            },
            {
                "_id": {
                    "lName": "Wagner",
                    "fName": "Barbara",
                    "uCode": "wagb",
                    "uId": "2860"
                },
                "count": 395
            },
            {
                "_id": {
                    "lName": "Lorico",
                    "fName": "Andrea",
                    "uCode": "Lorico",
                    "uId": "685213"
                },
                "count": 530
            },
            {
                "_id": {
                    "lName": "Qin",
                    "fName": "Alice Can Ran",
                    "uCode": "Qin",
                    "uId": "689446"
                },
                "count": 1015
            },
            {
                "_id": {
                    "lName": "Kim",
                    "fName": "James",
                    "uCode": "KIMJ1",
                    "uId": "696230"
                },
                "count": 456
            },
            {
                "_id": {
                    "lName": "Tyehemba",
                    "fName": "Nefertiti",
                    "uCode": "Tyehemba",
                    "uId": "689449"
                },
                "count": 869
            },
            {
                "_id": {
                    "lName": "Sampson",
                    "fName": "Cynthia",
                    "uCode": "samc",
                    "uId": "2868"
                },
                "count": 374
            },
            {
                "_id": {
                    "lName": "Soliman",
                    "fName": "Safa",
                    "uCode": "sols",
                    "uId": "691818"
                },
                "count": 74
            },
            {
                "_id": {
                    "lName": "Freeman",
                    "fName": "Darrel",
                    "uCode": "fred",
                    "uId": "469600"
                },
                "count": 152
            },

            {
                "_id": {
                    "lName": "Farooque",
                    "fName": "Alyssa",
                    "uCode": "FARA",
                    "uId": "696669"
                },
                "count": 34
            },
            {
                "_id": {
                    "lName": "Bitew",
                    "fName": "Addisalem",
                    "uCode": "bita",
                    "uId": "484459"
                },
                "count": 20
            },
            {
                "_id": {
                    "lName": "Malinow",
                    "fName": "Andrew",
                    "uCode": "MALA",
                    "uId": "2964"
                },
                "count": 407
            },
            {
                "_id": {
                    "lName": "Hilton",
                    "fName": "Christopher",
                    "uCode": "hilc",
                    "uId": "480382"
                },
                "count": 133
            },
            {
                "_id": {
                    "lName": "Hunt",
                    "fName": "John",
                    "uCode": "hunj",
                    "uId": "691744"
                },
                "count": 4
            },
            {
                "_id": {
                    "lName": "Browning",
                    "fName": "Kristy",
                    "uCode": "brok",
                    "uId": "2919"
                },
                "count": 204
            }];
        for (const row of fixes) {
            const user = await User.updateOne({
                last: row._id.lName,
                first: row._id.fName
            }, {
                $set: {
                    sfUserId: row._id.uId,
                    sfUserCode: row._id.uCode
                }
            });
        }
        return {success: true};
    }
}
