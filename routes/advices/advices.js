const express = require('express');
const router = express.Router();
const advices = require('../../controllers/advices/advices');

router.get('/:state', advices.handleAdvices);


module.exports = router;