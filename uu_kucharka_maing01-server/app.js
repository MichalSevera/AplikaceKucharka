//načtení modulu express
const express = require("express");
const cors = require("cors");

const recipeRouter = require("./controller/recipe-controller");



//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.use((req, res, next) => { // simple logging middleware
  console.log(req.method + ": " + req.url);
  console.log('  Time: ', new Date().toISOString());
  next();
})

//jednoduchá definice routy s HTTP metodou GET, která pouze navrací text
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

// router pro recipe
app.use("/recipe", recipeRouter);


app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
