const stripe = require("stripe")(process.env.STRIPESECRETTEST);
const Companies = require('../../models/companies/companies');


const handlePayment = async (req, res, next) => {
  let { amount, id, companyId } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Something bought",
        payment_method: id,
        confirm: true
    })
    res.status(200).json({
        message: 'Payment successfull',
        success: true
    })
  } catch (error) {
    console.log('Error', error);
    res.status(404).json({
        message: 'Payment failed',
        success: false
    })
  }
  const company = await Companies.findById(companyId);
  company.companyPremium = true;
  await company.save();
};

exports.handlePayment = handlePayment;
