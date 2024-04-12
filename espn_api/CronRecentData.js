const axios = require("axios");

/* 
Returns 
1. playerId
2. image
3. name
4. longName
5. battingName
6. fieldingName
7. country
8. Recent match IDs
*/

async function getPlayerData(playerId) {
    const url = `https://hs-consumer-api.espncricinfo.com/v1/pages/player/matches?playerId=${playerId}`;
    const playerData = await getEspnData(url);
    const player = playerData.player;

    const matches = playerData.content.matches.types[0].recent;
    const recentMatchIds = matches.map(match => match.objectId);

    return {
        "playerId": player.objectId,
        "image": player.imageUrl,
        "name": player.name,
        "longName": player.longName,
        "battingName": player.battingName,
        "fieldingName": player.fieldingName,
        "country": player.country.name,
        "recentMatches": recentMatchIds
    };
}

/* 
Returns 
1. Teams 
2. Players 
3. Batting Stats
4. Bowling Stats
5. Fielding Stats
*/

async function getMatchData(seriesId, matchId) {
    console.log(seriesId);
    console.log(matchId);
    if (seriesId === undefined || matchId === undefined) {
        return;
    }
    const url = `https://hs-consumer-api.espncricinfo.com/v1/ui/match/details?latest=true&lang=en&seriesId=${seriesId}&matchId=${matchId}`;
    console.log(url)
    const matchData = await getEspnData(url);

    let fieldingStats = new Map();
    let battingStats = new Map();
    let bowlingStats = new Map();
    let teams = [];
    let teamPlayers = [];

    matchData.matchPlayers.teamPlayers.forEach(team => {
        teams.push(team.team);
        team.players.forEach(player => {
            const playerData = {
                "playerId": player.player.objectId,
                "name": player.player.longName,
                "shortName": player.player.name,
                "teamId": team.team.objectId,
                "teamName": team.team.name,
                "role": player.player.playingRoles[0]
            };
            teamPlayers.push(playerData);

            fieldingStats.set(playerData.playerId, {
                playerId: playerData.playerId,
                matchId: matchId,
                catches: 0,
                runouts: 0,
                stumping: 0
            });
        });
    });

    matchData.scorecard?.innings.forEach(inning => {
        inning.inningBatsmen.forEach(batsman => {
            if (batsman.battedType === "yes" && batsman.runs !== null) {
                let hundred = 0;
                let fifty = 0;
                let tempRuns = batsman.runs;
                if (batsman.runs >= 100) {
                    hundred = Math.floor(batsman.runs / 100);
                    batsman.runs -= hundred * 100;
                }
                if (batsman.runs >= 50) {
                    fifty = Math.floor(batsman.runs / 50);
                    batsman.runs -= fifty * 50;
                }

                battingStats.set(batsman.player.objectId, {
                    playerId: batsman.player.objectId,
                    matchId: matchId,
                    bat_runs: tempRuns,
                    balls_faced: batsman.balls,
                    six_hit: batsman.sixes,
                    four_hit: batsman.fours,
                    is_bat: true,
                    is_out: batsman.isOut,
                    hundred: hundred,
                    fifty: fifty,
                });
            }
        });

        inning.inningBowlers.forEach(bowler => {
            bowlingStats.set(bowler.player.objectId, {
                balls_bowled: bowler.balls,
                dot_balls: bowler.dots,
                four_given: bowler.fours,
                maidian_over: bowler.maidens,
                runs_given: bowler.conceded,
                six_given: bowler.sixes,
                wicket: bowler.wickets,
                is_ball: true,
                match_id: matchId,
                player_id: bowler.player.objectId
            });
        });

        inning.inningBatsmen.forEach(batsman => {
            if (batsman.dismissalType !== null && batsman.dismissalType !== 2 && batsman.dismissalType !== 12) {
                if (batsman.dismissalType === 1) {
                    const fielderName = batsman.dismissalText.long.split(" ")[1] === "&" ?
                        batsman.dismissalText.long.split(" ")[3] :
                        batsman.dismissalText.long.split(" ")[1];
                    const player = searchFielderName(fielderName, teamPlayers);
                    if (player) {
                        let playerStats = fieldingStats.get(player.playerId);
                        playerStats.catches += 1;
                    }
                } else if (batsman.dismissalType === 4) {
                    const fielderName = batsman.dismissalText.long.split(" ")[2].replace(/\(|\)/g, "");
                    const player = searchFielderName(fielderName, teamPlayers);
                    if (player) {
                        let playerStats = fieldingStats.get(player.playerId);
                        playerStats.runouts += 1;
                    }
                } else if (batsman.dismissalType === 5) {
                    const fielderName = batsman.dismissalText.long.split(" ")[1].replace(/\(|\)/g, "").replace("†", "");;
                    console.log(fielderName)
                    const player = searchFielderName(fielderName, teamPlayers);
                    if (player) {
                        let playerStats = fieldingStats.get(player.playerId);
                        playerStats.runouts += 1;
                    }
                }
            }
        });
    });

    return {
        "format": matchData.match.format,
        "teams": teams,
        "teamPlayers": teamPlayers,
        "batting": mapToJSON(battingStats),
        "bowling": mapToJSON(bowlingStats),
        "fielding": mapToJSON(fieldingStats),
    };
}

function searchFielderName(fielderName, teamPlayers) {
    return teamPlayers.find(player => player.name.includes(fielderName));
}

function mapToJSON(map) {
    const obj = {};
    for (let [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
}

async function getEspnData(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { getPlayerData, getMatchData };
