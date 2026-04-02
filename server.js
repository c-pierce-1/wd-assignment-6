"use strict";

require('dotenv').config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get('/test', (req, res) => {
    res.json({ message: "Express server live" });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});