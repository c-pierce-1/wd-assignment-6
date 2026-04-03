"use strict";

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

exports.getCategories = async () => {
    const result = await pool.query('SELECT name FROM categories');
    return result.rows.map(row => row.name);
}

exports.getJokesByCategory = async (category, limit) => {
    let query = ` SELECT j.setup, j.delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = $1`;
    let params = [category];

    if (limit) {
        query += ' LIMIT $2';
        params.push(limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
}

exports.getRandomJoke = async () => {
    const result = await pool.query('SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1');
    return result.rows[0];
}

exports.addJoke = async (category, setup, delivery) => {
    let catResult = await pool.query('SELECT id FROM categories WHERE name = $1', [category]);

    let categoryId;
    if(catResult.rows.length === 0){
        const newCat = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [category]);
        categoryId = newCat.rows[0].id;
    } else{
        categoryId = catResult.rows[0].id;
    }
    await pool.query(
        'INSERT INTO jokes (setup, delivery, category_id) VALUES ($1, $2, $3)',[setup, delivery, categoryId]
    );

    return exports.getJokesByCategory(category);
};