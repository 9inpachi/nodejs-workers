const express = require('express'),
    app = express();

// Including database configuration
require('./db/db');

app.set('port', 5000);
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/updateUsers', (req, res) => {
    const randomlyUpdateLastActivityOfUsers = require('./workers/index');

    let allUpdatedUsers = [];
    let allUsersEmails;
    let i = 1;

    randomlyUpdateLastActivityOfUsers(usersEmail => {
        allUsersEmails = usersEmail;
    }, (singleUpdatedUser) => {
        allUpdatedUsers.push(singleUpdatedUser);
        // We send the response when all updated users data has been collected
        if (allUsersEmails.length === i) {
            // Getting only email and lastActivity
            const allUsers = allUpdatedUsers.map((user) => {
                const lastActivity = [
                    user.meta.lastActivity.getHours(),
                    user.meta.lastActivity.getMinutes(),
                    user.meta.lastActivity.getSeconds()
                ].join(':');
                return {
                    email: user.email,
                    lastActivity: lastActivity
                }
            });
            res.send({
                users: JSON.stringify(allUsers)
            });
        }
        i++;
    });
});

app.listen(app.get('port'), () => {
    console.log('App started at http://localhost:' + app.get('port'));
});