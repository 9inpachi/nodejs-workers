const mongoose = require('mongoose'),
    User = mongoose.model('User');

// GET the users route
const randomlyUpdateLastActivityOfUsers = (emailsCallback, singleUpdatedUserCallback) => {
    // Getting random users
    User.aggregate([{ $sample: { size: 10 } }]).exec((err, data) => {
        if (err) console.log(err);
        const usersEmail = data.map(user => user.email);

        emailsCallback(usersEmail);

        // Setting random `lastActivity` times
        for (const userEmail of usersEmail) {
            // Getting random time between 1 to 5 minutes ago
            // 300000 ms = 5 mins | 60000 ms = 1 min
            const randomTimestamp = Date.now() - (Math.floor(Math.random() * 300000 /* maximum (5 mins) */) + 60000) /* minimum (1 min) */

            const randomDateTime = new Date(randomTimestamp);

            // Update users' `lastActivity`
            User.findOneAndUpdate({ 'email': userEmail },
                { $set: { 'meta.lastActivity': randomDateTime } },
                { new: true }, (err, doc) => {
                    if (err) console.log(err);
                    else {
                        singleUpdatedUserCallback(doc);
                    }
                });
        }
    });
}

module.exports = randomlyUpdateLastActivityOfUsers;