"use strict";
const Model = require('../models/jokebookModel');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Model.getCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failure to fetch categories" });
    }
};

exports.getJokesByCategory = async (req, res) => {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    try {
        const jokes = await Model.getJokesByCategory(category, limit);

        if (jokes.length === 0) {
            return res.status(404).json({ error: `no jokes for category ${category}` });
        }
        res.json(jokes);
    } catch (err) {
        console.error("DATABASE ERROR:", err);
        res.status(500).json({ error: "Failed to fetch jokes"});
    }
};

exports.getRandomJoke = async(req, res)=>{
    try{
        const joke = await Model.getRandomJoke();
        res.json(joke);
    } catch (err) {
        res.status(500).json({error: "Failed to fetch random joke"});
    }
}

exports.addJoke = async(req,res) => {
    const { category, setup, delivery} = req.body;

    if(!category || !setup || !delivery){
        return res.status(400).json({ error: "invalid or insufficient user input"});
    }

    try{
        const updatedJokes = await Model.addJoke(category, setup, delivery);
        res.json(updatedJokes);
    } catch (err) {
        res.status(500).json({ error: "Failed to add joke"});
    }
};