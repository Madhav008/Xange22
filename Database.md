# Seed the Player 10 recent matches
    1. Get the Player
    2. Get the 10 recent matches
    3. Pass the matchesid and series id in the worker 


## System design for Player Performance

    1. Select the Player
    2. Find the Player in the Matches Collection
    3. Get the Stats of the That Match of the Player from the Stats Collection
    4. Save the Average Points and Price in the Performance Collection
    5. Create the Date of the Player Performance of that Match 

## Batting Collection

    Total Points 
    Stats
    PlayerId
    MatchId

## Fielding Collection

    Total Points 
    Stats
    PlayerId
    MatchId

## Bowling Collection

    Total Points 
    Stats
    PlayerId
    MatchId

## Match Collection

    MatchId
    PlayerId
    Date

## Average_Points Collection

    "_id": "player123"
    "price":"35"
    "averageBattingPoints": 75.2
    "averageBowlingPoints": 55.8
    "averageFieldingPoints": 90.5
    "date": "2015-2-12"
