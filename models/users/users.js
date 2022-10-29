const mongoose = require("mongoose");
const { JobSchema } = require("../../models/jobs/jobs");
const { FeedbackSchema } = require("../../models/feedbacks/feedbacks");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: false,
  },
  cv: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  applications: [JobSchema],
});

const Users = mongoose.model("users", UserSchema);

module.exports = {
  UserSchema,
  Users,
};
