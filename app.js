const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const getCalendarEvents = require('./util/google_calendar.js');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/calendar-events', function (req, res) {
  getCalendarEvents(req, res);
});

app.listen(3007, function () {
    console.log('Example app listening on port 3007!');
    console.log('http://localhost:3007/');
});
