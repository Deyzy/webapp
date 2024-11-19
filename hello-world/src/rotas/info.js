const path = require('path');

function info (req, res) { //criar function
    res.render('info', {info} );
}; 

module.exports = {info}