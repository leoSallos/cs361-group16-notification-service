# Communication Contract: Notification Service

## Requesting Data
Clients communicate with the server using HTTP requests, and each notification is 
associated with a specific user via their `userID` in the path of the requests.
Notifications are sent as JSON objects, and each must include the required categories
of: name, date, time, status, and class.

**Request Parameters:**
- `userID` -> The ID of the user (varies per user).
- `unread` -> Fetch only unread notifications.
- `all` -> Fetch all notifications for the user.
- `remove` -> Delete all read notifications.

## Example Requests

##### Get unread notifications:
```
const response = await fetch(URL + "/unread/" + userID);
```

##### Get all notifications:
```
const response = await fetch(URL + "/all/" + userID);
```

##### Submit a new notification:
```
const response = await fetch(URL + "/add/" + userID, {
    method: "POST",
    body: await JSON.stringify({
        name: <notification name>,
        date: <notification date>,
        time: <notification time>,
        status: "unread",
        class: <notification status>,
    }),
    headers: {"Content-Type": "application/json"}
});
```

##### Remove all read notifications:
```
const response = await fetch(URL + "/all/" + userID);
```

## Receiving Data
The server always returns a JSON object in the following format. Each element in the notifications array is a notification object with these keys:
- `name` -> name of the notification
- `date` -> date of the notification
- `time` -> time of the notification
- `status` -> "unread" or "read"
- `class` -> type of notification ["alert", "warning", "reminder"]

##### Responses:
`200 OK` -> Notification successfuly submitted

`204 No Content` -> Notification not found

`400 Bad Request` -> Invalid request

`404 Not found` -> No entry found

`500 Server Error` -> Failed to write to database

### Example Receive:
```
const response = await fetch(URL + "/all/" + userID);
const resNotification = await response.json();

const name = resNotification.name;
const date = resNotification.date;
const time = resNotification.time;
const status = resNotification.status;
const class = resNotification.class;
```

## UML Sequence Diagram
![UML Sequence Diagram: Notification Service](images/uml_sequence.png)

