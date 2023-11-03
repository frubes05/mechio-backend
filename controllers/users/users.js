const {Users} = require('../../models/users/users');
const Companies = require('../../models/companies/companies');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const loginUser = async(req, res) => {
    const { email, password} = req.body;


    if (!email || !password) {
        return res.status(400).json({message: 'Molimo vas da popunite sva potrebna polja!', status:400})
    }

    const userExists = await Users.findOne({email, password});
    const companyExists = await Companies.findOne({companyEmail: email});

    if (userExists) {
        if (userExists.email === email && userExists.password === password && !companyExists) {
            const payload = {
                _id: userExists._id,
                email,
                fullname: userExists.fullname,
                user: true,
                userLocation: userExists.location,
                loggedIn: true
            }
            jwt.sign(payload, 'secret', {expiresIn: '1d'}, (err, token) => {
                if (err) console.log(err);
                else {
                    return res.status(200).json({message: 'Posloprimac uspješno prijavljen!', token});
                }
            });
        } else if (companyExists) {
            return res.status(403).json({message: 'Ovaj email već koristi poslodavac!', status: 403});
        } else {
            return res.status(400).json({message: 'Unesli ste krive podatke! Pokušajte ponovno.', status: 400})
        }
    } else {
        return res.status(404).json({message: 'Ne postoji posloprimac s navedenim podacima!', status: 404})
    }
}

const registerUser = async(req, res) => {
    const {fullname, password, email, number, address, location, about} = req.body;

    if (!fullname || !password || !email || !number || !address || !location) {
        return res.status(400).json({message: 'Molimo vas da popunite sva potrebna polja!', status: 400})
    }

    const userExists = await Users.findOne({email, password});
    const companyExists = await Companies.findOne({companyEmail: email});

    if (userExists || companyExists) {
        return res.status(400).json({message: 'Već postoje podaci za navedenog posloprimca!', status: 400})
    } else {
        const newUser = Users({
            fullname,
            password,
            email,
            number,
            address,
            location,
            about,
            cv: req.files['cv'][0].path.replace(/\//g, '/'),
            image: req.files['image'][0].path.replace(/\//g, '/'),
            applications: []
        })
        const user = await newUser.save();
        const payload = {
            _id: user._id,
            email,
            user: true,
            userLocation: location,
            loggedIn: true
        }
        jwt.sign(payload, 'secret', {expiresIn: '1d'}, (err, token) => {
            if (err) console.log(err);
            else {
                return res.status(200).json({message: 'Podaci o posloprimcu uspješno kreirani!', token});
            }
        });
    }
}

const getAllUsers = async(req, res) => {
    try {
        const allUsers = await Users.find();
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(400).json({message: 'Nema posloprimca u bazi podataka!'})
    }
}

const getSpecificUser = async(req, res) => {
    try {
        const specificUser = await Users.findOne({email: req.params.email})
        if (specificUser) {
            return res.status(200).json(specificUser);
        }
    } catch (error) {
        res.status(400).json({message: 'Nema posloprimca u bazi podataka!'})
    }
}

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getAllUsers = getAllUsers;
exports.getSpecificUser = getSpecificUser;