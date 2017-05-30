# gt-local-calendar-sync
A simple calendar syncing system that keeps a local cache of calendar events that sync to Google Calendar API.

Devise and implement a simple cache system that allows an endpoint that serves a list of calendar events from a logged in user's Google calendar while limiting the number of API hits to Google Calendar by holding a local cache of events.

## Guidelines
1. The cache can be built in any way you see fit as long as it persistants beyond server restarts.
2. Response of GET request should return JSON

## Requirements
The server should respond to the following request via JSON in the format of the sample output below

### GET /calendar-events
* If the user is not logged in, redirect to login page for Google Calendar to authorize user. After auth, redirect to /calendar-events endpoint
* Show a list of upcoming calendar events with event data:
  * Event Title
  * Event Description
  * List of Attendees (with attendance reponse)

#### GET Params
| Params  | Required | Description |
| ------- | -------- | ----------- |
| startDate | false  | ISO date format string. If present, bounds all events returned by the query to have a starting event datetime >= to value. (i.e. '2017-01-17T03:36:22.321Z') |
| endDate   | false  | ISO date format string. If present, bounds all events returned by the query to have a starting event datetime <= to value. (i.e. '2017-01-17T03:36:22.321Z') |

#### Sample Output
```javascript
[
  {
    "start": {
      "date": "2017-05-30"
    },
    "end": {
      "date": "2017-05-31"
    },
    "title": "Technical Phone Screen"
  },
  {
    "start": {
      "dateTime": "2017-05-30T14:30:00-07:00"
    },
    "end": {
      "dateTime": "2017-05-30T17:00:00-07:00"
    },
    "title": "On-Site Interview: Steve Bottoms and Joe Jose",
    "description": "On-Site Interview for Steve Bottoms to meet with Team at ABC co",
    "attendees": [
      {
        "email": "stevebottoms@gmail.com",
        "displayName": "Steve Bottoms",
        "self": true,
        "responseStatus": "accepted"
      },
      {
        "email": "joejose@abc.co",
        "displayName": "Joe Jose",
        "responseStatus": "accepted"
      },
      {
        "email": "markyu@abc.co",
        "displayName": "Mark Yu",
        "responseStatus": "needsAction"
      }
    ]
  },
     // ... additional events
    }
   ]
 }
}
```

## Running the Project
1. Install node.js and npm
2. CD into directory and run 'npm install'
3. Download Google Calendar Credientials 'client_secret.json' 
4. Run 'redis-server'
5. Run 'npm run start'
6. Go to browser and navigate to http://localhost:3007/ for Hello World
7. Go to browser and navigate to http://localhost:3007/calendar-events for Recent Calendar Events
