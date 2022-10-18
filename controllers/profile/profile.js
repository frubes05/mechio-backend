const Companies = require('../../models/companies/companies');
const { Feedback } = require('../../models/feedbacks/feedbacks');
const { Jobs } = require('../../models/jobs/jobs');
const {Users} = require('../../models/users/users');

const getSpecificProfile = async(req, res) => {
    const user = await Users.findById(req.params.id);
    const company = await Companies.findById(req.params.id);

    if (user) {
        res.status(200).json({data: user, type: 'user'});
    } else if (company) {
        res.status(200).json({data: company, type: 'company'});
    } else {
        res.status(400).json({message: 'Nema podataka o ovome profilu'})
    }
};

const editSpecificProfile = async(req, res) => {
    const about = req.body.about;
    const companyDescription = req.body.companyDescription;

    try {
        if (about) {
            const user = await Users.findByIdAndUpdate(req.params.id, {about: about});
            return res.status(200).json(user)
        } else if (companyDescription) {
            const company = await Companies.findByIdAndUpdate(req.params.id, {companyDescription: companyDescription});
            return res.status(200).json(company);
        }
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke!'});
    }

}

const deleteUserFeedbacks = async(req, res, next) => {
    next();
}

const deleteUserApplications = async(req, res, next) => {
    next();
}

const deleteSpecificProfile = async(req, res) => {
    const company = await Companies.findById(req.params.id);
    const user = await Users.findById(req.params.id);

    try {
        if (company) {
            await Companies.findByIdAndDelete(req.params.id)
            await Feedback.deleteMany({companyId: req.params.id});
            await Jobs.deleteMany({companyId: req.params.id});
            company.companyFeedbacks = [];
            await company.save();
            return res.status(200).json({message: 'Tvrtka uspješno izbrisana'});
        } else if (user) {
            await Users.findByIdAndDelete(req.params.id);
            await Feedback.deleteMany({userId: req.params.id});
            const companies = await Companies.find({});
            const specificCompanies = companies.map(async(company) => {
                const index = company.companyFeedbacks.findIndex(feedback => feedback.userId === req.params.id);
                if (index !== -1) {
                    company.companyFeedbacks = company.companyFeedbacks.filter(elem => elem.userId !== req.params.id);
                    await company.save();
                }
            })
            return res.status(200).json({message: 'Korisnik uspješno izbrisan'});
        }
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke!'});
    }
}

const getAllUserFeedbacks = async(req, res, next) => {
    const id = req.params.id;
    try {
        const feedbacks = await Feedback.find({});
        const companies = await Companies.find({});
        const userFeedbacks = feedbacks.filter(feedback => feedback.userId === id);
        const improvedFeedbacks = userFeedbacks.map((feedback) => {
            const id = feedback.companyId;
            const specificCompany = companies.find(c => c._id.toString() === id);
            return {
                ...feedback,
                company: specificCompany
            }
        });
        res.status(200).json(improvedFeedbacks);
        next();
    } catch (error) {
        return res.status(404).json({message: 'Došlo je do pogrješke!'});
    }
}

const getAllCompanyJobs = async(req, res) => {
    const id = req.params.id;
    try {
        const jobs = await Jobs.find({});
        const companies = await Companies.find({});
        const company = companies.find(company => company._id.toString() === id);
        let companyJobs = jobs.map(job => {
            if (job.company === company.companyName) {
                return job;
            }
        })
        companyJobs = companyJobs.filter(job => job !== undefined);
        return res.status(200).json(companyJobs);
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke!'});
    }
}

const getAllCompanyJobApplicants = async(req, res) => {
    const id = req.params.id;
    try {
        const jobs = await Jobs.find({});
        const companies = await Companies.find({});
        const users = await Users.find({});
        const company = companies.find(company => company._id.toString() === id);
        const companyJobs = jobs.map(job => {
            if (job.companyId === company._id.toString()) {
                return job;
            }
        }).filter(elem => elem !== undefined)
        let activeUsersApplied = companyJobs.map(job => {
            return job.applications.map(j => users.find(elem => elem._id.toString() === j.toString()));
        })[0].filter(elem => elem !== undefined);
        return res.status(200).json(activeUsersApplied);
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke!'})
    }
}

const getUserApplications = async(req, res) => {
    const id = req.params.id;
    try {
        const jobs = await Jobs.find({});
        let specificJobs = jobs.map(job => {
            const exists = job.applications.find(j => j.toString() === req.params.id);
            if (exists) {
                return job;
            }
        }).filter(elem => elem !== undefined);
        return res.status(200).json(specificJobs);
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke !'});
    }
}

const getSpecificUserFeedbacks = async(req, res) => {
    const id = req.params.id;
    try {
        const companies = await Companies.find({});
        const feedbacks = await Feedback.find({userId: req.params.id});
        const existingFeedbacks = feedbacks.filter(feedback => {
            const id = companies.find(comp => comp._id.toString() === feedback.companyId);
            if (id) {
                return feedback;
            } 
        })
        return res.status(200).json(existingFeedbacks);
    } catch (error) {
        return res.status(400).json({message: 'Došlo je do pogrješke !'});
    }
}

exports.getSpecificProfile = getSpecificProfile;
exports.editSpecificProfile = editSpecificProfile;
exports.deleteSpecificProfile = deleteSpecificProfile;
exports.deleteUserFeedbacks = deleteUserFeedbacks;
exports.deleteUserApplications = deleteUserApplications;
exports.getAllUserFeedbacks = getAllUserFeedbacks;
exports.getAllCompanyJobs = getAllCompanyJobs;
exports.getAllCompanyJobApplicants = getAllCompanyJobApplicants
exports.getUserApplications = getUserApplications;
exports.getSpecificUserFeedbacks = getSpecificUserFeedbacks;