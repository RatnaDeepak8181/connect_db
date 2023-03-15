const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
module.exports = app;
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
        *
    FROM
        cricket_team
    order by 
        player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});
module.exports = app;

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
        INSERT INTO
            cricket_team(playerName,jerseyNumber,role)
        VALUES (
            "Vishal",17,"Bowler"
        );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

module.exports = app;

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerIdQuery = `
        SELECT
            *
        FROM
            cricket_team
        WHERE
            player_id - ${playerId};`;
  const playerArray = await db.all(getPlayerIdQuery);
  response.send(playerArray);
});

module.exports = app;

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
        UPDATE
            cricket_team
        SET
            playerName = "Maneesh",
            jerseyNumber = 54,
            role = "All-rounder"
        WHERE 
            player_Id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

module.exports = app;

app.delete("/players/:playerId", async (response, request) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM 
            cricket_team
        WHERE 
            player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
