const express = require('express');
const router = express.Router();
const tracking = require('../../controllers/tracking/tracking');

router.post('/', tracking.newTracking);
router.get('/:action/:category/:companyId', tracking.getSpecificTrackingData);
router.get('/:id', tracking.getTrackingData);

module.exports = router;