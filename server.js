var fs = require("fs").promises
var express = require("express")
var app = express()
app.use(express.static(__dirname));
app.use(express.json())
const port = 8003

//
// setup environment
//

console.log("Listening on port: " + port);

// 
// Server Actions
//

// server ping
app.get("/", function(req, res, next) {
    console.log("Ping recieved")
    res.status(204);
});

// client gets notifications


// client posts new notification
app.post("/:userID", async function(req, res, next) {
    console.log("Add notification request recieved");

    // get user information
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.log("Data file read error: " + err);
        var userDataString = undefined;
    }
    if (userDataString){
        var userData = JSON.parse(userDataString);
    } else {
        var userData = undefined;
    }

    // get data to import
    console.log(req.body);
    var data = req.body;
    if (!data.name || !data.time || !data.status || !data.class){
        console.log("Request error");
        res.status(400).send("Improper request body format.");
        return;
    }

    // save data
    if (userData){
        userData.notifications.push({
            name: data.name,
            time: data.time,
            status: data.status,
            class: data.class,
        });
    } else {
        userData = {
            notifications: [
                {
                    name: data.name,
                    time: data.time,
                    status: data.status,
                    class: data.class,
                },
            ],
        };
    }
    var userDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, userDataString, "utf8");
    } catch (err) {
        console.log("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }
    console.log("Sending success");
    res.status(200).send("Notification successfully submitted.");
});

// client removes read notifications


// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
