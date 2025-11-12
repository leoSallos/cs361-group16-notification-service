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
const serverURL = "http://localhost:8003/";

async function submitData(data){
    await fetch(serverURL + userID, {
        method: "POST",
        body: await JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(function(res){
        console.log("\t" + res.status + " " + res.statusText);
    });
}

// submit tests
async function submitTests(){
    console.log("Good data submit:");
    await submitData(goodData)
    console.log("Bad data submit:");
    await submitData(badData)
}

submitTests();
