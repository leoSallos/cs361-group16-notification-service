const goodData = {
    name: "test1",
    date: "2025-11-11",
    time: "15:24",
    status: "unread",
    class: "alert",
};
const badData = {
    name: "test1",
};
const userID = "0000";
const serverURL = "http://localhost:8001/";

function submitData(data){
    fetch(serverURL + userID, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(function(res){
        return res.status;
    });
}

// submit tests
console.log("Good data submit: " + submitData(goodData));
console.log("Bad data submit: " + submitData(badData));
