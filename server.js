const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(__dirname + '/dist/GEPE'));

// Catch-all route to index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/GEPGE/index.html'));
});

// Listen on port 8000 by default
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});