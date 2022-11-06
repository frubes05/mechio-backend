const mongoose = require("mongoose");

const TrackingSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  isEmployed: {
    type: Boolean,
    required: false
  },
  isRegistered: {
    type: Boolean,
    required: false
  },
  companyId: {
    type: String,
    required: false
  },
  jobId: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: false
  },
  userLocation: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  }
});

const Tracking = mongoose.model("tracking", TrackingSchema);

module.exports = {
  TrackingSchema,
  Tracking
};
