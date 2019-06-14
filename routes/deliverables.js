const deliverablesRoute = require('express').Router();
const AssignmentModel = require('../models/assignment');
const DeliverableModel = require('../models/deliverable');
const UserModel = require('../models/user');
const { badRequest, errorHandler } = require('../helpers/errorHandling');

deliverablesRoute.get('/deliverables/all/:assignmentId', (req, res) => {
  const { assignmentId } = req.params;
  DeliverableModel.find({ assignmentId })
    .then(docs => res.json({
      success: true,
      payload: docs
    }));
});

deliverablesRoute.get('/deliverables/single/:deliverableId', (req, res) => {
  const { deliverableId: _id } = req.params;
  DeliverableModel.findOne({ _id })
    .then(doc => res.json({
      success: true,
      payload: doc
    }));
});

deliverablesRoute.post('/deliverables/submit', (req, res) => {
  AssignmentModel.findById({ _id: req.body.assignmentId }, (e1, assignment) => {
    if (e1) {
      return res.json({
        success: true,
        paylad: 'Invalid assignment'
      });
    }
    return UserModel.findById({ _id: req.body.userId }, (e2, user) => {
      if (e2 || !user) {
        return res.json({
          success: true,
          payload: 'Invalid userId'
        });
      }
      const newDeliverable = new DeliverableModel(req.body);
      return DeliverableModel.create(newDeliverable, (e3, deliverable) => {
        if (e3) {
          const validationErrors = Object.values(e3.errors)
            .map(({ kind, path: payload }) => ({
              kind,
              payload
            }));
          if (validationErrors.length > 0) {
            return badRequest(res, validationErrors);
          }
          return errorHandler(res);
        }
        console.log(assignment);
        assignment.deliveredAssignments.push(deliverable._id);
        return assignment.save()
          .then(() => res.json({
            success: true,
            payload: deliverable
          }));
      });
    });
  });
});

module.exports = deliverablesRoute;
