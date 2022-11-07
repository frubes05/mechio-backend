const express = require('express');
const router = express.Router();
const payments = require('../../controllers/payments/payments');

router.post('/', payments.handlePayment);

module.exports = router;