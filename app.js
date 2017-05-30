const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;

const getCalendarEvents = require('./util/googleCalendar.js');
const cache = require('./util/cache.js');
const auth = require('./util/auth.js');
const helloWorld = require('./util/helloWorld.js');

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/auth', auth, cache, getCalendarEvents );
app.get('/calendar-events', cache, getCalendarEvents)

app.listen(PORT, function () {
    console.log(`Example app listening on port ! ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
});
