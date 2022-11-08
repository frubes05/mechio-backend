const mongoose = require("mongoose");
const { FeedbackSchema } = require("../feedbacks/feedbacks");

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyPassword: {
    type: String,
    required: true,
  },
  companyDescription: {
    type: String,
    required: false,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  companyNumber: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyImage: {
    type: String,
    required: false,
  },
  companyPremium: {
    type: Boolean,
    required: false
  },
  companyFeedbacks: [FeedbackSchema]
});

const Companies = mongoose.model("companies", CompanySchema);

module.exports = Companies;
