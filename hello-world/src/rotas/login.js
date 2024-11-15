const path = require('path');

function login (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
}

module.exports = {login}