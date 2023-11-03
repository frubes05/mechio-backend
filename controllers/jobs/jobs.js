const {Jobs} = require('../../models/jobs/jobs');
const Companies = require('../../models/companies/companies');
const {Users} = require('../../models/users/users');
const { Tracking } = require('../../models/tracking/tracking');

const getAllJobs = async(req, res) => {
    try {
        const awaitedJobs = await Jobs.find({});
        res.status(200).json(awaitedJobs);
    } catch (error) {
        res.json({message: 'Došlo je do pogrješke!', status:400})
    }
};

const getSpecificJob = async(req, res) => {
    const {id} = req.params;
    try {
        const specificJob = await Jobs.findOne({_id: id});
        res.status(200).json(specificJob)
    } catch (error) {
        res.json({message: 'Došlo je do pogrješke!', status: 400})
    }
};

const jobApplication = async(req, res) => {
    const { userId } = req.body;

    const user = await Users.findById(userId);
    const jobExists = await Jobs.findById(req.params.id);

    if (jobExists) {
        const userApplied = jobExists.applications.find((id) => id.toString() === user._id.toString());
        if (!userApplied) {
            await jobExists.applications.push(user);
            await jobExists.save();
            user.applications.push(jobExists);
            await user.save();
            return res.status(200).json({message: 'Vaša prijava je obavljena!'});
        } else {
            return res.json({message: 'Već ste se prijavili na ovaj oglas!', status: 403});
        }
    } else {
        return res.json({message: 'Došlo je do pogreške!', status: 500});
    }
}

const getAllApplications = async(req, res) => {
    const { id } = req.params;
    const job = await Jobs.find({_id: id});
    const applications = job[0].applications;
    const allUsers = await Users.find();
    const users = allUsers.filter(user => applications.includes(user._id));    
    res.json(users);
}

const addNewJob = async(req, res) => {
    const {companyId, company, companyPremium, position, description, location, seniority, pay, date} = req.body;

    try {
        if(!companyId || !company || !position || !description || !location || !seniority || !pay || !date) {
            return res.json({message: 'Molimo unesite sve relevantne podatke!', status: 404})
        }else {
            const getCompany = await Companies.findOne({_id: companyId});
            const newJob = Jobs({companyId, company, companyImage: getCompany.companyImage, companyPremium, position, description, location, seniority, pay, date})
            await newJob.save();
            return res.json({message: 'Uspješno ste dodali novi oglas!', status: 200});
        }
    } catch (error) {
        return res.json({message: 'Došlo je do pogrješke!', status: 400});
    }
};

const editJob = async(req, res) => {
    const {id} = req.params;
    const {companyId, company, companyPremium, position, description, location, seniority, pay, date} = req.body;

    try {
        if (!companyId || !companyPremium || !position || !description || !location || !seniority || !pay || !date) {
            return res.json({message: 'Unesite sve potrebne podatke!', status: 404})
        } else {
            await Jobs.findOneAndUpdate({_id: id}, {_id: id, companyId, company, companyPremium, position, description, location, seniority, pay, date}, {
                new: true
            })
            return res.status(200).json({message: 'Oglas uspješno izmijenjen!'})
        }
    } catch (error) {
        return res.json({message: 'Došlo je do pogrješke', status: 404})
    }
};

const deleteJob = async(req, res) => {
    const {id} = req.params;

    try {
        await Jobs.findOneAndRemove({_id: id});
        await Tracking.deleteMany({jobId: id});
        res.status(200).json({message: 'Oglas uspješno izbrisan!'});
    } catch (error) {
        res.json({message: 'Došlo je do pogrješke!', status: 404});
    }
};

exports.getAllJobs = getAllJobs;
exports.getSpecificJob = getSpecificJob;
exports.addNewJob = addNewJob;
exports.editJob = editJob;
exports.deleteJob = deleteJob;
exports.jobApplication = jobApplication;
exports.getAllApplications = getAllApplications;