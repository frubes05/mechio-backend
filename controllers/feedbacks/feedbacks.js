const { Feedback } = require('../../models/feedbacks/feedbacks');
const Companies = require('../../models/companies/companies');

const getAllFeedbacks = async(req, res) => {
    try {
        const allFeedbacks = await Feedback.find({});
        const companies = await Companies.find({});
        const feedbacksAvailable = allFeedbacks.map(feedback => {
            return companies.filter(c => c._id.toString() === feedback.companyId);
        })
        res.status(200).json(feedbacksAvailable);
    } catch (error) {
        res.json({message: 'Došlo je do pogreške!', status: 500});
    }
}

const getSpecificFeedback = async(req, res) => {
    const { id } = req.params;

    try {
        const specificFeedbacks = await Feedback.find({companyId: id});
        res.status(200).json(specificFeedbacks);
    } catch (error) {
        res.json({message: 'Došlo je do pogreške!', status: 500});
    }
}

const newCompanyFeedback = async(req, res) => {
    const { userId, companyId, position, rating, positives, negatives, date} = req.body;

    const company = await Companies.findOne({_id: companyId});
    const alreadyExists = await Feedback.findOne({userId: userId});

    if (alreadyExists) {
        return res.status(403).json({message: 'Već ste dali recenziju za ovaj posao!'});
    } else {
        const feedback = Feedback({ userId, companyId, position, rating, positives, negatives, date});
        await feedback.save();
        company.companyFeedbacks.push(feedback);
        await company.save();
        return res.status(200).json({message: 'Vaša recenzija je zabilježena!', data: company.companyFeedbacks});
    }
}

const deleteFeedback = async(req, res) => {
    const company = await Companies.findById(req.params.tvrtka);

    try {
        await Feedback.findByIdAndRemove(req.params.id);
        company.companyFeedbacks = company.companyFeedbacks.filter(feedback => feedback._id.toString() !== req.params.id);
        await company.save();
        res.status(200).json({message: 'Recenzija uspješno izbrisana!'});
    } catch (error) {
        res.status(404).json({message: 'Došlo je do pogrješke!', status: 404});
    }
};

exports.newCompanyFeedback = newCompanyFeedback;
exports.getSpecificFeedback = getSpecificFeedback;
exports.getAllFeedbacks = getAllFeedbacks;
exports.deleteFeedback = deleteFeedback;
