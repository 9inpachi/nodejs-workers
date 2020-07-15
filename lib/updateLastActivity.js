const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    { getRandomInRangeWithExclude } = require('./helpers');

// Set random last activity of random users
const randomlyUpdateLastActivityOfUsers = (usersCount, onUsersUpdated) => {
    // Getting random users
    User.aggregate([{ $sample: { size: usersCount } }]).exec((err, data) => {
        if (err) console.log(err);
        const usersEmail = data.map(user => user.email);

        let allUsersUpdatedDocs = [];
        let i = 0;
        // Setting random `lastActivity` times
        for (const userEmail of usersEmail) {
            // Getting random time between 1 to 5 minutes ago and excluding 3 to 4 minutes ago
            // 240000 ms = < 5 mins | 60000 ms = 1 min | 180000 ms = 3 mins | 240000 ms = 4 mins
            const randomValue = getRandomInRangeWithExclude(60000 /*1*/, 240000 /*< 5*/, 180000 /*3 exclude min*/, 240000 /*4 exclude max*/);
            const randomTimestamp = Date.now() - randomValue;

            const randomDateTime = new Date(randomTimestamp);

            // Update users' `lastActivity`
            User.findOneAndUpdate({ 'email': userEmail },
                { $set: { 'meta.lastActivity': randomDateTime } },
                { useFindAndModify: false, new: true }, (err, doc) => {
                    if (err) console.log(err);
                    else {
                        i++;
                        allUsersUpdatedDocs.push(doc);
                        if (i === usersEmail.length) {
                            if (onUsersUpdated) {
                                onUsersUpdated(allUsersUpdatedDocs);
                            }
                        }
                    }
                });
        }
    });
}

module.exports = randomlyUpdateLastActivityOfUsers;