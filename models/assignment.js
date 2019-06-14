const mongoose = require('mongoose');

/*
Score mechanism
0 - None
1 - Score between 1 and 10
2 - Score between 1 and 5
*/

const Assignment = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true,
    maxLength: 50000
  },
  assignmentName: {
    type: String,
    required: true,
    maxlength: 500
  },
  scoreMechanism: {
    type: Number,
    required: true,
    validate: v => [0, 1, 2].indexOf(v) > -1
  },
  dueDate: Date,
  deliveredAssignments: Array
});

module.exports = mongoose.model('Assignment', Assignment);
