import {Action, api, log, ParamsFrom} from "actionhero";
import {EpicEpisode} from "../../models/epicepisode";

export class ReportingEpisodesTable extends Action {
    constructor() {
        super();
        this.name = "reportingEpisodesTable";
        this.description = "reportingEpisodesTable";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            categories: { required: true}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingEpisodesTable> }) {
        const categories: any = params.categories;
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        const rows = await EpicEpisode.aggregate(
            [
                {
                    $match: {
                        date: {
                            $gte: start,
                            $lte: end
                        },
                        cat1: {$in: categories.list}
                    }
                },
                {
                    $addFields:
                        {
                            month: {
                                $month: "$date"
                            },
                            year: {
                                $year: "$date"
                            }
                        }
                },

                {
                    $group:
                        {
                            _id: {
                                year: "$year",
                                month: "$month",
                                category: "$cat1"
                            },
                            episodes: {
                                $sum: 1
                            },
                            anMinutes: {
                                $sum: "$anMinutes"
                            },
                            inRoomMinutes: {
                                $sum: "$inRoomMinutes"
                            }
                        }
                },
                {
                    $sort: { "_id.category": 1, "_id.year": 1, "_id.month": 1 }
                },
                {
                    $group:
                        {
                            _id: {
                                category: "$_id.category",
                            },
                            months: {
                                $push: {

                                    year: "$_id.year",
                                    month: "$_id.month",
                                    episodes: "$episodes",
                                    anMinutes: "$anMinutes",
                                    inRoomMinutes: "$inRoomMinutes"
                                }
                            },
                            episodes: {
                                $sum: "$episodes"
                            },
                            anMinutes: {
                                $sum: "$anMinutes"
                            },
                            inRoomMinutes: {
                                $sum: "$inRoomMinutes"
                            }
                        }
                },
                {
                    $sort: {
                        "_id.category": 1
                    }
                }
            ]
        );
        const neededMonths = api.helpers.neededMonths(start, end);
        // console.log(start)
        // console.log(end)
        // console.log(neededMonths);
        const fillMonths = (item: any, needed: any[]) => {
            const fixed = [];
            for (const n of needed) {
                const found = item.months.find((m: any) => {
                    return m.year === n.year && m.month === n.month;
                });
                if (found) {
                    fixed.push(found);
                } else {
                    fixed.push({
                        month: n.month,
                        year: n.year,
                        episodes: 0,
                        inRoomMinutes: 0,
                        anMinutes: 0,
                    });
                }
            }
            return fixed;
        }
        const neededCats = categories.list.sort();
        const ret = [];
        for (const cat of neededCats) {
            const found = rows.find((row: any) => {
                return row._id.category === cat;
            });
            if (found) {
                ret.push({
                    _id: {
                        category: found._id.category
                    },
                    episodes: found.episodes,
                    inRoomMinutes: found.inRoomMinutes,
                    anMinutes: found.anMinutes,
                    months: fillMonths(found, neededMonths)
                });
            } else {
                ret.push({
                    _id: {
                        category: cat,
                    },
                    episodes: 0,
                    inRoomMinutes: 0,
                    anMinutes: 0,
                    months: neededMonths.map((m: any) => {
                      return {
                          month: m.month,
                          year: m.year,
                          episodes: 0,
                          inRoomMinutes: 0,
                          anMinutes: 0,
                        }
                    })
                })
            }
        }
        return { result: ret};
    }
}
