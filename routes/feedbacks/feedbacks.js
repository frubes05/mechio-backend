const express = require('express');
const router = express.Router();
const feedback = require('../../controllers/feedbacks/feedbacks');

router.get('/', feedback.getAllFeedbacks);
router.get('/:id', feedback.getSpecificFeedback);
router.post('/nova-recenzija', feedback.newCompanyFeedback);
router.delete('/izbrisi/:tvrtka/:id', feedback.deleteFeedback);

module.exports = router;