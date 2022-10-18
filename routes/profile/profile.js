const express = require('express');
const router = express.Router();
const profile = require('../../controllers/profile/profile');

router.get('/:id', profile.getSpecificProfile);
router.get('/default/:id', profile.getSpecificProfile);
router.get('/feedbacks/:id', profile.getAllUserFeedbacks);
router.get('/userfeedbacks/:id', profile.getSpecificUserFeedbacks);
router.get('/jobs/:id', profile.getAllCompanyJobs);
router.get('/userapplications/:id', profile.getUserApplications);
router.get('/applications/:id', profile.getAllCompanyJobApplicants);
router.put('/izmijeni/:id', profile.editSpecificProfile);
router.delete('/izbrisi/:id', profile.deleteUserApplications, profile.deleteUserFeedbacks, profile.deleteSpecificProfile);

module.exports = router;