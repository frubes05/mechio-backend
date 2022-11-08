const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: true,
    },
    companyImage: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true,
    },
    positives: {
        type: String,
        required: true,
    },
    negatives: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
})

const Feedback = mongoose.model('feedbacks', FeedbackSchema);

module.exports = {
    Feedback,
    FeedbackSchema
};