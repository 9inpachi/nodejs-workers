const mongoose = require('mongoose');

// Connect to the local database
mongoose.connect('mongodb://localhost:27017/phlow', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log('ERROR CONNECTING TO THE DATABASE');
        console.log(err);
        process.exit(1);
    }
});

// Import models here so we don't have to include multiple files
require('./models');