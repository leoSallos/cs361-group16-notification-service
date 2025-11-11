var fs = require("fs")
var express = require("express")
var app = express()
const port = 8000

// send webpage
app.get("/", function(req, res, next) {
    res.status(200).sendFile(__dirname + "/testIndex.html");
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
