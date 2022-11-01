require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

// routes
const jobs = require('./routes/jobs/jobs');
const companies = require('./routes/companies/companies');
const users = require('./routes/users/users');
const feedbacks = require('./routes/feedbacks/feedbacks');
const profile = require('./routes/profile/profile');

mongoose.connect(`${process.env.MONGOCONNECTION}`)

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('https://mechio-test.onrender.com/poslodavci', companies);
app.use('https://mechio-test.onrender.com/posloprimci', users);
app.use('https://mechio-test.onrender.com/poslovi', jobs);
app.use('https://mechio-test.onrender.com/recenzije', feedbacks);
app.use('https://mechio-test.onrender.com/profil', profile);


app.listen(9000, (PORT) => {
    `Server started on port ${PORT}`;
})