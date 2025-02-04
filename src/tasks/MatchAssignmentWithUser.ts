import {Task} from "actionhero";
import {IUser, User} from "../models/user";
import {SFAssignment} from "../models/sfassignment";

export class MatchAssignmentWithUser extends Task {
    constructor() {
        super();
        this.name = "MatchAssignmentWithUser";
        this.description = "matches indiv assignment with indiv user";
        this.frequency = 0;
        this.queue = "spin-fusion";
        this.middleware = [];
    }

    async run(data: IUser) {
        await SFAssignment.updateMany({
            user: {$exists: false},
            $or: [
                { uCode: data.sfUserCode },
                { uId: data.sfUserId }
            ]
        }, {
            $set: {
                user: data._id
            }
        });
        return { success: true };
    }
}

/* fixes

Carpenter:
    uCode = CARR
    uId = 48510




/*
[{
  "_id": {
    "lName": "Carpenter",
    "fName": "Ross",
    "uCode": "CARR",
    "uId": "485103"
  },
  "count": 1326
},
{
  "_id": {
    "lName": "Everett",
    "fName": "Lauren",
    "uCode": "Everett",
    "uId": "685204"
  },
  "count": 482
},
{
  "_id": {
    "lName": "Swanson",
    "fName": "Ashleigh",
    "uCode": "swaa2",
    "uId": "63905"
  },
  "count": 2
},
{
  "_id": {
    "lName": "Powers",
    "fName": "Tara",
    "uCode": "pwtr",
    "uId": "483495"
  },
  "count": 10
},
{
  "_id": {
    "lName": "Silvano",
    "fName": "Andrea",
    "uCode": "sila",
    "uId": "697323"
  },
  "count": 122
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
    "lName": "Anderson",
    "fName": "Austin",
    "uCode": "anda",
    "uId": "687038"
  },
  "count": 376
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
    "lName": "Young",
    "fName": "Theresa",
    "uCode": "yout",
    "uId": "3483"
  },
  "count": 364
},
{
  "_id": {
    "lName": "Goetz",
    "fName": "Linda",
    "uCode": "goel",
    "uId": "2854"
  },
  "count": 351
},
{
  "_id": {
    "lName": "Evans",
    "fName": "Anna",
    "uCode": "evaa",
    "uId": "471185"
  },
  "count": 47
},
{
  "_id": {
    "lName": "Thomas",
    "fName": "Krystle",
    "uCode": "thok",
    "uId": "2912"
  },
  "count": 397
},
{
  "_id": {
    "lName": "Mohamod",
    "fName": "Dalmar",
    "uCode": "MOHD",
    "uId": "692595"
  },
  "count": 22
},
{
  "_id": {
    "lName": "McKiernan",
    "fName": "Brianna",
    "uCode": "McKiernan",
    "uId": "691705"
  },
  "count": 932
},
{
  "_id": {
    "lName": "Hunt, III",
    "fName": "John",
    "uCode": "hunj",
    "uId": "691744"
  },
  "count": 4
},
{
  "_id": {
    "lName": "Gerlach",
    "fName": "Brooke",
    "uCode": "Gerlach",
    "uId": "685209"
  },
  "count": 506
},
{
  "_id": {
    "lName": "-",
    "fName": "-",
    "uCode": "-",
    "uId": "3046"
  },
  "count": 9
},
{
  "_id": {
    "lName": "Tyehemba",
    "fName": "Nefertiti",
    "uCode": "Tyehemba",
    "uId": "689449"
  },
  "count": 867
},
{
  "_id": {
    "lName": "Martell",
    "fName": "Colleen",
    "uCode": "marc",
    "uId": "685944"
  },
  "count": 364
},
{
  "_id": {
    "lName": "Sullivan",
    "fName": "Miles",
    "uCode": "Sullivan",
    "uId": "696859"
  },
  "count": 415
},
{
  "_id": {
    "lName": "Pandya",
    "fName": "Jaimin",
    "uCode": "PANJ",
    "uId": "696904"
  },
  "count": 3
},
{
  "_id": {
    "lName": "Koodaly",
    "fName": "Lincy",
    "uCode": "kool",
    "uId": "692779"
  },
  "count": 37
},
{
  "_id": {
    "lName": "Dotson",
    "fName": "Cassandra",
    "uCode": "dotc",
    "uId": "687963"
  },
  "count": 134
},
{
  "_id": {
    "lName": "Yang",
    "fName": "Evan",
    "uCode": "Yang",
    "uId": "691707"
  },
  "count": 875
},
{
  "_id": {
    "lName": "Zimmerman",
    "fName": "Laura",
    "uCode": "ziml",
    "uId": "91672"
  },
  "count": 238
},
{
  "_id": {
    "lName": "Malinow",
    "fName": "Andrew M",
    "uCode": "MALA",
    "uId": "2964"
  },
  "count": 401
},
{
  "_id": {
    "lName": "Yim",
    "fName": "David",
    "uCode": "Yim",
    "uId": "689450"
  },
  "count": 921
},
{
  "_id": {
    "lName": "Lucas",
    "fName": "Kelsea",
    "uCode": "luck",
    "uId": "685943"
  },
  "count": 16
},
{
  "_id": {
    "lName": "Gulamani",
    "fName": "Shan",
    "uCode": "Gulamani",
    "uId": "689439"
  },
  "count": 891
},
{
  "_id": {
    "lName": "Martinez",
    "fName": "Alexis",
    "uCode": "marta",
    "uId": "685945"
  },
  "count": 438
},
{
  "_id": {
    "lName": "Towles",
    "fName": "Kendra",
    "uCode": "towk",
    "uId": "687691"
  },
  "count": 226
},
{
  "_id": {
    "lName": "Wooster",
    "fName": "Stephanie",
    "uCode": "woos",
    "uId": "90673"
  },
  "count": 125
},
{
  "_id": {
    "lName": "Lin",
    "fName": "Andrea",
    "uCode": "Lina",
    "uId": "691703"
  },
  "count": 883
},
{
  "_id": {
    "lName": "Howie",
    "fName": "Bill",
    "uCode": "howb",
    "uId": "2863"
  },
  "count": 248
},
{
  "_id": {
    "lName": "Morosanu",
    "fName": "Ionela",
    "uCode": "mori2",
    "uId": "476501"
  },
  "count": 16
},
{
  "_id": {
    "lName": "Scott",
    "fName": "Chris",
    "uCode": "scoc",
    "uId": "22817"
  },
  "count": 165
},
{
  "_id": {
    "lName": "Abraham",
    "fName": "Helle",
    "uCode": "abrh",
    "uId": "697199"
  },
  "count": 127
},
{
  "_id": {
    "lName": "Lawson",
    "fName": "Charles",
    "uCode": "Lawson",
    "uId": "691702"
  },
  "count": 871
},
{
  "_id": {
    "lName": "Hagan",
    "fName": "Shannon",
    "uCode": "hags",
    "uId": "22215"
  },
  "count": 380
},
{
  "_id": {
    "lName": "Cade",
    "fName": "Martina",
    "uCode": "cadm",
    "uId": "683104"
  },
  "count": 28
},
{
  "_id": {
    "lName": "Petz",
    "fName": "Kelly",
    "uCode": "petk",
    "uId": "16720"
  },
  "count": 44
},
{
  "_id": {
    "lName": "Pu",
    "fName": "Elbert",
    "uCode": "Pu",
    "uId": "689445"
  },
  "count": 890
},
{
  "_id": {
    "lName": "Ali",
    "fName": "Yusuf",
    "uCode": "Ali",
    "uId": "689435"
  },
  "count": 936
},
{
  "_id": {
    "lName": "Taylor",
    "fName": "Patrick",
    "uCode": "tayp",
    "uId": "2911"
  },
  "count": 280
},
{
  "_id": {
    "lName": "Haas",
    "fName": "Erica",
    "uCode": "Haas",
    "uId": "685210"
  },
  "count": 508
},
{
  "_id": {
    "lName": "Zaidi",
    "fName": "Bilal",
    "uCode": "Zaidi",
    "uId": "489259"
  },
  "count": 61
},
{
  "_id": {
    "lName": "Lin",
    "fName": "Grace",
    "uCode": "Lin",
    "uId": "689441"
  },
  "count": 979
},
{
  "_id": {
    "lName": "Wagner",
    "fName": "Barbara",
    "uCode": "wagb",
    "uId": "2860"
  },
  "count": 397
},
{
  "_id": {
    "lName": "Mattingly",
    "fName": "Tyler",
    "uCode": "MATT",
    "uId": "689406"
  },
  "count": 4
},
{
  "_id": {
    "lName": "Parrino",
    "fName": "Christopher",
    "uCode": "Parrino",
    "uId": "689507"
  },
  "count": 1038
},
{
  "_id": {
    "lName": "Rosenthal",
    "fName": "Peter",
    "uCode": "Rosenthal",
    "uId": "689448"
  },
  "count": 957
},
{
  "_id": {
    "lName": "Kurian",
    "fName": "Nisha",
    "uCode": "kurian",
    "uId": "686273"
  },
  "count": 147
},
{
  "_id": {
    "lName": "res1",
    "fName": "anes",
    "uCode": "Res1",
    "uId": "3714"
  },
  "count": 443
},
{
  "_id": {
    "lName": "Elmatite",
    "fName": "Waleed",
    "uCode": "ELMW",
    "uId": "692593"
  },
  "count": 20
},
{
  "_id": {
    "lName": "Freeman",
    "fName": "Darrell",
    "uCode": "fred",
    "uId": "469600"
  },
  "count": 151
},
{
  "_id": {
    "lName": "Genova",
    "fName": "Justin",
    "uCode": "Genova",
    "uId": "689438"
  },
  "count": 980
},
{
  "_id": {
    "lName": "Sampson",
    "fName": "Cindy",
    "uCode": "samc",
    "uId": "2868"
  },
  "count": 368
},
{
  "_id": {
    "lName": "Brooke",
    "fName": "Joseph",
    "uCode": "Brooke",
    "uId": "691694"
  },
  "count": 897
},
{
  "_id": {
    "lName": "MacNguyen",
    "fName": "Marilyn",
    "uCode": "MacNguyen",
    "uId": "691704"
  },
  "count": 911
},
{
  "_id": {
    "lName": "Smith",
    "fName": "Alexie",
    "uCode": "smia",
    "uId": "686057"
  },
  "count": 61
},
{
  "_id": {
    "lName": "Ejanda",
    "fName": "Ronald",
    "uCode": "ejar",
    "uId": "2916"
  },
  "count": 383
},
{
  "_id": {
    "lName": "Peterschmidt",
    "fName": "Aaron",
    "uCode": "Peterschmidt",
    "uId": "696858"
  },
  "count": 395
},
{
  "_id": {
    "lName": "Lu",
    "fName": "Chang",
    "uCode": "Lu",
    "uId": "689443"
  },
  "count": 979
},
{
  "_id": {
    "lName": "Igwe",
    "fName": "Nwadi",
    "uCode": "IGWN",
    "uId": "692594"
  },
  "count": 21
},
{
  "_id": {
    "lName": "Cooke",
    "fName": "Sarah",
    "uCode": "coos",
    "uId": "90114"
  },
  "count": 348
},
{
  "_id": {
    "lName": "D'Angelo",
    "fName": "Matthew",
    "uCode": "danm",
    "uId": "474480"
  },
  "count": 123
},
{
  "_id": {
    "lName": "Browning",
    "fName": "Kristy",
    "uCode": "brok",
    "uId": "2919"
  },
  "count": 201
},
{
  "_id": {
    "lName": "Nguyen",
    "fName": "Peterson",
    "uCode": "ngup",
    "uId": "482441"
  },
  "count": 95
},
{
  "_id": {
    "lName": "Batoon",
    "fName": "Bonjo",
    "uCode": "batb",
    "uId": "2855"
  },
  "count": 384
},
{
  "_id": {
    "lName": "Lalani",
    "fName": "Ishita",
    "uCode": "lali",
    "uId": "692042"
  },
  "count": 312
},
{
  "_id": {
    "lName": "Ergas",
    "fName": "Yaniv",
    "uCode": "ergy",
    "uId": "91631"
  },
  "count": 248
},
{
  "_id": {
    "lName": "Schmidt",
    "fName": "Bruce",
    "uCode": "Schmidt",
    "uId": "691706"
  },
  "count": 875
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
    "lName": "Hilton",
    "fName": "Chris",
    "uCode": "hilc",
    "uId": "480382"
  },
  "count": 131
},
{
  "_id": {
    "lName": "Choudhry",
    "fName": "Noman",
    "uCode": "CHON",
    "uId": "692169"
  },
  "count": 467
},
{
  "_id": {
    "lName": "Colbert",
    "fName": "Carmen",
    "uCode": "colc",
    "uId": "2914"
  },
  "count": 455
},
{
  "_id": {
    "lName": "Armstrong",
    "fName": "Phillip",
    "uCode": "Armstrong",
    "uId": "691692"
  },
  "count": 837
},
{
  "_id": {
    "lName": "Everson",
    "fName": "Marjorie",
    "uCode": "evem",
    "uId": "692958"
  },
  "count": 5
},
{
  "_id": {
    "lName": "Papanikos",
    "fName": "John \"Yani\"",
    "uCode": "PAPY",
    "uId": "696650"
  },
  "count": 514
},
{
  "_id": {
    "lName": "Sigalovsky",
    "fName": "Natalie",
    "uCode": "sign",
    "uId": "2870"
  },
  "count": 387
},
{
  "_id": {
    "lName": "Finney",
    "fName": "Kaia",
    "uCode": "fink",
    "uId": "471743"
  },
  "count": 153
},
{
  "_id": {
    "lName": "Fatuzzo",
    "fName": "Mia",
    "uCode": "Fatuzzo",
    "uId": "696852"
  },
  "count": 418
},
{
  "_id": {
    "lName": "Muntuerto",
    "fName": "Anne",
    "uCode": "muna",
    "uId": "17126"
  },
  "count": 2
},
{
  "_id": {
    "lName": "Robin",
    "fName": "Ntiense",
    "uCode": "robn",
    "uId": "689541"
  },
  "count": 329
},
{
  "_id": {
    "lName": "Miller",
    "fName": "Justin",
    "uCode": "Miller1",
    "uId": "696855"
  },
  "count": 389
},
{
  "_id": {
    "lName": "Mali",
    "fName": "Mitali",
    "uCode": "MALM",
    "uId": "692170"
  },
  "count": 452
},
{
  "_id": {
    "lName": "Westra",
    "fName": "Samuel",
    "uCode": "Westra",
    "uId": "696861"
  },
  "count": 413
},
{
  "_id": {
    "lName": "Zolet",
    "fName": "Morris",
    "uCode": "Zolet",
    "uId": "685219"
  },
  "count": 448
},
{
  "_id": {
    "lName": "Lennon",
    "fName": "Kelsey",
    "uCode": "lenk",
    "uId": "691303"
  },
  "count": 66
},
{
  "_id": {
    "lName": "Turner",
    "fName": "Gauri",
    "uCode": "TURG",
    "uId": "16062"
  },
  "count": 178
},
{
  "_id": {
    "lName": "Fan",
    "fName": "Ziyi",
    "uCode": "Fan",
    "uId": "685205"
  },
  "count": 450
},
{
  "_id": {
    "lName": "Xi",
    "fName": "Mingxia",
    "uCode": "xming",
    "uId": "485883"
  },
  "count": 295
},
{
  "_id": {
    "lName": "Westra",
    "fName": "Kimberly",
    "uCode": "wesk",
    "uId": "94235"
  },
  "count": 3
},
{
  "_id": {
    "lName": "Ergas",
    "fName": "Dana",
    "uCode": "ergd",
    "uId": "472981"
  },
  "count": 293
},
{
  "_id": {
    "lName": "Long",
    "fName": "Sara",
    "uCode": "Long",
    "uId": "689442"
  },
  "count": 929
},
{
  "_id": {
    "lName": "Eun",
    "fName": "Claire",
    "uCode": "Eun",
    "uId": "691699"
  },
  "count": 924
},
{
  "_id": {
    "lName": "Walton",
    "fName": "Leslie",
    "uCode": "WALL",
    "uId": "693097"
  },
  "count": 422
},
{
  "_id": {
    "lName": "Davis",
    "fName": "Meagan",
    "uCode": "davm",
    "uId": "63906"
  },
  "count": 8
},
{
  "_id": {
    "lName": "Pavlovich",
    "fName": "Mary",
    "uCode": "Pavlovich",
    "uId": "685217"
  },
  "count": 462
},
{
  "_id": {
    "lName": "Maher",
    "fName": "Clair",
    "uCode": "mahc",
    "uId": "697156"
  },
  "count": 143
},
{
  "_id": {
    "lName": "Sliwkowski",
    "fName": "Joey",
    "uCode": "slij",
    "uId": "7858"
  },
  "count": 313
},
{
  "_id": {
    "lName": "Scott-Herring",
    "fName": "Mary",
    "uCode": "scom",
    "uId": "2921"
  },
  "count": 48
},
{
  "_id": {
    "lName": "Muscara",
    "fName": "Gina",
    "uCode": "musg",
    "uId": "2918"
  },
  "count": 14
},
{
  "_id": {
    "lName": "Kim",
    "fName": "James",
    "uCode": "KIMJ1",
    "uId": "696230"
  },
  "count": 445
},
{
  "_id": {
    "lName": "Burns",
    "fName": "Erica",
    "uCode": "bure",
    "uId": "478069"
  },
  "count": 7
},
{
  "_id": {
    "lName": "Shaver",
    "fName": "Kristina",
    "uCode": "shak",
    "uId": "691186"
  },
  "count": 151
},
{
  "_id": {
    "lName": "Turner",
    "fName": "Deverie",
    "uCode": "turd",
    "uId": "3484"
  },
  "count": 377
},
{
  "_id": {
    "lName": "Drager",
    "fName": "Emilene",
    "uCode": "drae",
    "uId": "2862"
  },
  "count": 354
},
{
  "_id": {
    "lName": "Bitew",
    "fName": "Addis",
    "uCode": "bita",
    "uId": "484459"
  },
  "count": 20
},
{
  "_id": {
    "lName": "Scharf",
    "fName": "Katelyn",
    "uCode": "SCHK",
    "uId": "689408"
  },
  "count": 38
},
{
  "_id": {
    "lName": "Shaughnessy",
    "fName": "Adam",
    "uCode": "shaa",
    "uId": "7978"
  },
  "count": 441
},
{
  "_id": {
    "lName": "Dietrich",
    "fName": "Jonathan",
    "uCode": "Dietrich",
    "uId": "696850"
  },
  "count": 416
},
{
  "_id": {
    "lName": "Friedman",
    "fName": "Beth",
    "uCode": "frib",
    "uId": "697150"
  },
  "count": 153
},
{
  "_id": {
    "lName": "Miller",
    "fName": "Tara",
    "uCode": "milt",
    "uId": "19589"
  },
  "count": 299
},
{
  "_id": {
    "lName": "Iacono",
    "fName": "Michelle",
    "uCode": "iacm",
    "uId": "91515"
  },
  "count": 98
},
{
  "_id": {
    "lName": "Langlois",
    "fName": "Scott",
    "uCode": "langs",
    "uId": "485121"
  },
  "count": 334
},
{
  "_id": {
    "lName": "Russo",
    "fName": "Lydia",
    "uCode": "russ",
    "uId": "698960"
  },
  "count": 2
},
{
  "_id": {
    "lName": "Physician",
    "fName": "Test",
    "uCode": "PHYT",
    "uId": "15584"
  },
  "count": 5
},
{
  "_id": {
    "lName": "Bragdon",
    "fName": "George",
    "uCode": "brag",
    "uId": "684364"
  },
  "count": 38
},
{
  "_id": {
    "lName": "Nigatu",
    "fName": "Zee",
    "uCode": "nigz",
    "uId": "682142"
  },
  "count": 55
},
{
  "_id": {
    "lName": "Garcia",
    "fName": "Shelby",
    "uCode": "Garcia",
    "uId": "685207"
  },
  "count": 809
},
{
  "_id": {
    "lName": "Hopkins",
    "fName": "Natasha",
    "uCode": "hopn",
    "uId": "684282"
  },
  "count": 208
},
{
  "_id": {
    "lName": "Mukherjee",
    "fName": "Vikram",
    "uCode": "Mukherjee",
    "uId": "696856"
  },
  "count": 407
},
{
  "_id": {
    "lName": "Mallon",
    "fName": "John",
    "uCode": "Mallon",
    "uId": "696854"
  },
  "count": 414
},
{
  "_id": {
    "lName": "Cofer",
    "fName": "Savannah",
    "uCode": "Cofer",
    "uId": "691697"
  },
  "count": 867
},
{
  "_id": {
    "lName": "Yin",
    "fName": "Sophia",
    "uCode": "Yin",
    "uId": "696863"
  },
  "count": 427
},
{
  "_id": {
    "lName": "Kennedy",
    "fName": "Joseph",
    "uCode": "KennedyJ",
    "uId": "689440"
  },
  "count": 956
},
{
  "_id": {
    "lName": "Diaz",
    "fName": "Magdaline",
    "uCode": "diazm",
    "uId": "692715"
  },
  "count": 221
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
    "lName": "Cortese",
    "fName": "Kevin",
    "uCode": "Cortese",
    "uId": "685203"
  },
  "count": 459
},
{
  "_id": {
    "lName": "Patel",
    "fName": "Chintan",
    "uCode": "patc",
    "uId": "694194"
  },
  "count": 30
},
{
  "_id": {
    "lName": "Duell",
    "fName": "Michelle",
    "uCode": "duem",
    "uId": "3481"
  },
  "count": 212
},
{
  "_id": {
    "lName": "Koltz",
    "fName": "Thea",
    "uCode": "kolt",
    "uId": "91630"
  },
  "count": 14
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
    "lName": "Vedanaparti",
    "fName": "Yajnesh",
    "uCode": "Vedanaparti",
    "uId": "696860"
  },
  "count": 421
},
{
  "_id": {
    "lName": "Tucker",
    "fName": "Franny",
    "uCode": "tucf",
    "uId": "40017"
  },
  "count": 21
},
{
  "_id": {
    "lName": "Leung",
    "fName": "Boaz",
    "uCode": "leub",
    "uId": "472980"
  },
  "count": 422
},
{
  "_id": {
    "lName": "Qin",
    "fName": "Alice",
    "uCode": "Qin",
    "uId": "689446"
  },
  "count": 1014
},
{
  "_id": {
    "lName": "Jerez",
    "fName": "Debbie",
    "uCode": "jerd",
    "uId": "484816"
  },
  "count": 406
},
{
  "_id": {
    "lName": "Irish",
    "fName": "Emily",
    "uCode": "irie",
    "uId": "15039"
  },
  "count": 139
},
{
  "_id": {
    "lName": "Lorico",
    "fName": "Andie",
    "uCode": "Lorico",
    "uId": "685213"
  },
  "count": 530
},
{
  "_id": {
    "lName": "Chin Shue",
    "fName": "Kyle",
    "uCode": "ChinShue",
    "uId": "689436"
  },
  "count": 901
},
{
  "_id": {
    "lName": "Casella",
    "fName": "Joseph",
    "uCode": "Casella",
    "uId": "691696"
  },
  "count": 916
},
{
  "_id": {
    "lName": "Krogel",
    "fName": "Ashley",
    "uCode": "kroa",
    "uId": "692741"
  },
  "count": 381
},
{
  "_id": {
    "lName": "Adogu",
    "fName": "Obinna",
    "uCode": "adoo",
    "uId": "16941"
  },
  "count": 211
},
{
  "_id": {
    "lName": "Obereiner",
    "fName": "Kimberly",
    "uCode": "obek",
    "uId": "63909"
  },
  "count": 1
},
{
  "_id": {
    "lName": "Anwyll",
    "fName": "Carly",
    "uCode": "Anwyll",
    "uId": "696848"
  },
  "count": 397
},
{
  "_id": {
    "lName": "res2",
    "fName": "anes",
    "uCode": "Res2",
    "uId": "7773"
  },
  "count": 331
},
{
  "_id": {
    "lName": "Reindorf",
    "fName": "Rachel",
    "uCode": "Reindorf",
    "uId": "689447"
  },
  "count": 878
},
{
  "_id": {
    "lName": "Dalsania",
    "fName": "Ravi",
    "uCode": "Dalsania",
    "uId": "689437"
  },
  "count": 931
},
{
  "_id": {
    "lName": "Ahmed",
    "fName": "Birtukan",
    "uCode": "ahmb",
    "uId": "474816"
  },
  "count": 102
},
{
  "_id": {
    "lName": "Moore",
    "fName": "Diamond",
    "uCode": "mood",
    "uId": "687962"
  },
  "count": 187
},
{
  "_id": {
    "lName": "Travis",
    "fName": "David",
    "uCode": "trad",
    "uId": "3485"
  },
  "count": 62
},
{
  "_id": {
    "lName": "Burt",
    "fName": "Cameran",
    "uCode": "Burt",
    "uId": "696849"
  },
  "count": 426
},
{
  "_id": {
    "lName": "Miller",
    "fName": "Sharee",
    "uCode": "mils",
    "uId": "2865"
  },
  "count": 338
},
{
  "_id": {
    "lName": "Cline",
    "fName": "Cheryl",
    "uCode": "clic",
    "uId": "2857"
  },
  "count": 399
},
{
  "_id": {
    "lName": "Azzam",
    "fName": "Nadder",
    "uCode": "Azzam",
    "uId": "691693"
  },
  "count": 896
},
{
  "_id": {
    "lName": "Samet",
    "fName": "Ron",
    "uCode": "SAMR",
    "uId": "2976"
  },
  "count": 851
},
{
  "_id": {
    "lName": "Sachs",
    "fName": "Aaron",
    "uCode": "SACA1",
    "uId": "685231"
  },
  "count": 32
},
{
  "_id": {
    "lName": "Hildenbrand",
    "fName": "Frieda",
    "uCode": "hilf",
    "uId": "487630"
  },
  "count": 249
},
{
  "_id": {
    "lName": "Meade",
    "fName": "Danielle",
    "uCode": "mead",
    "uId": "91708"
  },
  "count": 219
},
{
  "_id": {
    "lName": "Goins",
    "fName": "Elizabeth",
    "uCode": "goie",
    "uId": "22819"
  },
  "count": 27
},
{
  "_id": {
    "lName": "Nguyen",
    "fName": "Martin",
    "uCode": "ngum",
    "uId": "694249"
  },
  "count": 43
},
{
  "_id": {
    "lName": "Fellow",
    "fName": "TOR",
    "uCode": "Fell1",
    "uId": "90067"
  },
  "count": 69
},
{
  "_id": {
    "lName": "Patel",
    "fName": "Kunal",
    "uCode": "Patel",
    "uId": "685216"
  },
  "count": 469
},
{
  "_id": {
    "lName": "Albanese",
    "fName": "Taylor",
    "uCode": "albt",
    "uId": "691185"
  },
  "count": 324
},
{
  "_id": {
    "lName": "Paul",
    "fName": "Frantz",
    "uCode": "pauf",
    "uId": "90672"
  },
  "count": 138
},
{
  "_id": {
    "lName": "Druker",
    "fName": "Leo",
    "uCode": "DRUL",
    "uId": "696900"
  },
  "count": 298
},
{
  "_id": {
    "lName": "Broussard",
    "fName": "Michael",
    "uCode": "brom",
    "uId": "2856"
  },
  "count": 399
},
{
  "_id": {
    "lName": "Mobarakeh",
    "fName": "Kayvon",
    "uCode": "MobarakehK",
    "uId": "685214"
  },
  "count": 483
},
{
  "_id": {
    "lName": "Hess",
    "fName": "Cary",
    "uCode": "Hess",
    "uId": "691700"
  },
  "count": 895
},
{
  "_id": {
    "lName": "Eden",
    "fName": "Brandon",
    "uCode": "Eden",
    "uId": "696851"
  },
  "count": 384
},
{
  "_id": {
    "lName": "LeBeauf",
    "fName": "Ireon",
    "uCode": "LEBI",
    "uId": "696901"
  },
  "count": 10
},
{
  "_id": {
    "lName": "Booth",
    "fName": "Richard",
    "uCode": "BOOT",
    "uId": "684022"
  },
  "count": 206
},
{
  "_id": {
    "lName": "Ferko",
    "fName": "Aarika",
    "uCode": "Ferko",
    "uId": "696853"
  },
  "count": 423
},
{
  "_id": {
    "lName": "Kim",
    "fName": "William",
    "uCode": "Kimw",
    "uId": "691701"
  },
  "count": 869
},
{
  "_id": {
    "lName": "Milnes",
    "fName": "Vania",
    "uCode": "minv",
    "uId": "483504"
  },
  "count": 40
},
{
  "_id": {
    "lName": "Misak",
    "fName": "Monika",
    "uCode": "MISM",
    "uId": "696903"
  },
  "count": 4
},
{
  "_id": {
    "lName": "Clark",
    "fName": "Ashlee",
    "uCode": "claa",
    "uId": "688882"
  },
  "count": 57
},
{
  "_id": {
    "lName": "Patel",
    "fName": "Kevin",
    "uCode": "PatelK",
    "uId": "696857"
  },
  "count": 382
},
{
  "_id": {
    "lName": "Telles-Hernandez",
    "fName": "Luis",
    "uCode": "TELL",
    "uId": "699054"
  },
  "count": 16
},
{
  "_id": {
    "lName": "Kelsh",
    "fName": "John",
    "uCode": "Kelsh",
    "uId": "685211"
  },
  "count": 468
},
{
  "_id": {
    "lName": "Bergbower",
    "fName": "Emily",
    "uCode": "Bergbower",
    "uId": "489246"
  },
  "count": 295
},
{
  "_id": {
    "lName": "Xia",
    "fName": "Yuwei",
    "uCode": "Xia",
    "uId": "696862"
  },
  "count": 403
},
{
  "_id": {
    "lName": "Sigalovsky",
    "fName": "Alex",
    "uCode": "siga",
    "uId": "2869"
  },
  "count": 384
},
{
  "_id": {
    "lName": "Eide",
    "fName": "Benjamin",
    "uCode": "Eide",
    "uId": "691698"
  },
  "count": 909
},
{
  "_id": {
    "lName": "res3",
    "fName": "Resident ",
    "uCode": "Res3",
    "uId": "17869"
  },
  "count": 17
},
{
  "_id": {
    "lName": "Moore",
    "fName": "Cindy",
    "uCode": "mooc",
    "uId": "686271"
  },
  "count": 51
},
{
  "_id": {
    "lName": "Renner",
    "fName": "Corinne",
    "uCode": "RENC",
    "uId": "696652"
  },
  "count": 39
},
{
  "_id": {
    "lName": "Tracy",
    "fName": "Travis",
    "uCode": "trat1",
    "uId": "697325"
  },
  "count": 118
},
{
  "_id": {
    "lName": "Martz",
    "fName": "Douglas G",
    "uCode": "MARD",
    "uId": "2966"
  },
  "count": 418
},
{
  "_id": {
    "lName": "Reinhart",
    "fName": "Carlyn",
    "uCode": "bonc",
    "uId": "485555"
  },
  "count": 104
},
{
  "_id": {
    "lName": "Villamater",
    "fName": "Edwin",
    "uCode": "VILE",
    "uId": "2987"
  },
  "count": 126
},
{
  "_id": {
    "lName": "Ward",
    "fName": "Kristy",
    "uCode": "wark",
    "uId": "40653"
  },
  "count": 28
},
{
  "_id": {
    "lName": "Sanchez",
    "fName": "Estefania",
    "uCode": "sane",
    "uId": "475399"
  },
  "count": 331
},
{
  "_id": {
    "lName": "Nemec",
    "fName": "Candice",
    "uCode": "nemc",
    "uId": "685946"
  },
  "count": 325
},
{
  "_id": {
    "lName": "Brush",
    "fName": "Michael",
    "uCode": "Brush",
    "uId": "691695"
  },
  "count": 954
},
{
  "_id": {
    "lName": "Dick",
    "fName": "Erika",
    "uCode": "dice",
    "uId": "2866"
  },
  "count": 310
}]
 */
