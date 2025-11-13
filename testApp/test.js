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

// submit request
async function submitData(data){
    await fetch(serverURL + "new/" + userID, {
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

// get request
async function getData(type, userID){
    await fetch(serverURL + type + "/" + userID).then(async function(res){
        console.log("\t" + res.status + " " + res.statusText);
        if (res.ok){
            console.log(await res.json(), "\n");
        }
    });
}

// get tests
async function getTests(){
    console.log("Get unread:");
    await getData("unread", userID);
    console.log("Get all:");
    await getData("all", userID);
    console.log("Get bad user:");
    await getData("all", "0001");
}


// execute tests
async function tests(){
    await submitTests();
    await getTests();
}

tests()
