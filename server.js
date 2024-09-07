const express = require('express');
const db = require('./db/db.json');

const PORT = 3001;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/data', (req, res) => {
    res.sendFile(db);
})


app.listen(PORT, () =>
    console.log(`Serving static asset routes on port ${PORT}!`)
);