const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common'));
app.use(cors());

const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { search = '', sort, genre } = req.query;

    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send(`Sort must be one of Rating or App. You used ${sort}`);
        }
    }

    if (genre) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
            return res
                .status(400)
                .send('Genre must be one of "Action", "Puzzle", "Strategy", "Casual", "Arcade", or "Card".')
        }
    }

    let results = apps
        .filter(app =>
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    if (genre) {
        results = results
            .filter(app => 
                app
                    .Genres
                    .toLowerCase()
                    .includes(genre.toLowerCase())
            );
    }

    if (sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            });
    }

    res.json(results);

});

module.exports = app;
