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
    console.log("Good data submit: (OK)");
    await submitData(goodData)

    console.log("Bad data submit: (Bad Request)");
    await submitData(badData)
}

// get request
async function getData(type, userID){
    await fetch(serverURL + type + "/" + userID).then(async function(res){
        console.log("\t" + res.status + " " + res.statusText);
        if (res.ok){
            console.log(await res.json());
        }
    });
}

// get tests
async function getTests(){
    console.log("Get unread: (1 Unread)");
    await getData("unread", userID);
    
    console.log("Get all: (1 Read)");
    await getData("all", userID);

    console.log("Get no unread: (Empty)");
    await getData("unread", userID);

    console.log("Get bad user: (Not Found)");
    await getData("all", "0001");
}

// remove request
async function removeRead(userID){
    await fetch(serverURL + "remove/" + userID).then(async function(res){
        console.log("\t" + res.status + " " + res.statusText);
    });
}

// remove tests
async function removeTests(){
    console.log("Add 1 unread:");
    await submitData(goodData);
    console.log("Remove all read: (1 Unread)");
    await removeRead(userID);
    await getData("all", userID);

    console.log("Remove last: (Empty)");
    await removeRead(userID);
    await getData("all", userID);

    console.log("Remove empty: (OK)");
    await removeRead(userID);

    console.log("Bad remove user: (Not Found)");
    await removeRead("0001");
}

// execute tests
async function tests(){
    console.log("=================");
    console.log("Submit Tests");
    console.log("=================\n");
    await submitTests();

    console.log("\n=================");
    console.log("Get Tests");
    console.log("=================\n");
    await getTests();
    
    console.log("\n=================");
    console.log("Remove Tests");
    console.log("=================\n");
    await removeTests();
}

tests()
