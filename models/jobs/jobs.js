const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    companyImage: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirementsList: {
        type: Array,
        required: true
    },
    benefitsList:  {
        type: Array,
        required: true
    },
    skillsList: {
        type: Array,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    seniority: {
        type: String,
        required: true
    },
    pay: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
});

const Jobs = mongoose.model('jobs', JobSchema);


module.exports = {
    Jobs,
    JobSchema
};