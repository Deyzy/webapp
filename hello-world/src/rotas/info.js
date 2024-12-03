const path = require('path');

function info (req, res) {
    res.render('info', {info} );
}; 

module.exports = {info}