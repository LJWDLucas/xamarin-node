const mongoose = require('mongoose');

const Deliverable = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: String,
    required: true
  },
  assignmentId: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  score: Number,
  submissionDate: Date
});

module.exports = mongoose.model('Deliverable', Deliverable);
