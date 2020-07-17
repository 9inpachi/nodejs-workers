const { getMinutesAgo } = require('../lib/helpers');

const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Jobs = mongoose.model('Jobs'),
    CronJob = require('cron').CronJob,
    { getMinsFromMs } = require('../lib/helpers');

// Worker for classifying users every minute based on last activity
const usersClassifierWorker = () => {
    // Get last activity query based on the start and end range
    const getLastActivityQuery = (startTime, endTime) => {
        return {
            'meta.lastActivity': {
                $lte: new Date(startTime), // less than this minute(s) ago
                $gte: new Date(endTime) // greater than this minute(s) ago
            }
        }
    }

    let runNumber = 0;

    const classifyUsers = () => {

        Jobs.findOneAndUpdate({ classifyUsersTimeDecrement: { $exists: true } },
            { $setOnInsert: { classifyUsersTimeDecrement: 0 } },
            { new: true, upsert: true, useFindAndModify: false },
            (err, jobsDoc) => {
                if (err) console.log(err);
                else {
                    let pastTimeByMinutes = []; // Minute is array index
                    const currentTime = Date.now();
                    for (let i = 1; i <= 5; i++) {
                        pastTimeByMinutes[i] = currentTime - (i * 60000) - (jobsDoc.classifyUsersTimeDecrement * 60000);
                    }

                    User.find({
                        $or: [
                            getLastActivityQuery(pastTimeByMinutes[1], pastTimeByMinutes[3]), // Find the users between 1 and 3 minutes (1-3 minutes ago)
                            getLastActivityQuery(pastTimeByMinutes[4], pastTimeByMinutes[5]) // Find the users between 4 and 5 minutes (4-5 minutes ago)
                        ]
                    }, (err, usersArray) => {
                        if (err) console.log(err);
                        else {
                            const currentDateDecremented = new Date(currentTime - jobsDoc.classifyUsersTimeDecrement * 60000);
                            // 1-2 minutes - 1 < lastActivity < 2
                            const usersArrayOneToTwo = usersArray.filter(user => {
                                return getMinutesAgo(user.meta.lastActivity, currentDateDecremented) === '1-2 minutes ago';
                            });
                            // 2-3 minutes - 2 < lastActivity < 3
                            const usersArrayTwoToThree = usersArray.filter(user => {
                                return getMinutesAgo(user.meta.lastActivity, currentDateDecremented) === '2-3 minutes ago';
                            });
                            // 4-5 minutes - 4 < lastActivity < 5
                            const usersArrayFourToFive = usersArray.filter(user => {
                                return getMinutesAgo(user.meta.lastActivity, currentDateDecremented) === '4-5 minutes ago';
                            });
                            console.log('1-2 minutes ago: ' + usersArrayOneToTwo.length);
                            console.log('2-3 minutes ago: ' + usersArrayTwoToThree.length);
                            console.log('4-5 minutes ago: ' + usersArrayFourToFive.length);
                            console.log('---');
                            runNumber++;
                            // Check if the job has ran for a multiple of 5 minutes
                            if (runNumber % 5 === 0) {
                                // Increase the time by which the future time is to be descreased - for another cycle
                                jobsDoc.classifyUsersTimeDecrement += 5;
                                jobsDoc.save();
                                console.log('---');
                                console.log('5 minutes mark');
                                console.log('---');
                            }
                        }
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