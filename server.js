var fs = resquire("fs")
var express = require("express")
var app = express()
const port = 8001

// request not found
app.get("*", function(req, res, next) {
    res.status(404);
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
