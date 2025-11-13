var fs = require("fs").promises
var express = require("express")
var app = express()
app.use(express.static(__dirname));
app.use(express.json())
const port = 8003

//
// setup environment
//
fs.mkdir(__dirname + "/data/", {recursive: true})
    .then(() => console.log("Database setup"))
    .catch(err => console.log("Error creating directory: " + err));
console.log("Listening on port: " + port);

// 
// Server Actions
//

// server ping
app.get("/", function(req, res, next) {
    console.log("Ping recieved")
    res.status(204);
});

// client gets all notifications
app.get("/all/:userID", async function(req, res, next) {
    console.log("Get all notifications request recieved");

    // get user information
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.error("User data could not be retrieved.");
        res.status(404).send("User data not found.");
        return;
    }

    // get all notifications
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        res.status(204).send("User has no notifications.");
        return;
    }

    // mark all notifiactions as read
    const resUserData = userData;
    for (var i = 0; i < userData.notifications.length; i++){
        userData.notifications[i].status = "read";
    }

    // save notifications
    var newUserDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, newUserDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }

    // send data to user
    console.log("Sending success");
    res.status(200).json(resUserData);
});

// client gets unread notifications
app.get("/unread/:userID", async function(req, res, next) {
    console.log("Get unread notifications request recieved");

    // get user information
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.error("User data could not be retrieved.");
        res.status(404).send("User data not found.");
        return;
    }

    // get all notifications
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        res.status(204).send("User has no notifications.");
        return;
    }

    // filter read notifications and mark unread as read after loading into res
    var resUserData = {notifications: []};
    for (var i = 0; i < userData.notifications.length; i++){
        if (userData.notifications[i].status == "unread"){
            resUserData.notifications.push(userData.notifications[i]);
            userData.notifications.status = "read";
        }
    }

    // save notifications
    var newUserDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, newUserDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }

    // send data to user
    console.log("Sending success");
    res.status(200).json(resUserData);
});


// client posts new notification
app.post("/new/:userID", async function(req, res, next) {
    console.log("Add notification request recieved");

    // get user information
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.log("User data doesn't exist, making new data file.");
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
        console.error("Request error");
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
    userDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, userDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }
    console.log("Sending success");
    res.status(200).send({test: "Notification successfully submitted."});
});

// client removes read notifications
app.get("/remove/:userID", async function(req, res, next){
    console.log("Remove request recieved");

    // get user information
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.error("User data could not be retrieved.");
        res.status(404).send("User data not found.");
        return;
    }

    // parse file data
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        var userData = {notifications: []};
    }

    // remove read notifications
    for (var i = 0; i < userData.notifications.length; i++){
        if (userData.notifications[i].status = "read"){
            userData.notifications.splice(i, 1);
            i--;
        }
    }

    // save notifications
    var newUserDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, newUserDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }

    // send response to user
    console.log("Sending success");
    res.status(200).send("All read notifications removed");
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
