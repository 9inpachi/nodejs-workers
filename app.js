const express = require('express'),
    app = express(),
    { getMinutesAgo } = require('./lib/helpers');

// Including database configuration
require('./db/db');

app.set('port', 5000);
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/updateUsers', (req, res) => {
    const updateLastActivity = require('./lib/updateLastActivity');

    let allUpdatedUsers = [];
    let allUsersEmails;
    let i = 0;

    updateLastActivity(10, usersEmail => {
        allUsersEmails = usersEmail;
    }, (singleUpdatedUser) => {
        i++;
        allUpdatedUsers.push(singleUpdatedUser);
        // We send the response when all updated users data has been collected
        if (allUsersEmails.length === i) {
            // Getting only email and lastActivity
            const allUsers = allUpdatedUsers.map((user) => {
                return {
                    email: user.email,
                    lastActivity: getMinutesAgo(user.meta.lastActivity)
                }
            });
            res.header('Content-Type', 'application/json');
            res.send(JSON.stringify(allUsers, null, 2));
        }
    });
});

// Worker
const usersClassifierWorker = require('./workers');
usersClassifierWorker();

app.listen(app.get('port'), () => {
    console.log('App started at http://localhost:' + app.get('port'));
});