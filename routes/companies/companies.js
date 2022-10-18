const express = require('express');
const router = express.Router();
const company = require('../../controllers/companies/companies');
const fileUpload = require('../../middleware/file-upload');

router.post('/login-poslodavac', company.loginCompany);
router.post('/novi-poslodavac', fileUpload.single("image"), company.registerCompany);
router.get('/', company.getAllCompanies);
router.get('/:id', company.getSpecificCompany, company.getSpecificCompanyEmail);

module.exports = router;