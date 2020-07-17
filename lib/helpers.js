// Helper functions

// Get random integer within a range excluding a particular range
const getRandomInRangeWithExclude = (min, max, excludeMin, excludeMax) => {
    const randomNumber = Math.floor(Math.random() * max) + min;
    if (randomNumber < excludeMin || randomNumber > excludeMax) {
        return randomNumber;
    } else {
        return getRandomInRangeWithExclude(min, max, excludeMin, excludeMax);
    }
};

// Get milliseconds from minutes
const getMsFromMins = (mins) => {
    return mins * 60000;
};

// Get minutes from milliseconds
const getMinsFromMs = (ms) => {
    return ms / 1000 / 60;
};

// Get minutes ago string based on past date
const getMinutesAgo = (pastDate, currentDate) => {
    if (!currentDate) {
        currentDate = new Date();
    }
    const timeDifference = currentDate.getTime() - pastDate.getTime();

    if (timeDifference >= getMsFromMins(1) && timeDifference <= getMsFromMins(2)) {
        return '1-2 minutes ago';
    } else if (timeDifference >= getMsFromMins(2) && timeDifference <= getMsFromMins(3)) {
        return '2-3 minutes ago';
    } 
    // There is no 3-4 minutes ago in the task - skipping assuming this was intentional
    else if (timeDifference >= getMsFromMins(4) && timeDifference <= getMsFromMins(5)) {
        return '4-5 minutes ago';
    }
};

module.exports = {
    getRandomInRangeWithExclude,
    getMinutesAgo,
    getMinsFromMs,
    getMsFromMins
}