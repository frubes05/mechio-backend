const express = require('express');
const router = express.Router();
const advices = require('../../controllers/advices/advices');

router.get('/', advices.handleAdvices);


module.exports = router;