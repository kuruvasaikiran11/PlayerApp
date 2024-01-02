const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
var cors = require("cors");
const Player = require("./models/player.model");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://kuruvasaikiran11:Kurnool123@cluster0.z1ij6vp.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(async () => {
    const PlayerDetails = await Player.find();
    // console.log(PlayerDetails);
    // Set up EJS as the view engine
    app.set("view engine", "ejs");

    // Home page route
    app.get("/", (req, res) => {
      res.render("index");
    });

    // Declare a global variable to store the current player index
    let currentPlayerIndex = 0;

    app.get("/players", async (req, res) => {
      try {
        // Fetch all players from the database
        const players = await Player.find({});
        if (!players || players.length === 0) {
          return res.send("No player data found.");
        }

        // Set the current player index to the first player
        currentPlayerIndex = 0;

        res.render("player", { player: players[currentPlayerIndex] });
      } catch (err) {
        console.error(err);
        res.send("Error fetching player data.");
      }
    });

    app.get("/players/next", async (req, res) => {
      try {
        // Fetch all players from the database
        const players = await Player.find({});
        if (!players || players.length === 0) {
          return res.send("No player data found.");
        }

        // Increment the current player index or reset to 0 if at the end
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

        res.render("player", { player: players[currentPlayerIndex] });
      } catch (err) {
        console.error(err);
        res.send("Error fetching next player data.");
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
