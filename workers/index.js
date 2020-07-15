const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CronJob = require('cron').CronJob;

// Worker for classifying users every minute based on last activity
const usersClassifierWorker = () => {
    // Get last activity query based on the start and end range
    const getLastActivityQuery = (startTime, endTime) => {
        return {
            $and: [
                { 'meta.lastActivity': { $lte: new Date(startTime) } }, // less than this minute(s) ago
                { 'meta.lastActivity': { $gte: new Date(endTime) } } // greater than this minute(s) ago
            ]
        }
    }

    let runNumber = 0;
    let minutesDecrement = 0;

    const classifyUsers = () => {
        let pastTimeByMinutes = []; // Minute is array index
        const currentTime = Date.now();
        for (let i = 1; i <= 5; i++) {
            pastTimeByMinutes[i] = currentTime - (i * 60000) - (minutesDecrement * 60000);
        }

        // Find the users between 1 and 2 minutes (1-2 minutes ago)
        User.find(getLastActivityQuery(pastTimeByMinutes[1], pastTimeByMinutes[2]), (err, usersArrayOneToTwo) => {
            if (err) console.log(err);
            else {
                // Find the users between 2 and 3 minutes (2-3 minutes ago)
                User.find(getLastActivityQuery(pastTimeByMinutes[2], pastTimeByMinutes[3]), (err, usersArrayTwoToThree) => {
                    if (err) console.log(err);
                    else {
                        // Find the users between 4 and 5 minutes (4-5 minutes ago)
                        User.find(getLastActivityQuery(pastTimeByMinutes[4], pastTimeByMinutes[5]), (err, usersArrayFourToFive) => {
                            if (err) console.log(err);
                            console.log('1-2 minutes ago: ' + usersArrayOneToTwo.length);
                            console.log('2-3 minutes ago: ' + usersArrayTwoToThree.length);
                            console.log('4-5 minutes ago: ' + usersArrayFourToFive.length);
                            console.log('---');
                            runNumber++;
                            // Check if the job has ran for a multiple of 5 minutes
                            if (runNumber % 5 === 0) {
                                // Increase the time by which the future time is to be descreased - for another cycle
                                minutesDecrement += 5;
                                console.log('---');
                                console.log('5 minutes mark');
                                console.log('---');
                            }
                        });
                    };
                });
            }
        });
    }

    // USING setInterval

    // classifyUsers();
    // setInterval(() => {
    //     classifyUsers();
    // }, 60000);

    // USING cron

    // Run a cron job for classifying users every second
    new CronJob('*/1 * * * *', () => {
        classifyUsers();
    }, null, true, null, null, true).start();
}

module.exports = usersClassifierWorker;