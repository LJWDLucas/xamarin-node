const assignmentsRoute = require('express').Router();
const AssignmentModel = require('../models/assignment');
const UserModel = require('../models/user');
const { badRequest, errorHandler } = require('../helpers/errorHandling');

assignmentsRoute.get('/assignments/createdBy/:userId', (req, res) => {
  // verify userId first
  const { userId } = req.params;
  UserModel.findById({ _id: userId })
    .then(() => AssignmentModel.find({ userId }, '_id assignmentName body')
      .then(docs => res.json({
        success: true,
        payload: docs
      })))
    .catch(() => res.json({
      success: false,
      payload: 'Invalid id'
    }));
});

assignmentsRoute.get('/assignments/:assignmentId', (req, res) => {
  AssignmentModel.findOne({ _id: req.params.assignmentId })
    .then(doc => res.json({
      success: true,
      payload: doc
    }));
});

assignmentsRoute.get('/assignments', (req, res) => {
  AssignmentModel.find({}, '_id')
    .then(docs => res.json({
      success: true,
      payload: docs
    }));
});

assignmentsRoute.post('/assignments/create', (req, res) => {
  const newAssignment = new AssignmentModel(req.body);
  AssignmentModel.create(newAssignment, (err, assignment) => {
    if (err) {
      const validationErrors = Object.values(err.errors)
        .map(({ kind, path: payload }) => ({
          kind,
          payload
        }));
      if (validationErrors.length > 0) {
        return badRequest(res, validationErrors);
      }
      return errorHandler(res);
    }
    return res.json({
      success: true,
      payload: assignment
    });
  });
});

assignmentsRoute.delete('/assignments/delete/:assignmentId', (req, res) => {
  AssignmentModel.deleteOne({ _id: req.params.assignmentId }, (err) => {
    if (err) {
      return res.json({
        success: false,
        payload: err
      });
    }
    return res.json({
      success: true,
      payload: req.params.assignmentId
    });
  });
});

module.exports = assignmentsRoute;
