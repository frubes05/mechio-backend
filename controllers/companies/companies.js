const Companies = require('../../models/companies/companies');
const { Users } = require('../../models/users/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const loginCompany = async(req, res) => {
    const { companyEmail, companyPassword } = req.body;

    if (!companyEmail || !companyPassword) {
        return res.json({message: 'Molimo vas da popunite sva potrebna polja!', status: 400})
    }

    const companyExists = await Companies.findOne({companyEmail: companyEmail});
    const userExists = await Users.findOne({email: companyEmail});

    if (companyExists) {
        if (companyExists.companyEmail === companyEmail && companyExists.companyPassword === companyPassword && !userExists) {
            const payload = {
                _id: companyExists._id,
                companyEmail,
                company: true
            }
            jwt.sign(payload, 'secret', {expiresIn: '1d'}, (err, token) => {
                if (err) console.log(err);
                else {
                    return res.status(200).json({message: 'Poslodavac uspješno prijavljen!', token});
                }
            });
        } else if (userExists) {
            return res.json({message: 'Ovaj email već koristi posloprimac!', status: 403});
        } else {
            return res.json({message: 'Unesli ste krive podatke! Pokušajte ponovno.', status: 404})
        }
    } else {
        return res.json({message: 'Ne postoji poslodavac s navedenim podacima!'})
    }
}

const registerCompany = async(req, res) => {
    const {companyName, companyPassword, companyEmail, companyNumber, companyAddress, companyDescription, companyImage} = req.body;

    if (!companyName || !companyPassword || !companyEmail || !companyNumber || !companyAddress) {
        return res.json({message: 'Molimo vas da popunite sva potrebna polja!', status: 400})
    }

    const companyExists = await Companies.findOne({companyName: companyName, companyEmail: companyEmail});
    const userExists = await Users.findOne({email: companyEmail});

    if (companyExists) {
        return res.json({message: 'Već postoje podaci za navedenog poslodavca!', status: 400})
    } else if (userExists) {
        return res.json({message: 'Već postoji posloprimac s istim podacima!', status: 400})
    }
      else {
        const newCompany = Companies({
            companyName,
            companyPassword,
            companyEmail,
            companyNumber,
            companyAddress,
            companyDescription,
            companyImage: req.file.path,
            companyFeedbacks: []
        })
        const comp = await newCompany.save();
        const payload = {
            _id: comp._id,
            companyName,
            companyEmail,
            company: true
        }
        jwt.sign(payload, 'secret', {expiresIn: '1d'}, (err, token) => {
            if (err) console.log(err);
            else {
                return res.status(200).json({message: 'Podaci o poslodavcu uspješno kreirani!', token});
            }
        });
    }
}

const getAllCompanies = async(req, res) => {
    try {
        const allCompanies = await Companies.find();
        res.status(200).json(allCompanies)
    } catch (error) {
        res.status(400).json({message: 'Nema poslodavaca u bazi podataka!'})
    }
}

const getSpecificCompanyEmail = async(req, res, next) => {
    try {
        const specificCompany = await Companies.find({companyEmail: req.params.id});
        return res.status(200).json(specificCompany);
    } catch (error) {
        res.status(400).json({message: 'Nema posloprimca u bazi podataka!'})
    }
}

const getSpecificCompany = async(req, res, next) => {
    try {
        const specificCompany = await Companies.findById(req.params.id);
        if (specificCompany) {
            return res.status(200).json(specificCompany);
        }
        next();
    } catch (error) {
        res.status(400).json({message: 'Nema posloprimca u bazi podataka!'})
    }
}

exports.loginCompany = loginCompany;
exports.registerCompany = registerCompany;
exports.getAllCompanies = getAllCompanies;
exports.getSpecificCompany = getSpecificCompany;
exports.getSpecificCompanyEmail = getSpecificCompanyEmail;
