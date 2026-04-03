"use strict";

/** Display a random joke and categories by default, by calling the respective functions */
document.addEventListener("DOMContentLoaded", () => {
    loadRandomJoke();
    loadCategories();
});

/**fetch a random joke and make an element for it */
async function loadRandomJoke() {
    try {
        const response = await fetch('/jokebook/random');
        const joke = await response.json();

        const container = document.getElementById('random-joke-container');
        container.innerHTML = '';

        const setupText = document.createElement('p');
        setupText.innerHTML = `<strong>${joke.setup}</strong>`;

        const deliveryText = document.createElement('p');
        deliveryText.textContent = joke.delivery;

        container.appendChild(setupText);
        container.appendChild(deliveryText);
    } catch (error) {
        console.error("Error loading random joke:", error);
    }
}

/**fetch categories and make elements for them, clickable */
async function loadCategories() {
    try {
        const response = await fetch('/jokebook/categories');
        const categories = await response.json();

        const buttonContainer = document.getElementById('category-buttons');
        buttonContainer.innerHTML = '';

        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.textContent = category;

            btn.addEventListener('click', () => {
                console.log(`${category} jokes loading.`);
                fetchCategoryJokes(category);
            });

            buttonContainer.appendChild(btn);
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

/** Get jokes from one category and make elements for them */
async function fetchCategoryJokes(category) {
    const title = document.getElementById('current-category-title');
    const container = document.getElementById('jokes-container');

    try {
        const response = await fetch(`/jokebook/category/${category}`);

        if (!response.ok) {
            title.textContent = "Category not found!";
            container.innerHTML = `<p>No jokes exist for "${category}" yet.</p>`;
            return;
        }

        const jokes = await response.json();

        title.textContent = `Jokes in: ${category}`;
        container.innerHTML = ''; // Clear out the old jokes

        jokes.forEach(joke => {
            const jokeDiv = document.createElement('div');
            jokeDiv.classList.add('joke-card');

            jokeDiv.innerHTML = `
                <p><strong>Q:</strong> ${joke.setup}</p>
                <p><strong>A:</strong> ${joke.delivery}</p>
                <hr>
            `;
            container.appendChild(jokeDiv);
        });

    } catch (error) {
        console.error("Error fetching category jokes:", error);
    }
}

document.getElementById('search-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-category').value.trim();
    if (searchInput !== "") {
        fetchCategoryJokes(searchInput);
    }
});

document.getElementById('add-joke-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const category = document.getElementById('new-category').value.trim();
    const setup = document.getElementById('new-setup').value.trim();
    const delivery = document.getElementById('new-delivery').value.trim();

    try {
        const response = await fetch('/jokebook/joke/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, setup, delivery })
        });

        if (!response.ok) {
            alert("Error adding joke. Check your inputs!");
            return;
        }

        fetchCategoryJokes(category);

        document.getElementById('add-joke-form').reset();

        loadCategories();

    } catch (error) {
        console.error("Error adding joke:", error);
    }
});