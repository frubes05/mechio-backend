const express = require('express');
const router = express.Router();
const job = require('../../controllers/jobs/jobs');

router.get('/', job.getAllJobs);
router.get('/:id', job.getSpecificJob);
router.post('/novi-oglas', job.addNewJob);
router.post('/prijava/:id', job.jobApplication);
router.get('/prijave/:id', job.getAllApplications);
router.put('/izmijeni-oglas/:id', job.editJob);
router.delete('/izbrisi-oglas/:id', job.deleteJob);

module.exports = router;