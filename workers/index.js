const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CronJob = require('cron').CronJob;

const usersClassifierWorker = () => {
    
    const getLastActivityQuery = (startTime, endTime) => {
        return {
            $and: [
                { 'meta.lastActivity': { $lte: new Date(startTime) } }, // less than this minute(s) ago
                { 'meta.lastActivity': { $gte: new Date(endTime) } } // greater than this minute(s) ago
            ]
        }
    }

    new CronJob('*/1 * * * *', () => {
        let pastTimeByMinutes = []; // Minute is array index
        const currentTime = Date.now();
        for (let i = 1; i <= 5; i++) {
            pastTimeByMinutes[i] = currentTime - (i * 60000);
        }

        User.find(getLastActivityQuery(pastTimeByMinutes[1], pastTimeByMinutes[2]), (err, usersArrayOneToTwo) => {
            if (err) console.log(err);
            else {
                User.find(getLastActivityQuery(pastTimeByMinutes[2], pastTimeByMinutes[3]), (err, usersArrayTwoToThree) => {
                    if (err) console.log(err);
                    else {
                        User.find(getLastActivityQuery(pastTimeByMinutes[4], pastTimeByMinutes[5]), (err, usersArrayFourToFive) => {
                            if (err) console.log(err);
                            console.log('1-2 minutes ago: ' + usersArrayOneToTwo.length);
                            console.log('2-3 minutes ago: ' + usersArrayTwoToThree.length);
                            console.log('4-5 minutes ago: ' + usersArrayFourToFive.length);
                            console.log('---');
                        });
                    };
                });
            }
        });
    }, null, true).start();
}

module.exports = usersClassifierWorker;