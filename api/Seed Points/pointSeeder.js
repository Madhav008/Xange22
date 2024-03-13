const BattingPoints = require("../models/BattingPoints");
const BowlingPoints = require("../models/BowlingPoints");
const FieldingPoints = require("../models/FieldingPoints");
const PlayerStats = require("../models/PlayerStats");

const seedPoints = async () => {
    const pointsData = [
        {
            batting: {
                format: 'T10',
                run: 1,
                boundary: 1,
                six: 2,
                halfCenturyBonus: 8,
                centuryBonus: 0,
            },
            bowling: {
                format: 'T10',

                wicket: 20,
                threeWicketHaulBonus: 8,
                fourWicketHaulBonus: 8,
                fiveWicketHaulBonus: 8,
                maidenOver: 12
            },
            fielding: {
                format: 'T10',
                catch: 8,
                runOutThrower: 12,
                stumping: 12
            }
        },
        {
            batting: {
                format: 'T20',
                run: 1,
                boundary: 1,
                six: 2,
                halfCenturyBonus: 7,
                centuryBonus: 15,
            },
            bowling: {
                format: 'T20',

                wicket: 20,
                threeWicketHaulBonus: 5,
                fourWicketHaulBonus: 8,
                fiveWicketHaulBonus: 8,
                maidenOver: 7
            },
            fielding: {
                format: 'T20',
                catch: 8,
                runOutThrower: 12,
                stumping: 12
            }
        },
        {
            batting: {
                format: 'ODI',

                run: 1,
                boundary: 1,
                six: 2,
                halfCenturyBonus: 5,
                centuryBonus: 8,
            },
            bowling: {
                format: 'ODI',

                wicket: 25,
                threeWicketHaulBonus: 0,
                fourWicketHaulBonus: 5,
                fiveWicketHaulBonus: 8,
                maidenOver: 5
            },
            fielding: {
                format: 'ODI',
                catch: 8,
                runOutThrower: 12,
                stumping: 12
            }
        },
        {
            batting: {
                format: 'Test',

                run: 0.5,
                boundary: 1,
                six: 3,
                halfCenturyBonus: 5,
                centuryBonus: 8,
                doubleCenturyBonus: 15
            },
            bowling: {
                format: 'Test',
                wicket: 12,
                threeWicketHaulBonus: 0,
                fourWicketHaulBonus: 0,
                fiveWicketHaulBonus: 10,
                maidenOver: 1
            },
            fielding: {
                format: 'Test',

                catch: 6,
                runOutThrower: 12,
                stumping: 12
            }
        },
        {
            batting: {
                format: 'The Hundred',
                run: 1,
                boundary: 1,
                six: 2,
                halfCenturyBonus: 8,
            },
            bowling: {
                format: 'The Hundred',
                wicket: 20,
                threeWicketHaulBonus: 5,
                fourWicketHaulBonus: 8,
                fiveWicketHaulBonus: 8,
                maidenOver: 0
            },
            fielding: {
                format: 'The Hundred',
                catch: 8,
                runOutThrower: 12,
                stumping: 12
            }
        }
    ];

    try {
        for (const data of pointsData) {
            // Seed batting points
            let batting = new BattingPoints(data.batting);
            await batting.save();
            // // Seed bowling points
            let bowling = new BowlingPoints(data.bowling);
            await bowling.save();

            // // Seed fielding points
            let fielding = new FieldingPoints(data.fielding);
            await fielding.save();
            console.log(`Points seeded successfully for ${data.format}`);
        }
    } catch (error) {
        console.error('Error seeding points:', error);
    }
};

module.exports = seedPoints;
