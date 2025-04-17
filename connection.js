var mysql = require("mysql");
var util = require("util");
var conn = mysql.createConnection({
    "host":"bqhi9apuxaovmnku3s9i-mysql.services.clever-cloud.com",
    "user":"uzn4gfr519yqntgd",
    "password":"drKod6S4pXQtLhS84CNp",
    "database":"bqhi9apuxaovmnku3s9i"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
