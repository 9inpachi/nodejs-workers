// Helper functions

const getRandomInRangeWithExclude = (min, max, excludeMin, excludeMax) => {
    const randomNumber = Math.floor(Math.random() * max) + min;
    if (randomNumber < excludeMin || randomNumber > excludeMax) {
        return randomNumber;
    } else {
        return getRandomInRangeWithExclude(min, max, excludeMin, excludeMax);
    }
};

const getMinsInMs = (mins) => {
    return mins * 60000;
};

const getMinutesAgo = (pastDate, currentDate) => {
    if (!currentDate) {
        currentDate = new Date();
    }
    const timeDifference = currentDate.getTime() - pastDate.getTime();

    if (timeDifference >= getMinsInMs(1) && timeDifference <= getMinsInMs(2)) {
        return '1-2 minutes ago';
    } else if (timeDifference >= getMinsInMs(2) && timeDifference <= getMinsInMs(3)) {
        return '2-3 minutes ago';
    } 
    // There is no 3-4 minutes ago in the task - skipping assuming this was intentional
    else if (timeDifference >= getMinsInMs(4) && timeDifference <= getMinsInMs(5)) {
        return '4-5 minutes ago';
    }
};

module.exports = {
    getRandomInRangeWithExclude,
    getMinutesAgo
}