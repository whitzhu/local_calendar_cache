const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const redisClient = require('./redisConfig');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'goodtime-google-calendar.json';

const authorize = function(req, res, credentials, callback ) {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(req, res, oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(req, res, oauth2Client);
    }
  });
}

const getNewToken = function(req, res, oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  const code = req.code;
  code === undefined ? res.redirect(authUrl) : null ;
  oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
      res.redirect('/calendar-events');
  })
}

const storeNewToken = function(req, res, oauth2Client, callback) {
  oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
}

const storeToken = function(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

const listEvents = function(req, res, auth) {
  const calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
      res.send('No upcoming events found.')
    } else {
      events = events.map( event => {
        return { start: event.start, end: event.end, title: event.summary, description: event.description, attendees: event.attendees}
      })

      events = JSON.stringify(events);

      redisClient.setexAsync('user:events', 600, events)
        .then( console.log('SUCCESS: caching event(s)'))
        .catch( err => console.error('ERROR: caching event(s): ', err));

      res.send(events);
    }
  });
  return 'listevents return something';
}

const getCalendarEvents = function(req, res) {
  console.log('getCalendarEvents invoked!');
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    authorize(req, res, JSON.parse(content), listEvents);
  });
}

module.exports = getCalendarEvents;