const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/phlow', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log('ERROR CONNECTING TO THE DATABASE');
        console.log(err);
        process.exit(1);
    }
});

require('./models');