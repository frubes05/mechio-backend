require('dotenv').config();
require('child_process').fork('./scrapping/puppeteerCV.js');
require('child_process').fork('./scrapping/puppeteerEmployees.js');
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
const tracking = require('./routes/tracking/tracking');
const payments = require('./routes/payments/payments');
const advices = require('./routes/advices/advices');

mongoose.connect(`${process.env.MONGOCONNECTION}`)

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/poslodavci', companies);
app.use('/posloprimci', users);
app.use('/poslovi', jobs);
app.use('/recenzije', feedbacks);
app.use('/profil', profile);
app.use('/analitika', tracking);
app.use('/placanja', payments);
app.use('/savjeti', advices);


app.listen(9000, (PORT) => {
    `Server started on port ${PORT}`;
})